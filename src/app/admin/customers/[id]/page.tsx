'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminCustomers, adminOrders } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { ArrowLeft, Eye } from 'lucide-react';

function CustomerDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const customer = adminCustomers.find((c) => c.id === id) || adminCustomers[0];
  const customerOrders = adminOrders.filter(
    (o) => o.customerName === customer.name || o.city === customer.city
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Client Dossier: ${customer.name}`}
        subtitle={`Member since ${customer.registeredDate} • Primary City: ${customer.city}, Pakistan`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Customers', href: '/admin/customers' },
          { label: customer.name },
        ]}
        actions={
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[var(--radius-md)] border border-[var(--color-border-dark)] bg-white hover:bg-[var(--color-bg-secondary)]"
          >
            <ArrowLeft size={13} />
            <span>Back to Customers</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Profile Card & Spend Metrics */}
        <div className="space-y-6">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-light)]">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-[var(--color-accent)] flex items-center justify-center font-heading text-lg font-bold uppercase">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                  {customer.name}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  Verified Client
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Email
                </span>
                <p className="font-medium text-[var(--color-text-primary)]">{customer.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Phone
                </span>
                <p className="font-medium text-[var(--color-text-primary)]">{customer.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                  Registered Destination
                </span>
                <p className="font-medium text-[var(--color-text-primary)]">{customer.city}, Pakistan</p>
              </div>
            </div>
          </div>

          {/* Spend Summary */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs space-y-3">
            <h3 className="font-heading text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
              Lifetime Commercial Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Total Gross Spend:</span>
                <span className="font-bold text-[var(--color-text-primary)]">
                  {formatPKR(customer.totalSpend)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Completed Orders:</span>
                <span className="font-bold text-[var(--color-text-primary)]">
                  {customer.totalOrders} Orders
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Average Order Value:</span>
                <span className="font-bold text-emerald-700">
                  {formatPKR(Math.round(customer.totalSpend / Math.max(1, customer.totalOrders)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Last Acquisition:</span>
                <span className="font-mono text-[var(--color-text-muted)]">
                  {customer.lastOrderDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Order History Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
            <div className="p-5 pb-3 border-b border-[var(--color-border-light)]">
              <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                Client Order History
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Consignments dispatched to this customer
              </p>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
                  <tr>
                    <th className="py-2.5 px-4">Order Ref</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Destination</th>
                    <th className="py-2.5 px-4">Payment</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-light)]">
                  {customerOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[var(--color-text-muted)]">
                        No previous orders recorded for this profile.
                      </td>
                    </tr>
                  ) : (
                    customerOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[var(--color-text-primary)]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-[var(--color-text-muted)]">{ord.date}</td>
                        <td className="py-3 px-4 text-[var(--color-text-secondary)]">{ord.city}</td>
                        <td className="py-3 px-4 capitalize">
                          {ord.paymentMethod === 'cod' ? 'COD' : 'Bank Transfer'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[var(--color-text-primary)]">
                          {formatPKR(ord.total)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="p-1 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                          >
                            <Eye size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-stone-500 uppercase tracking-widest">
          Loading client dossier...
        </div>
      }
    >
      <CustomerDetailContent />
    </Suspense>
  );
}
