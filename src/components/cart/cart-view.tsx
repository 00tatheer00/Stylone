'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Container } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { CartItemRow } from './cart-item-row';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';

export function CartView() {
  const {
    items,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 mx-auto border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">Loading your bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <EmptyCart />
      </Container>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--color-border-light)] pb-5 mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
              You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium transition-colors"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
            <span className="text-[var(--color-border)]">|</span>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
            >
              <Trash2 size={13} />
              Clear Bag
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items List (7 cols on desktop) */}
          <div className="lg:col-span-7 divide-y divide-[var(--color-border-light)] border-t border-[var(--color-border-light)]">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Order Summary (5 cols on desktop, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <CartSummary />
          </div>
        </div>
      </Container>
    </div>
  );
}
