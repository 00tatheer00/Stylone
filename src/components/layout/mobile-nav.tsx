'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, User, ShoppingBag, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

function MobileNav({ open, onClose, links }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      const closeBtn = drawerRef.current?.querySelector<HTMLButtonElement>('[data-close]');
      closeBtn?.focus();
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          'fixed top-0 left-0 z-[70] h-full w-[310px] max-w-[85vw]',
          'bg-white shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-xs">
              <Sparkles size={16} />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight text-emerald-950">
              STYLONE
            </span>
          </Link>
          <button
            data-close
            className="p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-emerald-700 hover:bg-emerald-100/50 rounded-xl transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-5 px-4" aria-label="Mobile navigation">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-700/60 mb-2">
            Navigation
          </p>
          <ul className="space-y-1.5">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition-all duration-200 group"
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} className="text-emerald-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer shortcuts */}
        <div className="border-t border-emerald-100 bg-emerald-50/40 p-5 space-y-3">
          <Link
            href="/account/wishlist"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-100 text-sm font-medium text-[var(--color-text-secondary)] hover:border-emerald-300 transition-colors shadow-2xs"
          >
            <span className="flex items-center gap-2.5">
              <Heart size={18} className="text-rose-500" />
              <span>Wishlist</span>
            </span>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold transition-all shadow-xs"
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag size={18} />
              <span>Shopping Bag</span>
            </span>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-white text-emerald-800 rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-emerald-100 text-sm font-medium text-[var(--color-text-primary)] hover:border-emerald-300 transition-colors shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                {(profile?.fullName || user.email || 'C').charAt(0)}
              </div>
              <span className="truncate">My Account ({profile?.fullName || 'Client'})</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-300 text-emerald-800 font-semibold text-sm hover:bg-emerald-100/50 transition-colors"
            >
              <User size={16} />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export { MobileNav };
