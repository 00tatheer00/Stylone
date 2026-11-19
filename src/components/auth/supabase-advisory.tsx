'use client';

import { Info } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function SupabaseAdvisory() {
  const configured = isSupabaseConfigured();

  if (configured) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
      <div className="flex items-start gap-2.5">
        <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 mb-1">
            Supabase Connection Pending
          </p>
          <p className="text-amber-700">
            Real customer authentication requires your Supabase URL &amp; Anon Key in{' '}
            <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-[11px]">.env.local</code>.
            As mandated by STYLONE security standards, authentication is never simulated.
          </p>
        </div>
      </div>
    </div>
  );
}
