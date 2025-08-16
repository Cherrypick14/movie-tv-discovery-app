import '@testing-library/jest-dom';

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_TMDB_API_KEY: 'test-tmdb-key',
    VITE_TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    VITE_TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    VITE_OMDB_API_KEY: 'test-omdb-key',
    VITE_OMDB_BASE_URL: 'https://www.omdbapi.com',
    VITE_APP_NAME: 'Movie & TV Discovery App',
    VITE_APP_VERSION: '1.0.0',
    VITE_DEV_MODE: 'true',
    VITE_API_CACHE_DURATION: '300000',
  },
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
