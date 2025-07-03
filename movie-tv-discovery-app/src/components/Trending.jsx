import React from 'react';

const Trending = ({ items, onSelect }) => {
  if (!items || items.length === 0) {
    return <div className="text-center text-gray-400 mt-8 font-sans">No trending content found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8">
      {items.map((item) => (
        <div
          key={item.id}
          className="col-span-1 mx-auto max-w-xs bg-adamur-dark-blue rounded-xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-glow-green hover:border-adamur-green border border-transparent transition transform duration-200 cursor-pointer flex flex-col items-center font-sans"
          onClick={() => onSelect(item)}
        >
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-64 object-cover"
            onError={(e) => (e.target.src = '/placeholder.png')}
          />
          <div className="p-4 w-full text-center">
            <div className="font-bold text-lg text-adamur-green">{item.title}</div>
            <div className="text-sm text-gray-400">{item.year}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trending; 