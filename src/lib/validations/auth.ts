import { z } from 'zod';
import { emailSchema } from './index';
import { pakistanPhoneRegex } from './checkout';

/**
 * Password strength rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number or special character
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password cannot exceed 72 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[\d\W]/, 'Password must contain at least one number or symbol');

/**
 * Register Form Validation Schema
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name is too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name should only contain letters, spaces, hyphens, and apostrophes')
      .trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service & Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login Form Validation Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Forgot Password Validation Schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Validation Schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long')
    .trim(),
  phone: z
    .string()
    .trim()
    .refine((val) => !val || pakistanPhoneRegex.test(val), {
      message: 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567)',
    }),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

/**
 * Saved Address Schema
 */
export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .trim()
    .regex(pakistanPhoneRegex, 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567)'),
  city: z.string().min(2, 'Please select or enter your city').trim(),
  area: z.string().min(2, 'Please enter area / neighborhood / sector').trim(),
  addressLine1: z.string().min(5, 'Please enter complete house/flat and street address').trim(),
  landmark: z.string().max(100).optional().default(''),
  label: z.enum(['Home', 'Work', 'Other'], {
    message: 'Please select an address label',
  }),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

/**
 * Password Strength Evaluator
 */
export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Too weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, label: 'Too weak', color: 'bg-red-400', feedback: [] };
  }

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mix of uppercase and lowercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number (0-9)');
  }

  if (/[\W_]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special symbol (!@#$%^&*)');
  }

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: 'Too weak', color: 'bg-red-500', feedback };
    case 2:
      return { score: 2, label: 'Weak', color: 'bg-amber-500', feedback };
    case 3:
      return { score: 3, label: 'Fair', color: 'bg-yellow-500', feedback };
    case 4:
      return { score: 4, label: 'Strong', color: 'bg-emerald-600', feedback: [] };
    default:
      return { score: 0, label: 'Too weak', color: 'bg-red-400', feedback };
  }
}
