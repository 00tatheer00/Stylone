'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { SavedAddress, AddressFormData } from '@/types/customer';
import { addressSchema } from '@/lib/validations/auth';
import { PAKISTAN_MAJOR_CITIES } from '@/lib/validations/checkout';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Home,
  Briefcase,
  Bookmark,
  Check,
} from 'lucide-react';

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    city: 'Karachi',
    area: '',
    addressLine1: '',
    landmark: '',
    label: 'Home',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Storage key for local client caching / offline fallback
  const storageKey = user ? `stylone_addresses_${user.id}` : null;

  // Load addresses from Supabase or local storage
  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: SavedAddress[] = data.map((row) => ({
            id: row.id,
            userId: row.user_id,
            fullName: row.full_name,
            phone: row.phone,
            city: row.city,
            area: row.area,
            addressLine1: row.address_line1,
            landmark: row.landmark || '',
            label: row.label,
            isDefault: row.is_default,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
          setAddresses(mapped);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback to local storage below
      }
    }

    // Local storage fallback for seamless testing
    if (storageKey) {
      try {
        const local = localStorage.getItem(storageKey);
        if (local) {
          setAddresses(JSON.parse(local));
        } else {
          setAddresses([]);
        }
      } catch {
        setAddresses([]);
      }
    }
    setIsLoading(false);
  }, [user, storageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAddresses();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAddresses]);

  // Sync to local storage
  const persistLocal = (newAddresses: SavedAddress[]) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newAddresses));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      city: 'Karachi',
      area: '',
      addressLine1: '',
      landmark: '',
      label: 'Home',
      isDefault: addresses.length === 0,
    });
    setErrors({});
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (addr: SavedAddress) => {
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      city: addr.city,
      area: addr.area,
      addressLine1: addr.addressLine1,
      landmark: addr.landmark || '',
      label: addr.label,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) {
      return;
    }

    if (isSupabaseConfigured() && user) {
      try {
        const supabase = createBrowserClient();
        await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
      } catch {
        // Fallback
      }
    }

    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    persistLocal(updated);
    setStatusMessage({ type: 'success', text: 'Address removed successfully.' });
  };

  const handleSetDefault = async (id: string) => {
    if (isSupabaseConfigured() && user) {
      try {
        const supabase = createBrowserClient();
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
        await supabase.from('addresses').update({ is_default: true }).eq('id', id).eq('user_id', user.id);
      } catch {
        // Fallback
      }
    }

    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    persistLocal(updated);
    setStatusMessage({ type: 'success', text: 'Default delivery address updated.' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const now = new Date().toISOString();
    const shouldBeDefault = formData.isDefault || addresses.length === 0;

    let updatedList: SavedAddress[];

    if (editingId) {
      // Update existing
      if (isSupabaseConfigured() && user) {
        try {
          const supabase = createBrowserClient();
          if (shouldBeDefault) {
            await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
          }
          await supabase
            .from('addresses')
            .update({
              full_name: formData.fullName.trim(),
              phone: formData.phone.trim(),
              city: formData.city.trim(),
              area: formData.area.trim(),
              address_line1: formData.addressLine1.trim(),
              landmark: formData.landmark?.trim() || '',
              label: formData.label,
              is_default: shouldBeDefault,
              updated_at: now,
            })
            .eq('id', editingId)
            .eq('user_id', user.id);
        } catch {
          // Ignored
        }
      }

      updatedList = addresses.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            ...formData,
            isDefault: shouldBeDefault,
            updatedAt: now,
          };
        }
        return shouldBeDefault ? { ...item, isDefault: false } : item;
      });
      setStatusMessage({ type: 'success', text: 'Address details updated successfully.' });
    } else {
      // Add new
      const newId = crypto.randomUUID();
      const newAddress: SavedAddress = {
        id: newId,
        userId: user?.id || 'demo-user',
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        area: formData.area.trim(),
        addressLine1: formData.addressLine1.trim(),
        landmark: formData.landmark?.trim() || '',
        label: formData.label,
        isDefault: shouldBeDefault,
        createdAt: now,
        updatedAt: now,
      };

      if (isSupabaseConfigured() && user) {
        try {
          const supabase = createBrowserClient();
          if (shouldBeDefault) {
            await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
          }
          await supabase.from('addresses').insert({
            id: newId,
            user_id: user.id,
            full_name: newAddress.fullName,
            phone: newAddress.phone,
            city: newAddress.city,
            area: newAddress.area,
            address_line1: newAddress.addressLine1,
            landmark: newAddress.landmark,
            label: newAddress.label,
            is_default: newAddress.isDefault,
          });
        } catch {
          // Ignored
        }
      }

      updatedList = shouldBeDefault
        ? [newAddress, ...addresses.map((a) => ({ ...a, isDefault: false }))]
        : [...addresses, newAddress];

      setStatusMessage({ type: 'success', text: 'New address added to your account.' });
    }

    setAddresses(updatedList);
    persistLocal(updatedList);
    setIsSubmitting(false);
    resetForm();
  };

  const getLabelIcon = (label: string) => {
    switch (label) {
      case 'Home':
        return <Home size={14} />;
      case 'Work':
        return <Briefcase size={14} />;
      default:
        return <Bookmark size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Manage your verified shipping locations for seamless Pakistan-wide delivery
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <Plus size={15} />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-[var(--radius-md)] text-xs flex items-start gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          )}
          <p className="leading-relaxed">{statusMessage.text}</p>
        </div>
      )}

      {/* Address Form (Add / Edit) */}
      {isFormOpen && (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border-light)]">
            <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
              {editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Recipient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Fatima Ali"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-[var(--color-border-light)]'
                  } outline-none focus:border-[var(--color-accent)]`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0300 1234567"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-[var(--color-border-light)]'
                  } outline-none focus:border-[var(--color-accent)]`}
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-white outline-none focus:border-[var(--color-accent)]"
                >
                  {PAKISTAN_MAJOR_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                  Area / Sector / Phase <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Clifton Block 4 or DHA Phase 5"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                    errors.area ? 'border-rose-400 bg-rose-50/30' : 'border-[var(--color-border-light)]'
                  } outline-none focus:border-[var(--color-accent)]`}
                />
                {errors.area && <p className="mt-1 text-xs text-rose-600">{errors.area}</p>}
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Complete Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="House / Apartment #, Street, Building name"
                className={`w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                  errors.addressLine1 ? 'border-rose-400 bg-rose-50/30' : 'border-[var(--color-border-light)]'
                } outline-none focus:border-[var(--color-accent)]`}
              />
              {errors.addressLine1 && <p className="mt-1 text-xs text-rose-600">{errors.addressLine1}</p>}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Near Shell Pump, Behind Main Market"
                className="w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            {/* Label Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5">
                Address Type
              </label>
              <div className="flex items-center gap-3">
                {(['Home', 'Work', 'Other'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: type })}
                    className={`flex items-center gap-2 py-2 px-4 rounded-[var(--radius-md)] text-xs font-medium border transition-colors ${
                      formData.label === type
                        ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-white'
                        : 'border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-border-dark)]'
                    }`}
                  >
                    {getLabelIcon(type)}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Default address checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-[var(--color-border-dark)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] accent-[var(--color-accent)]"
                />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Set as default delivery address for checkout
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="py-2.5 px-4 rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-[var(--color-text-primary)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-44 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] animate-pulse" />
          <div className="h-44 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] animate-pulse" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-10 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] flex items-center justify-center mb-4">
            <MapPin size={22} />
          </div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-1">
            No Addresses Saved
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto mb-6">
            You have not added any delivery addresses yet. Add your address to enjoy fast checkout.
          </p>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <Plus size={15} />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-[var(--radius-lg)] border p-5 shadow-xs flex flex-col justify-between transition-all ${
                addr.isDefault
                  ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20'
                  : 'border-[var(--color-border-light)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
                      {getLabelIcon(addr.label)}
                      <span>{addr.label}</span>
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                        <Check size={11} />
                        <span>Default</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(addr)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
                      aria-label="Edit address"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  <p className="font-heading text-sm font-bold text-[var(--color-text-primary)]">
                    {addr.fullName}
                  </p>
                  <p>{addr.addressLine1}</p>
                  <p>
                    {addr.area}, {addr.city}
                  </p>
                  {addr.landmark && (
                    <p className="text-[11px] text-[var(--color-text-muted)] italic">
                      Near: {addr.landmark}
                    </p>
                  )}
                  <p className="pt-1 text-[var(--color-text-primary)] font-medium">
                    Phone: {addr.phone}
                  </p>
                </div>
              </div>

              {!addr.isDefault && (
                <div className="mt-4 pt-3 border-t border-[var(--color-border-light)]">
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Set as default destination
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
