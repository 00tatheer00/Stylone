'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2, ShoppingBag, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container, LoadingIndicator } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { CartItemRow } from './cart-item-row';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';

export function CartView() {
  const {
    items,
    itemCount,
    subtotal,
    freeShippingRemaining,
    freeShippingThreshold,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-24 text-center">
        <LoadingIndicator size="lg" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Preparing your bag...
        </p>
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
    <div className="py-8 sm:py-14">
      <Container>
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-emerald-100 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Shopping Bag
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              You have <strong className="text-emerald-700">{itemCount}</strong> {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 hover:text-emerald-800 font-bold transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Continue Shopping</span>
            </Link>
            <span className="text-emerald-200">|</span>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 transition-colors font-medium"
            >
              <Trash2 size={13} />
              <span>Clear Bag</span>
            </button>
          </div>
        </div>

        {/* Full-Width Free Shipping & Free Gift Progress Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                {freeShippingRemaining > 0 ? <Truck size={15} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                  {freeShippingRemaining > 0 ? (
                    <>Add <span className="text-emerald-800 font-black">{formatPrice(freeShippingRemaining)}</span> more to unlock <strong>FREE Express Delivery</strong> nationwide!</>
                  ) : (
                    <span className="text-emerald-800 font-black">🎉 Awesome! You have unlocked FREE Express Delivery across Pakistan!</span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Orders of {formatPrice(freeShippingThreshold)}+ qualify for free express delivery &amp; complimentary botanical sample.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2.5 overflow-hidden shrink-0">
              <div
                className="bg-gradient-to-r from-emerald-600 to-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items List (7 cols on desktop) */}
          <div className="lg:col-span-7 divide-y divide-emerald-50 border-t border-emerald-100 bg-white/60 p-4 sm:p-6 rounded-2xl border">
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
