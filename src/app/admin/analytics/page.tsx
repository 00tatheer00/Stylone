'use client';

import { AdminPageHeader, RevenueChart } from '@/components/admin';
import { formatPKR } from '@/lib/utils';
import { MapPin, PieChart } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const categoryShare = [
    { name: 'Skincare', percentage: 42, revenue: 1043700 },
    { name: 'Makeup', percentage: 28, revenue: 695800 },
    { name: 'Haircare', percentage: 16, revenue: 397600 },
    { name: 'Beauty Accessories', percentage: 8, revenue: 198800 },
    { name: 'Personal Care', percentage: 6, revenue: 149100 },
  ];

  const cityDistribution = [
    { city: 'Karachi', percentage: 38, orders: 244 },
    { city: 'Lahore', percentage: 32, orders: 205 },
    { city: 'Islamabad / Rawalpindi', percentage: 18, orders: 115 },
    { city: 'Faisalabad', percentage: 6, orders: 38 },
    { city: 'Multan, Sialkot & Others', percentage: 6, orders: 40 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Commercial Analytics &amp; Market Insights"
        subtitle="Aggregate revenue growth, Pakistani regional demand distribution and category performance."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Average Basket Value (AOV)
          </span>
          <p className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mt-1">
            Rs. 3,870
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">+8.4% vs previous quarter</p>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            COD Fulfillment Success
          </span>
          <p className="font-heading text-2xl font-bold text-emerald-700 mt-1">
            94.2%
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">First-attempt delivery rate</p>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Customer Repeat Rate
          </span>
          <p className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mt-1">
            34.6%
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">High luxury client retention</p>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Return &amp; Damage Rate
          </span>
          <p className="font-heading text-2xl font-bold text-stone-700 mt-1">
            1.4%
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Significantly below industry standard</p>
        </div>
      </div>

      {/* Main Revenue Trajectory Chart */}
      <RevenueChart />

      {/* Category Share & Regional Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2">
            <PieChart size={18} className="text-[var(--color-accent)]" />
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              Revenue by Category Contribution
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {categoryShare.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[var(--color-text-primary)]">{cat.name} ({cat.percentage}%)</span>
                  <span className="text-[var(--color-text-secondary)]">{formatPKR(cat.revenue)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-text-primary)] rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Pakistan Distribution */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border-light)] pb-2">
            <MapPin size={18} className="text-[var(--color-accent)]" />
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              Regional Demand Distribution (Pakistan)
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {cityDistribution.map((reg) => (
              <div key={reg.city}>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[var(--color-text-primary)]">{reg.city} ({reg.percentage}%)</span>
                  <span className="text-[var(--color-text-secondary)]">{reg.orders} parcels</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent)] rounded-full"
                    style={{ width: `${reg.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
