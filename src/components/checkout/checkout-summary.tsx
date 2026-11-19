'use client';

import Image from 'next/image';
import { Tag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

export function CheckoutSummary() {
  const { items, subtotal, discountAmount, shippingFee, total, appliedCoupon } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
        <h2 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
          Order Summary
        </h2>
        <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items list */}
      <div className="divide-y divide-emerald-50 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex items-center gap-3">
            <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100 shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                {item.name}
              </h4>
              {item.variantName && (
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {item.variantName}
                </p>
              )}
              <p className="text-xs font-bold text-emerald-800 mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-emerald-100" />

      {/* Financial Breakdown */}
      <dl className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between text-stone-600">
          <dt>Subtotal</dt>
          <dd className="font-semibold text-[var(--color-text-primary)]">{formatPrice(subtotal)}</dd>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <dt className="flex items-center gap-1.5">
              <Tag size={13} />
              <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
            </dt>
            <dd className="font-bold">-{formatPrice(discountAmount)}</dd>
          </div>
        )}

        <div className="flex justify-between text-stone-600">
          <dt>Delivery Charges</dt>
          <dd className="font-semibold">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </dd>
        </div>

        <div className="border-t border-emerald-100 pt-3.5 flex justify-between items-baseline">
          <dt className="font-heading text-base font-bold text-[var(--color-text-primary)]">
            Total Payable
          </dt>
          <dd className="text-xl font-extrabold text-emerald-800">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* Trust reassurance */}
      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1.5 text-[11px] text-emerald-950 font-medium">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-emerald-600 shrink-0" />
          <span>Dispatched from our climate-controlled beauty warehouse</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span>Tamper-evident luxury packaging guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-600 shrink-0" />
          <span>Complimentary sample sachet included</span>
        </div>
      </div>
    </div>
  );
}
