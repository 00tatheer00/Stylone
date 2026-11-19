'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { CheckCircle2, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'STYLONE',
    legalEntity: 'STYLONE Luxury Cosmetics Private Limited',
    market: 'Pakistan (Domestic)',
    currency: 'PKR (Rs.)',
    supportEmail: 'concierge@stylone.pk',
    supportPhone: '+92 300 1234567',
    hubAddress: 'Plot 44, Industrial Sector I-9, Islamabad / Lahore Distribution Center',
    taxNTN: '9012841-7 (FBR Registered)',
  });

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Store configuration saved successfully (Demo Mode).');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Boutique Settings &amp; Legal Configuration"
        subtitle="Manage master store identity, domestic tax NTN registrations and official support channels."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}
      />

      {savedMsg && (
        <div className="p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{savedMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
            Store Identity &amp; Market Legalities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Store Brand Wordmark
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Registered Legal Entity Name
              </label>
              <input
                type="text"
                required
                value={settings.legalEntity}
                onChange={(e) => setSettings({ ...settings, legalEntity: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Market &amp; Jurisdiction
              </label>
              <input
                type="text"
                disabled
                value={settings.market}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-stone-100 text-stone-600 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Operating Currency
              </label>
              <input
                type="text"
                disabled
                value={settings.currency}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-stone-100 text-stone-600 font-bold outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                FBR National Tax Number (NTN)
              </label>
              <input
                type="text"
                value={settings.taxNTN}
                onChange={(e) => setSettings({ ...settings, taxNTN: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Concierge Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
              Central Receiving Hub &amp; Physical Inspection Facility
            </label>
            <input
              type="text"
              value={settings.hubAddress}
              onChange={(e) => setSettings({ ...settings, hubAddress: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          <Save size={14} />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
}
