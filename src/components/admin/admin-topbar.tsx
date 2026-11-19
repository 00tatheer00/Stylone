'use client';

import { useState } from 'react';
import { Menu, Search, Bell, Shield, Sparkles } from 'lucide-react';

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
}

export function AdminTopbar({ onOpenMobileSidebar }: AdminTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border-light)] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle + Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search orders, SKU, customers, batches..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-primary)]/50 focus:bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
      </div>

      {/* Right: Environment Pill, Notifications & User */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Isolated Demo Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          <Sparkles size={11} className="text-amber-600" />
          <span>Demo Environment (Isolated)</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label="View system notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-lg p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-border-light)] font-semibold text-[var(--color-text-primary)]">
                <span>Recent System Alerts</span>
                <span className="text-[10px] text-[var(--color-accent)]">2 New</span>
              </div>
              <ul className="space-y-2.5 text-[var(--color-text-secondary)]">
                <li className="p-2 rounded bg-amber-50/70 border border-amber-200/50">
                  <p className="font-semibold text-amber-900">Low Stock Alert</p>
                  <p className="text-[11px] text-amber-800">
                    Silk Infusion Hair Mask has only 6 units remaining.
                  </p>
                </li>
                <li className="p-2 rounded bg-emerald-50/70 border border-emerald-200/50">
                  <p className="font-semibold text-emerald-900">Direct Bank Transfer</p>
                  <p className="text-[11px] text-emerald-800">
                    Order #STY-782909 deposit proof submitted.
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[var(--color-border-light)]">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-[var(--color-accent)] flex items-center justify-center font-heading text-xs font-bold shrink-0">
            ST
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">
              Executive Admin
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
              <Shield size={10} className="text-[var(--color-accent)]" />
              <span>STYLONE Operations</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
