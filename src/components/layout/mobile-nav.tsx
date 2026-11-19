'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, User, ShoppingBag, Heart } from 'lucide-react';
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

  // Focus trap — close on Escape
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
          'fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300 lg:hidden',
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
          'fixed top-0 left-0 z-[70] h-full w-[280px] max-w-[85vw]',
          'bg-[var(--color-bg-primary)] shadow-[var(--shadow-xl)]',
          'flex flex-col transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border-light)]">
          <span className="font-heading text-lg font-bold tracking-tight">
            STYLONE
          </span>
          <button
            data-close
            className="p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
          <ul className="space-y-1 px-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block px-3 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--color-border-light)] px-5 py-4 space-y-3">
          <Link
            href="/account/wishlist"
            onClick={onClose}
            className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Heart size={18} />
              Curated Wishlist
            </span>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-[var(--color-text-primary)] text-white rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={18} />
              Shopping Bag
            </span>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-[var(--color-accent)] text-white rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-dark)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)] uppercase">
                {(profile?.fullName || user.email || 'C').charAt(0)}
              </div>
              <span>My Account ({profile?.fullName || 'Client'})</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <User size={18} />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export { MobileNav };
