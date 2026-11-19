/**
 * STYLONE — Coupon & Discount System
 *
 * Isolated demonstration coupon definitions and calculation engine.
 * Supports percentage and fixed amount discounts with eligibility conditions.
 */

export type CouponType = 'percentage' | 'fixed';

export interface DemoCoupon {
  code: string;
  type: CouponType;
  /** Percentage (e.g. 10 for 10%) or fixed amount in PKR (e.g. 500) */
  value: number;
  /** Minimum subtotal required in PKR */
  minPurchase: number;
  /** Maximum discount allowed in PKR (for percentage coupons) */
  maxDiscount?: number;
  description: string;
  isExpired?: boolean;
}

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  description: string;
  discountAmount: number;
}

export type CouponValidationResult =
  | { success: true; coupon: AppliedCoupon; message: string }
  | { success: false; message: string };

/**
 * Temporary demonstration coupons.
 * Clearly isolated and not connected to a live database.
 */
export const demoCoupons: DemoCoupon[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 2000,
    maxDiscount: 1000,
    description: '10% off your order (min. Rs. 2,000)',
  },
  {
    code: 'STYLONE500',
    type: 'fixed',
    value: 500,
    minPurchase: 3500,
    description: 'Rs. 500 flat off orders above Rs. 3,500',
  },
  {
    code: 'BEAUTY20',
    type: 'percentage',
    value: 20,
    minPurchase: 4500,
    maxDiscount: 2000,
    description: '20% VIP beauty discount (min. Rs. 4,500)',
  },
  {
    code: 'EXPIRED50',
    type: 'percentage',
    value: 50,
    minPurchase: 1000,
    isExpired: true,
    description: 'Expired seasonal discount',
  },
];

/**
 * Validates and calculates discount for a given coupon code against a subtotal.
 */
export function validateAndApplyCoupon(
  rawCode: string,
  subtotal: number
): CouponValidationResult {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return { success: false, message: 'Please enter a coupon code.' };
  }

  const found = demoCoupons.find((c) => c.code === code);

  if (!found) {
    return {
      success: false,
      message: `Coupon code "${code}" is invalid or does not exist.`,
    };
  }

  if (found.isExpired) {
    return {
      success: false,
      message: `Coupon code "${code}" has expired.`,
    };
  }

  if (subtotal < found.minPurchase) {
    return {
      success: false,
      message: `Minimum order amount of Rs. ${found.minPurchase.toLocaleString(
        'en-PK'
      )} required for coupon "${code}".`,
    };
  }

  // Calculate discount
  let discount = 0;
  if (found.type === 'percentage') {
    discount = Math.round((subtotal * found.value) / 100);
    if (found.maxDiscount && discount > found.maxDiscount) {
      discount = found.maxDiscount;
    }
  } else {
    discount = found.value;
  }

  // Never allow discount to exceed the subtotal
  discount = Math.min(discount, subtotal);

  return {
    success: true,
    coupon: {
      code: found.code,
      type: found.type,
      value: found.value,
      description: found.description,
      discountAmount: discount,
    },
    message: `Coupon "${found.code}" applied successfully!`,
  };
}

export const validateCouponCode = validateAndApplyCoupon;
