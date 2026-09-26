import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  History,
  Settings as SettingsIcon,
  HelpCircle,
  Bug,
  Info,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
  Send,
  Star,
  Globe,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { BottomSheet } from '../components/BottomSheet';
import { StatusBadge } from '../components/StatusBadge';
import { APP_INFO } from '../data/mockData';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUserRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    properties,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    viewHistory,
    recentSearches,
    clearHistory,
    bugReports,
    submitBugReport,
    settings,
    updateSettings,
    updateFilter,
    geminiApiKey,
    saveApiKey
  } = useProperties();
  const { showToast } = useToast();

  // Active section modal
  const [activeModal, setActiveModal] = useState(null); // 'notifications' | 'history' | 'settings' | 'help' | 'account' | 'bug' | 'about' | 'apikey'

  // API Key Form State
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');

  // Bug Report Form State
  const [bugTitle, setBugTitle] = useState('');
  const [bugCategory, setBugCategory] = useState('UI / Display Issue');
  const [bugDescription, setBugDescription] = useState('');
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // FAQs Accordion open state
  const [openFaq, setOpenFaq] = useState(null);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleBugSubmit = (e) => {
    e.preventDefault();
    if (!bugTitle || !bugDescription) {
      showToast('Please fill in both bug title and description.', 'error');
      return;
    }

    setIsSubmittingBug(true);
    setTimeout(() => {
      submitBugReport({
        title: bugTitle,
        description: bugDescription,
        category: bugCategory,
        userEmail: user?.email,
        userName: user?.name,
      });
      setIsSubmittingBug(false);
      setBugTitle('');
      setBugDescription('');
      setActiveModal(null);
    }, 600);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you for your ${feedbackRating}-star feedback! It has been submitted.`, 'success');
    setFeedbackText('');
    setActiveModal(null);
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    saveApiKey(apiKeyInput);
    setActiveModal(null);
  };

  const viewedPropertiesList = properties.filter(p => viewHistory.includes(p.id));

  const faqs = [
    {
      q: "How does PropEase verify TN RERA properties?",
      a: "Every listing on PropEase is cross-referenced with the official TN RERA public portal database for valid registration number, approved building plan, and encumbrance certificates."
    },
    {
      q: "Are there any brokerage fees for buyers?",
      a: "No. PropEase is a direct buyer-to-builder/verified-agent marketplace with 0% brokerage on new project launches."
    },
    {
      q: "How does typo auto-correction work in AI Advisor?",
      a: "The AI Concierge uses fuzzy Levenshtein distance matching against all Tamil Nadu districts, localities, builder names, and categories so missing or swapped letters are automatically resolved."
    },
    {
      q: "How do I connect my own Google Gemini API Key?",
      a: "Go to Profile > Connect Gemini API Key (or click 'Join API Key' in AI Concierge) and paste your free key from Google AI Studio (aistudio.google.com)."
    }
  ];

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2 max-w-lg mx-auto">
      {/* Profile Header Card */}
      <div className="p-4.5 rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={user?.avatar}
            name={user?.name || 'User'}
            size="lg"
            online={isAuthenticated}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-heading text-[#111827] dark:text-[#F1F5F9] truncate">
                {user?.name || 'Guest User'}
              </h2>
              {isAuthenticated && (
                <ShieldCheck className="w-4 h-4 text-[#0EA5A0] flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate mt-0.5">
              {user?.email || 'Sign in to access all features'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC]">
                {user?.role || 'Guest Explorer'}
              </span>
              {user?.phone && (
                <span className="text-[11px] text-[#9CA3AF]">
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Menu List */}
      <div className="rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#2D3143]">
        {/* 1. Connect API Key */}
        <button
          type="button"
          onClick={() => {
            setApiKeyInput(geminiApiKey || '');
            setActiveModal('apikey');
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] flex items-center gap-1.5">
                <span>Join / Manage API Key</span>
                {geminiApiKey && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-4px bg-[#D1FAE5] text-[#059669]">
                    Connected
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Connect Google Gemini API for live generation
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* 2. Notifications */}
        <button
          type="button"
          onClick={() => setActiveModal('notifications')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Notifications
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Inquiry updates, RERA alerts & price drops
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadNotifsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">
                {unreadNotifsCount} New
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
          </div>
        </button>

        {/* 3. History */}
        <button
          type="button"
          onClick={() => setActiveModal('history')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-[#CCFBF1] dark:bg-[#134E4A]/30 flex items-center justify-center text-[#0EA5A0]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                History & Activity
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Recently viewed properties & search terms
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* 4. Manage Account */}
        <button
          type="button"
          onClick={() => setActiveModal('account')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Manage Account
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Sign in, sign out, switch demo profile
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* 5. Settings */}
        <button
          type="button"
          onClick={() => setActiveModal('settings')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                App Settings
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Theme, Tamil/English language, push alerts
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* 6. Report Bug */}
        <button
          type="button"
          onClick={() => setActiveModal('bug')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] flex items-center gap-1.5">
                <span>Report Bug</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 font-bold">
                  Direct to Creator
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Submit feedback or glitches directly to app creator
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* 7. Help & Feedback */}
        <button
          type="button"
          onClick={() => setActiveModal('help')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Help & Feedback
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                FAQs, typo correction guide & app ratings
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* 8. About PropEase */}
        <button
          type="button"
          onClick={() => setActiveModal('about')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#F8F9FC] dark:hover:bg-[#23262F] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-12px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#A5B4FC]">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                About PropEase
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Version 1.3.0 • All TN Districts • Credits
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </button>
      </div>

      {/* --- MODALS / BOTTOM SHEETS --- */}

      {/* API Key Modal */}
      <BottomSheet
        isOpen={activeModal === 'apikey'}
        onClose={() => setActiveModal(null)}
        title="Connect Google Gemini API Key"
      >
        <form onSubmit={handleSaveApiKey} className="flex flex-col gap-3.5 py-1 text-left">
          <div className="p-3 rounded-12px bg-[#EEF2FF] dark:bg-[#1E1B4B]/30 border border-[#C7D2FE] dark:border-[#3730A3]/50 text-xs text-[#3730A3] dark:text-[#C7D2FE] leading-relaxed">
            <span className="font-bold flex items-center gap-1 mb-1">
              <Key className="w-3.5 h-3.5" />
              Live AI Key Connection:
            </span>
            Paste your Google Gemini API Key below to unlock live AI generative intelligence. If left blank, the app runs on its built-in offline Tamil Nadu reasoning engine.
          </div>

          <Input
            label="Google Gemini API Key"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            helperText="Stored securely in your device's localStorage"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline flex items-center gap-1 font-bold"
            >
              Get Free Key from Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>

            {geminiApiKey && (
              <button
                type="button"
                onClick={() => {
                  saveApiKey('');
                  setApiKeyInput('');
                  setActiveModal(null);
                }}
                className="text-xs text-[#EF4444] hover:underline font-bold"
              >
                Disconnect Key
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
            <Button type="submit" size="md" variant="primary" className="w-full">
              {apiKeyInput.trim() ? 'Save & Connect API Key' : 'Close'}
            </Button>
          </div>
        </form>
      </BottomSheet>

      {/* Notifications Modal */}
      <BottomSheet
        isOpen={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
        title="Notifications Center"
      >
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              {notifications.length} Total Alerts
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-bold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
              >
                Mark all as read
              </button>
              <span>•</span>
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-[#EF4444] hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>

          {notifications.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.propertyId) {
                      setActiveModal(null);
                      navigate(`/properties/${notif.propertyId}`);
                    }
                  }}
                  className={`p-3.5 rounded-16px border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-[#F8F9FC] dark:bg-[#1A1D27] border-[#E5E7EB] dark:border-[#2D3143] opacity-80'
                      : 'bg-white dark:bg-[#23262F] border-[#3B4FCD]/40 ring-1 ring-[#3B4FCD]/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#3B4FCD] flex-shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                        {notif.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF] mt-1">
                    {notif.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              No notifications at this time.
            </div>
          )}
        </div>
      </BottomSheet>

      {/* History Modal */}
      <BottomSheet
        isOpen={activeModal === 'history'}
        onClose={() => setActiveModal(null)}
        title="Browsing & Search History"
      >
        <div className="flex flex-col gap-4 py-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
              Recently Viewed Properties
            </span>
            <button
              onClick={clearHistory}
              className="text-[11px] font-bold text-[#EF4444] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear History
            </button>
          </div>

          {viewedPropertiesList.length > 0 ? (
            <div className="flex flex-col gap-2">
              {viewedPropertiesList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveModal(null);
                    navigate(`/properties/${p.id}`);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] cursor-pointer hover:border-[#3B4FCD]"
                >
                  <img
                    src={p.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-8px object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                      {p.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono-price font-bold text-[#3B4FCD] dark:text-[#A5B4FC]">
                        {p.priceDisplay}
                      </span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                        {p.city}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              No viewed properties in your history yet.
            </p>
          )}

          {/* Recent Searches */}
          <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
            <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] mb-2">
              Recent Search Queries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    updateFilter('query', term);
                    setActiveModal(null);
                    navigate('/properties');
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-[#4B5563] dark:text-[#D1D5DB] hover:border-[#3B4FCD]"
                >
                  🔍 {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Manage Account Modal */}
      <BottomSheet
        isOpen={activeModal === 'account'}
        onClose={() => setActiveModal(null)}
        title="Manage Account & Access"
      >
        <div className="flex flex-col gap-4 py-1">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-16px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                    {user.email} • {user.role}
                  </div>
                </div>
                <StatusBadge status="Verified" />
              </div>



              <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#2D3143]">
                <Button
                  variant="danger"
                  size="md"
                  icon={LogOut}
                  onClick={handleLogout}
                  className="w-full"
                >
                  Sign Out from Account
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                Sign in to sync your wishlist, site visit inquiries, and AI preferences across all devices.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={LogIn}
                  onClick={() => {
                    setActiveModal(null);
                    navigate('/login');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={UserPlus}
                  onClick={() => {
                    setActiveModal(null);
                    navigate('/register');
                  }}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Settings Modal */}
      <BottomSheet
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        title="App & Display Settings"
      >
        <div className="flex flex-col gap-4 py-1">
          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-16px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#3A3F52]">
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Theme Appearance
              </div>
              <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-8px text-xs font-bold bg-[#3B4FCD] text-white shadow-sm"
            >
              Toggle {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Regional Language */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Regional Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'English', label: 'English', sub: 'Default' },
                { code: 'Tamil', label: 'தமிழ்', sub: 'Tamil' },
                { code: 'Hindi', label: 'हिंदी', sub: 'Hindi' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => updateSettings('language', lang.code)}
                  className={`p-2.5 rounded-12px border text-center transition-all ${
                    settings.language === lang.code
                      ? 'bg-[#3B4FCD] text-white border-[#3B4FCD]'
                      : 'bg-[#F8F9FC] dark:bg-[#23262F] text-[#4B5563] dark:text-[#D1D5DB] border-[#E5E7EB] dark:border-[#3A3F52]'
                  }`}
                >
                  <div className="text-xs font-bold">{lang.label}</div>
                  <div className="text-[10px] opacity-80">{lang.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-3 rounded-16px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#3A3F52]">
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Instant WhatsApp & Push Alerts
              </div>
              <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                Receive instant agent site visit updates
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => updateSettings('pushNotifications', e.target.checked)}
              className="w-5 h-5 accent-[#3B4FCD] cursor-pointer"
            />
          </div>
        </div>
      </BottomSheet>

      {/* Report Bug Modal */}
      <BottomSheet
        isOpen={activeModal === 'bug'}
        onClose={() => setActiveModal(null)}
        title="Report Bug (Connected to Creator)"
      >
        <form onSubmit={handleBugSubmit} className="flex flex-col gap-4 py-1">
          <div className="p-3 rounded-12px bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
            <span className="font-bold">Direct Creator Channel:</span> Once submitted, your issue is logged with device metadata and delivered directly to the PropEase creator for resolution.
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Issue Category
            </label>
            <select
              value={bugCategory}
              onChange={(e) => setBugCategory(e.target.value)}
              className="h-12 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] text-xs px-3 focus:outline-none focus:border-[#3B4FCD]"
            >
              <option>UI / Display Issue</option>
              <option>Search & District Filter Glitch</option>
              <option>AI Concierge Typo / Auto-correct Issue</option>
              <option>API Key Connection Issue</option>
              <option>Site Visit Inquiry Submission</option>
              <option>Other Performance Issue</option>
            </select>
          </div>

          <Input
            label="Brief Summary"
            value={bugTitle}
            onChange={(e) => setBugTitle(e.target.value)}
            placeholder="e.g. District filter reset issue in Coimbatore"
            required
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Detailed Description & Steps to Reproduce
            </label>
            <textarea
              rows={3}
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              className="w-full p-3 rounded-12px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:border-[#3B4FCD]"
              placeholder="Describe what happened and what you expected to see..."
              required
            />
          </div>

          {bugReports.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
              <span className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Your Submitted Reports ({bugReports.length})
              </span>
              {bugReports.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-8px bg-[#F8F9FC] dark:bg-[#23262F] text-xs flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="font-bold text-[#3B4FCD] dark:text-[#A5B4FC]">#{r.id}</span> • {r.title}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669] font-semibold whitespace-nowrap">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={isSubmittingBug}
            icon={Send}
            iconPosition="right"
            className="w-full shadow-pop"
          >
            Submit Report to Creator
          </Button>
        </form>
      </BottomSheet>

      {/* Help & Feedback Modal */}
      <BottomSheet
        isOpen={activeModal === 'help'}
        onClose={() => setActiveModal(null)}
        title="Help, Support & Feedback"
      >
        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Frequently Asked Questions
            </h4>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-12px border border-[#E5E7EB] dark:border-[#2D3143] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3 text-left text-xs font-bold text-[#111827] dark:text-[#F1F5F9] bg-[#F8F9FC] dark:bg-[#23262F] flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <span>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="p-3 text-xs text-[#4B5563] dark:text-[#9CA3AF] bg-white dark:bg-[#1A1D27] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Share Your Feedback
            </h4>
            <div className="flex items-center gap-1 my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= feedbackRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What do you love most about PropEase? What can we improve?"
              className="w-full p-2.5 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:border-[#3B4FCD]"
            />

            <Button size="md" variant="secondary" type="submit">
              Submit Feedback
            </Button>
          </form>
        </div>
      </BottomSheet>

      {/* About Modal */}
      <BottomSheet
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
        title="About PropEase"
      >
        <div className="flex flex-col gap-3 py-1 text-left">
          <div className="p-4 rounded-16px bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] text-white">
            <h3 className="text-base font-extrabold font-heading">
              {APP_INFO.name}
            </h3>
            <p className="text-xs text-white/90 mt-1">
              {APP_INFO.tagline}
            </p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
              {APP_INFO.version}
            </span>
          </div>

          <p className="text-xs text-[#4B5563] dark:text-[#D1D5DB] leading-relaxed">
            {APP_INFO.description}
          </p>

          <div className="p-3 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] text-xs flex flex-col gap-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
              Creator & Engineering
            </div>
            <div className="font-bold text-[#111827] dark:text-[#F1F5F9]">
              {APP_INFO.creator}
            </div>
            <div className="text-[#3B4FCD] dark:text-[#A5B4FC]">
              {APP_INFO.supportEmail}
            </div>
          </div>

          <div className="p-3 rounded-12px bg-[#EEF2FF] dark:bg-[#1E1B4B]/30 border border-[#C7D2FE] dark:border-[#3730A3]/50 text-[11px] text-[#3730A3] dark:text-[#C7D2FE]">
            <span className="font-bold">TN RERA Notice:</span> {APP_INFO.reraCompliance}. All property titles are subject to independent legal verification.
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
