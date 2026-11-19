'use client';

import Image from 'next/image';
import { Tag, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

export function CheckoutSummary() {
  const { items, subtotal, discountAmount, shippingFee, total, appliedCoupon } = useCart();

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-5">
      <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-4">
        <h2 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
          Order Summary
        </h2>
        <span className="text-xs text-[var(--color-text-muted)] font-medium">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items list */}
      <div className="divide-y divide-[var(--color-border-light)] max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex items-center gap-3">
            <div className="relative w-14 h-16 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-text-primary)] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                {item.name}
              </h4>
              {item.variantName && (
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  {item.variantName}
                </p>
              )}
              <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border-light)]" />

      {/* Financial Breakdown */}
      <dl className="space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between text-[var(--color-text-secondary)]">
          <dt>Subtotal</dt>
          <dd className="font-medium text-[var(--color-text-primary)]">{formatPrice(subtotal)}</dd>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-[var(--color-success)]">
            <dt className="flex items-center gap-1.5">
              <Tag size={13} />
              <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
            </dt>
            <dd className="font-semibold">-{formatPrice(discountAmount)}</dd>
          </div>
        )}

        <div className="flex justify-between text-[var(--color-text-secondary)]">
          <dt>Delivery Charges</dt>
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
          <dd className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* Trust reassurance */}
      <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-light)] space-y-1.5 text-[11px] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-[var(--color-accent)] shrink-0" />
          <span>Dispatched from our climate-controlled warehouse</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[var(--color-accent)] shrink-0" />
          <span>100% Genuine batch verified products</span>
        </div>
      </div>
    </div>
  );
}
