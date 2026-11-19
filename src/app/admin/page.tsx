'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AdminPageHeader,
  AdminKPICard,
  RevenueChart,
} from '@/components/admin';
import {
  adminKPIs,
  adminOrders,
  adminProducts,
  adminInventory,
} from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import {
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowRight,
  Eye,
  Calendar,
} from 'lucide-react';

const kpiIcons = [
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  Users,
  AlertTriangle,
];

export default function AdminDashboardPage() {
  const [dateFilter, setDateFilter] = useState('This Month');

  const lowStockItems = adminInventory.filter(
    (item) => item.status === 'low_stock' || item.status === 'out_of_stock'
  );

  const bestSellers = [...adminProducts].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Executive Overview"
        subtitle="Real-time commercial performance, consignment tracking and operational metrics for STYLONE Pakistan."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Overview' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-white border border-[var(--color-border-light)] text-xs text-[var(--color-text-secondary)]">
              <Calendar size={13} className="text-[var(--color-accent)]" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent font-medium text-[var(--color-text-primary)] outline-none cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Year to Date">Year to Date</option>
              </select>
            </div>
          </div>
        }
      />

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {adminKPIs.map((kpi, idx) => (
          <AdminKPICard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            timeframe={kpi.timeframe}
            icon={kpiIcons[idx]}
          />
        ))}
      </div>

      {/* Revenue Chart & Fulfillment Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Order Status Breakdown Card */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
          <div>
            <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-1">
              Consignment Statuses
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-5">
              Active dispatch lifecycle breakdown across Pakistan
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Delivered (91%)</span>
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">584</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>In Transit / Dispatched (5%)</span>
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">32</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Pending &amp; Packing (3%)</span>
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">20</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '3%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Cancelled / Returned (1%)</span>
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">6</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '1%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--color-text-muted)]">Couriers: TCS, Leopards, Trax</span>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
            >
              <span>Manage Orders</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Best Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Watch */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-light)]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
                Low Stock &amp; Depletion Alerts
              </h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs uppercase font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-border-light)] text-xs">
            {lowStockItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--color-text-primary)]">{item.productName}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    SKU: {item.sku} • Category: {item.category}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.currentStock === 0
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {item.currentStock === 0 ? 'Out of Stock' : `${item.currentStock} Units Left`}
                  </span>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                    Threshold: {item.lowStockThreshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best-Selling Cosmetics */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-light)]">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              Top Performing Curations
            </h3>
            <Link
              href="/admin/products"
              className="text-xs uppercase font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
            >
              Catalog
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-border-light)] text-xs">
            {bestSellers.map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-12 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] overflow-hidden shrink-0">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--color-text-primary)] truncate block">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      {prod.brand} • {formatPKR(prod.regularPrice)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[var(--color-text-primary)]">
                    {prod.salesCount} sold
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {prod.stockQuantity} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 pb-4 border-b border-[var(--color-border-light)] flex items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
              Recent Boutique Orders
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Live customer transactions and dispatch statuses
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
          >
            <span>View All Orders ({adminOrders.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {adminOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-text-primary)]">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[var(--color-text-primary)]">{ord.customerName}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                    {ord.area}, {ord.city}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                    {ord.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize">
                      {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ord.orderStatus === 'shipped'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : ord.orderStatus === 'processing'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-stone-100 text-stone-800 border border-stone-200'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[var(--color-text-primary)]">
                    {formatPKR(ord.total)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="p-1.5 inline-flex rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                      aria-label="View order details"
                    >
                      <Eye size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
