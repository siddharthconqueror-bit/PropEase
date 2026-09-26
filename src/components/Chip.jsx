import React from 'react';
import { Building2, Building, Home, LandPlot, Crown, Briefcase } from 'lucide-react';
import { MOCK_CATEGORIES } from '../data/mockData';

const iconMap = {
  Building2,
  Building,
  Home,
  LandPlot,
  Crown,
  Briefcase
};

export const Chip = ({
  label,
  subLabel,
  active = false,
  onClick,
  icon: Icon,
  count,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 border ${
        active
          ? 'bg-[#3B4FCD] text-white border-[#3B4FCD] shadow-sm'
          : 'bg-white dark:bg-[#1A1D27] text-[#111827] dark:text-[#F1F5F9] border-[#E5E7EB] dark:border-[#2D3143] hover:bg-[#F3F4F6] dark:hover:bg-[#23262F]'
      } ${className}`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`} />}
      <span>{label}</span>
      {subLabel && (
        <span className={`text-[10px] font-normal opacity-80 ${active ? 'text-white/80' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
          ({subLabel})
        </span>
      )}
      {count !== undefined && (
        <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#6B7280] dark:text-[#9CA3AF]'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

export const FilterChips = ({ selectedCategory = 'all', onSelectCategory, categories = MOCK_CATEGORIES }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-4 -mx-4">
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Building2;
        return (
          <Chip
            key={cat.id}
            label={cat.label}
            subLabel={cat.tamil}
            icon={IconComponent}
            active={selectedCategory === cat.id}
            onClick={() => onSelectCategory(cat.id)}
          />
        );
      })}
    </div>
  );
};
