'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tag, X, ArrowRight, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm space-y-6">
      <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
        Order Summary
      </h2>

      {/* Free Delivery Progress */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-green-50/40 border border-emerald-100 text-xs">
        {freeShippingRemaining > 0 ? (
          <>
            <div className="flex items-center justify-between font-semibold text-emerald-950 mb-2">
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-600" />
                <span>Free Delivery Target</span>
              </span>
              <span className="text-emerald-700 font-bold">Add {formatPrice(freeShippingRemaining)}</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-emerald-800/80 font-medium">
              Orders of {formatPrice(freeShippingThreshold)}+ qualify for free nationwide express delivery!
            </p>
          </>
        ) : (
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>Awesome! You have unlocked FREE Express Delivery!</span>
          </div>
        )}
      </div>

      {/* Coupon Application Box */}
      <div>
        <label
          htmlFor="cart-coupon"
          className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2"
        >
          Have a Promo Code?
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Tag size={15} className="text-emerald-600" />
              <span>
                <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discountAmount)})
              </span>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-white transition-colors"
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
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-emerald-200 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-2xs whitespace-nowrap active:scale-95"
            >
              Apply
            </button>
          </form>
        )}

        {couponFeedback && (
          <p
            className={cn(
              'mt-2 text-xs font-medium',
              couponFeedback.type === 'success'
                ? 'text-emerald-700'
                : 'text-rose-600'
            )}
          >
            {couponFeedback.text}
          </p>
        )}

        <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1.5 flex-wrap">
          <span>Active trial codes:</span>
          <code className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">WELCOME10</code>
          <code className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">STYLONE500</code>
        </div>
      </div>

      <div className="border-t border-emerald-100" />

      {/* Financial Breakdown */}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between text-stone-600">
          <dt>Subtotal</dt>
          <dd className="font-semibold text-[var(--color-text-primary)]">{formatPrice(subtotal)}</dd>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <dt className="flex items-center gap-1.5">
              <span>Savings Discount</span>
              {appliedCoupon && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 font-bold text-emerald-800">
                  {appliedCoupon.code}
                </span>
              )}
            </dt>
            <dd className="font-bold">-{formatPrice(discountAmount)}</dd>
          </div>
        )}

        <div className="flex justify-between text-stone-600">
          <dt>Nationwide Shipping</dt>
          <dd className="font-semibold">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-100/80 px-2 py-0.5 rounded-full">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </dd>
        </div>

        <div className="border-t border-emerald-100 pt-3.5 flex justify-between items-baseline">
          <dt className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
            Total Payable
          </dt>
          <dd className="text-2xl font-extrabold text-emerald-800">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* Checkout CTA Button */}
      <Link
        href="/checkout"
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white hover:from-emerald-700 hover:to-green-800 active:scale-[0.98] text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-[var(--shadow-green)] select-none"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight size={17} />
      </Link>

      {/* Assurances */}
      <div className="pt-3 border-t border-emerald-100 space-y-2 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <Truck size={15} className="text-emerald-600 shrink-0" />
          <span>Cash on Delivery (COD) available all over Pakistan</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
          <span>100% Guaranteed Authentic Brands</span>
        </div>
      </div>
    </div>
  );
}
