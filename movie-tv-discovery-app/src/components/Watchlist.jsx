import React from 'react';

const Watchlist = ({ items, onRemove, onMarkWatched }) => {
  if (!items || items.length === 0) {
    return <div className="text-center text-gray-500 mt-8">Your watchlist is empty.</div>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded shadow p-2 flex flex-col items-center ${item.watched ? 'opacity-60' : ''}`}
        >
          <img
            src={item.poster}
            alt={item.title}
            className="w-32 h-48 object-cover rounded mb-2"
            onError={(e) => (e.target.src = '/placeholder.png')}
          />
          <div className="font-semibold text-center">{item.title}</div>
          <div className="text-xs text-gray-500">{item.year}</div>
          <div className="flex gap-2 mt-2">
            <button
              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              onClick={() => onMarkWatched(item.id)}
              disabled={item.watched}
            >
              {item.watched ? 'Watched' : 'Mark as Watched'}
            </button>
            <button
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Watchlist; 