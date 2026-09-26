import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Bus,
  Train,
  Plane,
  Building2,
  GraduationCap,
  HeartPulse,
  Layers,
  Copy,
  Check,
  Compass,
  Maximize2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const PropertyMap = ({ property }) => {
  const { showToast } = useToast();
  const [mapMode, setMapMode] = useState('street'); // 'street' | 'satellite' | 'transit'
  const [copied, setCopied] = useState(false);

  const coords = property?.coordinates || { lat: 13.0827, lng: 80.2707 };
  const locationInfo = property?.locationData || {
    address: property?.location || 'Tamil Nadu, India',
    district: property?.city || 'Tamil Nadu',
    landmark: property?.aiSummary?.commuteScore || 'Prime Transit Belt',
    transit: {
      metroOrBus: '3 mins to Nearest Metro / Bus Stop',
      railway: '15 mins to District Railway Junction',
      airport: '35 mins to International / Domestic Airport'
    },
    nearbyPlaces: {
      hospitals: ['District Multi-Speciality Hospital', 'Apollo / Kauvery Medical Center'],
      schools: ['DAV / DPS Matriculation School', 'Vellore / PSG Tech Campus'],
      itOrCommercial: [property?.landmark || 'Tech Park & Commercial Hub']
    }
  };

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;

  // OpenStreetMap embed iframe URL with bbox & marker
  const delta = mapMode === 'satellite' ? 0.015 : 0.01;
  const bbox = `${coords.lng - delta},${coords.lat - delta},${coords.lng + delta},${coords.lat + delta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lng}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    setCopied(true);
    showToast('GPS Coordinates copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] p-4 shadow-card overflow-hidden">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-10px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9]">
              Location & Live Map
            </h3>
            <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
              {property.city}, Tamil Nadu
            </span>
          </div>
        </div>

        {/* View Switcher Chips */}
        <div className="flex items-center bg-[#F3F4F6] dark:bg-[#23262F] p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => setMapMode('street')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${
              mapMode === 'street'
                ? 'bg-[#3B4FCD] text-white shadow-xs'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Street Map
          </button>
          <button
            type="button"
            onClick={() => setMapMode('transit')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${
              mapMode === 'transit'
                ? 'bg-[#3B4FCD] text-white shadow-xs'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Transit
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-52 sm:h-60 rounded-16px overflow-hidden border border-[#E5E7EB] dark:border-[#2D3143] bg-[#E5E7EB] dark:bg-[#11131A] shadow-inner">
        {/* OpenStreetMap Live Interactive Embed */}
        <iframe
          title={`Map for ${property.title}`}
          src={osmEmbedUrl}
          className="w-full h-full border-0 select-none"
          loading="lazy"
        />

        {/* Floating Coordinates & Quick Action Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono-price font-bold shadow-sm">
            <Compass className="w-3 h-3 text-[#5EEAD4] animate-spin-slow" />
            <span>{coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E</span>
            <button
              type="button"
              onClick={handleCopyCoords}
              className="ml-1 hover:text-[#5EEAD4] transition-colors"
              title="Copy GPS coordinates"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3B4FCD] hover:bg-[#2F3FA6] text-white text-[10px] font-bold shadow-md transition-all active:scale-95"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </a>
        </div>

        {/* Bottom Location Address Bar */}
        <div className="absolute bottom-2 left-2 right-2 p-2 rounded-12px bg-white/95 dark:bg-[#1A1D27]/95 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping flex-shrink-0" />
            <p className="text-[10px] font-semibold text-[#111827] dark:text-[#F1F5F9] truncate">
              {locationInfo.address}
            </p>
          </div>
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline flex items-center gap-0.5 flex-shrink-0"
          >
            Google Maps
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Transit & Commute Highlights Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-2 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#3B4FCD] dark:text-[#A5B4FC]">
            <Bus className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Bus / Metro</span>
          </div>
          <span className="text-[10px] font-bold text-[#111827] dark:text-[#F1F5F9] leading-tight">
            {locationInfo.transit?.metroOrBus || '3 mins walk'}
          </span>
        </div>

        <div className="p-2 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#0EA5A0] dark:text-[#5EEAD4]">
            <Train className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Railway</span>
          </div>
          <span className="text-[10px] font-bold text-[#111827] dark:text-[#F1F5F9] leading-tight">
            {locationInfo.transit?.railway || '12 mins drive'}
          </span>
        </div>

        <div className="p-2 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] flex flex-col gap-1">
          <div className="flex items-center gap-1 text-amber-500">
            <Plane className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Airport</span>
          </div>
          <span className="text-[10px] font-bold text-[#111827] dark:text-[#F1F5F9] leading-tight">
            {locationInfo.transit?.airport || '30 mins drive'}
          </span>
        </div>
      </div>

      {/* Neighborhood Infrastructure */}
      <div className="flex flex-col gap-2 pt-1 border-t border-[#E5E7EB] dark:border-[#2D3143]">
        <div className="text-[10px] font-bold uppercase text-[#6B7280] dark:text-[#9CA3AF] tracking-wider">
          Nearby Essentials & Infrastructure
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-start gap-1.5 text-[#374151] dark:text-[#D1D5DB]">
            <HeartPulse className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <span className="truncate">{locationInfo.nearbyPlaces?.hospitals?.[0] || 'Apollo / Govt Multi-Speciality'}</span>
          </div>
          <div className="flex items-start gap-1.5 text-[#374151] dark:text-[#D1D5DB]">
            <GraduationCap className="w-3.5 h-3.5 text-[#3B4FCD] flex-shrink-0 mt-0.5" />
            <span className="truncate">{locationInfo.nearbyPlaces?.schools?.[0] || 'Top Matriculation & CBSE Schools'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
