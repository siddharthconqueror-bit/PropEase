import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Sun,
  Moon,
  ArrowLeft,
  Bell,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Tag,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { Avatar } from './Avatar';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

export const Header = ({ showBack = false, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const {
    properties,
    notifications,
    markNotificationRead,
    deleteNotification,
    markAllNotificationsRead,
    clearAllNotifications
  } = useProperties();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotifId, setSelectedNotifId] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isProfilePage = location.pathname === '/user/profile';
  const isDetailPage = location.pathname.startsWith('/properties/') && location.pathname !== '/properties';
  const canGoBack = showBack || isDetailPage || isProfilePage;

  const selectedNotif = notifications.find(n => n.id === selectedNotifId);
  const linkedProperty = selectedNotif?.propertyId ? properties.find(p => p.id === selectedNotif.propertyId) : null;

  const handleOpenNotification = (notif) => {
    markNotificationRead(notif.id);
    setSelectedNotifId(notif.id);
  };

  const handleCloseSheet = () => {
    setIsNotifOpen(false);
    setSelectedNotifId(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#2D3143] transition-colors flex-shrink-0">
        <div className="w-full px-4 h-13 flex items-center justify-between">
          {/* Left: Brand or Back Button */}
          <div className="flex items-center gap-2">
            {canGoBack ? (
              <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 rounded-10px bg-[#F3F4F6] dark:bg-[#1A1D27] flex items-center justify-center text-[#111827] dark:text-[#F1F5F9] hover:bg-[#E5E7EB] dark:hover:bg-[#23262F] transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}

            {title ? (
              <div>
                <h1 className="text-sm font-bold font-heading text-[#111827] dark:text-[#F1F5F9] leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                    {subtitle}
                  </p>
                )}
              </div>
            ) : (
              <div
                onClick={() => navigate(isAuthenticated ? '/user/dashboard' : '/')}
                className="flex items-center gap-2 cursor-pointer select-none group"
              >
                <div className="w-8 h-8 rounded-10px bg-white dark:bg-[#1A1D27] p-0.5 border border-[#E5E7EB] dark:border-[#2D3143] shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src="/propease-logo.png"
                    alt="PropEase Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold font-heading tracking-tight text-[#111827] dark:text-[#F1F5F9] leading-tight">
                    Prop<span className="text-[#3B4FCD] dark:text-[#A5B4FC]">Ease</span>
                  </span>
                  <span className="text-[8px] text-[#6B7280] dark:text-[#9CA3AF] font-medium leading-none mt-0.5">
                    Tamil Nadu Real Estate
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-8px bg-[#F3F4F6] dark:bg-[#1A1D27] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#3B4FCD]" />}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative w-8 h-8 rounded-8px bg-[#F3F4F6] dark:bg-[#1A1D27] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9] transition-all"
              aria-label="View Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white dark:ring-[#0F1117]" />
              )}
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => navigate('/user/profile')}
              className="cursor-pointer pl-0.5 hover:scale-105 active:scale-95 transition-transform"
              title="Open Profile"
            >
              <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" online={isAuthenticated} />
            </div>
          </div>
        </div>
      </header>

      {/* Dedicated Notification Modal / Bottom Sheet */}
      <BottomSheet
        isOpen={isNotifOpen}
        onClose={handleCloseSheet}
        title={selectedNotif ? "Notification Details" : "Notifications Center"}
      >
        {selectedNotif ? (
          /* FULL NOTIFICATION DETAIL VIEW */
          <div className="flex flex-col gap-3.5 py-1 text-left animate-fade-in">
            {/* Top Navigation & Actions */}
            <div className="flex items-center justify-between pb-1 border-b border-[#E5E7EB] dark:border-[#2D3143]">
              <button
                type="button"
                onClick={() => setSelectedNotifId(null)}
                className="text-xs font-bold text-[#3B4FCD] dark:text-[#A5B4FC] flex items-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to All Notifications
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteNotification(selectedNotif.id);
                  setSelectedNotifId(null);
                }}
                className="text-[11px] text-[#EF4444] hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>

            {/* Category Badge & Timestamp */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] border border-[#C7D2FE] dark:border-[#3730A3]">
                {selectedNotif.category || 'System Alert'}
              </span>
              <span className="text-[10px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                {selectedNotif.date || selectedNotif.time}
              </span>
            </div>

            {/* Full Headline Title */}
            <h3 className="text-sm sm:text-base font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9] leading-snug">
              {selectedNotif.title}
            </h3>

            {/* Full Expanded Notification Message */}
            <div className="p-3.5 rounded-16px bg-[#F8F9FC] dark:bg-[#1E2230] border border-[#E5E7EB] dark:border-[#2D3143] text-xs sm:text-sm text-[#374151] dark:text-[#D1D5DB] leading-relaxed shadow-inner">
              {selectedNotif.fullMessage || selectedNotif.description}
            </div>

            {/* Sender / Authority Card */}
            {selectedNotif.sender && (
              <div className="p-3 rounded-14px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {selectedNotif.sender.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                      {selectedNotif.sender.name}
                    </div>
                    <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                      {selectedNotif.sender.role}
                    </div>
                  </div>
                </div>

                {selectedNotif.sender.phone && (
                  <a
                    href={`tel:${selectedNotif.sender.phone}`}
                    className="px-2.5 py-1.5 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] text-[10px] font-bold flex items-center gap-1 flex-shrink-0 hover:bg-[#3B4FCD] hover:text-white transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                )}
              </div>
            )}

            {/* Linked Property Preview Card */}
            {linkedProperty && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase text-[#6B7280] dark:text-[#9CA3AF] tracking-wider">
                  Referenced Property Listing:
                </span>
                <div
                  onClick={() => {
                    handleCloseSheet();
                    navigate(`/properties/${linkedProperty.id}`);
                  }}
                  className="p-2.5 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#3B4FCD]/30 hover:border-[#3B4FCD] shadow-sm flex items-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <img
                    src={linkedProperty.images[0]}
                    alt=""
                    className="w-14 h-14 rounded-10px object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                      {linkedProperty.title}
                    </h5>
                    <div className="text-xs font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                      {linkedProperty.priceDisplay}
                    </div>
                    <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                      {linkedProperty.city}, Tamil Nadu
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#3B4FCD] flex-shrink-0" />
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              {linkedProperty && (
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => {
                    handleCloseSheet();
                    navigate(`/properties/${linkedProperty.id}`);
                  }}
                  className="w-full shadow-pop text-xs font-bold"
                >
                  View Property Details
                </Button>
              )}

              {selectedNotif.type === 'inquiry' && (
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    handleCloseSheet();
                    navigate('/user/inquiries');
                  }}
                  className="w-full text-xs font-bold"
                >
                  Go to My Inquiries
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* NOTIFICATIONS LIST VIEW (PREVIEW MODE) */
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[#E5E7EB] dark:border-[#2D3143]">
              <span className="text-[#6B7280] dark:text-[#9CA3AF]">
                {notifications.length} Alerts ({unreadCount} unread)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-bold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
                >
                  Mark all read
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
                    onClick={() => handleOpenNotification(notif)}
                    className={`p-3 rounded-16px border transition-all cursor-pointer hover:border-[#3B4FCD] text-left ${
                      notif.read
                        ? 'bg-[#F8F9FC] dark:bg-[#1A1D27] border-[#E5E7EB] dark:border-[#2D3143] opacity-85'
                        : 'bg-white dark:bg-[#23262F] border-[#3B4FCD]/40 ring-1 ring-[#3B4FCD]/20 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#3B4FCD] flex-shrink-0 animate-pulse" />
                        )}
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-4px bg-[#EEF2FF] dark:bg-[#1A1D27] text-[#3B4FCD] dark:text-[#A5B4FC] border border-[#C7D2FE] dark:border-[#3730A3] uppercase">
                          {notif.category || 'Alert'}
                        </span>
                        <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap flex-shrink-0">
                        {notif.time}
                      </span>
                    </div>

                    {/* Brief Preview Text */}
                    <p className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF] mt-1.5 line-clamp-2 leading-relaxed">
                      {notif.previewText || notif.description || notif.fullMessage}
                    </p>

                    {/* Tap to view full details link */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.04] text-[10px]">
                      <span className="text-[#3B4FCD] dark:text-[#A5B4FC] font-semibold flex items-center gap-0.5">
                        Tap to view full notification
                        <ChevronRight className="w-3 h-3" />
                      </span>
                      {notif.read && (
                        <span className="text-[#9CA3AF] text-[9px]">Read</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                No notifications at this time.
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </>
  );
};
