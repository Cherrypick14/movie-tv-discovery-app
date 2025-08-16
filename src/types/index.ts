// Re-export all types for easy importing
export * from './movie';
export * from './api';
export * from './app';

// Vite environment variables
export interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_BASE_URL: string;
  readonly VITE_TMDB_IMAGE_BASE_URL: string;
  readonly VITE_OMDB_API_KEY: string;
  readonly VITE_OMDB_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_API_CACHE_DURATION: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
