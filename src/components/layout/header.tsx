'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, Heart, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui';
import { MobileNav } from './mobile-nav';
import { SearchOverlay } from './search-overlay';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { gsap } from '@/lib/gsap';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Herbal Shampoos', href: '/category/haircare' },
  { label: 'Active Serums', href: '/category/skincare' },
  { label: 'Anti-Hairfall Care', href: '/category/haircare' },
  { label: 'Shop All', href: '/shop' },
  { label: 'Beauty Accessories', href: '/category/beauty-accessories' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, profile } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!navContainerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-item-link',
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }, navContainerRef);
    return () => ctx.revert();
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100'
            : 'bg-[var(--color-bg-primary)]/90 backdrop-blur-sm border-b border-transparent',
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2.5 -ml-2 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] rounded-xl hover:bg-emerald-50 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Wordmark Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-300">
                <Sparkles size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-emerald-950 leading-none">
                  STYLONE
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 leading-tight">
                  Clinical Botanicals
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <nav
              ref={navContainerRef}
              className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center px-4"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="nav-item-link relative px-3 py-1.5 text-xs xl:text-sm font-medium text-[var(--color-text-secondary)] hover:text-emerald-700 transition-colors duration-200 whitespace-nowrap group"
                >
                  {link.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-emerald-500 to-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="p-2 sm:p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/account/wishlist"
                className="relative hidden sm:flex p-2 sm:p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full leading-none shadow-xs">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              {user ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[var(--color-text-primary)] hover:border-emerald-400 transition-all duration-200"
                  aria-label={`Client Account (${profile?.fullName || user.email})`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-[11px] font-bold text-white uppercase shadow-xs">
                    {(profile?.fullName || user.email || 'C').charAt(0)}
                  </div>
                  <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline">
                    {profile?.fullName ? profile.fullName.split(' ')[0] : 'Account'}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex p-2 sm:p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
                  aria-label="Sign In"
                >
                  <User size={20} />
                </Link>
              )}

              {/* Shopping Bag */}
              <Link
                href="/cart"
                className="relative p-2 sm:p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-[var(--shadow-green)] transition-all duration-200 active:scale-95"
                aria-label={`Shopping bag${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-yellow-300 text-emerald-950 rounded-full leading-none shadow-xs border border-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />

      {/* Search overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}

export { Header };
