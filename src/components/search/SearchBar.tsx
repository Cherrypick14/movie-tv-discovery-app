import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { debounce } from '@/utils';
import { SearchBarProps } from '@/types';

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for movies and TV shows...',
  isLoading = false,
  className,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounced onChange to avoid too many API calls
  const debouncedOnChange = useCallback(
    debounce((searchValue: string) => {
      onChange(searchValue);
    }, 300),
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(localValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative max-w-2xl mx-auto">
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-12 pr-20 h-12 text-lg"
          leftIcon={
            isLoading ? (
              <div className="animate-spin">
                <Search className="h-5 w-5" />
              </div>
            ) : (
              <Search className="h-5 w-5" />
            )
          }
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {localValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!localValue.trim() || isLoading}
            className="h-8"
          >
            Search
          </Button>
        </div>
      </div>
      
      {/* Search suggestions could go here */}
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try searching for "Inception", "Breaking Bad", or "Marvel"
        </p>
      </div>
    </form>
  );
};

export { SearchBar };
