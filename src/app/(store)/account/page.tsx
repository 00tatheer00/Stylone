'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/hooks/use-wishlist';
import {
  User,
  MapPin,
  Package,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AccountOverviewPage() {
  const { profile, user } = useAuth();
  const { wishlistProducts, count: wishlistCount } = useWishlist();

  const fullName = profile?.fullName || user?.user_metadata?.full_name || 'Client';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || user?.user_metadata?.phone || 'Not added';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold mb-2">
          <Sparkles size={14} />
          <span>STYLONE Private Client</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Bonjour, {fullName}
        </h2>
        <p className="text-sm text-stone-300 max-w-xl leading-relaxed">
          Welcome to your STYLONE private client portal. Here you can manage your personal details,
          delivery destinations, track consignments, and explore your curated beauty wishlist.
        </p>
      </div>

      {/* 2x2 Grid of Account Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                <User size={16} className="text-[var(--color-accent)]" />
                <span>Personal Profile</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded-sm">
                Active
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
                {fullName}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                <strong className="text-[var(--color-text-primary)] font-medium">Email:</strong> {email}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                <strong className="text-[var(--color-text-primary)] font-medium">Phone:</strong> {phone}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                <strong className="text-[var(--color-text-primary)] font-medium">Access Tier:</strong> Standard Customer
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--color-border-light)]">
            <Link
              href="/account/profile"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <span>Edit Profile Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                <MapPin size={16} className="text-[var(--color-accent)]" />
                <span>Delivery Addresses</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 rounded-sm">
                Pakistan
              </span>
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <p className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-1">
                Saved Destinations
              </p>
              <p>
                Save your home and office addresses for expedited one-click checkout across Pakistan.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--color-border-light)]">
            <Link
              href="/account/addresses"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <span>Manage Addresses</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                <Package size={16} className="text-[var(--color-accent)]" />
                <span>Recent Orders</span>
              </span>
            </div>
            <div className="py-4 text-center">
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                No orders have been recorded on this account yet.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--color-border-light)]">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <span>View Order History</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Wishlist Card */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                <Heart size={16} className="text-[var(--color-accent)]" />
                <span>Curated Wishlist</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-full">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {wishlistCount === 0 ? (
              <p className="text-xs text-[var(--color-text-secondary)] py-4 text-center">
                Your wishlist is empty. Tap the heart on products you love.
              </p>
            ) : (
              <div className="flex items-center gap-2.5 overflow-hidden py-1">
                {wishlistProducts.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative w-12 h-14 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] overflow-hidden shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ))}
                {wishlistCount > 3 && (
                  <div className="w-12 h-14 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] flex items-center justify-center text-xs font-bold text-[var(--color-text-muted)] shrink-0">
                    +{wishlistCount - 3}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--color-border-light)]">
            <Link
              href="/account/wishlist"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <span>Explore Wishlist</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
