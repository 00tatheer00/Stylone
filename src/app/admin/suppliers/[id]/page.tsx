'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminSuppliers } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

function SupplierDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const supplier = adminSuppliers.find((s) => s.id === id) || adminSuppliers[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Supplier Profile: ${supplier.name}`}
        subtitle={`Artisanal Partner located in ${supplier.city}, Pakistan • Overall QC Pass Rate: ${supplier.inspectionPassRate}%`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Suppliers', href: '/admin/suppliers' },
          { label: supplier.name },
        ]}
        actions={
          <Link
            href="/admin/suppliers"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-white hover:bg-[var(--color-bg-secondary)]"
          >
            <ArrowLeft size={13} />
            <span>Back to Suppliers</span>
          </Link>
        }
      />

      {/* Quality Enforcement Banner */}
      <div className="p-4 rounded-[var(--radius-lg)] bg-stone-900 text-white text-xs flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-[var(--color-accent)] shrink-0" />
          <p className="text-stone-300">
            <strong>Direct Dispatch Restriction:</strong> All supplier goods from {supplier.name} are physically received and inspected at STYLONE Central Hub before customer dispatch.
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          QC Certified Partner
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Receiving History & Inspection Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Receiving Logs */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border-light)]">
              Physical Consignment Receiving &amp; QC Logs
            </h3>

            <div className="divide-y divide-[var(--color-border-light)] text-xs">
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[var(--color-text-primary)]">
                    Batch #DCP-2026-REC04
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Passed Inspection
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[var(--color-text-secondary)]">
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Received Date:</span>
                    <span className="font-medium">2026-11-12</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Total Units:</span>
                    <span className="font-medium">100 Units</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Accepted:</span>
                    <span className="font-bold text-emerald-700">98 Units</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Damaged/Rejected:</span>
                    <span className="font-bold text-rose-600">2 Units (Seal Broken)</span>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] italic pt-1">
                  QC Officer Note: Formulation purity confirmed. Batch approved for inventory intake.
                </p>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[var(--color-text-primary)]">
                    Batch #DCP-2026-REC03
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Passed Inspection
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[var(--color-text-secondary)]">
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Received Date:</span>
                    <span className="font-medium">2026-10-24</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Total Units:</span>
                    <span className="font-medium">75 Units</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Accepted:</span>
                    <span className="font-bold text-emerald-700">75 Units (100%)</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-muted)] block">Damaged/Rejected:</span>
                    <span className="font-bold text-stone-500">0 Units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Payment Ledger */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border-light)]">
              Supplier Accounts &amp; Settlement Ledger
            </h3>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
                  <tr>
                    <th className="py-2.5 px-3">Invoice Ref</th>
                    <th className="py-2.5 px-3">Batch Received</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Invoice Amount</th>
                    <th className="py-2.5 px-3 text-center">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-light)]">
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold">INV-DCP-9102</td>
                    <td className="py-3 px-3 font-mono text-[11px]">DCP-2026-REC04</td>
                    <td className="py-3 px-3 text-[var(--color-text-muted)]">2026-11-14</td>
                    <td className="py-3 px-3 text-right font-bold text-[var(--color-text-primary)]">
                      {formatPKR(137200)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800">
                        Paid (Bank Transfer)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold">INV-DCP-8819</td>
                    <td className="py-3 px-3 font-mono text-[11px]">DCP-2026-REC03</td>
                    <td className="py-3 px-3 text-[var(--color-text-muted)]">2026-10-26</td>
                    <td className="py-3 px-3 text-right font-bold text-[var(--color-text-primary)]">
                      {formatPKR(105000)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800">
                        Paid (Meezan Bank)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Contact Profile & Supplied Lines */}
        <div className="space-y-6">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Procurement Representative
            </h3>
            <div className="text-xs space-y-2 text-[var(--color-text-secondary)]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Contact Person
                </span>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">
                  {supplier.contactPerson}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Direct Email
                </span>
                <p className="font-medium text-[var(--color-text-primary)]">{supplier.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Phone / Landline
                </span>
                <p className="font-medium text-[var(--color-text-primary)]">{supplier.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Head Office
                </span>
                <p className="font-medium text-[var(--color-text-primary)]">{supplier.city}, Pakistan</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Assigned Categories
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {supplier.categoriesSupplied.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                >
                  {cat}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] pt-2 leading-relaxed">
              {supplier.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-stone-500 uppercase tracking-widest">
          Loading supplier dossier...
        </div>
      }
    >
      <SupplierDetailContent />
    </Suspense>
  );
}
