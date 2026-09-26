import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container (Fixed at top/safe-area on mobile, top-right on desktop) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none flex flex-col gap-2">
        {toasts.map(toast => {
          let bgClass = "bg-white dark:bg-[#1A1D27] text-[#111827] dark:text-[#F1F5F9] border-[#E5E7EB] dark:border-[#2D3143]";
          let Icon = Info;
          let iconColor = "text-[#3B4FCD]";

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            iconColor = "text-[#10B981]";
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            iconColor = "text-[#EF4444]";
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = "text-[#F59E0B]";
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-12px border shadow-pop backdrop-blur-md animate-fade-in ${bgClass}`}
            >
              <div className="flex items-center gap-3 pr-2">
                <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                <span className="text-sm font-medium leading-tight">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-8px hover:bg-[#F3F4F6] dark:hover:bg-[#23262F] text-[#6B7280] dark:text-[#9CA3AF] transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
