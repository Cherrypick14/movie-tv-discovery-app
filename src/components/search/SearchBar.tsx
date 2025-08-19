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
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="animate-spin">
                <Search className={`h-5 w-5 transition-colors ${
                  localValue.trim() ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'
                }`} />
              </div>
            ) : (
              <Search className={`h-5 w-5 transition-colors cursor-pointer ${
                localValue.trim() ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'
              }`} />
            )}
          </div>

          <input
            type="text"
            value={localValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3 text-base bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none border-0 border-b border-gray-300 dark:border-gray-600 focus:border-primary-400 transition-colors"
          />

          {localValue && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export { SearchBar };
