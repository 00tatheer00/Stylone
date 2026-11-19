'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { CheckCircle2 } from 'lucide-react';

export default function AdminShippingPage() {
  const [flatFee, setFlatFee] = useState(250);
  const [freeThreshold, setFreeThreshold] = useState(3000);
  const [activeCouriers, setActiveCouriers] = useState({
    tcs: true,
    leopards: true,
    trax: true,
    callCourier: false,
  });

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Domestic shipping parameters updated successfully (Demo Mode).');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Domestic Logistics &amp; Shipping Rules"
        subtitle="Manage Pakistan-wide delivery charges, free freight thresholds and approved courier partners."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Shipping' }]}
      />

      {savedMsg && (
        <div className="p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{savedMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Freight Fee Configuration */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
            Standard Delivery Rates (PKR)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Standard Nationwide Delivery Fee (PKR)
              </label>
              <input
                type="number"
                required
                value={flatFee}
                onChange={(e) => setFlatFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                Default flat rate applied to all domestic customer baskets.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Free Delivery Spend Threshold (PKR)
              </label>
              <input
                type="number"
                required
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                Baskets at or above this net subtotal receive complimentary shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Courier Integrations */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
            Integrated Domestic Courier Services
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border-light)] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[var(--color-text-primary)]">TCS Express</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Overnight express delivery &amp; COD collection</p>
              </div>
              <input
                type="checkbox"
                checked={activeCouriers.tcs}
                onChange={(e) => setActiveCouriers({ ...activeCouriers, tcs: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
            </div>

            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border-light)] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[var(--color-text-primary)]">Leopards Courier</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Secondary delivery partner across Punjab &amp; Sindh</p>
              </div>
              <input
                type="checkbox"
                checked={activeCouriers.leopards}
                onChange={(e) => setActiveCouriers({ ...activeCouriers, leopards: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
            </div>

            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border-light)] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[var(--color-text-primary)]">Trax Logistics</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Real-time API tracking &amp; automated return alerts</p>
              </div>
              <input
                type="checkbox"
                checked={activeCouriers.trax}
                onChange={(e) => setActiveCouriers({ ...activeCouriers, trax: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
            </div>

            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border-light)] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[var(--color-text-primary)]">Call Courier</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Bulk dispatch handling for rural delivery sectors</p>
              </div>
              <input
                type="checkbox"
                checked={activeCouriers.callCourier}
                onChange={(e) => setActiveCouriers({ ...activeCouriers, callCourier: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
            Domestic Delivery Zones &amp; Lead Times
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[var(--color-bg-primary)] rounded-[var(--radius-md)]">
              <p className="font-bold text-[var(--color-text-primary)]">Karachi &amp; Port Sector</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Same-Day / Next-Day Delivery</p>
            </div>
            <div className="p-3 bg-[var(--color-bg-primary)] rounded-[var(--radius-md)]">
              <p className="font-bold text-[var(--color-text-primary)]">Lahore, Islamabad &amp; Metros</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">2 to 3 Business Days</p>
            </div>
            <div className="p-3 bg-[var(--color-bg-primary)] rounded-[var(--radius-md)]">
              <p className="font-bold text-[var(--color-text-primary)]">Nationwide Rest of Pakistan</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">3 to 5 Business Days</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Save Shipping Configuration
        </button>
      </form>
    </div>
  );
}
