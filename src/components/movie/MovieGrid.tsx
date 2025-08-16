import React from 'react';
import { MovieCard } from './MovieCard';
import { Skeleton } from '@/components/ui';
import { MediaItem } from '@/types';
import { cn } from '@/utils';

export interface MovieGridProps {
  movies: MediaItem[];
  isLoading?: boolean;
  onMovieSelect?: (movie: MediaItem) => void;
  showWatchlistButton?: boolean;
  showRating?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  className?: string;
  emptyMessage?: string;
  loadingCount?: number;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  onMovieSelect,
  showWatchlistButton = true,
  showRating = true,
  cardSize = 'medium',
  className,
  emptyMessage = 'No movies found',
  loadingCount = 20,
}) => {
  // Loading skeleton
  if (isLoading && movies.length === 0) {
    return (
      <div className={cn('grid-responsive', className)}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton variant="rectangular" className="aspect-[2/3] w-full" />
            <div className="space-y-2">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Try adjusting your search terms or browse our popular movies and TV shows.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid-responsive', className)}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          media={movie}
          onSelect={onMovieSelect}
          showWatchlistButton={showWatchlistButton}
          showRating={showRating}
          size={cardSize}
        />
      ))}
      
      {/* Loading more items */}
      {isLoading && movies.length > 0 && (
        <>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`loading-${index}`} className="space-y-3">
              <Skeleton variant="rectangular" className="aspect-[2/3] w-full" />
              <div className="space-y-2">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export { MovieGrid };
