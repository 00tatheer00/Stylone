'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { Container, toast } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { CheckoutSummary } from './checkout-summary';

import {
  PAKISTAN_MAJOR_CITIES,
  checkoutFormSchema,
  normalizePakistanPhone,
  type CheckoutFormData,
} from '@/lib/validations/checkout';
import type { DemoOrder } from '@/types/order';
import { cn, formatPrice } from '@/lib/utils';
import { placeOrderAction } from '@/actions/checkout';

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, total, appliedCoupon, clearCart, isHydrated } = useCart();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Karachi',
    area: '',
    address: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill authenticated customer information seamlessly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || profile?.fullName || user.user_metadata?.full_name || '',
          email: prev.email || user.email || '',
          phone: prev.phone || profile?.phone || user.user_metadata?.phone || '',
        }));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user, profile]);

  const handleChange = (
    field: keyof CheckoutFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = checkoutFormSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CheckoutFormData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);

      // Scroll to first error
      const firstErrorEl = document.querySelector('[aria-invalid="true"]');
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          ...validation.data,
          phone: normalizePakistanPhone(validation.data.phone),
        },
        items: items.map((it) => ({
          productId: it.productId || it.id,
          variantId: it.variantId,
          quantity: it.quantity,
        })),
        couponCode: appliedCoupon?.code,
        idempotencyKey: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined,
      };

      const res = await placeOrderAction(payload);
      if (!res.success) {
        toast.error(res.error || 'Failed to place order. Please check details.', 'Checkout Error');
        setIsSubmitting(false);
        return;
      }

      toast.success(
        `Order #${res.orderNumber} confirmed! We will dispatch via Express Courier.`,
        'Order Successful'
      );

      // Store confirmed order for immediate preview on confirmation screen
      const orderSnapshot: DemoOrder = {
        orderReference: res.orderNumber || 'STY-PK-1001',
        createdAt: new Date().toISOString(),
        customer: {
          ...validation.data,
          phone: normalizePakistanPhone(validation.data.phone),
        },
        items: [...items],
        financials: {
          subtotal,
          discountAmount,
          shippingFee,
          total: res.total || total,
        },
        couponCode: appliedCoupon?.code,
        guestAccessToken: res.guestAccessToken,
      };

      try {
        sessionStorage.setItem('stylone_latest_order', JSON.stringify(orderSnapshot));
      } catch {
        // Storage failover
      }

      clearCart();
      const query = new URLSearchParams({
        orderNumber: res.orderNumber || '',
        token: res.guestAccessToken || '',
      });
      router.push(`/order-confirmation?${query.toString()}`);
    } catch (err: unknown) {
      alert((err as Error).message || 'An error occurred placing your order.');
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 mx-auto border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="py-20 text-center max-w-md mx-auto">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
            Your Bag is Empty
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Please add items to your shopping bag before proceeding to checkout.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[var(--color-text-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Browse Products
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mb-8 border-b border-[var(--color-border-light)] pb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Complete your order with Cash on Delivery or Bank Transfer. Guest checkout supported.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Contact Information */}
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-7 shadow-[var(--shadow-sm)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-3">
                  <h2 className="font-heading text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    1. Contact Information
                  </h2>
                  {user ? (
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Signed In: {profile?.fullName || user.email}
                    </span>
                  ) : (
                    <div className="text-[11px] text-[var(--color-text-secondary)]">
                      <span>Guest Checkout • </span>
                      <Link
                        href="/login?redirectTo=/checkout"
                        className="text-[var(--color-accent)] hover:underline font-semibold"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Full Name <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className={cn(
                        'w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors',
                        errors.fullName
                          ? 'border-[var(--color-error)]'
                          : 'border-[var(--color-border)]'
                      )}
                      aria-invalid={Boolean(errors.fullName)}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Mobile Phone Number <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-medium text-[var(--color-text-muted)]">
                        🇵🇰 +92
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="0300 1234567"
                        className={cn(
                          'w-full pl-18 pr-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors',
                          errors.phone
                            ? 'border-[var(--color-error)]'
                            : 'border-[var(--color-border)]'
                        )}
                        aria-invalid={Boolean(errors.phone)}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                      For delivery confirmation and dispatch notifications (e.g. 03001234567).
                    </p>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Email Address <span className="text-[11px] text-[var(--color-text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={cn(
                        'w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors',
                        errors.email
                          ? 'border-[var(--color-error)]'
                          : 'border-[var(--color-border)]'
                      )}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-7 shadow-[var(--shadow-sm)] space-y-4">
                <div className="border-b border-[var(--color-border-light)] pb-3">
                  <h2 className="font-heading text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    2. Delivery Address (Pakistan)
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* City Selector */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      City <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={cn(
                        'w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors cursor-pointer',
                        errors.city
                          ? 'border-[var(--color-error)]'
                          : 'border-[var(--color-border)]'
                      )}
                    >
                      {PAKISTAN_MAJOR_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Area / Sector */}
                  <div>
                    <label
                      htmlFor="area"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Area / Locality / Sector <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input
                      id="area"
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      placeholder="e.g. DHA Phase 5, Gulberg III, F-7/2, Clifton Block 4"
                      className={cn(
                        'w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors',
                        errors.area
                          ? 'border-[var(--color-error)]'
                          : 'border-[var(--color-border)]'
                      )}
                      aria-invalid={Boolean(errors.area)}
                    />
                    {errors.area && (
                      <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.area}
                      </p>
                    )}
                  </div>

                  {/* Complete Street Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Complete Street Address <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <textarea
                      id="address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="House / Apartment #, Street #, Building Name"
                      className={cn(
                        'w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors resize-y',
                        errors.address
                          ? 'border-[var(--color-error)]'
                          : 'border-[var(--color-border)]'
                      )}
                      aria-invalid={Boolean(errors.address)}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Landmark (Optional) */}
                  <div>
                    <label
                      htmlFor="landmark"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Nearby Landmark <span className="text-[11px] text-[var(--color-text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="landmark"
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => handleChange('landmark', e.target.value)}
                      placeholder="e.g. Near Shell Pump, Opposite City Hospital"
                      className="w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5"
                    >
                      Special Delivery Instructions <span className="text-[11px] text-[var(--color-text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="notes"
                      type="text"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="e.g. Please call before arriving or deliver after 2 PM"
                      className="w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-7 shadow-[var(--shadow-sm)] space-y-4">
                <div className="border-b border-[var(--color-border-light)] pb-3">
                  <h2 className="font-heading text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    3. Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all',
                      formData.paymentMethod === 'cod'
                        ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/60'
                        : 'border-emerald-100 hover:border-emerald-300 bg-white'
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => handleChange('paymentMethod', 'cod')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-[var(--color-text-primary)]">
                        <Banknote size={18} className="text-emerald-600" />
                        <span>Cash on Delivery (COD)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                          Recommended
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                        Pay in cash to the delivery rider when your package arrives at your doorstep. Please have exact change ready.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all',
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/60'
                        : 'border-emerald-100 hover:border-emerald-300 bg-white'
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={() => handleChange('paymentMethod', 'bank_transfer')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-[var(--color-text-primary)]">
                        <CreditCard size={18} className="text-emerald-600" />
                        <span>Direct Bank Transfer</span>
                      </div>
                      <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                        Transfer directly via Raast / Online Banking. Account details will be provided on the next screen.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA (Desktop & Mobile) */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white hover:from-emerald-700 hover:to-green-800 active:scale-[0.98] text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-[var(--shadow-green)] select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Placing Your Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Place Order • {formatPrice(total)}</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>
              </div>
            </div>

            {/* Right Summary Column (5 cols, sticky on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <CheckoutSummary />
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
