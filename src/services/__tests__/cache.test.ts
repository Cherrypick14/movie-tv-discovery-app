import { CacheManager } from '../cache';

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager({
      duration: 1000, // 1 second for testing
      maxSize: 3,
    });
  });

  afterEach(() => {
    cacheManager.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const testData = { id: 1, name: 'test' };
      cacheManager.set('/test', testData);
      
      const retrieved = cacheManager.get('/test');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const retrieved = cacheManager.get('/non-existent');
      expect(retrieved).toBeNull();
    });

    it('should handle different data types', () => {
      cacheManager.set('/string', 'test string');
      cacheManager.set('/number', 42);
      cacheManager.set('/boolean', true);
      cacheManager.set('/array', [1, 2, 3]);
      cacheManager.set('/object', { key: 'value' });

      expect(cacheManager.get('/string')).toBe('test string');
      expect(cacheManager.get('/number')).toBe(42);
      expect(cacheManager.get('/boolean')).toBe(true);
      expect(cacheManager.get('/array')).toEqual([1, 2, 3]);
      expect(cacheManager.get('/object')).toEqual({ key: 'value' });
    });
  });

  describe('expiration', () => {
    it('should return null for expired items', async () => {
      const testData = { id: 1, name: 'test' };
      cacheManager.set('/test', testData);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const retrieved = cacheManager.get('/test');
      expect(retrieved).toBeNull();
    });

    it('should remove expired items from cache', async () => {
      cacheManager.set('/test', 'data');
      expect(cacheManager.has('/test')).toBe(true);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Accessing expired item should remove it
      cacheManager.get('/test');
      expect(cacheManager.has('/test')).toBe(false);
    });
  });

  describe('has method', () => {
    it('should return true for existing non-expired items', () => {
      cacheManager.set('/test', 'data');
      expect(cacheManager.has('/test')).toBe(true);
    });

    it('should return false for non-existent items', () => {
      expect(cacheManager.has('/non-existent')).toBe(false);
    });

    it('should return false for expired items', async () => {
      cacheManager.set('/test', 'data');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(cacheManager.has('/test')).toBe(false);
    });
  });

  describe('delete method', () => {
    it('should remove specific cache entries', () => {
      cacheManager.set('/test1', 'data1');
      cacheManager.set('/test2', 'data2');
      
      expect(cacheManager.has('/test1')).toBe(true);
      expect(cacheManager.has('/test2')).toBe(true);
      
      cacheManager.delete('/test1');
      
      expect(cacheManager.has('/test1')).toBe(false);
      expect(cacheManager.has('/test2')).toBe(true);
    });

    it('should return true when deleting existing items', () => {
      cacheManager.set('/test', 'data');
      const result = cacheManager.delete('/test');
      expect(result).toBe(true);
    });

    it('should return false when deleting non-existent items', () => {
      const result = cacheManager.delete('/non-existent');
      expect(result).toBe(false);
    });
  });

  describe('clear method', () => {
    it('should remove all cache entries', () => {
      cacheManager.set('/test1', 'data1');
      cacheManager.set('/test2', 'data2');
      cacheManager.set('/test3', 'data3');
      
      expect(cacheManager.has('/test1')).toBe(true);
      expect(cacheManager.has('/test2')).toBe(true);
      expect(cacheManager.has('/test3')).toBe(true);
      
      cacheManager.clear();
      
      expect(cacheManager.has('/test1')).toBe(false);
      expect(cacheManager.has('/test2')).toBe(false);
      expect(cacheManager.has('/test3')).toBe(false);
    });
  });

  describe('max size enforcement', () => {
    it('should enforce maximum cache size', () => {
      // Add items up to max size
      cacheManager.set('/test1', 'data1');
      cacheManager.set('/test2', 'data2');
      cacheManager.set('/test3', 'data3');
      
      // All should be present
      expect(cacheManager.has('/test1')).toBe(true);
      expect(cacheManager.has('/test2')).toBe(true);
      expect(cacheManager.has('/test3')).toBe(true);
      
      // Add one more item (should remove oldest)
      cacheManager.set('/test4', 'data4');
      
      // Oldest item should be removed
      expect(cacheManager.has('/test1')).toBe(false);
      expect(cacheManager.has('/test2')).toBe(true);
      expect(cacheManager.has('/test3')).toBe(true);
      expect(cacheManager.has('/test4')).toBe(true);
    });
  });

  describe('parameters in cache key', () => {
    it('should generate different keys for different parameters', () => {
      const params1 = { page: 1, genre: 'action' };
      const params2 = { page: 2, genre: 'action' };
      
      cacheManager.set('/movies', 'data1', params1);
      cacheManager.set('/movies', 'data2', params2);
      
      expect(cacheManager.get('/movies', params1)).toBe('data1');
      expect(cacheManager.get('/movies', params2)).toBe('data2');
    });

    it('should generate same key for same parameters', () => {
      const params = { page: 1, genre: 'action' };
      
      cacheManager.set('/movies', 'data1', params);
      cacheManager.set('/movies', 'data2', params); // Should overwrite
      
      expect(cacheManager.get('/movies', params)).toBe('data2');
    });
  });

  describe('getStats method', () => {
    it('should return cache statistics', () => {
      cacheManager.set('/test1', 'data1');
      cacheManager.set('/test2', 'data2');
      
      const stats = cacheManager.getStats();
      
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(3);
      expect(typeof stats.memoryUsage).toBe('number');
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });
  });

  describe('updateConfig method', () => {
    it('should update cache configuration', () => {
      cacheManager.updateConfig({ maxSize: 5 });
      
      // Should be able to store more items now
      for (let i = 1; i <= 5; i++) {
        cacheManager.set(`/test${i}`, `data${i}`);
      }
      
      // All items should be present
      for (let i = 1; i <= 5; i++) {
        expect(cacheManager.has(`/test${i}`)).toBe(true);
      }
    });
  });
});
