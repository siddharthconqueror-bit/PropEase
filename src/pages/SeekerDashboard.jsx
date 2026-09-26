import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  MapPin,
  Building,
  Flame,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { StatCard } from '../components/StatCard';
import { PropertyCard } from '../components/PropertyCard';
import { FilterChips } from '../components/Chip';
import { Button } from '../components/Button';
import { ALL_TN_DISTRICTS, MOCK_CATEGORIES } from '../data/mockData';

export const SeekerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, favorites, inquiries, updateFilter, filters } = useProperties();

  const activeInquiries = inquiries.filter((i) => i.status !== 'Cancelled');
  const featuredProperties = properties.filter((p) => p.featured || p.verified);

  const handleCitySelect = (cityName) => {
    updateFilter('city', cityName);
    navigate('/properties');
  };

  const handleCategorySelect = (categoryId) => {
    updateFilter('category', categoryId);
    navigate('/properties');
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-1">
      {/* Welcome Greeting */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#3B4FCD] dark:text-[#A5B4FC] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Live Market Active
          </span>
          <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] font-tamil font-medium">
            வணக்கம் {user?.name?.split(' ')[0] || 'நண்பா'}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9] tracking-tight">
          Welcome, {user?.name?.split(' ')[0] || 'Dinesh'} 👋
        </h2>
        <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
          Discover verified real estate across all 14+ districts of Tamil Nadu.
        </p>
      </div>

      {/* AI Advisor Visual Poster Banner (No chat box, No 'Gemini') */}
      <div className="relative overflow-hidden rounded-24px bg-gradient-to-br from-[#3B4FCD] via-[#2A3BAA] to-[#0EA5A0] text-white p-5 shadow-pop flex flex-col justify-between gap-4">
        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0EA5A0]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Poster Top Badge & Header */}
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md border border-white/20 shadow-sm text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Property Advisor
            </span>
            <span className="text-[10px] font-medium text-white/80">
              Tamil Nadu Real Estate Intelligence
            </span>
          </div>

          <div className="mt-1">
            <h3 className="text-lg sm:text-xl font-extrabold font-heading text-white leading-tight tracking-tight">
              Find Your Ideal Property with AI Guidance
            </h3>
            <p className="text-xs text-white/85 mt-1 leading-relaxed max-w-sm">
              Get instant automated price valuation, locality safety scores, and Tamil Nadu RERA compliance checks before you invest.
            </p>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 rounded-12px bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
            <Zap className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span className="text-[11px] font-medium leading-tight">Instant Micro-Market Insights</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-12px bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
            <ShieldCheck className="w-4 h-4 text-[#5EEAD4] flex-shrink-0" />
            <span className="text-[11px] font-medium leading-tight">100% RERA Title Verification</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-12px bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
            <TrendingUp className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span className="text-[11px] font-medium leading-tight">Accurate EMI & Fair Pricing</span>
          </div>
        </div>

        {/* Poster Bottom Action Button */}
        <div className="relative z-10 pt-1">
          <Button
            size="md"
            variant="secondary"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/user/ai-concierge')}
            className="w-full bg-white text-[#3B4FCD] hover:bg-[#EEF2FF] font-bold border-none shadow-sm h-11 text-xs"
          >
            Consult AI Property Advisor
          </Button>
        </div>
      </div>

      {/* 4 Statistics Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          title="Saved Homes"
          value={favorites.length}
          subtitle="Saved to wishlist"
          icon={Heart}
          badge={favorites.length > 0 ? "Active" : null}
          onClick={() => navigate('/user/favorites')}
        />

        <StatCard
          title="Active Inquiries"
          value={activeInquiries.length}
          subtitle="Direct builder leads"
          icon={MessageSquare}
          badge={activeInquiries.length > 0 ? `${activeInquiries.length} Slots` : null}
          badgeType="positive"
          onClick={() => navigate('/user/inquiries')}
        />

        <StatCard
          title="Total Properties"
          value={`${properties.length}+`}
          subtitle="Across all TN districts"
          icon={ShieldCheck}
          badge="TN RERA"
          badgeType="positive"
          onClick={() => navigate('/properties')}
        />

        <StatCard
          title="Avg Growth"
          value="+11.4%"
          subtitle="Annual TN Index"
          icon={TrendingUp}
          badge="Bullish"
          badgeType="positive"
        />
      </div>

      {/* All Tamil Nadu Districts Horizontal Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#3B4FCD]" />
            Tamil Nadu Districts ({ALL_TN_DISTRICTS.length - 1})
          </h3>
          <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
            15+ properties each
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {ALL_TN_DISTRICTS.map((district) => (
            <button
              key={district}
              onClick={() => handleCitySelect(district)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filters.city === district
                  ? 'bg-[#3B4FCD] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1A1D27] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#2D3143] hover:border-[#3B4FCD]'
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-heading text-[#111827] dark:text-[#F1F5F9] flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-[#0EA5A0]" />
            Categories
          </h3>
          <button
            onClick={() => navigate('/properties')}
            className="text-xs font-semibold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
          >
            See All
          </button>
        </div>
        <FilterChips
          selectedCategory={filters.category}
          onSelectCategory={handleCategorySelect}
          categories={MOCK_CATEGORIES}
        />
      </div>

      {/* Featured Properties Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
              Featured & Verified Listings
            </h3>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="text-xs font-semibold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline flex items-center gap-0.5"
          >
            View all ({properties.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {featuredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};
