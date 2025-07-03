import React, { useState, useCallback } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search callback
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-full max-w-2xl">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-adamur-green">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-lg bg-adamur-dark-blue/80 border border-adamur-green/30 backdrop-blur text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-adamur-green font-sans text-lg transition"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBar; 