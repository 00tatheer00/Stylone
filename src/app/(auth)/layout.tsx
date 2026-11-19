import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config';
import { ToastProvider } from '@/components/ui';

/**
 * (auth) route group layout — Luxury customer authentication portal
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col justify-between bg-[var(--color-bg-primary)] px-4 py-8 sm:py-12">
        {/* Top bar with logo and back link */}
        <header className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Boutique</span>
          </Link>

          <Link href="/" className="text-center group">
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {siteConfig.name}
            </span>
          </Link>

          <div className="w-16" aria-hidden="true" />
        </header>

        {/* Main auth card container */}
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>

        {/* Auth footer */}
        <footer className="w-full max-w-md mx-auto mt-8 pt-6 border-t border-[var(--color-border-light)] text-center text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Link href="/privacy" className="hover:text-[var(--color-text-primary)] underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[var(--color-text-primary)] underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[var(--color-text-primary)] underline-offset-4 hover:underline">
              Contact Support
            </Link>
          </div>
          <p>© 2026 {siteConfig.name}. All rights reserved.</p>
        </footer>
      </div>
    </ToastProvider>
  );
}
