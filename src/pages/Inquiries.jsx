import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Phone, CheckCircle2, Clock, XCircle, ArrowRight, CornerDownRight, ExternalLink } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

export const Inquiries = () => {
  const navigate = useNavigate();
  const { inquiries, cancelInquiry } = useProperties();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Inquiries', count: inquiries.length },
    { id: 'Pending', label: 'Pending', count: inquiries.filter((i) => i.status === 'Pending').length },
    { id: 'Contacted', label: 'Contacted', count: inquiries.filter((i) => i.status === 'Contacted').length },
    { id: 'Resolved', label: 'Resolved', count: inquiries.filter((i) => i.status === 'Resolved').length },
    { id: 'Cancelled', label: 'Cancelled', count: inquiries.filter((i) => i.status === 'Cancelled').length },
  ];

  const filteredInquiries = inquiries.filter((inq) => {
    if (activeTab === 'all') return true;
    return inq.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleFollowUp = (inq) => {
    showToast(`Sending follow-up reminder to ${inq.agentName}...`, 'success');
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9]">
          Direct Inquiries & Site Visits
        </h2>
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
          Track verified responses, agent site visit slots, and bank loan approvals.
        </p>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-4 -mx-4 border-b border-[#E5E7EB] dark:border-[#2D3143]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-[#3B4FCD] text-[#3B4FCD] dark:text-[#A5B4FC]'
                : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F1F5F9]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                activeTab === tab.id
                  ? 'bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC]'
                  : 'bg-[#F3F4F6] dark:bg-[#23262F] text-[#6B7280] dark:text-[#9CA3AF]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length > 0 ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-4 rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col gap-3.5"
            >
              {/* Header with Property Info & Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={inq.propertyImage}
                    alt={inq.propertyTitle}
                    className="w-14 h-14 rounded-12px object-cover flex-shrink-0"
                  />
                  <div>
                    <h4
                      onClick={() => navigate(`/properties/${inq.propertyId}`)}
                      className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F1F5F9] hover:text-[#3B4FCD] transition-colors cursor-pointer line-clamp-1"
                    >
                      {inq.propertyTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                        {inq.propertyPrice}
                      </span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                        • {inq.propertyLocation}
                      </span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={inq.status} />
              </div>

              {/* Seeker Message Preview */}
              <div className="p-3 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#374151] dark:text-[#D1D5DB] leading-relaxed">
                <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mb-1">
                  <span className="font-semibold uppercase tracking-wider">Your Message</span>
                  <span>Sent {formatDate(inq.createdAt)}</span>
                </div>
                <p>{inq.seekerMessage}</p>
                {inq.preferredVisitDate && (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#3B4FCD] dark:text-[#A5B4FC] mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Requested Visit Date: {inq.preferredVisitDate}</span>
                  </div>
                )}
              </div>

              {/* Agent Reply Box if Available */}
              {inq.agentReply && (
                <div className="p-3 rounded-12px bg-[#EEF2FF]/70 dark:bg-[#1E1B4B]/30 border border-[#C7D2FE] dark:border-[#3730A3]/50 text-xs text-[#1E1B4B] dark:text-[#E0E7FF] leading-relaxed">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#3B4FCD] dark:text-[#A5B4FC] mb-1">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Agent Reply from {inq.agentName} ({inq.agentPhone})</span>
                  </div>
                  <p>{inq.agentReply}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] dark:border-[#2D3143]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFollowUp(inq)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] hover:bg-[#E0E7FF] transition-colors"
                  >
                    Send Follow-up
                  </button>

                  {inq.status !== 'Cancelled' && (
                    <button
                      type="button"
                      onClick={() => cancelInquiry(inq.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-8px text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/30 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/properties/${inq.propertyId}`)}
                  className="flex items-center gap-1 text-xs font-bold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title={`No ${activeTab !== 'all' ? activeTab : ''} Inquiries`}
          description="Send an inquiry on any property to connect directly with verified builders and schedule exclusive site visits."
          actionText="Browse Verified Properties"
          onAction={() => navigate('/properties')}
        />
      )}
    </div>
  );
};
