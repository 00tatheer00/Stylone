/**
 * STYLONE — Shipping & Delivery Calculation Module
 *
 * Centralized shipping logic for Pakistan market.
 * Designed to be easily replaced by dynamic API/backend rules in later phases.
 */

export interface ShippingConfig {
  /** Free shipping threshold in PKR */
  freeShippingThreshold: number;
  /** Standard flat delivery fee across Pakistan in PKR */
  standardFee: number;
  /** Estimated business days for delivery */
  deliveryTimeDays: string;
}

export const defaultShippingConfig: ShippingConfig = {
  freeShippingThreshold: 3000,
  standardFee: 250,
  deliveryTimeDays: '2–4 business days',
};

/**
 * Calculate shipping fee based on eligible subtotal and city.
 * @param subtotal - The cart subtotal in PKR
 * @param config - Optional custom shipping config
 * @returns Shipping fee in PKR (0 if above free threshold)
 */
export function calculateShippingFee(
  subtotal: number,
  config: ShippingConfig = defaultShippingConfig
): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= config.freeShippingThreshold) {
    return 0;
  }
  return config.standardFee;
}

/**
 * Calculates how much more the customer needs to spend to get free shipping.
 * @param subtotal - Current subtotal
 * @param threshold - Free shipping threshold
 * @returns Remaining amount, or 0 if qualified
 */
export function getRemainingForFreeShipping(
  subtotal: number,
  threshold: number = defaultShippingConfig.freeShippingThreshold
): number {
  if (subtotal >= threshold) return 0;
  return Math.max(0, threshold - subtotal);
}
