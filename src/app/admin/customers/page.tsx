'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminCustomers, AdminCustomer } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { Search, Eye, Shield } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers] = useState<AdminCustomer[]>(adminCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm) ||
      cust.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = cityFilter === 'All' || cust.city === cityFilter;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Directory &amp; Client Relations"
        subtitle="Review client profiles, order history, lifetime spend and contact details across Pakistan."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Customers' }]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, phone number or city..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Faisalabad">Faisalabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-text-muted)] flex items-center justify-between pt-1">
          <span>Showing {filteredCustomers.length} of {customers.length} registered clients</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <Shield size={12} />
            <span>Customer PII Protected</span>
          </span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Information</th>
                <th className="py-3 px-4">Primary City</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[var(--color-text-primary)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-[var(--color-accent)] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <span>{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                    <p>{cust.email}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{cust.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                    {cust.city}, Pakistan
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)] font-mono text-[11px]">
                    {cust.registeredDate}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[var(--color-text-primary)]">
                    {cust.totalOrders}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[var(--color-text-primary)]">
                    {formatPKR(cust.totalSpend)}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)] font-mono text-[11px]">
                    {cust.lastOrderDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/admin/customers/${cust.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--color-bg-secondary)] hover:bg-[var(--color-text-primary)] hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Eye size={13} />
                      <span>Details</span>
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
