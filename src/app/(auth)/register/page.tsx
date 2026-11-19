import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join STYLONE for a curated luxury cosmetics and beauty shopping experience in Pakistan.',
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] animate-pulse h-96" />
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
