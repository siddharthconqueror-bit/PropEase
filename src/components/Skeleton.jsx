import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-12px' }) => {
  return (
    <div
      className={`animate-pulse bg-[#E5E7EB] dark:bg-[#23262F] ${rounded} ${className}`}
    />
  );
};

export const PropertyCardSkeleton = () => {
  return (
    <div className="rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] overflow-hidden p-3.5 flex flex-col gap-3 shadow-card">
      <Skeleton className="w-full h-48 rounded-16px" />
      <div className="flex justify-between items-center px-1">
        <Skeleton className="w-28 h-6 rounded-8px" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-8px px-1" />
      <Skeleton className="w-1/2 h-4 rounded-8px px-1" />
      <div className="flex gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
        <Skeleton className="w-1/3 h-4 rounded-4px" />
        <Skeleton className="w-1/3 h-4 rounded-4px" />
        <Skeleton className="w-1/3 h-4 rounded-4px" />
      </div>
    </div>
  );
};
