import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  User,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Eye,
  Trash2,
  Tag,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { BottomSheet } from '../components/BottomSheet';
import { StatusBadge } from '../components/StatusBadge';
import { ALL_TN_DISTRICTS, MOCK_CATEGORIES } from '../data/mockData';

export const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, inquiries, acceptInquiry, rejectInquiry, addProperty, deleteProperty } = useProperties();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'listings'
  const [inquiryFilter, setInquiryFilter] = useState('Pending'); // 'all' | 'Pending' | 'Contacted' | 'Confirmed'

  // Modal State for New Property Listing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Chennai');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newType, setNewType] = useState('Apartment');
  const [newBhk, setNewBhk] = useState(3);
  const [newArea, setNewArea] = useState(1500);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('/properties/tn_classic_white_apt.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accept Inquiry Modal State
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Agent Specific Metrics
  const agentProperties = properties.filter(
    (p) => p.agent?.email === user?.email || p.agent?.name === user?.name || true // fallback to all for demo
  );

  const pendingInquiries = inquiries.filter((i) => i.status === 'Pending');
  const confirmedInquiries = inquiries.filter((i) => i.status === 'Contacted' || i.status === 'Confirmed' || i.status === 'Approved');

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter === 'all') return true;
    if (inquiryFilter === 'Confirmed') return inq.status === 'Contacted' || inq.status === 'Confirmed' || inq.status === 'Approved';
    return inq.status.toLowerCase() === inquiryFilter.toLowerCase();
  });

  const handleAddPropertySubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !newLocation.trim()) {
      showToast('Please fill in all mandatory fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const numericPrice = parseFloat(newPrice.replace(/[^0-9.]/g, '')) || 8500000;

    const propertyObj = {
      title: newTitle.trim(),
      city: newCity,
      location: newLocation.trim(),
      price: numericPrice,
      priceDisplay: `₹${(numericPrice / 100000).toFixed(2)} Lakhs`,
      type: newType,
      bhk: parseInt(newBhk, 10),
      sqft: parseInt(newArea, 10),
      description: newDescription || `Premium ${newBhk} BHK ${newType} situated in prime ${newLocation}, ${newCity}. TN RERA approved project.`,
      images: [newImageUrl, '/properties/tn_modern_house.jpg'],
      verified: true,
      featured: true,
      agent: {
        name: user?.name || 'Verified Builder',
        phone: user?.phone || '+91 98401 23456',
        email: user?.email || 'agent@propease.in',
        role: 'Verified Agent / Builder',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    };

    setTimeout(() => {
      addProperty(propertyObj);
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      // Reset
      setNewTitle('');
      setNewLocation('');
      setNewPrice('');
      setNewDescription('');
      showToast('New property listing published successfully!', 'success');
    }, 600);
  };

  const handleOpenAcceptModal = (inq) => {
    setSelectedInquiry(inq);
    setReplyMessage(`Vanakkam ${inq.seekerName || 'Friend'}! Your site visit appointment has been CONFIRMED for ${inq.preferredVisitDate || 'this Saturday'}. I will be waiting at the property gate with all RERA title documents.`);
  };

  const handleConfirmAccept = () => {
    if (!selectedInquiry) return;
    acceptInquiry(selectedInquiry.id, replyMessage, 'AGENT');
    setSelectedInquiry(null);
    setReplyMessage('');
    showToast(`Site visit request accepted for ${selectedInquiry.seekerName || 'Buyer'}!`, 'success');
  };

  const handleReject = (inqId) => {
    rejectInquiry(inqId, 'Agent unavailable for requested slot. Alternative dates will be proposed.');
    showToast('Inquiry declined', 'info');
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-1">
      {/* Agent Top Banner */}
      <div className="p-4 rounded-24px bg-gradient-to-r from-[#1E1B4B] via-[#2E1065] to-[#3B4FCD] text-white shadow-pop relative overflow-hidden flex flex-col gap-3">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#0EA5A0]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-8px bg-white/20 backdrop-blur-md text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
              Verified Agent & Builder Console
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10B981] text-white">
            Online & Ready
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white">
            Welcome, {user?.name || 'Agent'} 👋
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Manage buyer inquiries, accept scheduled site visits, and publish new Tamil Nadu property listings.
          </p>
        </div>

        <div className="pt-1 flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={PlusCircle}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white text-[#3B4FCD] hover:bg-[#EEF2FF] font-bold text-xs shadow-sm"
          >
            + Post New Property
          </Button>

          <Button
            size="sm"
            variant="ghost"
            icon={Building2}
            onClick={() => setActiveTab('listings')}
            className="text-white hover:bg-white/10 text-xs font-semibold"
          >
            My Listings ({agentProperties.length})
          </Button>
        </div>
      </div>

      {/* 4 Agent KPIs */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          title="Pending Requests"
          value={pendingInquiries.length}
          subtitle="Buyer visits waiting"
          icon={Clock}
          badge={pendingInquiries.length > 0 ? "Action Needed" : "All Caught Up"}
          badgeType={pendingInquiries.length > 0 ? "warning" : "positive"}
          onClick={() => {
            setActiveTab('inquiries');
            setInquiryFilter('Pending');
          }}
        />

        <StatCard
          title="Confirmed Visits"
          value={confirmedInquiries.length}
          subtitle="Scheduled site visits"
          icon={CheckCircle2}
          badge="Active"
          badgeType="positive"
          onClick={() => {
            setActiveTab('inquiries');
            setInquiryFilter('Confirmed');
          }}
        />

        <StatCard
          title="My Listings"
          value={agentProperties.length}
          subtitle="Active in Tamil Nadu"
          icon={Building2}
          badge="Live"
          badgeType="positive"
          onClick={() => setActiveTab('listings')}
        />

        <StatCard
          title="Lead Conversion"
          value="84.2%"
          subtitle="Inquiry response rate"
          icon={TrendingUp}
          badge="Top Rated"
          badgeType="positive"
        />
      </div>

      {/* Main Mode Toggle: Inquiries vs Listings */}
      <div className="grid grid-cols-2 p-1 rounded-16px bg-[#F3F4F6] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143]">
        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-12px text-xs font-bold transition-all ${
            activeTab === 'inquiries'
              ? 'bg-white dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] shadow-card'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Buyer Visit Requests ({inquiries.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-12px text-xs font-bold transition-all ${
            activeTab === 'listings'
              ? 'bg-white dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] shadow-card'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          My Property Listings ({agentProperties.length})
        </button>
      </div>

      {/* SECTION 1: INCOMING BUYER REQUESTS & SITE VISITS */}
      {activeTab === 'inquiries' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* Sub-filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'Pending', label: `Pending Approval (${pendingInquiries.length})` },
              { id: 'Confirmed', label: `Confirmed (${confirmedInquiries.length})` },
              { id: 'all', label: `All Requests (${inquiries.length})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setInquiryFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  inquiryFilter === f.id
                    ? 'bg-[#3B4FCD] text-white shadow-sm'
                    : 'bg-white dark:bg-[#1A1D27] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#2D3143]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredInquiries.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col gap-3"
                >
                  {/* Buyer & Property Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B4FCD] to-[#0EA5A0] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {inq.seekerName ? inq.seekerName.charAt(0) : 'B'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F1F5F9]">
                            {inq.seekerName || 'Buyer Inquiry'}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-4px bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] font-semibold">
                            Buyer
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                          <span>{inq.seekerPhone || '+91 98765 43210'}</span>
                          <span>•</span>
                          <span>{inq.seekerEmail || 'buyer@gmail.com'}</span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={inq.status} />
                  </div>

                  {/* Referenced Property */}
                  <div
                    onClick={() => navigate(`/properties/${inq.propertyId}`)}
                    className="p-2.5 rounded-12px bg-[#F8F9FC] dark:bg-[#23262F] border border-[#E5E7EB] dark:border-[#2D3143] flex items-center gap-2.5 cursor-pointer hover:border-[#3B4FCD] transition-colors"
                  >
                    <img
                      src={inq.propertyImage || '/properties/tn_classic_white_apt.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-8px object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                        {inq.propertyTitle}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                          {inq.propertyPrice}
                        </span>
                        <span className="text-[#6B7280] dark:text-[#9CA3AF] truncate">
                          • {inq.propertyLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Request Details */}
                  <div className="p-3 rounded-12px bg-[#EEF2FF]/40 dark:bg-[#1E1B4B]/20 border border-[#C7D2FE]/60 dark:border-[#3730A3]/40 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-[#3B4FCD] dark:text-[#A5B4FC] font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Requested Visit Date: {inq.preferredVisitDate || 'This Weekend (11:00 AM)'}
                      </span>
                    </div>
                    <p className="text-[#374151] dark:text-[#D1D5DB] leading-relaxed">
                      "{inq.seekerMessage}"
                    </p>
                  </div>

                  {/* Existing Reply if Confirmed */}
                  {inq.agentReply && (
                    <div className="p-2.5 rounded-10px bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#A7F3D0] dark:border-[#047857]/40 text-xs text-[#065F46] dark:text-[#6EE7B7]">
                      <div className="font-bold text-[10px] uppercase mb-0.5">Your Sent Confirmation:</div>
                      <div>{inq.agentReply}</div>
                    </div>
                  )}

                  {/* Action Buttons for Agent */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143]">
                    <a
                      href={`tel:${inq.seekerPhone || '+919876543210'}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-8px bg-[#F3F4F6] dark:bg-[#23262F] text-xs font-bold text-[#111827] dark:text-[#F1F5F9] hover:bg-[#E5E7EB]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                      Call Buyer
                    </a>

                    <div className="flex items-center gap-2">
                      {inq.status === 'Pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleReject(inq.id)}
                            className="px-3 py-1.5 rounded-8px text-xs font-semibold text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/30"
                          >
                            Decline
                          </button>
                          <Button
                            size="sm"
                            variant="primary"
                            icon={CheckCircle2}
                            onClick={() => handleOpenAcceptModal(inq)}
                            className="shadow-pop text-xs font-bold"
                          >
                            Accept & Confirm Visit
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Visit Confirmed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-24px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-center text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              No {inquiryFilter !== 'all' ? inquiryFilter : ''} inquiries found.
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MY PROPERTY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Active Listings ({agentProperties.length})
            </h3>
            <Button
              size="sm"
              variant="primary"
              icon={PlusCircle}
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs shadow-pop"
            >
              + Add Property
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {agentProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-3.5 rounded-20px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prop.images[0]}
                    alt=""
                    className="w-16 h-16 rounded-12px object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-[#EEF2FF] text-[#3B4FCD] dark:bg-[#23262F] dark:text-[#A5B4FC]">
                        {prop.type} • {prop.bhk} BHK
                      </span>
                      <span className="text-[10px] font-bold text-[#10B981]">
                        TN RERA Approved
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F1F5F9] truncate mt-0.5">
                      {prop.title}
                    </h4>
                    <div className="text-xs font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                      {prop.priceDisplay}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-[#2D3143] text-xs">
                  <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3B4FCD]" />
                    {prop.city}, Tamil Nadu
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/properties/${prop.id}`)}
                      className="px-2.5 py-1 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] font-bold text-[11px] hover:underline"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProperty(prop.id);
                        showToast('Listing removed', 'info');
                      }}
                      className="p-1.5 rounded-8px text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/30"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW PROPERTY LISTING */}
      <BottomSheet
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Post New Property Listing"
      >
        <form onSubmit={handleAddPropertySubmit} className="flex flex-col gap-3.5 py-1 text-left">
          <Input
            label="Property Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Coimbatore Saravanampatti 3 BHK Villa"
            required
          />

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#374151] dark:text-[#D1D5DB] mb-1">
                District / City
              </label>
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-12px bg-[#F8F9FC] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs font-semibold text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B4FCD]"
              >
                {ALL_TN_DISTRICTS.filter(d => d !== 'All Tamil Nadu').map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] dark:text-[#D1D5DB] mb-1">
                Property Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-12px bg-[#F8F9FC] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs font-semibold text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B4FCD]"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">Independent House</option>
                <option value="Plot">Plot / Land</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <Input
            label="Locality / Landmark"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="e.g. Near CHIL SEZ Tech Park, Saravanampatti"
            required
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Price (INR ₹)"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="7500000"
              required
            />
            <Input
              label="BHK"
              type="number"
              value={newBhk}
              onChange={(e) => setNewBhk(e.target.value)}
              placeholder="3"
            />
            <Input
              label="Area (sqft)"
              type="number"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] dark:text-[#D1D5DB] mb-1">
              Select Primary Photo
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                '/properties/tn_classic_white_apt.jpg',
                '/properties/tn_tropical_villa.jpg',
                '/properties/tn_modern_house.jpg',
                '/properties/tn_highrise_dusk.jpg'
              ].map((imgUrl) => (
                <div
                  key={imgUrl}
                  onClick={() => setNewImageUrl(imgUrl)}
                  className={`h-14 rounded-10px overflow-hidden border-2 cursor-pointer transition-all ${
                    newImageUrl === imgUrl ? 'border-[#3B4FCD] ring-2 ring-[#3B4FCD]/30' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] dark:text-[#D1D5DB] mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe amenities, Vaastu compliance, water source, and nearby connectivity..."
              className="w-full p-3 rounded-12px bg-[#F8F9FC] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B4FCD]"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={isSubmitting}
            icon={CheckCircle2}
            className="w-full mt-2 shadow-pop"
          >
            Publish Listing Live to Tamil Nadu
          </Button>
        </form>
      </BottomSheet>

      {/* MODAL 2: ACCEPT / CONFIRM INQUIRY */}
      <BottomSheet
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Confirm Site Visit Appointment"
      >
        {selectedInquiry && (
          <div className="flex flex-col gap-3.5 py-1 text-left animate-fade-in">
            <div className="p-3 rounded-14px bg-[#EEF2FF] dark:bg-[#23262F] border border-[#C7D2FE] dark:border-[#3730A3] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B4FCD] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {selectedInquiry.seekerName?.charAt(0) || 'B'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                  {selectedInquiry.seekerName || 'Buyer'}
                </div>
                <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                  Requested: {selectedInquiry.preferredVisitDate || 'Saturday 11:00 AM'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] dark:text-[#D1D5DB] mb-1">
                Confirmation Note & Meeting Instructions
              </label>
              <textarea
                rows={4}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Enter instructions for the buyer..."
                className="w-full p-3 rounded-12px bg-[#F8F9FC] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B4FCD]"
              />
            </div>

            <Button
              type="button"
              size="lg"
              variant="primary"
              icon={CheckCircle2}
              onClick={handleConfirmAccept}
              className="w-full shadow-pop font-bold"
            >
              Send Confirmation & Reserve Slot
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
