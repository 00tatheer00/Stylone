'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tag, X, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

export function CartSummary() {
  const {
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingRemaining,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFeedback(null);

    if (!couponCode.trim()) {
      setCouponFeedback({
        type: 'error',
        text: 'Please enter a coupon code.',
      });
      return;
    }

    const res = applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
      setCouponCode('');
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-6">
      <h2 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
        Order Summary
      </h2>

      {/* Free Delivery Progress */}
      <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-light)] text-xs">
        {freeShippingRemaining > 0 ? (
          <>
            <div className="flex items-center justify-between font-medium text-[var(--color-text-primary)] mb-1.5">
              <span>Free Delivery Target</span>
              <span>Add {formatPrice(freeShippingRemaining)}</span>
            </div>
            <div className="w-full bg-[var(--color-border)] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
              Spend {formatPrice(freeShippingThreshold)} or more to get free delivery across Pakistan.
            </p>
          </>
        ) : (
          <div className="flex items-center gap-2 text-[var(--color-success)] font-medium">
            <Sparkles size={16} />
            <span>You&apos;ve qualified for FREE Delivery across Pakistan!</span>
          </div>
        )}
      </div>

      {/* Coupon Application Box */}
      <div>
        <label
          htmlFor="cart-coupon"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2"
        >
          Promotional Code
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-[var(--color-success)] font-medium">
              <Tag size={14} />
              <span>
                <strong>{appliedCoupon.code}</strong> (-{formatPrice(discountAmount)})
              </span>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
              aria-label="Remove applied coupon"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              id="cart-coupon"
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                if (couponFeedback) setCouponFeedback(null);
              }}
              placeholder="e.g. WELCOME10"
              className="flex-1 px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-md)] transition-colors whitespace-nowrap"
            >
              Apply
            </button>
          </form>
        )}

        {couponFeedback && (
          <p
            className={cn(
              'mt-2 text-xs',
              couponFeedback.type === 'success'
                ? 'text-[var(--color-success)]'
                : 'text-[var(--color-error)]'
            )}
          >
            {couponFeedback.text}
          </p>
        )}

        <div className="mt-2 text-[11px] text-[var(--color-text-muted)]">
          Demo codes: <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">WELCOME10</code>,{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">STYLONE500</code>
        </div>
      </div>

      <div className="border-t border-[var(--color-border-light)]" />

      {/* Financial Breakdown */}
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between text-[var(--color-text-secondary)]">
          <dt>Subtotal</dt>
          <dd className="font-medium text-[var(--color-text-primary)]">{formatPrice(subtotal)}</dd>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-[var(--color-success)]">
            <dt className="flex items-center gap-1.5">
              <span>Discount</span>
              {appliedCoupon && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 font-semibold">
                  {appliedCoupon.code}
                </span>
              )}
            </dt>
            <dd className="font-semibold">-{formatPrice(discountAmount)}</dd>
          </div>
        )}

        <div className="flex justify-between text-[var(--color-text-secondary)]">
          <dt>Estimated Delivery</dt>
          <dd className="font-medium">
            {shippingFee === 0 ? (
              <span className="text-[var(--color-success)] font-semibold">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </dd>
        </div>

        <div className="border-t border-[var(--color-border-light)] pt-3 flex justify-between items-baseline">
          <dt className="font-heading text-base font-bold text-[var(--color-text-primary)]">
            Total Payable
          </dt>
          <dd className="text-xl font-bold text-[var(--color-text-primary)]">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* Checkout CTA Button */}
      <Link
        href="/checkout"
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.99] text-sm font-semibold uppercase tracking-wider transition-all shadow-sm select-none"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight size={16} />
      </Link>

      {/* Assurances */}
      <div className="pt-2 border-t border-[var(--color-border-light)] space-y-2 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-[var(--color-accent)] shrink-0" />
          <span>Cash on Delivery available nationwide</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[var(--color-accent)] shrink-0" />
          <span>100% Genuine, inspected stock</span>
        </div>
      </div>
    </div>
  );
}
