import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowUpDown, Trash2, MapPin, BedDouble, Maximize, Sparkles, ShieldCheck } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

export const Favorites = () => {
  const navigate = useNavigate();
  const { properties, favorites, toggleFavorite, isFavorite } = useProperties();
  const [sortBy, setSortBy] = useState('newest');

  // Filter properties in favorites
  const savedProperties = properties
    .filter((p) => favorites.includes(p.id))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="flex flex-col gap-3.5 pb-24 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9]">
            Saved Wishlist
          </h2>
          <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
            {savedProperties.length} properties saved
          </p>
        </div>

        {savedProperties.length > 0 && (
          <div className="flex items-center gap-1 bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] rounded-10px px-2 py-1 shadow-card">
            <ArrowUpDown className="w-3 h-3 text-[#6B7280] dark:text-[#9CA3AF]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort saved properties"
              className="text-[11px] font-semibold bg-transparent text-[#111827] dark:text-[#F1F5F9] focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-white dark:bg-[#1A1D27]">Recently Saved</option>
              <option value="price-asc" className="bg-white dark:bg-[#1A1D27]">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-[#1A1D27]">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {/* 2-Column Grid for Saved Properties */}
      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 animate-fade-in">
          {savedProperties.map((property) => {
            return (
              <div
                key={property.id}
                onClick={() => navigate(`/properties/${property.id}`)}
                className="group relative rounded-20px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] overflow-hidden shadow-card hover:shadow-pop transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Image */}
                <div className="relative w-full h-28 sm:h-32 bg-[#F3F4F6] dark:bg-[#23262F] overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded-4px bg-black/60 backdrop-blur-md text-white font-mono-price font-bold text-[11px]">
                    {property.priceDisplay}
                  </div>

                  {/* Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 dark:bg-[#1A1D27]/90 backdrop-blur-md flex items-center justify-center text-[#EF4444] shadow-sm hover:scale-110 active:scale-95 transition-all"
                    aria-label="Remove from saved"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#EF4444]" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                  <div>
                    <h4 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9] line-clamp-2 leading-tight group-hover:text-[#3B4FCD] transition-colors">
                      {property.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-1 truncate">
                      <MapPin className="w-3 h-3 text-[#3B4FCD] flex-shrink-0" />
                      <span className="truncate">{property.city}</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="pt-1.5 border-t border-[#E5E7EB] dark:border-[#2D3143] flex items-center justify-between text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                    <span>{property.bhk ? `${property.bhk} BHK` : property.type}</span>
                    <span className="font-mono-price">{property.sqft} sqft</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save apartments, villas, and DTCP plots by clicking the heart icon on any listing to view them here."
          actionText="Explore Properties"
          onAction={() => navigate('/properties')}
        />
      )}
    </div>
  );
};
