import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Search,
  Filter,
  Trash2,
  Eye,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { BottomSheet } from '../components/BottomSheet';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, inquiries, acceptInquiry, rejectInquiry, deleteProperty } = useProperties();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'users' | 'properties'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  // Mock Platform Registered Users for Admin Management
  const [platformUsers, setPlatformUsers] = useState([
    { id: 1, name: 'Senthil Kumar', email: 'senthil@propease.in', role: 'AGENT', phone: '+91 98401 23456', status: 'Active', listings: 6 },
    { id: 2, name: 'Kavitha Raman', email: 'kavitha@propease.in', role: 'AGENT', phone: '+91 94432 89012', status: 'Active', listings: 4 },
    { id: 3, name: 'Dinesh Natarajan', email: 'dinesh@propease.in', role: 'CUSTOMER', phone: '+91 98765 43210', status: 'Active', bookings: 3 },
    { id: 4, name: 'Priya Sundaram', email: 'priya@gmail.com', role: 'CUSTOMER', phone: '+91 97890 12345', status: 'Active', bookings: 1 },
    { id: 5, name: 'Rajesh Kannan', email: 'rajesh.agent@yahoo.com', role: 'AGENT', phone: '+91 98410 56789', status: 'Active', listings: 2 }
  ]);

  const pendingRequests = inquiries.filter((i) => i.status === 'Pending');
  const approvedRequests = inquiries.filter((i) => i.status === 'Contacted' || i.status === 'Confirmed' || i.status === 'Approved');

  const handleOpenApproveModal = (inq) => {
    setSelectedRequest(inq);
    setAdminNote(`Approved by PropEase Administrator. Agent has been notified to assist ${inq.seekerName || 'the buyer'} for site visit.`);
  };

  const handleAdminApprove = () => {
    if (!selectedRequest) return;
    acceptInquiry(selectedRequest.id, adminNote, 'ADMIN');
    setSelectedRequest(null);
    setAdminNote('');
    showToast(`Request #${selectedRequest.id} APPROVED by Administrator!`, 'success');
  };

  const handleAdminReject = (inqId) => {
    rejectInquiry(inqId, 'Declined by Administrator based on scheduling verification.');
    showToast(`Request #${inqId} rejected`, 'info');
  };

  const toggleUserStatus = (userId) => {
    setPlatformUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
    showToast('User status updated', 'info');
  };

  return (
    <div className="flex flex-col gap-4 pb-24 pt-1">
      {/* Top Admin Banner */}
      <div className="p-4 rounded-24px bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#3B4FCD] text-white shadow-pop relative overflow-hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-8px bg-[#3B4FCD] text-white">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Master Admin Control Center
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white">
            System Live
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white">
            Administrator Console 🛡️
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Full platform authority over buyers, verified agents, property listings, and booking request approvals.
          </p>
        </div>
      </div>

      {/* 4 Master Platform KPIs */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="Buyer visits to approve"
          icon={Clock}
          badge={pendingRequests.length > 0 ? "Requires Review" : "Clear"}
          badgeType={pendingRequests.length > 0 ? "warning" : "positive"}
          onClick={() => setActiveTab('requests')}
        />

        <StatCard
          title="Total Users"
          value={platformUsers.length + 1}
          subtitle="Agents & Buyers"
          icon={Users}
          badge="Active"
          badgeType="positive"
          onClick={() => setActiveTab('users')}
        />

        <StatCard
          title="Total Properties"
          value={properties.length}
          subtitle="Across Tamil Nadu"
          icon={Building2}
          badge="TN RERA"
          badgeType="positive"
          onClick={() => setActiveTab('properties')}
        />

        <StatCard
          title="Approved Visits"
          value={approvedRequests.length}
          subtitle="Confirmed site visits"
          icon={CheckCircle2}
          badge="Success"
          badgeType="positive"
          onClick={() => setActiveTab('requests')}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-16px bg-[#F3F4F6] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143]">
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`py-2 rounded-10px text-xs font-bold transition-all ${
            activeTab === 'requests'
              ? 'bg-white dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] shadow-card'
              : 'text-[#6B7280] dark:text-[#9CA3AF]'
          }`}
        >
          Approvals ({inquiries.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`py-2 rounded-10px text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-white dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] shadow-card'
              : 'text-[#6B7280] dark:text-[#9CA3AF]'
          }`}
        >
          Users ({platformUsers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('properties')}
          className={`py-2 rounded-10px text-xs font-bold transition-all ${
            activeTab === 'properties'
              ? 'bg-white dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC] shadow-card'
              : 'text-[#6B7280] dark:text-[#9CA3AF]'
          }`}
        >
          Listings ({properties.length})
        </button>
      </div>

      {/* TAB 1: ALL BUYER REQUEST APPROVALS */}
      {activeTab === 'requests' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              All Buyer Site Visit Requests
            </h3>
            <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
              Admin Approval Enabled
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 rounded-20px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                        Buyer: {inq.seekerName || 'Prospective Buyer'}
                      </span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                        ({inq.seekerPhone || '+91 98765 43210'})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#3B4FCD] dark:text-[#A5B4FC] font-semibold mt-0.5">
                      Property: {inq.propertyTitle}
                    </div>
                  </div>

                  <StatusBadge status={inq.status} />
                </div>

                {/* Message */}
                <div className="p-2.5 rounded-10px bg-[#F8F9FC] dark:bg-[#23262F] text-xs text-[#374151] dark:text-[#D1D5DB]">
                  <div className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] mb-0.5">
                    Requested Date: {inq.preferredVisitDate || 'This Weekend'}
                  </div>
                  <div>"{inq.seekerMessage}"</div>
                </div>

                {/* Admin Status / Reply */}
                {inq.agentReply && (
                  <div className="p-2.5 rounded-10px bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#A7F3D0] dark:border-[#047857]/40 text-xs text-[#065F46] dark:text-[#6EE7B7]">
                    <div className="font-bold text-[10px] uppercase">Approval Status:</div>
                    <div>{inq.agentReply}</div>
                  </div>
                )}

                {/* Admin Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#E5E7EB] dark:border-[#2D3143]">
                  {inq.status === 'Pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAdminReject(inq.id)}
                        className="px-3 py-1.5 rounded-8px text-xs font-semibold text-[#EF4444] hover:bg-[#FEE2E2]"
                      >
                        Reject
                      </button>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={CheckCircle2}
                        onClick={() => handleOpenApproveModal(inq)}
                        className="text-xs shadow-pop"
                      >
                        Approve Request as Admin
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approved & Scheduled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USER & AGENT GOVERNANCE */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              Registered Users & Agents ({platformUsers.length})
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {platformUsers.map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      u.role === 'AGENT' ? 'bg-[#3B4FCD]' : 'bg-[#0EA5A0]'
                    }`}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                        {u.name}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-4px ${
                          u.role === 'AGENT'
                            ? 'bg-[#EEF2FF] text-[#3B4FCD] dark:bg-[#23262F] dark:text-[#A5B4FC]'
                            : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#23262F] dark:text-[#9CA3AF]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                      {u.email} • {u.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-2 py-1 rounded-6px text-[10px] font-bold ${
                      u.status === 'Active'
                        ? 'bg-[#ECFDF5] text-[#10B981]'
                        : 'bg-[#FEE2E2] text-[#EF4444]'
                    }`}
                  >
                    {u.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL PROPERTY CATALOG MODERATION */}
      {activeTab === 'properties' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F1F5F9]">
              All Listed Properties ({properties.length})
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {properties.slice(0, 10).map((prop) => (
              <div
                key={prop.id}
                className="p-3 rounded-16px bg-white dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] shadow-card flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={prop.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-10px object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9] truncate">
                      {prop.title}
                    </h4>
                    <div className="text-xs font-extrabold font-mono-price text-[#3B4FCD] dark:text-[#A5B4FC]">
                      {prop.priceDisplay}
                    </div>
                    <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                      {prop.city}, Tamil Nadu
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="p-1.5 rounded-8px bg-[#EEF2FF] dark:bg-[#23262F] text-[#3B4FCD] dark:text-[#A5B4FC]"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteProperty(prop.id);
                      showToast('Listing removed by Admin', 'info');
                    }}
                    className="p-1.5 rounded-8px text-[#EF4444] hover:bg-[#FEE2E2]"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN APPROVAL MODAL */}
      <BottomSheet
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Admin Site Visit Approval"
      >
        {selectedRequest && (
          <div className="flex flex-col gap-3.5 py-1 text-left animate-fade-in">
            <div className="p-3 rounded-14px bg-[#EEF2FF] dark:bg-[#23262F] flex flex-col gap-1">
              <div className="text-xs font-bold text-[#111827] dark:text-[#F1F5F9]">
                Buyer: {selectedRequest.seekerName || 'Buyer'} ({selectedRequest.seekerPhone || '+91 98765 43210'})
              </div>
              <div className="text-[11px] text-[#3B4FCD] dark:text-[#A5B4FC]">
                Property: {selectedRequest.propertyTitle}
              </div>
              <div className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                Requested Date: {selectedRequest.preferredVisitDate || 'This Weekend'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] dark:text-[#D1D5DB] mb-1">
                Admin Approval Note
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full p-3 rounded-12px bg-[#F8F9FC] dark:bg-[#1A1D27] border border-[#E5E7EB] dark:border-[#2D3143] text-xs text-[#111827] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B4FCD]"
              />
            </div>

            <Button
              type="button"
              size="lg"
              variant="primary"
              icon={CheckCircle2}
              onClick={handleAdminApprove}
              className="w-full shadow-pop font-bold"
            >
              Confirm Admin Approval & Notify Buyer
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
