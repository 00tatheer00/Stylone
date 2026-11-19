import { type ClassValue, clsx } from 'clsx';

/**
 * Lightweight alternative to clsx + tailwind-merge.
 * We use clsx directly to keep the bundle small.
 * If class conflicts become an issue in later phases,
 * consider adding tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a number as PKR currency.
 */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export const formatPKR = formatPrice;


/**
 * Delay helper for loading states / staggered animations.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
