import { Movie, TVShow, MediaItem } from './movie';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// User preferences
export interface UserPreferences {
  theme: Theme;
  language: string;
  includeAdult: boolean;
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
  autoplay: boolean;
  notifications: boolean;
}

// Watchlist item
export interface WatchlistItem {
  id: string; // unique identifier for the watchlist item
  mediaId: number; // TMDB ID
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  releaseDate: string;
  addedAt: string; // ISO date string
  watched: boolean;
  watchedAt?: string; // ISO date string
  rating?: number; // user rating 1-10
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

// Search history
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string; // ISO date string
  resultsCount: number;
}

// Filter options
export interface FilterOptions {
  genres: number[];
  year?: number;
  rating?: {
    min: number;
    max: number;
  };
  runtime?: {
    min: number;
    max: number;
  };
  sortBy: SortOption;
  mediaType: 'all' | 'movie' | 'tv';
}

export type SortOption = 
  | 'popularity.desc'
  | 'popularity.asc'
  | 'release_date.desc'
  | 'release_date.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'title.asc'
  | 'title.desc';

// Navigation
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: number;
}

// Modal types
export type ModalType = 
  | 'movie-details'
  | 'tv-details'
  | 'trailer'
  | 'settings'
  | 'watchlist'
  | 'search-filters'
  | null;

export interface ModalState {
  type: ModalType;
  data?: any;
  isOpen: boolean;
}

// Toast notifications
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Application state
export interface AppState {
  user: {
    preferences: UserPreferences;
    watchlist: WatchlistItem[];
    searchHistory: SearchHistoryItem[];
  };
  ui: {
    theme: Theme;
    modal: ModalState;
    toasts: Toast[];
    isLoading: boolean;
    sidebar: {
      isOpen: boolean;
      activeSection: string;
    };
  };
  search: {
    query: string;
    filters: FilterOptions;
    results: {
      movies: Movie[];
      tvShows: TVShow[];
    };
    isLoading: boolean;
    hasMore: boolean;
    page: number;
  };
  cache: {
    movies: Map<number, any>;
    tvShows: Map<number, any>;
    searches: Map<string, any>;
  };
}

// Action types for state management
export type AppAction = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_TO_WATCHLIST'; payload: WatchlistItem }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'UPDATE_WATCHLIST_ITEM'; payload: { id: string; updates: Partial<WatchlistItem> } }
  | { type: 'ADD_SEARCH_HISTORY'; payload: SearchHistoryItem }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'SET_SEARCH_RESULTS'; payload: { movies: Movie[]; tvShows: TVShow[] } }
  | { type: 'SET_SEARCH_LOADING'; payload: boolean }
  | { type: 'OPEN_MODAL'; payload: { type: ModalType; data?: any } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_SECTION'; payload: string };

// Component props interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface MediaCardProps extends BaseComponentProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
  showWatchlistButton?: boolean;
  showRating?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface SearchBarProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'movie-app-preferences',
  WATCHLIST: 'movie-app-watchlist',
  SEARCH_HISTORY: 'movie-app-search-history',
  THEME: 'movie-app-theme',
  CACHE: 'movie-app-cache',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
