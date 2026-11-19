/**
 * STYLONE — Centralized Pricing & Order Total Calculations
 *
 * All financial amounts are rounded to integers in PKR.
 * Frontend calculations are strictly for customer preview;
 * future server transactions will recompute from database records.
 */

import { calculateShippingFee, type ShippingConfig, defaultShippingConfig } from './shipping';
import type { AppliedCoupon } from './coupon';

export interface OrderFinancials {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

export function calculateOrderFinancials(
  subtotal: number,
  coupon: AppliedCoupon | null,
  shippingConfig: ShippingConfig = defaultShippingConfig
): OrderFinancials {
  const safeSubtotal = Math.max(0, Math.round(subtotal));

  // Determine eligible discount
  let discountAmount = 0;
  if (coupon && coupon.discountAmount > 0) {
    discountAmount = Math.min(safeSubtotal, Math.round(coupon.discountAmount));
  }

  // Shipping calculated on net subtotal or initial subtotal
  const shippingFee = calculateShippingFee(safeSubtotal, shippingConfig);

  // Total payable
  const total = Math.max(0, safeSubtotal - discountAmount + shippingFee);

  return {
    subtotal: safeSubtotal,
    discountAmount,
    shippingFee,
    total,
  };
}
