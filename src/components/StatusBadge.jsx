import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, Check, XCircle, Sparkles } from 'lucide-react';

export const StatusBadge = ({ status, size = 'sm', showIcon = true, className = '' }) => {
  let bg = "bg-[#EEF2FF] text-[#3B4FCD] dark:bg-[#23262F] dark:text-[#EEF2FF] border-[#E0E7FF] dark:border-[#3A3F52]";
  let Icon = Sparkles;
  let label = status;

  switch (status?.toLowerCase()) {
    case 'pending':
      bg = "bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F]/30 dark:text-[#FCD34D] border-[#FDE68A] dark:border-[#92400E]/50";
      Icon = Clock;
      break;
    case 'contacted':
      bg = "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD] border-[#BFDBFE] dark:border-[#1E40AF]/50";
      Icon = CheckCircle2;
      break;
    case 'resolved':
      bg = "bg-[#D1FAE5] text-[#059669] dark:bg-[#064E3B]/30 dark:text-[#6EE7B7] border-[#A7F3D0] dark:border-[#065F46]/50";
      Icon = Check;
      break;
    case 'cancelled':
    case 'canceled':
      bg = "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D]/30 dark:text-[#FCA5A5] border-[#FECACA] dark:border-[#991B1B]/50";
      Icon = XCircle;
      break;
    case 'verified':
      bg = "bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A]/40 dark:text-[#5EEAD4] border-[#99F6E4] dark:border-[#115E59]";
      Icon = ShieldCheck;
      label = "Verified";
      break;
    case 'rera':
    case 'rera approved':
      bg = "bg-[#EEF2FF] text-[#3B4FCD] dark:bg-[#1E1B4B]/40 dark:text-[#A5B4FC] border-[#C7D2FE] dark:border-[#3730A3]";
      Icon = ShieldCheck;
      label = "RERA Approved";
      break;
    case 'featured':
      bg = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      Icon = Sparkles;
      label = "Featured";
      break;
    default:
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px] gap-1' : 'px-3 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border shadow-sm ${sizeClasses} ${bg} ${className}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
