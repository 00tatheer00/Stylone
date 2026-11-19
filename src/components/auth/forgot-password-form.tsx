'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { SupabaseAdvisory } from './supabase-advisory';

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = forgotPasswordSchema.safeParse(formData);
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
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to activate password recovery.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setServerError(error.message);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while sending the reset link.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={30} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Reset Link Sent
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          If an account exists for <strong className="text-[var(--color-text-primary)] font-semibold">{formData.email}</strong>,
          you will receive a password reset link shortly.
        </p>

        <div className="p-4 bg-[var(--color-bg-primary)] rounded-[var(--radius-md)] text-xs text-[var(--color-text-secondary)] mb-6 text-left space-y-1.5">
          <p className="font-medium text-[var(--color-text-primary)]">Next steps:</p>
          <p>• Click the link in your email to choose a new password.</p>
          <p>• The reset link expires in 1 hour for security.</p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent)] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Forgot Password
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Enter your email to receive a secure recovery link
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
                setFormData({ email: e.target.value });
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending Link...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[var(--color-border-light)] text-center text-xs text-[var(--color-text-secondary)]">
        Remember your password?{' '}
        <Link
          href="/login"
          className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
