// Export all services
export * from './api';
export * from './tmdb';
export * from './omdb';
export * from './cache';
export * from './rateLimit';
export * from './config';

// Combined service for enhanced media details
import { tmdbService } from './tmdb';
import { omdbService } from './omdb';
import { MovieDetails, TVShowDetails, EnhancedMediaDetails, isMovieDetails } from '@/types';

class MediaService {
  // Get enhanced movie details with OMDB data
  async getEnhancedMovieDetails(tmdbId: number): Promise<EnhancedMediaDetails> {
    const tmdbData = await tmdbService.getMovieDetails(tmdbId);
    
    let omdbData;
    try {
      // Try to get OMDB data using IMDB ID
      if (tmdbData.imdb_id) {
        omdbData = await omdbService.getByImdbId(tmdbData.imdb_id);
      }
    } catch (error) {
      console.warn('Failed to fetch OMDB data:', error);
      // Continue without OMDB data
    }

    return {
      tmdb: tmdbData,
      omdb: omdbData,
    };
  }

  // Get enhanced TV show details with OMDB data
  async getEnhancedTVShowDetails(tmdbId: number): Promise<EnhancedMediaDetails> {
    const tmdbData = await tmdbService.getTVShowDetails(tmdbId);
    
    let omdbData;
    try {
      // For TV shows, try searching by title since IMDB ID might not be available
      const title = tmdbData.name || tmdbData.original_name;
      const year = tmdbData.first_air_date ? new Date(tmdbData.first_air_date).getFullYear() : undefined;
      
      const searchResult = await omdbService.searchByTitle(title, year, 'series');
      if (searchResult.Search && searchResult.Search.length > 0) {
        omdbData = await omdbService.getByImdbId(searchResult.Search[0].imdbID);
      }
    } catch (error) {
      console.warn('Failed to fetch OMDB data for TV show:', error);
      // Continue without OMDB data
    }

    return {
      tmdb: tmdbData,
      omdb: omdbData,
    };
  }

  // Generic method that works for both movies and TV shows
  async getEnhancedMediaDetails(
    tmdbId: number,
    mediaType: 'movie' | 'tv'
  ): Promise<EnhancedMediaDetails> {
    if (mediaType === 'movie') {
      return this.getEnhancedMovieDetails(tmdbId);
    } else {
      return this.getEnhancedTVShowDetails(tmdbId);
    }
  }

  // Search across both TMDB and OMDB
  async searchMedia(query: string, page: number = 1) {
    const [tmdbMovies, tmdbTVShows, omdbResults] = await Promise.allSettled([
      tmdbService.searchMovies({ query, page }),
      tmdbService.searchTVShows({ query, page }),
      omdbService.searchByTitle(query),
    ]);

    return {
      tmdb: {
        movies: tmdbMovies.status === 'fulfilled' ? tmdbMovies.value : null,
        tvShows: tmdbTVShows.status === 'fulfilled' ? tmdbTVShows.value : null,
      },
      omdb: omdbResults.status === 'fulfilled' ? omdbResults.value : null,
    };
  }

  // Get trending content
  async getTrendingContent(timeWindow: 'day' | 'week' = 'day') {
    const [movies, tvShows] = await Promise.allSettled([
      tmdbService.getTrendingMovies(timeWindow),
      tmdbService.getTrendingTVShows(timeWindow),
    ]);

    return {
      movies: movies.status === 'fulfilled' ? movies.value : null,
      tvShows: tvShows.status === 'fulfilled' ? tvShows.value : null,
    };
  }

  // Get popular content
  async getPopularContent(page: number = 1) {
    const [movies, tvShows] = await Promise.allSettled([
      tmdbService.getPopularMovies(page),
      tmdbService.getPopularTVShows(page),
    ]);

    return {
      movies: movies.status === 'fulfilled' ? movies.value : null,
      tvShows: tvShows.status === 'fulfilled' ? tvShows.value : null,
    };
  }

  // Get top rated content
  async getTopRatedContent(page: number = 1) {
    const [movies, tvShows] = await Promise.allSettled([
      tmdbService.getTopRatedMovies(page),
      tmdbService.getTopRatedTVShows(page),
    ]);

    return {
      movies: movies.status === 'fulfilled' ? movies.value : null,
      tvShows: tvShows.status === 'fulfilled' ? tvShows.value : null,
    };
  }

  // Get genres for both movies and TV shows
  async getAllGenres() {
    const [movieGenres, tvGenres] = await Promise.allSettled([
      tmdbService.getGenres('movie'),
      tmdbService.getGenres('tv'),
    ]);

    return {
      movies: movieGenres.status === 'fulfilled' ? movieGenres.value.genres : [],
      tvShows: tvGenres.status === 'fulfilled' ? tvGenres.value.genres : [],
    };
  }
}

// Create and export singleton instance
export const mediaService = new MediaService();

// Export class for testing
export { MediaService };
