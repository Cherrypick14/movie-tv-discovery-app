import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Button, Loading } from '@/components/ui';
import { mediaService } from '@/services';
import { MediaItem, APIError } from '@/types';
import { errorHelpers } from '@/utils';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load popular movies on initial load
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mediaService.getPopularContent(1);
      if (response.movies) {
        setMovies(response.movies.results);
        setHasMore(response.movies.page < response.movies.total_pages);
      }
    } catch (err) {
      setError(errorHelpers.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadPopularMovies();
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    
    try {
      const response = await mediaService.searchMedia(query, 1);
      const allResults: MediaItem[] = [];
      
      if (response.tmdb.movies) {
        allResults.push(...response.tmdb.movies.results);
      }
      if (response.tmdb.tvShows) {
        allResults.push(...response.tmdb.tvShows.results);
      }
      
      setMovies(allResults);
      setHasMore(false); // Simplified for now
    } catch (err) {
      setError(errorHelpers.getErrorMessage(err));
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie: MediaItem) => {
    // TODO: Open movie details modal or navigate to details page
    console.log('Selected movie:', movie);
  };

  const loadMore = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;
    
    try {
      let response;
      if (searchQuery.trim()) {
        response = await mediaService.searchMedia(searchQuery, nextPage);
      } else {
        response = await mediaService.getPopularContent(nextPage);
      }
      
      const newResults: MediaItem[] = [];
      if (searchQuery.trim()) {
        if (response.tmdb.movies) {
          newResults.push(...response.tmdb.movies.results);
        }
        if (response.tmdb.tvShows) {
          newResults.push(...response.tmdb.tvShows.results);
        }
      } else if (response.movies) {
        newResults.push(...response.movies.results);
        setHasMore(response.movies.page < response.movies.total_pages);
      }
      
      setMovies(prev => [...prev, ...newResults]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(errorHelpers.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Movie & TV Discovery
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover your next favorite movie or TV show
            </p>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading content
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Popular Movies & TV Shows'}
            </h2>
            
            {movies.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                {movies.length} results
              </p>
            )}
          </div>

          <MovieGrid
            movies={movies}
            isLoading={isLoading && movies.length === 0}
            onMovieSelect={handleMovieSelect}
            emptyMessage={searchQuery.trim() ? 'No results found for your search' : 'No popular content available'}
          />

          {/* Load More Button */}
          {hasMore && movies.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMore}
                isLoading={isLoading}
                variant="outline"
                size="lg"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Movie & TV Discovery App. Built with React & TypeScript.</p>
            <p className="mt-2 text-sm">
              Data provided by{' '}
              <a href="https://www.themoviedb.org/" className="text-primary hover:underline">
                The Movie Database (TMDB)
              </a>
              {' '}and{' '}
              <a href="https://www.omdbapi.com/" className="text-primary hover:underline">
                OMDb API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
