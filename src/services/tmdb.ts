import {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  TMDBResponse,
  TMDBGenreResponse,
  SearchParams,
  DiscoverParams,
  TMDBService,
} from '@/types';
import { tmdbClient } from './api';
import { endpoints } from './config';

class TMDBServiceImpl implements TMDBService {
  // Search methods
  async searchMovies(params: SearchParams): Promise<TMDBResponse<Movie>> {
    const queryParams = {
      query: params.query,
      page: params.page || 1,
      include_adult: params.include_adult || false,
      year: params.year,
    };

    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.searchMovies,
      queryParams
    );
  }

  async searchTVShows(params: SearchParams): Promise<TMDBResponse<TVShow>> {
    const queryParams = {
      query: params.query,
      page: params.page || 1,
      include_adult: params.include_adult || false,
      first_air_date_year: params.year,
    };

    return tmdbClient.get<TMDBResponse<TVShow>>(
      endpoints.tmdb.searchTVShows,
      queryParams
    );
  }

  // Detail methods
  async getMovieDetails(id: number): Promise<MovieDetails> {
    const [details, credits, videos, similar, recommendations] = await Promise.allSettled([
      tmdbClient.get<MovieDetails>(endpoints.tmdb.movieDetails(id)),
      tmdbClient.get(endpoints.tmdb.movieCredits(id)),
      tmdbClient.get(endpoints.tmdb.movieVideos(id)),
      tmdbClient.get<TMDBResponse<Movie>>(endpoints.tmdb.movieSimilar(id)),
      tmdbClient.get<TMDBResponse<Movie>>(endpoints.tmdb.movieRecommendations(id)),
    ]);

    const movieDetails = details.status === 'fulfilled' ? details.value : null;
    if (!movieDetails) {
      throw new Error('Failed to fetch movie details');
    }

    // Attach additional data if available
    if (credits.status === 'fulfilled') {
      movieDetails.credits = credits.value;
    }
    if (videos.status === 'fulfilled') {
      movieDetails.videos = videos.value;
    }
    if (similar.status === 'fulfilled') {
      movieDetails.similar = similar.value;
    }
    if (recommendations.status === 'fulfilled') {
      movieDetails.recommendations = recommendations.value;
    }

    return movieDetails;
  }

  async getTVShowDetails(id: number): Promise<TVShowDetails> {
    const [details, credits, videos, similar, recommendations] = await Promise.allSettled([
      tmdbClient.get<TVShowDetails>(endpoints.tmdb.tvDetails(id)),
      tmdbClient.get(endpoints.tmdb.tvCredits(id)),
      tmdbClient.get(endpoints.tmdb.tvVideos(id)),
      tmdbClient.get<TMDBResponse<TVShow>>(endpoints.tmdb.tvSimilar(id)),
      tmdbClient.get<TMDBResponse<TVShow>>(endpoints.tmdb.tvRecommendations(id)),
    ]);

    const tvDetails = details.status === 'fulfilled' ? details.value : null;
    if (!tvDetails) {
      throw new Error('Failed to fetch TV show details');
    }

    // Attach additional data if available
    if (credits.status === 'fulfilled') {
      tvDetails.credits = credits.value;
    }
    if (videos.status === 'fulfilled') {
      tvDetails.videos = videos.value;
    }
    if (similar.status === 'fulfilled') {
      tvDetails.similar = similar.value;
    }
    if (recommendations.status === 'fulfilled') {
      tvDetails.recommendations = recommendations.value;
    }

    return tvDetails;
  }

  // Trending methods
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<Movie>> {
    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.trendingMovies(timeWindow)
    );
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<TVShow>> {
    return tmdbClient.get<TMDBResponse<TVShow>>(
      endpoints.tmdb.trendingTVShows(timeWindow)
    );
  }

  // Popular methods
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.popularMovies,
      { page }
    );
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return tmdbClient.get<TMDBResponse<TVShow>>(
      endpoints.tmdb.popularTVShows,
      { page }
    );
  }

  // Top rated methods
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.topRatedMovies,
      { page }
    );
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return tmdbClient.get<TMDBResponse<TVShow>>(
      endpoints.tmdb.topRatedTVShows,
      { page }
    );
  }

  // Upcoming and now playing (movies only)
  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.upcomingMovies,
      { page }
    );
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.nowPlayingMovies,
      { page }
    );
  }

  // Discover methods
  async discoverMovies(params: DiscoverParams): Promise<TMDBResponse<Movie>> {
    const queryParams = {
      page: params.page || 1,
      sort_by: params.sort_by || 'popularity.desc',
      year: params.year,
      with_genres: params.with_genres,
      primary_release_year: params.primary_release_year,
      vote_average_gte: params.vote_average_gte,
      vote_average_lte: params.vote_average_lte,
      with_runtime_gte: params.with_runtime_gte,
      with_runtime_lte: params.with_runtime_lte,
      include_adult: params.include_adult || false,
    };

    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key as keyof typeof queryParams] === undefined) {
        delete queryParams[key as keyof typeof queryParams];
      }
    });

    return tmdbClient.get<TMDBResponse<Movie>>(
      endpoints.tmdb.discoverMovies,
      queryParams
    );
  }

  async discoverTVShows(params: DiscoverParams): Promise<TMDBResponse<TVShow>> {
    const queryParams = {
      page: params.page || 1,
      sort_by: params.sort_by || 'popularity.desc',
      with_genres: params.with_genres,
      first_air_date_year: params.first_air_date_year,
      vote_average_gte: params.vote_average_gte,
      vote_average_lte: params.vote_average_lte,
      with_runtime_gte: params.with_runtime_gte,
      with_runtime_lte: params.with_runtime_lte,
      include_adult: params.include_adult || false,
    };

    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key as keyof typeof queryParams] === undefined) {
        delete queryParams[key as keyof typeof queryParams];
      }
    });

    return tmdbClient.get<TMDBResponse<TVShow>>(
      endpoints.tmdb.discoverTVShows,
      queryParams
    );
  }

  // Genre methods
  async getGenres(type: 'movie' | 'tv'): Promise<TMDBGenreResponse> {
    const endpoint = type === 'movie' 
      ? endpoints.tmdb.movieGenres 
      : endpoints.tmdb.tvGenres;
    
    return tmdbClient.get<TMDBGenreResponse>(endpoint);
  }

  // Utility method to get configuration
  async getConfiguration(): Promise<any> {
    return tmdbClient.get(endpoints.tmdb.configuration);
  }
}

// Create and export singleton instance
export const tmdbService = new TMDBServiceImpl();

// Export class for testing
export { TMDBServiceImpl };
