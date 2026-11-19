'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { SupabaseAdvisory } from './supabase-advisory';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse(formData);
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
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to activate live authentication.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Security best practice: never reveal specifically whether the email or password was wrong
        setServerError('Invalid email or password. Please verify your credentials and try again.');
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-md">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
          Sign In
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Welcome back to STYLONE Luxury Boutique
        </p>
      </div>

      <SupabaseAdvisory />

      {serverError && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
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
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-emerald-200 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
              } text-[var(--color-text-primary)] placeholder-stone-400 outline-none transition-all`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock size={16} />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border ${
                errors.password
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-emerald-200 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
              } text-[var(--color-text-primary)] placeholder-stone-400 outline-none transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-emerald-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
            <span className="text-xs text-stone-600 font-medium">
              Remember this device
            </span>
          </label>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs uppercase tracking-widest font-bold transition-all shadow-sm hover:shadow-[var(--shadow-green)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In to Stylone</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-emerald-100 text-center text-xs text-stone-600">
        Don&apos;t have an account?{' '}
        <Link
          href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors underline-offset-4 hover:underline"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  );
}
