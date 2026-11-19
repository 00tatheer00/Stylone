'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Banknote,
  Copy,
  Check,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { formatPakistanPhoneDisplay } from '@/lib/validations/checkout';
import type { DemoOrder } from '@/types/order';

export function OrderConfirmationClient() {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const stored = sessionStorage.getItem('stylone_latest_order');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.orderReference) {
            setOrder(parsed);
          }
        }
      } catch {
        // Storage unavailable
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(t);
  }, []);

  const copyOrderRef = () => {
    if (order?.orderReference) {
      navigator.clipboard.writeText(order.orderReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 mx-auto border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">Loading order details...</p>
      </div>
    );
  }

  // Fallback if accessed directly without an active session order
  const displayOrder: DemoOrder = order ?? {
    orderReference: 'STY-PK-DEMO',
    createdAt: new Date().toISOString(),
    customer: {
      fullName: 'Valued Customer',
      phone: '03001234567',
      email: 'customer@example.com',
      city: 'Karachi',
      area: 'DHA Phase 5',
      address: 'Street 14, House 22',
      paymentMethod: 'cod',
    },
    items: [],
    financials: {
      subtotal: 4800,
      discountAmount: 480,
      shippingFee: 0,
      total: 4320,
    },
    couponCode: 'WELCOME10',
  };

  return (
    <div className="py-10 sm:py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Banner */}
          <div className="text-center bg-white rounded-[var(--radius-xl)] border border-[var(--color-border-light)] p-8 sm:p-10 shadow-[var(--shadow-sm)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-[var(--color-success)] mb-5">
              <CheckCircle2 size={36} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
              Order Placed Successfully
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Thank You for Your Order!
            </h1>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
              We&apos;ve received your order and our team is preparing it for physical inspection in our climate-controlled warehouse.
            </p>

            {/* Order Reference Badge */}
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                Order Reference:
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                {displayOrder.orderReference}
              </span>
              <button
                type="button"
                onClick={copyOrderRef}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 transition-colors"
                title="Copy reference code"
                aria-label="Copy order reference"
              >
                {copied ? <Check size={14} className="text-[var(--color-success)]" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Order Verification Notice */}
            <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-[var(--radius-md)] bg-stone-900 text-white text-left text-xs leading-relaxed">
              <CheckCircle2 size={16} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--color-accent)] font-semibold">Order Registered &amp; Stock Allocated:</strong> Your order has been recorded into the STYLONE fulfillment pipeline. All items are physically prepared, batched, and dispatched from our Lahore central distribution hub.
              </div>
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 sm:p-7 shadow-[var(--shadow-sm)]">
            <h2 className="font-heading text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-5">
              What Happens Next?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex sm:flex-col items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-accent)] flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Confirmation
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    You may receive a WhatsApp or SMS message to verify your address details.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-accent)] flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Quality Inspection
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Every batch is physically inspected, sealed, and packaged carefully.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-accent)] flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Express Dispatch
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Delivered across Pakistan within 2 to 4 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Delivery & Payment Info */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 space-y-4 shadow-[var(--shadow-sm)]">
              <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-3">
                Delivery Details
              </h3>

              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-[var(--color-text-muted)] block text-xs">Recipient:</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {displayOrder.customer.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-text-muted)] block text-xs">Phone:</span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {formatPakistanPhoneDisplay(displayOrder.customer.phone)}
                  </span>
                </div>

                {displayOrder.customer.email && (
                  <div>
                    <span className="text-[var(--color-text-muted)] block text-xs">Email:</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {displayOrder.customer.email}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[var(--color-text-muted)] block text-xs">Shipping Address:</span>
                  <span className="font-medium text-[var(--color-text-primary)] block">
                    {displayOrder.customer.address}
                  </span>
                  <span className="text-[var(--color-text-secondary)] block text-xs mt-0.5">
                    {displayOrder.customer.area}, {displayOrder.customer.city}
                  </span>
                  {displayOrder.customer.landmark && (
                    <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">
                      Landmark: {displayOrder.customer.landmark}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--color-border-light)]">
                  <span className="text-[var(--color-text-muted)] block text-xs">Payment Method:</span>
                  <span className="font-semibold text-[var(--color-text-primary)] inline-flex items-center gap-1.5 mt-0.5">
                    {displayOrder.customer.paymentMethod === 'cod' ? (
                      <>
                        <Banknote size={15} className="text-[var(--color-accent)]" />
                        Cash on Delivery (Pay at doorstep)
                      </>
                    ) : (
                      <>
                        <CreditCard size={15} className="text-[var(--color-accent)]" />
                        Direct Bank Transfer
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Instructions (if chosen) */}
              {displayOrder.customer.paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border-light)] text-xs space-y-1.5">
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Bank Transfer Details:
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Bank: <strong>Standard Chartered Bank Pakistan</strong>
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Account Title: <strong>STYLONE BEAUTY PVT LTD</strong>
                  </p>
                  <p className="text-[11px] font-mono text-[var(--color-text-primary)]">
                    IBAN: PK36SCBL0000001122334455
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] pt-1">
                    Please transfer the exact amount ({formatPrice(displayOrder.financials.total)}) and share your screenshot with your reference ({displayOrder.orderReference}) on WhatsApp support.
                  </p>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 space-y-4 shadow-[var(--shadow-sm)]">
              <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-3">
                Payment Summary
              </h3>

              {displayOrder.items.length > 0 && (
                <div className="divide-y divide-[var(--color-border-light)] max-h-48 overflow-y-auto pr-1">
                  {displayOrder.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-8 h-10 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-[var(--color-text-primary)] truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Qty: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[var(--color-text-primary)] shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <dl className="space-y-2 text-xs border-t border-[var(--color-border-light)] pt-3">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-[var(--color-text-primary)]">
                    {formatPrice(displayOrder.financials.subtotal)}
                  </dd>
                </div>

                {displayOrder.financials.discountAmount > 0 && (
                  <div className="flex justify-between text-[var(--color-success)] font-medium">
                    <dt>Discount {displayOrder.couponCode && `(${displayOrder.couponCode})`}</dt>
                    <dd>-{formatPrice(displayOrder.financials.discountAmount)}</dd>
                  </div>
                )}

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <dt>Delivery Fee</dt>
                  <dd className="font-medium">
                    {displayOrder.financials.shippingFee === 0 ? (
                      <span className="text-[var(--color-success)] font-semibold">FREE</span>
                    ) : (
                      formatPrice(displayOrder.financials.shippingFee)
                    )}
                  </dd>
                </div>

                <div className="border-t border-[var(--color-border-light)] pt-2.5 flex justify-between items-baseline">
                  <dt className="font-bold text-sm text-[var(--color-text-primary)]">
                    Total Amount
                  </dt>
                  <dd className="text-base font-bold text-[var(--color-text-primary)]">
                    {formatPrice(displayOrder.financials.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent-hover)] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] text-xs font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
