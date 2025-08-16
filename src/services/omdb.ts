import {
  OMDBResponse,
  OMDBSearchResponse,
  OMDBService,
} from '@/types';
import { omdbClient } from './api';
import { endpoints } from './config';

class OMDBServiceImpl implements OMDBService {
  // Get movie/TV show details by IMDB ID
  async getByImdbId(imdbId: string): Promise<OMDBResponse> {
    const queryParams = {
      i: imdbId,
      plot: 'full',
    };

    return omdbClient.get<OMDBResponse>(
      endpoints.omdb.byId,
      queryParams
    );
  }

  // Search for movies/TV shows by title
  async searchByTitle(
    title: string,
    year?: number,
    type?: string
  ): Promise<OMDBSearchResponse> {
    const queryParams: Record<string, any> = {
      s: title,
    };

    if (year) {
      queryParams.y = year;
    }

    if (type) {
      queryParams.type = type; // movie, series, episode
    }

    return omdbClient.get<OMDBSearchResponse>(
      endpoints.omdb.search,
      queryParams
    );
  }

  // Get detailed information by title (alternative to IMDB ID)
  async getByTitle(
    title: string,
    year?: number,
    type?: string
  ): Promise<OMDBResponse> {
    const queryParams: Record<string, any> = {
      t: title,
      plot: 'full',
    };

    if (year) {
      queryParams.y = year;
    }

    if (type) {
      queryParams.type = type;
    }

    return omdbClient.get<OMDBResponse>(
      endpoints.omdb.byId,
      queryParams
    );
  }

  // Helper method to extract ratings from OMDB response
  extractRatings(omdbData: OMDBResponse): {
    imdb?: number;
    rottenTomatoes?: number;
    metacritic?: number;
  } {
    const ratings: {
      imdb?: number;
      rottenTomatoes?: number;
      metacritic?: number;
    } = {};

    // IMDB Rating
    if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
      ratings.imdb = parseFloat(omdbData.imdbRating);
    }

    // Metacritic Score
    if (omdbData.Metascore && omdbData.Metascore !== 'N/A') {
      ratings.metacritic = parseInt(omdbData.Metascore, 10);
    }

    // Rotten Tomatoes from ratings array
    const rtRating = omdbData.Ratings?.find(
      rating => rating.Source === 'Rotten Tomatoes'
    );
    if (rtRating && rtRating.Value !== 'N/A') {
      const percentage = rtRating.Value.replace('%', '');
      ratings.rottenTomatoes = parseInt(percentage, 10);
    }

    return ratings;
  }

  // Helper method to parse runtime
  parseRuntime(runtime: string): number | null {
    if (!runtime || runtime === 'N/A') {
      return null;
    }

    const match = runtime.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Helper method to parse box office
  parseBoxOffice(boxOffice: string): number | null {
    if (!boxOffice || boxOffice === 'N/A') {
      return null;
    }

    // Remove currency symbols and commas
    const cleaned = boxOffice.replace(/[$,]/g, '');
    const match = cleaned.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Helper method to parse genres
  parseGenres(genreString: string): string[] {
    if (!genreString || genreString === 'N/A') {
      return [];
    }

    return genreString.split(', ').map(genre => genre.trim());
  }

  // Helper method to parse cast/crew
  parsePeople(peopleString: string): string[] {
    if (!peopleString || peopleString === 'N/A') {
      return [];
    }

    return peopleString.split(', ').map(person => person.trim());
  }

  // Enhanced method to get enriched data
  async getEnrichedData(imdbId: string): Promise<{
    basic: OMDBResponse;
    parsed: {
      ratings: {
        imdb?: number;
        rottenTomatoes?: number;
        metacritic?: number;
      };
      runtime: number | null;
      boxOffice: number | null;
      genres: string[];
      cast: string[];
      directors: string[];
      writers: string[];
    };
  }> {
    const basic = await this.getByImdbId(imdbId);

    const parsed = {
      ratings: this.extractRatings(basic),
      runtime: this.parseRuntime(basic.Runtime),
      boxOffice: this.parseBoxOffice(basic.BoxOffice || ''),
      genres: this.parseGenres(basic.Genre),
      cast: this.parsePeople(basic.Actors),
      directors: this.parsePeople(basic.Director),
      writers: this.parsePeople(basic.Writer),
    };

    return { basic, parsed };
  }
}

// Create and export singleton instance
export const omdbService = new OMDBServiceImpl();

// Export class for testing
export { OMDBServiceImpl };
