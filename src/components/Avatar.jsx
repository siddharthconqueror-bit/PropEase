import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'sm' (32px) | 'md' (40px) | 'lg' (52px) | 'xl' (64px)
  online = false,
  verified = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-13 h-13 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeStyles[size]} rounded-full object-cover border-2 border-white dark:border-[#1A1D27] shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#EEF2FF] font-semibold flex items-center justify-center border-2 border-white dark:border-[#1A1D27] shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-white dark:border-[#1A1D27] rounded-full ring-1 ring-white" />
      )}
    </div>
  );
};
