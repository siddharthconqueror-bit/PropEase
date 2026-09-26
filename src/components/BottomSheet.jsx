import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showHandle = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Modal Container */}
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] bg-white dark:bg-[#1A1D27] rounded-t-24px sm:rounded-24px border border-[#E5E7EB] dark:border-[#2D3143] shadow-sheet sm:shadow-pop flex flex-col z-10 animate-slide-up overflow-hidden pb-safe ${className}`}
      >
        {/* Drag handle for mobile */}
        {showHandle && (
          <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab">
            <div className="w-12 h-1.5 rounded-full bg-[#D1D5DB] dark:bg-[#3A3F52]" />
          </div>
        )}

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] dark:border-[#2D3143]">
          <h3 className="text-base font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-8px flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#23262F] transition-colors"
            aria-label="Close sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Scrollable Body */}
        <div className="px-5 py-4 overflow-y-auto no-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
