/**
 * STYLONE — Pakistan Checkout Validation & Normalization
 */

import { z } from 'zod';

export const pakistanPhoneRegex = /^(\+92\s?|92\s?|0)?3\d{2}[-\s]?\d{7}$/;

export const PAKISTAN_MAJOR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Mardan',
  'Gujrat',
  'Wah Cantt',
  'Sheikhupura',
  'Rahim Yar Khan',
  'Other City',
] as const;

/**
 * Normalizes any format of a Pakistan mobile number to standard local format (03XXXXXXXXX).
 * Example: "+92 300 1234567" -> "03001234567"
 * Example: "923001234567" -> "03001234567"
 */
export function normalizePakistanPhone(raw: string): string {
  // Strip spaces, dashes, parentheses
  const cleaned = raw.replace(/[\s\-()]/g, '');

  if (cleaned.startsWith('+92')) {
    return '0' + cleaned.substring(3);
  }
  if (cleaned.startsWith('92')) {
    return '0' + cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Formats canonical number for display: "0300 1234567" -> "+92 300 1234567"
 */
export function formatPakistanPhoneDisplay(phone: string): string {
  const normalized = normalizePakistanPhone(phone);
  if (/^03\d{9}$/.test(normalized)) {
    return `+92 ${normalized.substring(1, 4)} ${normalized.substring(4)}`;
  }
  return phone;
}

/**
 * Validates a Pakistan mobile phone number:
 * Accepts:
 * - 03XXXXXXXXX
 * - +923XXXXXXXXX
 * - 923XXXXXXXXX
 * with optional spaces or dashes
 */
export function isValidPakistanPhone(phone: string): boolean {
  const normalized = normalizePakistanPhone(phone);
  return /^03\d{9}$/.test(normalized);
}

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Please enter your full name (at least 2 characters)')
    .max(80, 'Name is too long')
    .trim(),
  phone: z
    .string()
    .min(10, 'Please enter a valid Pakistani mobile number')
    .refine(
      (val) => isValidPakistanPhone(val),
      'Please enter a valid Pakistan mobile number (e.g. 0300 1234567)'
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .or(z.literal(''))
    .optional(),
  city: z
    .string()
    .min(1, 'Please select your city'),
  area: z
    .string()
    .min(2, 'Please enter your area / sector / locality')
    .trim(),
  address: z
    .string()
    .min(5, 'Please enter your complete street / house address')
    .trim(),
  landmark: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  paymentMethod: z.enum(['cod', 'bank_transfer'], {
    message: 'Please choose a payment method',
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
