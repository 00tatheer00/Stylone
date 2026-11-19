'use client';

import { useAuth } from '@/hooks/use-auth';
import { ShieldCheck, Calendar, Mail } from 'lucide-react';

export function AccountHeader() {
  const { profile, user } = useAuth();

  const displayName = profile?.fullName || user?.user_metadata?.full_name || 'Customer';
  const displayEmail = profile?.email || user?.email || '';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
      })
    : '2026';

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-dark)] flex items-center justify-center text-[var(--color-text-primary)] font-heading text-xl font-bold uppercase shrink-0">
            {displayName.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <ShieldCheck size={12} />
                <span>Verified Client</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mt-1 flex-wrap">
              {displayEmail && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[var(--color-text-muted)]" />
                  <span>{displayEmail}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[var(--color-text-muted)]" />
                <span>Client since {memberSince}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
