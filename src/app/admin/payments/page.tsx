'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { CreditCard, Banknote, CheckCircle2 } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);

  const [bankDetails, setBankDetails] = useState({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'STYLONE LUXURY COSMETICS',
    iban: 'PK36MEZN0001234567890123',
    branchCode: '0102 (DHA Phase 5, Lahore)',
    whatsappVerificationNumber: '+92 300 1234567',
  });

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Payment gateway parameters saved successfully (Demo Mode).');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Methods &amp; Gateway Settings"
        subtitle="Manage customer checkout payment channels: Cash on Delivery and Direct Bank Transfer."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payments' }]}
      />

      {savedMsg && (
        <div className="p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{savedMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Cash on Delivery Configuration */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-3">
            <div className="flex items-center gap-2.5">
              <Banknote size={18} className="text-emerald-600" />
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  Cash on Delivery (COD)
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Primary payment preference across the Pakistani e-commerce landscape
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                {codEnabled ? 'Active' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="text-xs text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
            <p>
              • Courier collects cash payment in full upon physical handover of consignment parcel.
            </p>
            <p>
              • Automated phone or WhatsApp confirmation verification is triggered prior to hub dispatch for orders above Rs. 10,000.
            </p>
          </div>
        </div>

        {/* Direct Bank Transfer Configuration */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-3">
            <div className="flex items-center gap-2.5">
              <CreditCard size={18} className="text-[var(--color-accent)]" />
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  Direct Bank Transfer (IBAN)
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Corporate banking credentials displayed to clients during checkout
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bankTransferEnabled}
                onChange={(e) => setBankTransferEnabled(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                {bankTransferEnabled ? 'Active' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Designated Bank
              </label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Account Title
              </label>
              <input
                type="text"
                value={bankDetails.accountTitle}
                onChange={(e) => setBankDetails({ ...bankDetails, accountTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                International Bank Account Number (IBAN)
              </label>
              <input
                type="text"
                value={bankDetails.iban}
                onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                WhatsApp Proof Verification Line
              </label>
              <input
                type="text"
                value={bankDetails.whatsappVerificationNumber}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, whatsappVerificationNumber: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Save Payment Settings
        </button>
      </form>
    </div>
  );
}
