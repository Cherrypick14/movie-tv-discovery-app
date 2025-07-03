import React from 'react';

const MovieDetail = ({ movie, onClose }) => {
  if (!movie) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-40 h-60 object-cover rounded"
            onError={(e) => (e.target.src = '/placeholder.png')}
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <div className="text-gray-600 mb-2">{movie.year} &bull; {movie.releaseDate}</div>
            <div className="mb-2"><span className="font-semibold">Plot:</span> {movie.plot}</div>
            <div className="mb-2"><span className="font-semibold">Cast:</span> {movie.cast}</div>
            <div className="mb-2"><span className="font-semibold">Ratings:</span> {movie.ratings}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 