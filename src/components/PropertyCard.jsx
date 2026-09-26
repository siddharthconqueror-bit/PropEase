import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Maximize, Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const PropertyCard = ({ property, layout = 'vertical' }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, trackPropertyView } = useProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const favorited = isFavorite(property.id);

  const handleCardClick = (e) => {
    if (e.target.closest('.no-nav')) return;
    trackPropertyView(property.id);
    navigate(`/properties/${property.id}`);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] overflow-hidden shadow-card hover:shadow-pop transition-all duration-200 cursor-pointer flex ${
        layout === 'horizontal' ? 'flex-row' : 'flex-col'
      }`}
    >
      {/* Media Container */}
      <div className={`relative ${layout === 'horizontal' ? 'w-2/5 min-h-[160px]' : 'w-full h-48'} overflow-hidden bg-[#F3F4F6] dark:bg-[#23262F]`}>
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 pointer-events-none">
          {property.verified && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 dark:bg-[#1A1D27]/95 text-[#0EA5A0] backdrop-blur-md flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-[#0EA5A0]" />
              Verified
            </span>
          )}
          {property.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="no-nav absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#1A1D27]/90 backdrop-blur-md flex items-center justify-center text-[#111827] dark:text-[#F1F5F9] shadow-sm hover:scale-110 active:scale-95 transition-all"
          aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#6B7280] dark:text-[#9CA3AF]'
            }`}
          />
        </button>

        {/* Carousel Arrow Controls */}
        {property.images.length > 1 && layout !== 'horizontal' && (
          <div className="no-nav opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={prevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* AI Investment Score Pill */}
        {property.aiSummary?.investmentScore && (
          <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3B4FCD]/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            AI {property.aiSummary.investmentScore}/10
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Price & Type */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC] tracking-tight">
                {property.priceDisplay}
              </span>
              <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                ({property.pricePerSqft})
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-6px bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB]">
              {property.type}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs sm:text-sm font-bold font-heading text-[#111827] dark:text-[#F1F5F9] line-clamp-1 mt-0.5 group-hover:text-[#3B4FCD] transition-colors">
            {property.title}
          </h4>

          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            <MapPin className="w-3 h-3 text-[#3B4FCD] flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Specs Footer */}
        <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143] flex items-center justify-between text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
          {property.bhk && (
            <div className="flex items-center gap-1 font-medium">
              <BedDouble className="w-3 h-3 text-[#6B7280] dark:text-[#9CA3AF]" />
              <span>{property.bhk} BHK</span>
            </div>
          )}

          {property.bathrooms && (
            <div className="flex items-center gap-1 font-medium">
              <Bath className="w-3 h-3 text-[#6B7280] dark:text-[#9CA3AF]" />
              <span>{property.bathrooms} Bath</span>
            </div>
          )}

          <div className="flex items-center gap-1 font-medium font-mono-price text-[10px]">
            <Maximize className="w-3 h-3 text-[#6B7280] dark:text-[#9CA3AF]" />
            <span>{property.sqft} sq.ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
