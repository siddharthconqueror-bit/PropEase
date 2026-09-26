import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Sparkles, ShieldCheck, Compass, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleGetStarted = () => {
    completeOnboarding();
    navigate('/user/dashboard');
  };

  const handleBrowseGuest = () => {
    navigate('/properties');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Brand Bar */}
      <div className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-16px bg-white dark:bg-[#1A1D27] p-1 border border-[#E5E7EB] dark:border-[#2D3143] shadow-pop flex items-center justify-center overflow-hidden">
            <img src="/propease-logo.png" alt="PropEase Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9]">
                Prop<span className="text-[#3B4FCD] dark:text-[#A5B4FC]">Ease</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-4px bg-[#EEF2FF] text-[#3B4FCD] dark:bg-[#23262F] dark:text-[#A5B4FC]">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-medium font-tamil">
              தமிழ்நாடு & இந்தியா
            </span>
          </div>
        </div>

        <button
          onClick={handleBrowseGuest}
          className="text-xs font-semibold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline flex items-center gap-0.5"
        >
          Skip to Browse
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Illustration / Content */}
      <div className="my-auto py-6 flex flex-col gap-6 animate-fade-in">
        <div className="relative rounded-24px overflow-hidden shadow-pop border border-[#E5E7EB] dark:border-[#2D3143] bg-white dark:bg-[#1A1D27]">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            alt="PropEase Modern Homes"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#0EA5A0] bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm w-fit mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Property Discovery
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white leading-tight">
              Find Your Perfect Property
            </h2>
            <p className="text-xs text-white/80 mt-1">
              AI-powered real estate intelligence for Chennai, Coimbatore, Madurai & across India.
            </p>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 p-3.5 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card">
            <div className="w-10 h-10 rounded-12px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                AI Property Concierge
              </h4>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Get personalized recommendations, EMI breakdowns, and micro-market analysis instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card">
            <div className="w-10 h-10 rounded-12px bg-[#CCFBF1] dark:bg-[#134E4A]/30 flex items-center justify-center text-[#0EA5A0] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                100% TN RERA & Title Verified
              </h4>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Every listing is cross-checked with official land records, DTCP, and RERA certifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card">
            <div className="w-10 h-10 rounded-12px bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Direct Agent & Builder Inquiries
              </h4>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Schedule verified site visits, talk on WhatsApp, and receive pre-approved bank loans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pb-safe flex flex-col gap-2.5">
        <Button
          size="lg"
          variant="primary"
          icon={ArrowRight}
          iconPosition="right"
          onClick={handleGetStarted}
          className="w-full shadow-pop"
        >
          Get Started
        </Button>

        <Button
          size="md"
          variant="outline"
          onClick={() => navigate('/login')}
          className="w-full"
        >
          Sign In to Existing Account
        </Button>
      </div>
    </div>
  );
};
