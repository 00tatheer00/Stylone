'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center py-20">
      <Container className="text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-error)] mb-4">
          Error
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[var(--color-text-primary)] mb-3">
          Something Went Wrong
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
        >
          Try Again
        </button>
      </Container>
    </main>
  );
}
