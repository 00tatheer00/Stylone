'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Droplets, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

export function MobileBottomBar() {
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
                'relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 select-none active:scale-90',
                active
                  ? 'text-emerald-700 font-bold'
                  : 'text-stone-500 hover:text-emerald-700 font-medium'
              )}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={cn(
                    'transition-all duration-200',
                    active ? 'stroke-[2.5] scale-110 text-emerald-700' : 'stroke-[1.75]'
                  )}
                />

                {/* Cart Item Count Badge */}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-extrabold bg-emerald-600 text-white rounded-full shadow-xs animate-scale-in">
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}

                {/* Star / Glow Pill Badge */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-px text-[8px] font-extrabold uppercase tracking-tighter bg-amber-400 text-emerald-950 rounded-full shadow-2xs leading-none">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  'text-[10px] mt-1 tracking-tight',
                  active ? 'text-emerald-900 font-bold' : 'text-stone-500'
                )}
              >
                {item.label}
              </span>

              {/* Active bottom emerald indicator line */}
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
