import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export const PropertyMiniCard = ({ property }) => {
  const navigate = useNavigate();

  if (!property) return null;

  return (
    <div
      onClick={() => navigate(`/properties/${property.id}`)}
      className="group flex items-center gap-3 p-2.5 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] hover:border-[#3B4FCD]/50 shadow-sm transition-all duration-150 cursor-pointer text-left w-full"
    >
      <img
        src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
        alt={property.title}
        className="w-16 h-16 rounded-12px object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-bold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
            {property.priceDisplay}
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-4px bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#9CA3AF]">
            {property.type}
          </span>
        </div>
        <h5 className="text-xs font-semibold text-[#111827] dark:text-[#F1F5F9] truncate mt-0.5">
          {property.title}
        </h5>
        <div className="flex items-center gap-1 text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate mt-0.5">
          <MapPin className="w-3 h-3 text-[#3B4FCD] flex-shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>
      </div>
      <div className="w-7 h-7 rounded-full bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#EEF2FF] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
