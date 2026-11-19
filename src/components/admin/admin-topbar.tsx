'use client';

import { useState } from 'react';
import { Menu, Search, Bell, Shield, Sparkles } from 'lucide-react';

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
}

export function AdminTopbar({ onOpenMobileSidebar }: AdminTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-emerald-100 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile Menu Toggle + Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-emerald-800 hover:bg-emerald-50"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search orders, SKU, customers, batches..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white text-[var(--color-text-primary)] placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right: Environment Pill, Notifications & User */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Isolated Demo Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Sparkles size={11} className="text-emerald-600" />
          <span>Demo Environment (Isolated)</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
            aria-label="View system notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-emerald-100 shadow-xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100 font-bold text-[var(--color-text-primary)]">
                <span>Recent System Alerts</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <ul className="space-y-2.5 text-stone-600">
                <li className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60">
                  <p className="font-bold text-amber-900">Low Stock Alert</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Silk Infusion Hair Mask has only 6 units remaining.
                  </p>
                </li>
                <li className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60">
                  <p className="font-bold text-emerald-900">Direct Bank Transfer</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Order #STY-782909 deposit proof submitted.
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-emerald-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center font-heading text-xs font-bold shrink-0 shadow-xs">
            ST
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">
              Executive Admin
            </p>
            <p className="text-[10px] text-stone-500 flex items-center gap-1 font-medium">
              <Shield size={10} className="text-emerald-600" />
              <span>STYLONE Operations</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
