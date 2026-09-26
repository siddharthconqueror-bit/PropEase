import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Heart, MessageSquare } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const BottomNav = () => {
  const { favorites, inquiries } = useProperties();

  const activeInquiriesCount = inquiries.filter(i => i.status !== 'Cancelled').length;

  const navItems = [
    {
      to: '/user/dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      to: '/properties',
      label: 'Explore',
      icon: Compass,
    },
    {
      to: '/user/ai-concierge',
      label: 'AI Concierge',
      icon: Sparkles,
      highlight: true,
    },
    {
      to: '/user/favorites',
      label: 'Saved',
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : null,
    },
    {
      to: '/user/inquiries',
      label: 'Inquiries',
      icon: MessageSquare,
      badge: activeInquiriesCount > 0 ? activeInquiriesCount : null,
    },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 w-full bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-md border-t border-[#E5E7EB] dark:border-[#2D3143] pb-safe flex-shrink-0 transition-colors">
      <div className="w-full px-2 h-14 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-4 relative group"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-11 h-11 rounded-18px flex items-center justify-center shadow-pop transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${
                        isActive
                          ? 'bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] text-white ring-3 ring-white dark:ring-[#0F1117]'
                          : 'bg-gradient-to-tr from-[#3B4FCD] to-[#2A3BAA] text-white'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
                    </div>
                    <span
                      className={`text-[9px] font-bold mt-0.5 tracking-tight ${
                        isActive ? 'text-[#3B4FCD] dark:text-[#A5B4FC]' : 'text-[#6B7280] dark:text-[#9CA3AF]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                  isActive
                    ? 'text-[#3B4FCD] dark:text-[#A5B4FC]'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#3B4FCD] text-white text-[8px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-medium mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
