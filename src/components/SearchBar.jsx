import React from 'react';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { TAMIL_NADU_CITIES } from '../data/mockData';

export const SearchBar = ({
  query,
  onQueryChange,
  city,
  onCityChange,
  onOpenFilters,
  placeholder = "Search locality, project, BHK, or builder...",
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#9CA3AF] dark:text-[#6B7280] pointer-events-none" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-9 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-sm text-[#111827] dark:text-[#F1F5F9] placeholder-[#9CA3AF] shadow-card focus:outline-none focus:border-[#3B4FCD] dark:focus:border-[#3B4FCD] focus:ring-2 focus:ring-[#EEF2FF] dark:focus:ring-[#23262F] transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute right-3 w-5 h-5 rounded-full bg-[#F3F4F6] dark:bg-[#23262F] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* City Dropdown Selector */}
      {onCityChange && (
        <div className="relative hidden sm:block">
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="h-12 pl-3 pr-8 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs font-semibold text-[#111827] dark:text-[#F1F5F9] shadow-card focus:outline-none focus:border-[#3B4FCD] cursor-pointer appearance-none"
          >
            {TAMIL_NADU_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filter Button */}
      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          className="h-12 w-12 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center justify-center text-[#111827] dark:text-[#F1F5F9] hover:bg-[#F3F4F6] dark:hover:bg-[#23262F] active:scale-95 transition-all flex-shrink-0"
          aria-label="Open filter options"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#3B4FCD] dark:text-[#A5B4FC]" />
        </button>
      )}
    </div>
  );
};
