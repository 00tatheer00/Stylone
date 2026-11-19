'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
} from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';

interface AccountNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

const navItems: AccountNavItem[] = [
  { label: 'Overview', href: '/account', icon: LayoutDashboard, exact: true },
  { label: 'My Profile', href: '/account/profile', icon: User },
  { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'My Orders', href: '/account/orders', icon: Package },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();
  const { signOut } = useAuth();

  const isActive = (item: AccountNavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="w-full" aria-label="Account navigation">
      {/* Desktop vertical sidebar */}
      <div className="hidden lg:block bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-3 shadow-xs">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)] text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} className={active ? 'text-[var(--color-accent)]' : ''} />
                    <span>{item.label}</span>
                  </span>
                  {item.href === '/account/wishlist' && wishlistCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--color-accent)] text-white font-semibold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="pt-3 mt-3 border-t border-[var(--color-border-light)]">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-md)] text-xs font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors text-left"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile horizontal pill navigation */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-none flex items-center gap-2 py-1 mb-6 border-b border-[var(--color-border-light)] pb-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-[var(--color-text-primary)] text-white'
                  : 'bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
              {item.href === '/account/wishlist' && wishlistCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    active ? 'bg-white text-[var(--color-text-primary)]' : 'bg-[var(--color-accent)] text-white'
                  }`}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
