import { APIConfig } from '@/types';

// Environment variable validation
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not defined`);
  }
  return value;
};

// API Configuration
export const apiConfig: APIConfig = {
  tmdb: {
    apiKey: validateEnvVar('VITE_TMDB_API_KEY', import.meta.env.VITE_TMDB_API_KEY),
    baseUrl: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    imageBaseUrl: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  },
  omdb: {
    apiKey: validateEnvVar('VITE_OMDB_API_KEY', import.meta.env.VITE_OMDB_API_KEY),
    baseUrl: import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com',
  },
};

// App Configuration
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Movie & TV Discovery App',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDev: import.meta.env.VITE_DEV_MODE === 'true',
  cache: {
    duration: parseInt(import.meta.env.VITE_API_CACHE_DURATION || '300000', 10), // 5 minutes default
    maxSize: 100,
  },
  rateLimit: {
    tmdb: {
      requests: 40,
      window: 10000, // 10 seconds
    },
    omdb: {
      requests: 1000,
      window: 86400000, // 24 hours
    },
  },
};

// Image size configurations for TMDB
export const imageConfig = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
  logo: {
    small: 'w45',
    medium: 'w92',
    large: 'w185',
    original: 'original',
  },
};

// Helper function to build image URLs
export const buildImageUrl = (
  path: string | null,
  size: string = 'medium',
  type: 'poster' | 'backdrop' | 'profile' | 'logo' = 'poster'
): string => {
  if (!path) {
    return getPlaceholderImage(type);
  }

  const sizeConfig = imageConfig[type];
  const imageSize = sizeConfig[size as keyof typeof sizeConfig] || sizeConfig.medium;
  
  return `${apiConfig.tmdb.imageBaseUrl}/${imageSize}${path}`;
};

// Placeholder images for missing posters/backdrops
export const getPlaceholderImage = (type: 'poster' | 'backdrop' | 'profile' | 'logo'): string => {
  const placeholders = {
    poster: 'https://via.placeholder.com/342x513/1f2937/9ca3af?text=No+Poster',
    backdrop: 'https://via.placeholder.com/780x439/1f2937/9ca3af?text=No+Backdrop',
    profile: 'https://via.placeholder.com/185x278/1f2937/9ca3af?text=No+Photo',
    logo: 'https://via.placeholder.com/185x100/1f2937/9ca3af?text=No+Logo',
  };
  
  return placeholders[type];
};

// API endpoints
export const endpoints = {
  tmdb: {
    // Movies
    popularMovies: '/movie/popular',
    topRatedMovies: '/movie/top_rated',
    upcomingMovies: '/movie/upcoming',
    nowPlayingMovies: '/movie/now_playing',
    movieDetails: (id: number) => `/movie/${id}`,
    movieCredits: (id: number) => `/movie/${id}/credits`,
    movieVideos: (id: number) => `/movie/${id}/videos`,
    movieSimilar: (id: number) => `/movie/${id}/similar`,
    movieRecommendations: (id: number) => `/movie/${id}/recommendations`,
    
    // TV Shows
    popularTVShows: '/tv/popular',
    topRatedTVShows: '/tv/top_rated',
    onTheAirTVShows: '/tv/on_the_air',
    airingTodayTVShows: '/tv/airing_today',
    tvDetails: (id: number) => `/tv/${id}`,
    tvCredits: (id: number) => `/tv/${id}/credits`,
    tvVideos: (id: number) => `/tv/${id}/videos`,
    tvSimilar: (id: number) => `/tv/${id}/similar`,
    tvRecommendations: (id: number) => `/tv/${id}/recommendations`,
    
    // Search
    searchMovies: '/search/movie',
    searchTVShows: '/search/tv',
    searchMulti: '/search/multi',
    
    // Discover
    discoverMovies: '/discover/movie',
    discoverTVShows: '/discover/tv',
    
    // Trending
    trendingMovies: (timeWindow: 'day' | 'week' = 'day') => `/trending/movie/${timeWindow}`,
    trendingTVShows: (timeWindow: 'day' | 'week' = 'day') => `/trending/tv/${timeWindow}`,
    trendingAll: (timeWindow: 'day' | 'week' = 'day') => `/trending/all/${timeWindow}`,
    
    // Genres
    movieGenres: '/genre/movie/list',
    tvGenres: '/genre/tv/list',
    
    // Configuration
    configuration: '/configuration',
  },
  omdb: {
    byId: '/',
    search: '/',
  },
} as const;
