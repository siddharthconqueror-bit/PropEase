import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' (36px) | 'md' (48px) | 'lg' (52px) | 'icon' (44px)
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs rounded-8px gap-1.5",
    md: "h-12 px-5 text-sm rounded-12px gap-2", // 48px primary baseline
    lg: "h-13 px-6 text-base rounded-16px gap-2.5",
    icon: "w-11 h-11 p-0 rounded-12px flex items-center justify-center", // 44px icon button baseline
    'icon-sm': "w-9 h-9 p-0 rounded-8px flex items-center justify-center",
  };

  const variantStyles = {
    primary: "bg-[#3B4FCD] hover:bg-[#2A3BAA] text-white shadow-sm focus-visible:ring-[#3B4FCD] dark:focus-visible:ring-offset-[#0F1117]",
    secondary: "bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#3B4FCD] dark:bg-[#23262F] dark:hover:bg-[#2D3143] dark:text-[#EEF2FF] focus-visible:ring-[#3B4FCD]",
    outline: "bg-transparent border border-[#D1D5DB] dark:border-[#2D3143] hover:bg-[#F3F4F6] dark:hover:bg-[#23262F] text-[#111827] dark:text-[#F1F5F9] focus-visible:ring-[#3B4FCD]",
    ghost: "bg-transparent hover:bg-[#F3F4F6] dark:hover:bg-[#23262F] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9]",
    teal: "bg-[#0EA5A0] hover:bg-[#0D9488] text-white shadow-sm focus-visible:ring-[#0EA5A0]",
    danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm focus-visible:ring-[#EF4444]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0`} />
      ) : null}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0`} />
      )}
    </button>
  );
};
