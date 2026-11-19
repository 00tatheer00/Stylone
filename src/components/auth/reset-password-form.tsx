'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { evaluatePasswordStrength, resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { SupabaseAdvisory } from './supabase-advisory';

export function ResetPasswordForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const strength = evaluatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = resetPasswordSchema.safeParse(formData);
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
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to activate password reset.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('expired') || error.message.toLowerCase().includes('invalid token')) {
          setServerError('This password recovery link has expired or is invalid. Please request a new recovery link.');
        } else {
          setServerError(error.message);
        }
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while updating your password.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={30} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Password Updated
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          Your password has been successfully reset. You may now continue to your STYLONE account.
        </p>

        <button
          onClick={() => {
            router.push('/account');
            router.refresh();
          }}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent)] transition-colors"
        >
          <span>Continue to Account</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Set New Password
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Create a secure password for your STYLONE account
        </p>
      </div>

      <SupabaseAdvisory />

      {serverError && (
        <div className="mb-6 p-3.5 rounded-[var(--radius-md)] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="leading-relaxed">{serverError}</p>
            {serverError.includes('expired') && (
              <Link
                href="/forgot-password"
                className="mt-2 inline-block font-semibold text-rose-900 underline hover:no-underline"
              >
                Request a new link →
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            New Password <span className="text-rose-500">*</span>
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

          {/* Strength bar */}
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
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Confirm New Password <span className="text-rose-500">*</span>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[var(--color-border-light)] text-center text-xs text-[var(--color-text-secondary)]">
        Return to{' '}
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
