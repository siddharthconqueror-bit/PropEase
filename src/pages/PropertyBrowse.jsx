import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/Chip';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { useProperties } from '../context/PropertyContext';
import {
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  MapPin,
  Check,
  Map as MapIcon,
  List,
  Navigation,
  ExternalLink,
  ChevronRight,
  Compass
} from 'lucide-react';
import { TAMIL_NADU_CITIES, MOCK_CATEGORIES } from '../data/mockData';

export const PropertyBrowse = () => {
  const navigate = useNavigate();
  const {
    filteredProperties,
    filters,
    updateFilter,
    resetFilters,
    recentSearches,
    addRecentSearch
  } = useProperties();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedMapPropIndex, setSelectedMapPropIndex] = useState(0);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (val) => {
    updateFilter('query', val);
    if (val.length > 3) {
      addRecentSearch(val);
    }
  };

  const handleCityChange = (city) => {
    setIsLoading(true);
    updateFilter('city', city);
    setSelectedMapPropIndex(0);
    setTimeout(() => setIsLoading(false), 150);
  };

  const handleCategoryChange = (cat) => {
    setIsLoading(true);
    updateFilter('category', cat);
    setSelectedMapPropIndex(0);
    setTimeout(() => setIsLoading(false), 150);
  };

  const activeMapProperty = filteredProperties[selectedMapPropIndex] || filteredProperties[0];
  const activeCoords = activeMapProperty?.coordinates || { lat: 13.0827, lng: 80.2707 };
  const delta = 0.015;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeCoords.lng - delta},${activeCoords.lat - delta},${activeCoords.lng + delta},${activeCoords.lat + delta}&layer=mapnik&marker=${activeCoords.lat},${activeCoords.lng}`;

  return (
    <div className="flex flex-col gap-3.5 pb-24 pt-1">
      {/* Search Bar Header */}
      <div className="flex flex-col gap-2">
        <SearchBar
          query={filters.query}
          onQueryChange={handleQueryChange}
          city={filters.city}
          onCityChange={handleCityChange}
          onOpenFilters={() => setIsFilterSheetOpen(true)}
          placeholder="Search Chennai, OMR, Villas, 3 BHK..."
        />

        {/* Quick Trending District Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] whitespace-nowrap flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-[#3B4FCD]" />
            Districts:
          </span>
          {TAMIL_NADU_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCityChange(c)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                filters.city === c
                  ? 'bg-[#3B4FCD] text-white border-[#3B4FCD] shadow-sm'
                  : 'bg-white dark:bg-[#1A1D27] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB] dark:border-[#2D3143] hover:border-[#3B4FCD]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips Bar & View Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <FilterChips
            selectedCategory={filters.category}
            onSelectCategory={handleCategoryChange}
            categories={MOCK_CATEGORIES}
          />
        </div>

        {/* View Mode Toggle (List vs Map) */}
        <div className="flex items-center bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] p-0.5 rounded-full flex-shrink-0 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-[10px] font-bold ${
              viewMode === 'list'
                ? 'bg-[#3B4FCD] text-white shadow-xs'
                : 'text-[#6B7280] dark:text-[#9CA3AF]'
            }`}
            title="List View"
            aria-label="List View"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`p-1.5 rounded-full transition-all flex items-center gap-1 text-[10px] font-bold ${
              viewMode === 'map'
                ? 'bg-[#3B4FCD] text-white shadow-xs'
                : 'text-[#6B7280] dark:text-[#9CA3AF]'
            }`}
            title="Map View"
            aria-label="Map View"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Result Count and Sort Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] dark:border-[#2D3143]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
            {filteredProperties.length} Properties
          </span>
          {filters.city !== 'All Tamil Nadu' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] font-bold">
              in {filters.city}
            </span>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-[#6B7280] dark:text-[#9CA3AF]" />
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            aria-label="Sort properties"
            className="text-xs font-semibold bg-transparent text-[#4B5563] dark:text-[#D1D5DB] focus:outline-none cursor-pointer py-1"
          >
            <option value="featured" className="bg-white dark:bg-[#1A1D27]">Featured</option>
            <option value="price-asc" className="bg-white dark:bg-[#1A1D27]">Price: Low to High</option>
            <option value="price-desc" className="bg-white dark:bg-[#1A1D27]">Price: High to Low</option>
            <option value="rating" className="bg-white dark:bg-[#1A1D27]">Highest Rated</option>
            <option value="newest" className="bg-white dark:bg-[#1A1D27]">Newest Listed</option>
          </select>
        </div>
      </div>

      {/* Main View: Map View OR List View */}
      {viewMode === 'map' ? (
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* Interactive Map Frame with Property Markers */}
          <div className="relative w-full h-72 sm:h-80 rounded-24px overflow-hidden border border-[#E5E7EB] dark:border-[#2D3143] bg-[#E5E7EB] dark:bg-[#11131A] shadow-card">
            {activeMapProperty ? (
              <iframe
                key={activeMapProperty.id}
                title={`Map of ${activeMapProperty.title}`}
                src={osmEmbedUrl}
                className="w-full h-full border-0 select-none"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#6B7280]">
                No coordinates available
              </div>
            )}

            {/* Top Bar on Map: District & GPS Indicator */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold shadow-md">
                <Compass className="w-3 h-3 text-[#5EEAD4] animate-spin-slow" />
                <span>{filters.city !== 'All Tamil Nadu' ? filters.city : 'Tamil Nadu Map'}</span>
                <span className="text-white/60">({filteredProperties.length} pins)</span>
              </div>

              {activeMapProperty && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeCoords.lat},${activeCoords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3B4FCD] hover:bg-[#2F3FA6] text-white text-[10px] font-bold shadow-md transition-all active:scale-95"
                >
                  <Navigation className="w-3 h-3" />
                  Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Horizontal Property Selector Strip for Map */}
          {filteredProperties.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
                Select Pin on Map ({selectedMapPropIndex + 1} of {filteredProperties.length}):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {filteredProperties.map((prop, idx) => (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => setSelectedMapPropIndex(idx)}
                    className={`flex-shrink-0 p-2 rounded-16px border transition-all flex items-center gap-2 text-left w-52 ${
                      idx === selectedMapPropIndex
                        ? 'bg-[#3B4FCD] text-white border-[#3B4FCD] shadow-md scale-[1.02]'
                        : 'bg-white dark:bg-[#1A1D27] text-[#111827] dark:text-[#F1F5F9] border-[#E5E7EB] dark:border-[#2D3143] hover:border-[#3B4FCD]'
                    }`}
                  >
                    <img
                      src={prop.images[0]}
                      alt=""
                      className="w-11 h-11 rounded-10px object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate leading-tight">
                        {prop.title}
                      </div>
                      <div className={`text-[10px] font-bold font-mono-price ${idx === selectedMapPropIndex ? 'text-amber-200' : 'text-[#3B4FCD] dark:text-[#A5B4FC]'}`}>
                        {prop.priceDisplay}
                      </div>
                      <div className={`text-[9px] truncate ${idx === selectedMapPropIndex ? 'text-white/80' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                        {prop.city}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Selected Property Card in Map View */}
          {activeMapProperty && (
            <div className="p-3.5 rounded-20px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeMapProperty.images[0]}
                  alt=""
                  className="w-14 h-14 rounded-12px object-cover flex-shrink-0 shadow-xs"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                    {activeMapProperty.title}
                  </h4>
                  <div className="text-xs font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                    {activeMapProperty.priceDisplay}
                  </div>
                  <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#3B4FCD] flex-shrink-0" />
                    <span className="truncate">{activeMapProperty.location}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/properties/${activeMapProperty.id}`)}
                className="px-3.5 py-2 rounded-12px bg-[#3B4FCD] hover:bg-[#2F3FA6] text-white text-[11px] font-bold shadow-pop flex items-center gap-1 flex-shrink-0 active:scale-95 transition-all"
              >
                View
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standard List View */
        isLoading ? (
          <div className="flex flex-col gap-3.5">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="flex flex-col gap-3.5 animate-fade-in">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No properties found in ${filters.city !== 'All Tamil Nadu' ? filters.city : 'this category'}`}
            description="Try resetting your filters or selecting another district across Tamil Nadu to view all available listings."
            actionText="Show All Tamil Nadu"
            onAction={resetFilters}
          />
        )
      )}

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Refine Property Search"
      >
        <div className="flex flex-col gap-4 py-1">
          {/* City / District Filter */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              District / Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TAMIL_NADU_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateFilter('city', c)}
                  className={`p-2.5 rounded-12px text-xs font-semibold border transition-all text-left truncate ${
                    filters.city === c
                      ? 'bg-[#3B4FCD] text-white border-[#3B4FCD] shadow-sm'
                      : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB] dark:border-[#3A3F52]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Property Category */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Property Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilter('category', cat.id)}
                  className={`p-2 rounded-10px text-xs font-semibold border transition-all text-left ${
                    filters.category === cat.id
                      ? 'bg-[#3B4FCD] text-white border-[#3B4FCD]'
                      : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* BHK Configuration */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Bedrooms (BHK)
            </label>
            <div className="flex items-center gap-1.5">
              {['all', '1', '2', '3', '4'].map((bhkVal) => (
                <button
                  key={bhkVal}
                  type="button"
                  onClick={() => updateFilter('bhk', bhkVal)}
                  className={`flex-1 py-2 rounded-10px text-xs font-bold border transition-all ${
                    filters.bhk === bhkVal
                      ? 'bg-[#3B4FCD] text-white border-[#3B4FCD]'
                      : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB]'
                  }`}
                >
                  {bhkVal === 'all' ? 'Any' : `${bhkVal} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
            <Button
              variant="outline"
              size="md"
              icon={RotateCcw}
              onClick={() => {
                resetFilters();
                setIsFilterSheetOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Check}
              onClick={() => setIsFilterSheetOpen(false)}
            >
              View ({filteredProperties.length})
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
