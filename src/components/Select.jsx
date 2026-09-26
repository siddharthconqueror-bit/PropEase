import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-[#9CA3AF] dark:text-[#6B7280]">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full h-12 appearance-none rounded-12px bg-white dark:bg-[#1A1D27] border ${
            error
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[#E5E7EB] dark:border-[#2D3143] focus:border-[#3B4FCD] dark:focus:border-[#3B4FCD] focus:ring-[#EEF2FF] dark:focus:ring-[#23262F]'
          } text-[#111827] dark:text-[#F1F5F9] text-sm px-4 pr-10 ${
            Icon ? 'pl-11' : ''
          } transition-all duration-150 outline-none focus:ring-2 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option
                key={optVal}
                value={optVal}
                className="bg-white dark:bg-[#1A1D27] text-[#111827] dark:text-[#F1F5F9]"
              >
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-[#9CA3AF] dark:text-[#6B7280]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] font-medium mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
