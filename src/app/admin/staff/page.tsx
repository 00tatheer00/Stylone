'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { adminStaffMembers, AdminStaff } from '@/data/admin-demo';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<AdminStaff[]>(adminStaffMembers);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Inventory Manager' as AdminStaff['role'],
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: AdminStaff = {
      id: `staff-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'invited',
      lastActive: 'Invitation Pending',
    };
    setStaffList([...staffList, newStaff]);
    setFormData({ name: '', email: '', role: 'Inventory Manager' });
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Revoke access for this administrator?')) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Staff &amp; Role-Based Access Control (RBAC)"
        subtitle="Manage administrative permissions, warehouse team roles and customer service authorizations."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Staff' }]}
        actions={
          !isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <Plus size={15} />
              <span>Invite Team Member</span>
            </button>
          )
        }
      />

      {isFormOpen && (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-light)]">
            <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)]">
              Authorize New Administrative Account
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleInvite} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Asad Rehman"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Corporate Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@stylone.pk"
                  className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Access Privilege Tier
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as AdminStaff['role'] })
                }
                className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none"
              >
                <option value="Super Admin">Super Admin (Unrestricted System Control)</option>
                <option value="Inventory Manager">Inventory Manager (Stock, Batches &amp; Suppliers)</option>
                <option value="Order Dispatcher">Order Dispatcher (Packing, Couriers &amp; Tracking)</option>
                <option value="Customer Care">Customer Care (Support, Reviews &amp; Clients)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Send Invitation
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

      {/* Staff Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Corporate Email</th>
                <th className="py-3 px-4">Security Role</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[var(--color-text-primary)]">
                    {st.name}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)] font-mono text-[11px]">
                    {st.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800">
                      {st.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)]">{st.lastActive}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        st.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {st.role !== 'Super Admin' && (
                      <button
                        onClick={() => handleDelete(st.id)}
                        className="p-1.5 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Revoke access"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
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
