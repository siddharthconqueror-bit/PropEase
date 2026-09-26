import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Compass,
  Sofa,
  Car,
  Calendar,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Send,
  Download
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { AgentCard } from '../components/AgentCard';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { PropertyMap } from '../components/PropertyMap';

export const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, isFavorite, toggleFavorite, submitInquiry } = useProperties();
  const { showToast } = useToast();

  const property = properties.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInquirySheetOpen, setIsInquirySheetOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (10 AM - 12 PM)');
  const [contactMode, setContactMode] = useState('WhatsApp & Call');
  const [inquiryMsg, setInquiryMsg] = useState(
    'Hello, I would like to schedule a site visit and discuss the latest pricing, floor plan, and TN RERA documentation.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) {
    return (
      <div className="py-12">
        <EmptyState
          title="Property Not Found"
          description="The property you are looking for may have been sold or removed from the marketplace."
          actionText="Browse All Properties"
          onAction={() => navigate('/properties')}
        />
      </div>
    );
  }

  const favorited = isFavorite(property.id);

  // EMI Estimate Calculation: standard 8.5% over 20 years
  const loanPrincipal = property.price * 0.8;
  const monthlyRate = 8.5 / 12 / 100;
  const months = 240;
  const estimatedEMI = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out ${property.title} on PropEase for ${property.priceDisplay}`,
          url: window.location.href,
        });
      } catch (err) {
        // User dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard!', 'success');
    }
  };

  const handleSendInquirySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitInquiry({
        propertyId: property.id,
        seekerMessage: `${inquiryMsg} (Preferred Slot: ${visitDate} - ${timeSlot})`,
        preferredVisitDate: visitDate,
        contactMode: contactMode,
      });
      setIsSubmitting(false);
      setIsInquirySheetOpen(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 pb-2 pt-1 relative">
      {/* Media Carousel / Hero Banner */}
      <div className="relative rounded-24px overflow-hidden bg-[#1A1D27] shadow-pop">
        <div className="relative w-full h-64 sm:h-72">
          <img
            src={property.images[activeImageIndex] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Top Floating Actions: Back, Share, Favorite */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white/85 dark:bg-[#1A1D27]/85 backdrop-blur-md flex items-center justify-center text-[#111827] dark:text-[#F1F5F9] shadow-sm hover:scale-105 active:scale-95 transition-all"
              aria-label="Back"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/85 dark:bg-[#1A1D27]/85 backdrop-blur-md flex items-center justify-center text-[#111827] dark:text-[#F1F5F9] shadow-sm hover:scale-105 active:scale-95 transition-all"
                aria-label="Share property"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleFavorite(property.id)}
                className="w-9 h-9 rounded-full bg-white/85 dark:bg-[#1A1D27]/85 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                aria-label="Save property"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    favorited ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#111827] dark:text-[#F1F5F9]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + property.images.length) % property.images.length
                  )
                }
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % property.images.length)
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom Indicators & Image Count */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-1">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md">
              {activeImageIndex + 1} / {property.images.length} Photos
            </span>
          </div>
        </div>

        {/* Thumbnail Preview Row */}
        {property.images.length > 1 && (
          <div className="flex gap-2 p-2.5 bg-white dark:bg-[#1A1D27] overflow-x-auto no-scrollbar border-t border-[#E5E7EB] dark:border-[#2D3143]">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-11 rounded-8px overflow-hidden flex-shrink-0 border-2 transition-all ${
                  idx === activeImageIndex
                    ? 'border-[#3B4FCD] ring-2 ring-[#EEF2FF] dark:ring-[#23262F]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header Info & Badges */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {property.verified && (
            <StatusBadge status="Verified" size="sm" />
          )}
          {property.reraApproved && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] border border-[#C7D2FE] dark:border-[#3730A3]">
              <ShieldCheck className="w-3 h-3" />
              RERA: {property.reraId}
            </span>
          )}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB]">
            {property.possession}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9] leading-snug">
          {property.title}
        </h2>

        <div className="flex items-start gap-1 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          <MapPin className="w-3.5 h-3.5 text-[#3B4FCD] flex-shrink-0 mt-0.5" />
          <span>{property.location}</span>
        </div>

        {/* Price & EMI Box */}
        <div className="p-3 rounded-16px bg-[#EEF2FF]/60 dark:bg-[#1A1D27] border border-[#C7D2FE]/60 dark:border-[#2D3143] flex items-center justify-between gap-2 shadow-card">
          <div>
            <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-medium">
              Offered Price ({property.status})
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC] tracking-tight">
                {property.priceDisplay}
              </span>
              <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                @ {property.pricePerSqft}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-[#23262F] px-2.5 py-1.5 rounded-10px border border-[#E5E7EB] dark:border-[#3A3F52]">
            <Calculator className="w-3.5 h-3.5 text-[#0EA5A0]" />
            <div className="text-left">
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Est. EMI</div>
              <div className="text-[11px] font-bold font-mono-price text-[#111827] dark:text-[#F1F5F9]">
                ₹{estimatedEMI.toLocaleString('en-IN')}/mo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2x3 Key Attributes Grid */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
          Key Specifications
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-2">
            <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <BedDouble className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Config</div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                {property.bhk ? `${property.bhk} BHK` : property.type}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-2">
            <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Bath className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Baths</div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                {property.bathrooms ? `${property.bathrooms} Attached` : 'N/A'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-2">
            <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Maximize className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Area</div>
              <div className="text-xs font-bold font-mono-price text-[#111827] dark:text-[#F1F5F9]">
                {property.sqft} sq.ft
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-2">
            <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Vaastu</div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                {property.facing}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-2">
            <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Sofa className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Furnishing</div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                {property.furnishing}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center gap-2">
            <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Car className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF]">Parking</div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                {property.parking}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Summary Card */}
      {property.aiSummary && (
        <div className="p-4 rounded-20px bg-gradient-to-br from-[#3B4FCD]/10 via-[#0EA5A0]/10 to-transparent border border-[#3B4FCD]/30 dark:border-[#3B4FCD]/40 flex flex-col gap-3 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-8px bg-[#3B4FCD] text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <h3 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
                AI Real Estate Insights
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3B4FCD] text-white">
              AI {property.aiSummary.investmentScore}/10
            </span>
          </div>

          <p className="text-[11px] text-[#374151] dark:text-[#D1D5DB] leading-relaxed">
            {property.aiSummary.overview}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-10px bg-white/80 dark:bg-[#1A1D27]/80 border border-[#E5E7EB] dark:border-[#2D3143]">
              <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Locality Safety</span>
              <div className="text-[11px] font-semibold text-[#111827] dark:text-[#F1F5F9] mt-0.5">{property.aiSummary.localitySafety}</div>
            </div>
            <div className="p-2 rounded-10px bg-white/80 dark:bg-[#1A1D27]/80 border border-[#E5E7EB] dark:border-[#2D3143]">
              <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Connectivity</span>
              <div className="text-[11px] font-semibold text-[#111827] dark:text-[#F1F5F9] mt-0.5 truncate">{property.aiSummary.commuteScore}</div>
            </div>
          </div>
        </div>
      )}

      {/* Facilities & Amenities */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
          Facilities & Amenities
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {property.facilities.map((facility, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 p-2 rounded-10px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-[11px] text-[#111827] dark:text-[#F1F5F9]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5A0] flex-shrink-0" />
              <span className="truncate">{facility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Location & Map Card */}
      <PropertyMap property={property} />

      {/* Agent Card */}
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
          Listing Agent & Contact
        </h3>
        <AgentCard agent={property.agent} />
      </div>

      {/* Sticky Bottom Action Bar (Contained STRICTLY inside mobile frame) */}
      <div className="sticky bottom-0 -mx-4 -mb-2 z-30 w-[calc(100%+2rem)] bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-md border-t border-[#E5E7EB] dark:border-[#2D3143] px-4 py-3 shadow-sheet flex-shrink-0">
        <div className="w-full flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF] uppercase font-bold tracking-wider">
              Total Value
            </div>
            <div className="text-base font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
              {property.priceDisplay}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="md"
              variant="primary"
              icon={Send}
              onClick={() => setIsInquirySheetOpen(true)}
              className="px-5 shadow-pop h-11 text-xs font-bold"
            >
              Send Inquiry
            </Button>
          </div>
        </div>
      </div>

      {/* Send Inquiry Bottom Sheet Modal */}
      <BottomSheet
        isOpen={isInquirySheetOpen}
        onClose={() => setIsInquirySheetOpen(false)}
        title={`Inquire about ${property.title}`}
      >
        <form onSubmit={handleSendInquirySubmit} className="flex flex-col gap-3.5 py-1">
          <div className="p-2.5 rounded-12px bg-[#F3F4F6] dark:bg-[#23262F] flex items-center gap-2.5">
            <img
              src={property.images[0]}
              alt=""
              className="w-12 h-12 rounded-8px object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                {property.title}
              </h4>
              <div className="text-xs font-bold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                {property.priceDisplay}
              </div>
              <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                Agent: {property.agent.name}
              </div>
            </div>
          </div>

          {/* Preferred Date */}
          <Input
            label="Preferred Site Visit Date"
            type="date"
            icon={Calendar}
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />

          {/* Preferred Time Slot */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-bold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider">
              Preferred Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="h-11 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs px-3 focus:outline-none focus:border-[#3B4FCD]"
            >
              <option>Morning (10 AM - 12 PM)</option>
              <option>Afternoon (2 PM - 4 PM)</option>
              <option>Evening (4 PM - 6 PM)</option>
            </select>
          </div>

          {/* Contact Preference */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-bold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider">
              Preferred Contact Channel
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['WhatsApp & Call', 'WhatsApp Only', 'Phone Call'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setContactMode(mode)}
                  className={`p-2 rounded-10px text-[10px] font-bold border transition-all text-center ${
                    contactMode === mode
                      ? 'bg-[#3B4FCD] text-white border-[#3B4FCD]'
                      : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB] dark:border-[#3A3F52]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-bold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider">
              Custom Requirements
            </label>
            <textarea
              rows={3}
              value={inquiryMsg}
              onChange={(e) => setInquiryMsg(e.target.value)}
              className="w-full p-2.5 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:border-[#3B4FCD]"
              placeholder="Questions about pricing, floor plans, or loan tie-ups..."
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={isSubmitting}
            icon={Send}
            iconPosition="right"
            className="w-full mt-1 shadow-pop"
          >
            Submit Direct Inquiry
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
};
