/**
 * Zod validation schemas — Foundation
 *
 * Reusable validation schemas will be added as features are built.
 * This module serves as the central location for all validation logic.
 */

import { z } from 'zod';

/** Email validation */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/** Pakistan phone number (basic pattern) */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^(\+92|0)?3\d{9}$/,
    'Please enter a valid Pakistani phone number',
  );

/** Non-empty string */
export const requiredString = (field: string) =>
  z.string().min(1, `${field} is required`).trim();

/** Positive price in PKR */
export const priceSchema = z
  .number()
  .positive('Price must be greater than 0')
  .multipleOf(0.01, 'Price cannot have more than 2 decimal places');

export * from './checkout';
export * from './auth';

