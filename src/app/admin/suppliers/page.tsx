'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import { adminSuppliers, AdminSupplier } from '@/data/admin-demo';
import { createSupplierAction } from '@/actions/suppliers';
import { Plus, Eye, ShieldCheck } from 'lucide-react';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>(adminSuppliers);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'Lahore',
    categoriesSupplied: ['Skincare'],
    notes: 'Certified supplier with physical batch testing compliance.',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      city: 'Lahore',
      categoriesSupplied: ['Skincare'],
      notes: '',
    });
    setIsFormOpen(false);
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSup: AdminSupplier = {
      id: `sup-${Date.now()}`,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      categoriesSupplied: formData.categoriesSupplied,
      totalBatchesReceived: 1,
      inspectionPassRate: 100.0,
      status: 'active',
      notes: formData.notes,
    };
    setSuppliers([...suppliers, newSup]);

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('contactPerson', formData.contactPerson);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('city', formData.city);
      fd.append('notes', formData.notes);
      await createSupplierAction(fd);
    } catch {
      // Optimistic update
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Procurement &amp; Supplier Directory"
        subtitle="Manage approved beauty laboratories, direct importers and physical batch receiving records."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Suppliers' }]}
        actions={
          !isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <Plus size={15} />
              <span>Register New Supplier</span>
            </button>
          )
        }
      />

      {/* Mandatory Quality Standard Callout */}
      <div className="p-4 rounded-[var(--radius-lg)] bg-stone-900 text-white text-xs flex items-start gap-3 shadow-sm">
        <ShieldCheck size={20} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white tracking-wide">
            STYLONE Central Quality Control Protocol:
          </p>
          <p className="text-stone-300 leading-relaxed">
            All supplier consignments must be physically received, unboxed, batch-inspected and stored in the STYLONE distribution hub before catalogue availability. Supplier-direct shipping to end customers is strictly prohibited.
          </p>
        </div>
      </div>

      {/* Add Supplier Form Modal / Inline */}
      {isFormOpen && (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-light)]">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              Register Authorized Beauty Supplier
            </h3>
            <button
              onClick={resetForm}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddSupplier} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Supplier / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. DermaCos Pak Ltd"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Primary Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Mr. Tariq Mehmood"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="procurement@supplier.pk"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="042-35891200"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Operational City
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Faisalabad">Faisalabad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Quality &amp; Procurement Terms Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Inspection agreements, return terms for damaged goods..."
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Save Supplier
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--color-bg-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Supplier Organization</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4 text-center">Batches Received</th>
                <th className="py-3 px-4 text-center">QC Pass Rate</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[var(--color-text-primary)]">
                    <p>{sup.name}</p>
                    <p className="text-[11px] font-normal text-[var(--color-text-muted)]">{sup.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[var(--color-text-primary)]">{sup.contactPerson}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{sup.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                    {sup.city}, Pakistan
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {sup.categoriesSupplied.map((cat) => (
                        <span key={cat} className="px-1.5 py-0.5 rounded text-[10px] bg-stone-100 text-stone-700">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[var(--color-text-primary)]">
                    {sup.totalBatchesReceived} consignments
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-emerald-700">{sup.inspectionPassRate}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sup.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/admin/suppliers/${sup.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--color-bg-secondary)] hover:bg-[var(--color-text-primary)] hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Eye size={13} />
                      <span>Ledger</span>
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
