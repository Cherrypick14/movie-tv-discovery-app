import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '../movie/MovieCard';
import { Movie } from '@/types';

// Mock the services
jest.mock('@/services/config', () => ({
  buildImageUrl: jest.fn((path) => `https://image.tmdb.org/t/p/w342${path}`),
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  original_title: 'Test Movie',
  overview: 'This is a test movie description',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  popularity: 100,
  genre_ids: [28, 12],
  adult: false,
  original_language: 'en',
  video: false,
};

describe('MovieCard', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders movie title correctly', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('displays movie rating when showRating is true', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} showRating={true} />);
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('hides movie rating when showRating is false', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} showRating={false} />);
    expect(screen.queryByText('8.5')).not.toBeInTheDocument();
  });

  it('displays release year correctly', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} />);
    
    const card = screen.getByRole('img', { name: /test movie poster/i }).closest('div');
    fireEvent.click(card!);
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie);
  });

  it('shows watchlist button when showWatchlistButton is true', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} showWatchlistButton={true} />);
    expect(screen.getByLabelText(/add to watchlist/i)).toBeInTheDocument();
  });

  it('hides watchlist button when showWatchlistButton is false', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} showWatchlistButton={false} />);
    expect(screen.queryByLabelText(/add to watchlist/i)).not.toBeInTheDocument();
  });

  it('displays adult badge for adult content', () => {
    const adultMovie = { ...mockMovie, adult: true };
    render(<MovieCard media={adultMovie} onSelect={mockOnSelect} />);
    expect(screen.getByText('18+')).toBeInTheDocument();
  });

  it('displays top rated badge for high-rated movies', () => {
    const topRatedMovie = { ...mockMovie, vote_average: 8.5 };
    render(<MovieCard media={topRatedMovie} onSelect={mockOnSelect} />);
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
  });

  it('handles image loading error gracefully', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} />);
    
    const image = screen.getByRole('img', { name: /test movie poster/i });
    fireEvent.error(image);
    
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <MovieCard media={mockMovie} onSelect={mockOnSelect} size="small" />
    );
    
    let container = screen.getByRole('img', { name: /test movie poster/i }).closest('.w-32');
    expect(container).toBeInTheDocument();

    rerender(<MovieCard media={mockMovie} onSelect={mockOnSelect} size="large" />);
    
    container = screen.getByRole('img', { name: /test movie poster/i }).closest('.w-64');
    expect(container).toBeInTheDocument();
  });

  it('toggles watchlist state when watchlist button is clicked', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} showWatchlistButton={true} />);
    
    const watchlistButton = screen.getByLabelText(/add to watchlist/i);
    fireEvent.click(watchlistButton);
    
    expect(screen.getByLabelText(/remove from watchlist/i)).toBeInTheDocument();
  });

  it('prevents event propagation when watchlist button is clicked', () => {
    render(<MovieCard media={mockMovie} onSelect={mockOnSelect} showWatchlistButton={true} />);
    
    const watchlistButton = screen.getByLabelText(/add to watchlist/i);
    fireEvent.click(watchlistButton);
    
    // onSelect should not be called when clicking the watchlist button
    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});
