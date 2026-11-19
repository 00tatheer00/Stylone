import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-accent)] mb-6 shadow-xs">
        <ShoppingBag size={36} strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
        Your Shopping Bag is Empty
      </h2>
      <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
        Looks like you haven&apos;t added any beauty essentials to your bag yet.
        Discover our curated collections of skincare, makeup, and haircare.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-md)] transition-colors shadow-sm"
        >
          Start Shopping
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/category/skincare"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] transition-colors"
        >
          Explore Skincare
        </Link>
      </div>
    </div>
  );
}
