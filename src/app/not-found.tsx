import Link from 'next/link';
import { Container } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-20">
      <Container className="text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
          404
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[var(--color-text-primary)] mb-3">
          Page Not Found
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
        >
          Back to Home
        </Link>
      </Container>
    </main>
  );
}
