import React, { useState } from 'react';
import { Star, Calendar, Plus, Check, Play } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { MediaCardProps } from '@/types';
import { 
  getMediaTitle, 
  getMediaYear, 
  formatRating, 
  cn,
  truncateText 
} from '@/utils';
import { buildImageUrl } from '@/services/config';

const MovieCard: React.FC<MediaCardProps> = ({
  media,
  onSelect,
  showWatchlistButton = true,
  showRating = true,
  size = 'medium',
  className,
}) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = getMediaTitle(media);
  const year = getMediaYear(media);
  const rating = formatRating(media.vote_average);
  const posterUrl = buildImageUrl(media.poster_path, 'medium', 'poster');

  const sizeClasses = {
    small: 'w-32',
    medium: 'w-48',
    large: 'w-64',
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(media);
    }
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInWatchlist(!isInWatchlist);
    // TODO: Implement actual watchlist functionality
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card
      className={cn(
        'movie-card cursor-pointer group hover:shadow-lg hover:scale-105',
        sizeClasses[size],
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
          )}
          
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className={cn(
              'movie-card-image group-hover:scale-110',
              !imageLoaded && 'opacity-0',
              imageError && 'hidden'
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          
          {imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">🎬</div>
                <div className="text-xs">No Image</div>
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="movie-card-overlay group-hover:opacity-100">
            <div className="movie-card-content group-hover:translate-y-0">
              {/* Rating */}
              {showRating && media.vote_average > 0 && (
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rating}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Details
                </Button>
                
                {showWatchlistButton && (
                  <Button
                    size="sm"
                    variant={isInWatchlist ? 'secondary' : 'outline'}
                    onClick={handleWatchlistToggle}
                    className="p-2"
                    aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    {isInWatchlist ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {media.adult && (
              <Badge variant="destructive" size="sm">
                18+
              </Badge>
            )}
            
            {media.vote_average >= 8 && (
              <Badge variant="success" size="sm">
                Top Rated
              </Badge>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {truncateText(title, 40)}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{year}</span>
            </div>
            
            {showRating && media.vote_average > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {media.genre_ids && media.genre_ids.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {media.genre_ids.slice(0, 2).map((genreId) => (
                <Badge key={genreId} variant="outline" size="sm">
                  {/* TODO: Map genre IDs to names */}
                  Genre {genreId}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export { MovieCard };
