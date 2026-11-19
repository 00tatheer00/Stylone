'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalToastHandler: ((toast: Omit<ToastItem, 'id'>) => void) | null = null;

/**
 * Imperative toast function callable from anywhere
 */
export const toast = {
  success: (message: string, title = 'Success') => {
    globalToastHandler?.({ type: 'success', message, title });
  },
  error: (message: string, title = 'Attention') => {
    globalToastHandler?.({ type: 'error', message, title });
  },
  info: (message: string, title = 'Info') => {
    globalToastHandler?.({ type: 'info', message, title });
  },
  warning: (message: string, title = 'Notice') => {
    globalToastHandler?.({ type: 'warning', message, title });
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = {
      id,
      duration: 3500,
      ...t,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 visible
  }, []);

  useEffect(() => {
    globalToastHandler = addToast;
    return () => {
      globalToastHandler = null;
    };
  }, [addToast]);

  const success = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', message, title: title || 'Success' });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ type: 'error', message, title: title || 'Error' });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', message, title: title || 'Notice' });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', message, title: title || 'Warning' });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const duration = toast.duration || 3500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-600 shrink-0" />,
    info: <Info size={18} className="text-emerald-700 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white/95 shadow-[var(--shadow-green)]',
    error: 'border-rose-200 bg-white/95 shadow-md',
    info: 'border-emerald-150 bg-white/95 shadow-md',
    warning: 'border-amber-200 bg-white/95 shadow-md',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-2xl border p-4 backdrop-blur-md',
        'animate-in fade-in slide-in-from-bottom-4 duration-300 transition-all shadow-lg',
        borders[toast.type]
      )}
      role="alert"
    >
      {/* Top progress bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 origin-left',
          toast.type === 'success' && 'bg-emerald-500',
          toast.type === 'error' && 'bg-rose-500',
          toast.type === 'info' && 'bg-emerald-600',
          toast.type === 'warning' && 'bg-amber-500'
        )}
        style={{
          animation: `shrinkWidth ${duration}ms linear forwards`,
        }}
      />

      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[toast.type]}</div>
        <div className="flex-1 min-w-0 pr-2">
          {toast.title && (
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {toast.title}
            </p>
          )}
          <p className="text-xs font-medium text-stone-600 leading-snug mt-0.5">
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
    };
  }
  return ctx;
}
