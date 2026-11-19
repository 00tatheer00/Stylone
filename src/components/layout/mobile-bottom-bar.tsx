'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Droplets, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

function MobileBottomBarInner() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Hide on checkout to avoid distraction
  if (pathname === '/checkout') {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Shampoos',
      href: '/category/haircare',
      icon: Droplets,
      isActive: pathname.startsWith('/category/haircare'),
      badge: 'Star',
    },
    {
      label: 'Serums',
      href: '/category/skincare',
      icon: Sparkles,
      isActive: pathname.startsWith('/category/skincare'),
      badge: 'Glow',
    },
    {
      label: 'Bag',
      href: '/cart',
      icon: ShoppingBag,
      isActive: pathname === '/cart',
      count: itemCount,
    },
    {
      label: 'Account',
      href: '/account',
      icon: User,
      isActive: pathname.startsWith('/account') || pathname.startsWith('/login'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-emerald-100 shadow-[0_-4px_20px_rgba(16,185,129,0.08)] pb-safe"
    >
      <div className="grid grid-cols-5 h-14 sm:h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center py-1 transition-all duration-150',
                active ? 'text-emerald-800 font-bold scale-105' : 'text-slate-500 hover:text-slate-900',
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-black bg-emerald-700 text-white rounded-full leading-none shadow-xs">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
                {item.badge && !active && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-800 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileBottomBar() {
  return (
    <Suspense fallback={null}>
      <MobileBottomBarInner />
    </Suspense>
  );
}
