import React, { useState, useEffect } from 'react';
import { Search, Play, Star, Calendar, Clock, TrendingUp, Film, Tv, Home, Bookmark, Settings, User, Sun, Moon } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Button, Loading, Card, Badge } from '@/components/ui';
import { mediaService } from '@/services';
import { MediaItem, APIError } from '@/types';
import { errorHelpers } from '@/utils';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for cinema feel

  // Load initial content
  useEffect(() => {
    loadInitialContent();
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const loadInitialContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [popularResponse, trendingResponse] = await Promise.allSettled([
        mediaService.getPopularContent(1),
        mediaService.getTrendingContent('day')
      ]);

      if (popularResponse.status === 'fulfilled' && popularResponse.value.movies) {
        setPopularMovies(popularResponse.value.movies.results.slice(0, 12));
        setMovies(popularResponse.value.movies.results);
        setHasMore(popularResponse.value.movies.page < popularResponse.value.movies.total_pages);
      }

      if (trendingResponse.status === 'fulfilled' && trendingResponse.value.movies) {
        setTrendingMovies(trendingResponse.value.movies.results.slice(0, 6));
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 z-50">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">CinemaHub</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-dark-800 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premium User</p>
            </div>
            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-2xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                  isLoading={isLoading}
                  placeholder='Try searching for "Inception", "Breaking Bad", or "Marvel"'
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">
                    Error loading content
                  </h3>
                  <p className="text-sm text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {!searchQuery && trendingMovies.length > 0 && (
            <section className="mb-12">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-r from-dark-900 to-dark-800">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="px-12">
                    <Badge variant="default" className="mb-4">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending Now
                    </Badge>
                    <h2 className="text-5xl font-bold mb-4 text-white">
                      Discover Amazing
                      <br />
                      <span className="text-gradient">Movies & Shows</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-lg">
                      Explore thousands of movies and TV shows. Find your next favorite entertainment.
                    </p>
                    <div className="flex items-center space-x-4">
                      <Button variant="primary" size="lg" className="px-8">
                        <Play className="w-5 h-5 mr-2" />
                        Start Watching
                      </Button>
                      <Button variant="outline" size="lg" className="px-8">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Trending Section */}
          {!searchQuery && trendingMovies.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Trending This Week</h2>
                <Button variant="ghost" className="text-primary-400 hover:text-primary-300">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingMovies.map((movie, index) => (
                  <div key={movie.id} className="group cursor-pointer" onClick={() => handleMovieSelect(movie)}>
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-dark-800">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      <div className="absolute top-2 left-2 z-20">
                        <Badge variant="default" size="sm">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-1 text-xs text-white mb-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {movie.title || movie.name}
                    </h3>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Main Content Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Popular Movies & TV Shows'}
              </h2>

              {movies.length > 0 && (
                <p className="text-gray-400">
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
        </div>
      </main>

    </div>
  );
}

export default App;
