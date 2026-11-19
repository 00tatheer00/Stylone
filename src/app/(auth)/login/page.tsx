import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your STYLONE account to access your orders, saved addresses and luxury beauty wishlist.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] animate-pulse h-96" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
