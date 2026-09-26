import React from 'react';
import { Button } from './Button';
import { Home } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Home,
  title = "No results found",
  description = "Try adjusting your search criteria, filters, or location to explore more properties.",
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-24px bg-white/60 dark:bg-[#1A1D27]/60 border border-dashed border-[#D1D5DB] dark:border-[#2D3143] my-4 ${className}`}>
      <div className="w-14 h-14 rounded-24px bg-[#EEF2FF] dark:bg-[#23262F] flex items-center justify-center text-[#3B4FCD] dark:text-[#EEF2FF] mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#111827] dark:text-[#F1F5F9] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-xs mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
