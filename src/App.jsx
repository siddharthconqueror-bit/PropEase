import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

// Pages
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PropertyBrowse } from './pages/PropertyBrowse';
import { PropertyDetail } from './pages/PropertyDetail';
import { AIConcierge } from './pages/AIConcierge';
import { Favorites } from './pages/Favorites';
import { Inquiries } from './pages/Inquiries';
import { Profile } from './pages/Profile';

// Mobile Status Bar Component
const MobileStatusBar = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#0F1117] text-[#111827] dark:text-[#F1F5F9] px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold select-none border-b border-black/[0.04] dark:border-white/[0.04]">
      <span>{timeStr || '11:34 AM'}</span>
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <BatteryMedium className="w-4 h-4" />
      </div>
    </div>
  );
};

// Dynamic Role-Based Dashboard Selector
const DynamicDashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN' || user?.role?.toLowerCase().includes('admin')) {
    return <AdminDashboard />;
  }
  if (user?.role === 'AGENT' || user?.role?.toLowerCase().includes('agent') || user?.role?.toLowerCase().includes('builder')) {
    return <AgentDashboard />;
  }
  return <SeekerDashboard />;
};

// Layout Component (Mobile Application Canvas Format)
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const isPropertyDetail = location.pathname.startsWith('/properties/') && location.pathname !== '/properties';
  const showBottomNav = !isAuthPage && !isPropertyDetail;

  return (
    <div className="min-h-screen bg-[#E5E7EB] dark:bg-[#08090D] flex items-center justify-center p-0 sm:py-4 sm:px-2 selection:bg-[#EEF2FF] selection:text-[#3B4FCD]">
      {/* Mobile Application Container: Maximum 480px width, centered on tablet/desktop with mobile phone frame */}
      <div className="w-full sm:max-w-[460px] h-screen sm:h-[880px] sm:max-h-[96vh] bg-[#F8F9FC] dark:bg-[#0F1117] text-[#111827] dark:text-[#F1F5F9] flex flex-col sm:rounded-[36px] sm:border-[6px] sm:border-[#1A1D27] dark:sm:border-[#2D3143] sm:shadow-2xl overflow-hidden relative">
        {/* Native Mobile Status Bar */}
        <MobileStatusBar />

        {/* Header */}
        {!isAuthPage && <Header />}

        {/* Scrollable Screen Content Canvas */}
        <main className={`flex-1 overflow-y-auto no-scrollbar w-full ${isAuthPage ? 'p-0' : 'px-4 py-2'}`}>
          {children}
        </main>

        {/* Bottom Navigation Bar */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PropertyProvider>
            <Router>
              <AppLayout>
                <Routes>
                  {/* Onboarding & Authentication */}
                  <Route path="/" element={<Onboarding />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Dynamic Role-Based Dashboard */}
                  <Route path="/user/dashboard" element={<DynamicDashboard />} />
                  <Route path="/agent/dashboard" element={<AgentDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />

                  {/* Core App Screens */}
                  <Route path="/properties" element={<PropertyBrowse />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/user/ai-concierge" element={<AIConcierge />} />
                  <Route path="/user/favorites" element={<Favorites />} />
                  <Route path="/user/inquiries" element={<Inquiries />} />
                  <Route path="/user/profile" element={<Profile />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                </Routes>
              </AppLayout>
            </Router>
          </PropertyProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
