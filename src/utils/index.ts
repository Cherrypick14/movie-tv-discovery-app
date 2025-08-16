import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MediaItem, Movie, TVShow, isMovie, isTVShow } from '@/types';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Format date to readable string
export function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

// Format date to year only
export function formatYear(dateString: string): string {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch {
    return 'Unknown';
  }
}

// Format runtime in minutes to hours and minutes
export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

// Format vote average to one decimal place
export function formatRating(rating: number): string {
  if (!rating || rating <= 0) return 'N/A';
  return rating.toFixed(1);
}

// Format large numbers (e.g., vote count, revenue)
export function formatNumber(num: number): string {
  if (!num || num <= 0) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
}

// Format currency
export function formatCurrency(amount: number): string {
  if (!amount || amount <= 0) return 'Unknown';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get media title (works for both movies and TV shows)
export function getMediaTitle(media: MediaItem): string {
  if (isMovie(media)) {
    return media.title;
  }
  if (isTVShow(media)) {
    return media.name;
  }
  return 'Unknown Title';
}

// Get media release date (works for both movies and TV shows)
export function getMediaReleaseDate(media: MediaItem): string {
  if (isMovie(media)) {
    return media.release_date;
  }
  if (isTVShow(media)) {
    return media.first_air_date;
  }
  return '';
}

// Get media year (works for both movies and TV shows)
export function getMediaYear(media: MediaItem): string {
  const releaseDate = getMediaReleaseDate(media);
  return formatYear(releaseDate);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
}

// Capitalize first letter of each word
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Convert string to slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// Check if string is valid URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Get contrast color (black or white) for a given background color
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// Array helpers
export const arrayHelpers = {
  // Remove duplicates from array
  unique: <T>(array: T[]): T[] => [...new Set(array)],
  
  // Group array by key
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
  
  // Shuffle array
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
  
  // Chunk array into smaller arrays
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// Error handling helpers
export const errorHelpers = {
  // Get user-friendly error message
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  },
  
  // Log error with context
  logError: (error: unknown, context?: string): void => {
    const message = errorHelpers.getErrorMessage(error);
    const fullMessage = context ? `${context}: ${message}` : message;
    console.error(fullMessage, error);
  },
};

// Validation helpers
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  notEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },
  
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};
