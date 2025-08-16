import {
  debounce,
  formatDate,
  formatYear,
  formatRuntime,
  formatRating,
  formatNumber,
  formatCurrency,
  getMediaTitle,
  getMediaYear,
  truncateText,
  capitalizeWords,
  slugify,
  isValidUrl,
  storage,
  arrayHelpers,
  errorHelpers,
  validators,
} from '../index';
import { Movie, TVShow } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('debounce', () => {
    it('should delay function execution', async () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should cancel previous calls', async () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });
  });

  describe('formatDate', () => {
    it('should format valid dates', () => {
      expect(formatDate('2023-12-25')).toBe('December 25, 2023');
      expect(formatDate('2023-01-01')).toBe('January 1, 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('')).toBe('Unknown');
      expect(formatDate('invalid-date')).toBe('Unknown');
    });
  });

  describe('formatYear', () => {
    it('should extract year from date string', () => {
      expect(formatYear('2023-12-25')).toBe('2023');
      expect(formatYear('2020-01-01')).toBe('2020');
    });

    it('should handle invalid dates', () => {
      expect(formatYear('')).toBe('Unknown');
      expect(formatYear('invalid')).toBe('Unknown');
    });
  });

  describe('formatRuntime', () => {
    it('should format runtime correctly', () => {
      expect(formatRuntime(90)).toBe('1h 30m');
      expect(formatRuntime(120)).toBe('2h');
      expect(formatRuntime(45)).toBe('45m');
      expect(formatRuntime(0)).toBe('Unknown');
    });
  });

  describe('formatRating', () => {
    it('should format ratings to one decimal place', () => {
      expect(formatRating(8.567)).toBe('8.6');
      expect(formatRating(7.0)).toBe('7.0');
      expect(formatRating(0)).toBe('N/A');
    });
  });

  describe('formatNumber', () => {
    it('should format large numbers', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(2500)).toBe('2.5K');
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency amounts', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(0)).toBe('Unknown');
    });
  });

  describe('getMediaTitle', () => {
    it('should get title from movie', () => {
      const movie: Movie = {
        id: 1,
        title: 'Test Movie',
        original_title: 'Test Movie',
        overview: 'Test',
        poster_path: null,
        backdrop_path: null,
        release_date: '2023-01-01',
        vote_average: 8,
        vote_count: 100,
        popularity: 50,
        genre_ids: [],
        adult: false,
        original_language: 'en',
        video: false,
      };
      expect(getMediaTitle(movie)).toBe('Test Movie');
    });

    it('should get name from TV show', () => {
      const tvShow: TVShow = {
        id: 1,
        name: 'Test Show',
        original_name: 'Test Show',
        overview: 'Test',
        poster_path: null,
        backdrop_path: null,
        first_air_date: '2023-01-01',
        vote_average: 8,
        vote_count: 100,
        popularity: 50,
        genre_ids: [],
        adult: false,
        original_language: 'en',
        origin_country: ['US'],
      };
      expect(getMediaTitle(tvShow)).toBe('Test Show');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is a...');
    });

    it('should not truncate short text', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Test & Example')).toBe('test-example');
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('storage', () => {
    it('should get data from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('{"key":"value"}');
      const result = storage.get('test', {});
      expect(result).toEqual({ key: 'value' });
    });

    it('should return default value when localStorage fails', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = storage.get('test', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should set data to localStorage', () => {
      storage.set('test', { key: 'value' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test', '{"key":"value"}');
    });
  });

  describe('arrayHelpers', () => {
    describe('unique', () => {
      it('should remove duplicates', () => {
        expect(arrayHelpers.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      });
    });

    describe('groupBy', () => {
      it('should group array by key', () => {
        const items = [
          { type: 'movie', name: 'A' },
          { type: 'tv', name: 'B' },
          { type: 'movie', name: 'C' },
        ];
        const grouped = arrayHelpers.groupBy(items, 'type');
        expect(grouped.movie).toHaveLength(2);
        expect(grouped.tv).toHaveLength(1);
      });
    });

    describe('shuffle', () => {
      it('should shuffle array', () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = arrayHelpers.shuffle(original);
        expect(shuffled).toHaveLength(5);
        expect(shuffled).toEqual(expect.arrayContaining(original));
      });
    });

    describe('chunk', () => {
      it('should chunk array into smaller arrays', () => {
        const chunked = arrayHelpers.chunk([1, 2, 3, 4, 5], 2);
        expect(chunked).toEqual([[1, 2], [3, 4], [5]]);
      });
    });
  });

  describe('errorHelpers', () => {
    describe('getErrorMessage', () => {
      it('should extract message from Error objects', () => {
        const error = new Error('Test error');
        expect(errorHelpers.getErrorMessage(error)).toBe('Test error');
      });

      it('should handle string errors', () => {
        expect(errorHelpers.getErrorMessage('String error')).toBe('String error');
      });

      it('should handle unknown errors', () => {
        expect(errorHelpers.getErrorMessage(null)).toBe('An unexpected error occurred');
      });
    });
  });

  describe('validators', () => {
    describe('email', () => {
      it('should validate email addresses', () => {
        expect(validators.email('test@example.com')).toBe(true);
        expect(validators.email('invalid-email')).toBe(false);
      });
    });

    describe('notEmpty', () => {
      it('should validate non-empty strings', () => {
        expect(validators.notEmpty('test')).toBe(true);
        expect(validators.notEmpty('')).toBe(false);
        expect(validators.notEmpty('   ')).toBe(false);
      });
    });

    describe('minLength', () => {
      it('should validate minimum length', () => {
        expect(validators.minLength('test', 3)).toBe(true);
        expect(validators.minLength('te', 3)).toBe(false);
      });
    });
  });
});
