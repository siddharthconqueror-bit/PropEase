import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'positive',
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col justify-between transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#3B4FCD]/40 active:scale-[0.98]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] line-clamp-1">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#EEF2FF]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold font-heading text-[#111827] dark:text-[#F1F5F9] tracking-tight">
          {value}
        </span>
        {badge && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              badgeType === 'positive'
                ? 'bg-[#D1FAE5] text-[#059669] dark:bg-[#064E3B]/40 dark:text-[#6EE7B7]'
                : 'bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F]/40 dark:text-[#FCD34D]'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="mt-1 text-[11px] text-[#9CA3AF] dark:text-[#6B7280]">
          {subtitle}
        </span>
      )}
    </div>
  );
};
