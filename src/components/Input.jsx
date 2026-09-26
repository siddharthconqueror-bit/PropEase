import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
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

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full h-12 rounded-12px bg-white dark:bg-[#1A1D27] border ${
            error
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[#E5E7EB] dark:border-[#2D3143] focus:border-[#3B4FCD] dark:focus:border-[#3B4FCD] focus:ring-[#EEF2FF] dark:focus:ring-[#23262F]'
          } text-[#111827] dark:text-[#F1F5F9] placeholder-[#9CA3AF] text-sm px-4 ${
            Icon ? 'pl-11' : ''
          } ${rightElement ? 'pr-11' : ''} transition-all duration-150 outline-none focus:ring-2 ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] font-medium flex items-center gap-1 mt-0.5">
          <span>•</span> {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
