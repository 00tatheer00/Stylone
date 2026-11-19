'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { evaluatePasswordStrength, registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { SupabaseAdvisory } from './supabase-advisory';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const strength = evaluatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate with Zod
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (!isSupabaseConfigured()) {
      setServerError(
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to activate live registration.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setServerError('An account with this email address already exists. Please sign in instead.');
        } else {
          setServerError(error.message);
        }
        setIsSubmitting(false);
        return;
      }

      // Check if session was immediately established (email confirmation disabled in Supabase)
      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        // Email confirmation is required
        setRegisteredEmail(formData.email);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If waiting for email verification
  if (registeredEmail) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={30} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          We have sent a verification link to{' '}
          <strong className="text-[var(--color-text-primary)] font-semibold">{registeredEmail}</strong>.
          Please click the link in your email to activate your STYLONE account and access your boutique portal.
        </p>

        <div className="p-4 bg-[var(--color-bg-primary)] rounded-[var(--radius-md)] text-xs text-[var(--color-text-secondary)] mb-6 text-left space-y-1.5">
          <p className="font-medium text-[var(--color-text-primary)]">Didn&apos;t receive the email?</p>
          <p>• Check your spam or promotional folders.</p>
          <p>• Verification links are valid for 24 hours.</p>
        </div>

        <Link
          href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent)] transition-colors"
        >
          <span>Return to Sign In</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Create Your Account
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Join STYLONE for a tailored luxury beauty experience
        </p>
      </div>

      <SupabaseAdvisory />

      {serverError && (
        <div className="mb-6 p-3.5 rounded-[var(--radius-md)] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <User size={16} />
            </span>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="e.g. Fatima Ali"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                errors.fullName
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-[var(--color-border-light)] bg-white focus:border-[var(--color-accent)]'
              } text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Mail size={16} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="name@example.com"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-[var(--color-border-light)] bg-white focus:border-[var(--color-accent)]'
              } text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Lock size={16} />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Minimum 8 characters"
              className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                errors.password
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-[var(--color-border-light)] bg-white focus:border-[var(--color-accent)]'
              } text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
          )}

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-text-secondary)]">Strength:</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1 w-full bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-full transition-colors ${
                      strength.score >= level ? strength.color : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              {strength.feedback.length > 0 && (
                <ul className="text-[11px] text-[var(--color-text-muted)] list-disc pl-4 space-y-0.5">
                  {strength.feedback.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Lock size={16} />
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              placeholder="Re-enter your password"
              className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                errors.confirmPassword
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-[var(--color-border-light)] bg-white focus:border-[var(--color-accent)]'
              } text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Acceptance */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => {
                setFormData({ ...formData, acceptTerms: e.target.checked });
                if (errors.acceptTerms) setErrors({ ...errors, acceptTerms: '' });
              }}
              className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-dark)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] accent-[var(--color-accent)]"
            />
            <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-[var(--color-text-primary)] font-medium underline hover:text-[var(--color-accent)]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[var(--color-text-primary)] font-medium underline hover:text-[var(--color-accent)]">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs text-rose-600 pl-6.5">{errors.acceptTerms}</p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[var(--color-border-light)] text-center text-xs text-[var(--color-text-secondary)]">
        Already have a STYLONE account?{' '}
        <Link
          href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
