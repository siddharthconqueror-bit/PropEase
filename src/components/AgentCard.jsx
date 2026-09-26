import React from 'react';
import { Phone, MessageSquare, Star, ShieldCheck, Mail } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { useToast } from '../context/ToastContext';

export const AgentCard = ({ agent, onInquireClick }) => {
  const { showToast } = useToast();

  if (!agent) return null;

  const handleCall = () => {
    showToast(`Calling ${agent.name} at ${agent.phone}...`, 'info');
    window.location.href = `tel:${agent.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    showToast(`Opening WhatsApp chat with ${agent.name}...`, 'success');
    const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(agent.name)},%20I%20saw%20your%20property%20listing%20on%20PropEase.`, '_blank');
  };

  return (
    <div className="p-4.5 rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col gap-4">
      {/* Agent Info Header */}
      <div className="flex items-center gap-3">
        <Avatar src={agent.avatar} name={agent.name} size="lg" online />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold font-heading text-[#111827] dark:text-[#F1F5F9] truncate">
              {agent.name}
            </h4>
            {agent.verifiedAgent && (
              <ShieldCheck className="w-4 h-4 text-[#0EA5A0] flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate mt-0.5">
            {agent.agency}
          </p>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {agent.rating}
            </span>
            <span>•</span>
            <span>{agent.experience}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: WhatsApp, Call, and Direct Inquiry */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Button
          variant="outline"
          size="md"
          icon={MessageSquare}
          onClick={handleWhatsApp}
          className="text-[#0EA5A0] border-[#0EA5A0]/40 hover:bg-[#0EA5A0]/10"
        >
          WhatsApp
        </Button>
        <Button
          variant="secondary"
          size="md"
          icon={Phone}
          onClick={handleCall}
        >
          Call Agent
        </Button>
      </div>
    </div>
  );
};
