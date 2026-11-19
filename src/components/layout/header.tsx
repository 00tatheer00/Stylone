'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, Heart } from 'lucide-react';
import { Container } from '@/components/ui';
import { MobileNav } from './mobile-nav';
import { SearchOverlay } from './search-overlay';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Skincare', href: '/category/skincare' },
  { label: 'Makeup', href: '/category/makeup' },
  { label: 'Haircare', href: '/category/haircare' },
  { label: 'Beauty Accessories', href: '/category/beauty-accessories' },
  { label: 'Personal Care', href: '/category/personal-care' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, profile } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
          'sticky top-0 z-50 w-full transition-all duration-200',
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-[var(--shadow-sm)]'
            : 'bg-[var(--color-bg-primary)]',
        )}
      >
        {/* ── Desktop Nav ───────────────────────────── */}
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 text-[var(--color-text-primary)]"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Wordmark */}
            <Link
              href="/"
              className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)] lg:mr-10 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              STYLONE
            </Link>

            {/* Desktop links */}
            <nav
              className="hidden lg:flex items-center gap-1 flex-1"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/account/wishlist"
                className="relative hidden sm:flex p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-semibold bg-[var(--color-text-primary)] text-white rounded-full leading-none">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              {user ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label={`Client Account (${profile?.fullName || user.email})`}
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-dark)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)] uppercase">
                    {(profile?.fullName || user.email || 'C').charAt(0)}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label="Sign In"
                >
                  <User size={20} />
                </Link>
              )}

              {/* Shopping Bag */}
              <Link
                href="/cart"
                className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label={`Shopping bag${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 text-[10px] font-semibold bg-[var(--color-accent)] text-white rounded-full leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
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
