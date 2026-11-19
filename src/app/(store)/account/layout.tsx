'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { AccountNav } from '@/components/account/account-nav';
import { AccountHeader } from '@/components/account/account-header';
import { useAuth } from '@/hooks/use-auth';
import { ShieldAlert, ArrowRight, ShoppingBag } from 'lucide-react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isConfigured } = useAuth();

  useEffect(() => {
    if (!isLoading && isConfigured && !user) {
      router.push('/login?redirectTo=/account');
    }
  }, [isLoading, isConfigured, user, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="py-10 bg-[var(--color-bg-primary)] min-h-[60vh]">
        <Container>
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-6 w-36 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-24 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)]" />
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
              <div className="h-64 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] hidden lg:block" />
              <div className="h-96 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)]" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // If Supabase is not yet configured in .env.local
  if (!isConfigured) {
    return (
      <div className="py-12 md:py-16 bg-[var(--color-bg-primary)] min-h-[70vh]">
        <Container>
          <div className="max-w-xl mx-auto bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-8 sm:p-10 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <ShieldAlert size={28} />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-3">
              Supabase Configuration Required
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
              In accordance with STYLONE security standards, customer accounts, authentication, saved addresses,
              and order privacy require an active Supabase backend and are never simulated.
            </p>

            <div className="bg-[var(--color-bg-primary)] p-4 rounded-[var(--radius-md)] text-xs text-left mb-6 font-mono text-[var(--color-text-secondary)] space-y-1">
              <p className="font-semibold text-[var(--color-text-primary)] font-sans text-xs mb-1.5">
                Setup steps in <code className="text-amber-800">.env.local</code>:
              </p>
              <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent)] transition-colors"
              >
                <ShoppingBag size={14} />
                <span>Explore Boutique</span>
              </Link>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <span>Return Home</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // If configured but user is not logged in, prompt sign in
  if (!user) {
    return (
      <div className="py-12 md:py-16 bg-[var(--color-bg-primary)] min-h-[70vh]">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-8 text-center shadow-sm">
            <h1 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Authentication Required
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Please sign in to access your personal boutique client portal.
            </p>
            <Link
              href="/login?redirectTo=/account"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-md)] bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent)] transition-colors"
            >
              <span>Sign In to Account</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-[var(--color-bg-primary)] min-h-[80vh]">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'My Account', href: '/account' },
              ]}
            />
          </div>

          {/* Account Profile Greeting */}
          <AccountHeader />

          {/* Main Account Grid: Sidebar + Subpage Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
            <aside className="w-full">
              <AccountNav />
            </aside>
            <main className="w-full min-w-0">{children}</main>
          </div>
        </div>
      </Container>
    </div>
  );
}
