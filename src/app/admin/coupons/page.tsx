'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { adminCoupons, AdminCoupon } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(adminCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minSpend: 3000,
    maxDiscount: 1500,
    usageLimit: 500,
    startDate: '2026-11-01',
    endDate: '2026-12-31',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: AdminCoupon = {
      id: `cpn-${Date.now()}`,
      code: formData.code.toUpperCase().trim(),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minSpend: formData.minSpend,
      maxDiscount: formData.discountType === 'percentage' ? formData.maxDiscount : undefined,
      usageCount: 0,
      usageLimit: formData.usageLimit,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
    };
    setCoupons([newCoupon, ...coupons]);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minSpend: 3000,
      maxDiscount: 1500,
      usageLimit: 500,
      startDate: '2026-11-01',
      endDate: '2026-12-31',
      isActive: true,
    });
    setIsFormOpen(false);
  };

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this promotional voucher rule?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promotional Vouchers &amp; Coupons"
        subtitle="Configure discount incentives, minimum basket spends and client promotional campaigns."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Coupons' }]}
        actions={
          !isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <Plus size={15} />
              <span>Create Coupon Code</span>
            </button>
          )
        }
      />

      {isFormOpen && (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-light)]">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              Create Promotional Voucher
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Voucher Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as 'percentage' | 'fixed',
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                >
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="fixed">Fixed Deduction (PKR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Discount Amount / Rate <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Minimum Cart Spend (PKR)
                </label>
                <input
                  type="number"
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Max Cap Limit (PKR)
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                  placeholder="Only applies to %"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Max Redemption Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Save Promotional Voucher
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--color-bg-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Max Cap</th>
                <th className="py-3 px-4 text-center">Usage Count</th>
                <th className="py-3 px-4">Validity Window</th>
                <th className="py-3 px-4 text-center">Active</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {coupons.map((cpn) => (
                <tr key={cpn.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-text-primary)]">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-dark)]">
                      {cpn.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {cpn.discountType === 'percentage'
                      ? `${cpn.discountValue}% OFF`
                      : `-${formatPKR(cpn.discountValue)}`}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                    {formatPKR(cpn.minSpend)}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)]">
                    {cpn.maxDiscount ? formatPKR(cpn.maxDiscount) : 'None'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {cpn.usageCount}
                    </span>{' '}
                    / {cpn.usageLimit}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)] font-mono text-[11px]">
                    {cpn.startDate} → {cpn.endDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(cpn.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        cpn.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cpn.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDelete(cpn.id)}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      aria-label={`Delete coupon ${cpn.code}`}
                    >
                      <Trash2 size={14} />
                    </button>
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
