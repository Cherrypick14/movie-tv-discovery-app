import { Movie, TVShow, MovieDetails, TVShowDetails, Genre } from './movie';

// TMDB API Response interfaces
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenreResponse {
  genres: Genre[];
}

export interface TMDBSearchResponse<T> extends TMDBResponse<T> {}

export interface TMDBTrendingResponse<T> extends TMDBResponse<T> {}

export interface TMDBDiscoverResponse<T> extends TMDBResponse<T> {}

// OMDB API Response interfaces
export interface OMDBResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OMDBRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
  Error?: string;
  totalSeasons?: string;
}

export interface OMDBRating {
  Source: string;
  Value: string;
}

export interface OMDBSearchResponse {
  Search: OMDBSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface OMDBSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// API Error interfaces
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

// Search parameters
export interface SearchParams {
  query: string;
  page?: number;
  year?: number;
  genre?: number;
  sort_by?: string;
  include_adult?: boolean;
}

export interface DiscoverParams {
  page?: number;
  sort_by?: string;
  year?: number;
  genre?: number;
  with_genres?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  include_adult?: boolean;
}

// API Configuration
export interface APIConfig {
  tmdb: {
    apiKey: string;
    baseUrl: string;
    imageBaseUrl: string;
  };
  omdb: {
    apiKey: string;
    baseUrl: string;
  };
}

// Cache interfaces
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheConfig {
  duration: number; // in milliseconds
  maxSize: number;
}

// Rate limiting
export interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
}

export interface RateLimitState {
  requests: number;
  windowStart: number;
}

// API Service interfaces
export interface TMDBService {
  searchMovies(params: SearchParams): Promise<TMDBResponse<Movie>>;
  searchTVShows(params: SearchParams): Promise<TMDBResponse<TVShow>>;
  getMovieDetails(id: number): Promise<MovieDetails>;
  getTVShowDetails(id: number): Promise<TVShowDetails>;
  getTrendingMovies(timeWindow?: 'day' | 'week'): Promise<TMDBResponse<Movie>>;
  getTrendingTVShows(timeWindow?: 'day' | 'week'): Promise<TMDBResponse<TVShow>>;
  getPopularMovies(page?: number): Promise<TMDBResponse<Movie>>;
  getPopularTVShows(page?: number): Promise<TMDBResponse<TVShow>>;
  getTopRatedMovies(page?: number): Promise<TMDBResponse<Movie>>;
  getTopRatedTVShows(page?: number): Promise<TMDBResponse<TVShow>>;
  getUpcomingMovies(page?: number): Promise<TMDBResponse<Movie>>;
  getNowPlayingMovies(page?: number): Promise<TMDBResponse<Movie>>;
  discoverMovies(params: DiscoverParams): Promise<TMDBResponse<Movie>>;
  discoverTVShows(params: DiscoverParams): Promise<TMDBResponse<TVShow>>;
  getGenres(type: 'movie' | 'tv'): Promise<TMDBGenreResponse>;
}

export interface OMDBService {
  getByImdbId(imdbId: string): Promise<OMDBResponse>;
  searchByTitle(title: string, year?: number, type?: string): Promise<OMDBSearchResponse>;
}

// Combined service response
export interface EnhancedMediaDetails {
  tmdb: MovieDetails | TVShowDetails;
  omdb?: OMDBResponse;
}

// API Response status
export type APIStatus = 'idle' | 'loading' | 'success' | 'error';

export interface APIState<T> {
  data: T | null;
  status: APIStatus;
  error: APIError | null;
}

// Pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
