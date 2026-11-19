'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/validations/auth';
import { User, Mail, Phone, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { profile, user, updateProfile } = useAuth();

  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    fullName: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile || user) {
        setFormData({
          fullName: profile?.fullName || user?.user_metadata?.full_name || '',
          phone: profile?.phone || user?.user_metadata?.phone || '',
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = profileUpdateSchema.safeParse(formData);
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

    const response = await updateProfile({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
    });

    setIsSubmitting(false);

    if (response.success) {
      setSuccessMessage('Your profile information has been successfully updated.');
    } else {
      setErrorMessage(response.error || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Personal Information
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Update your contact details and account preferences
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-xl">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <User size={16} />
            </span>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="e.g. Fatima Ali"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                errors.fullName
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-[var(--color-border-light)] bg-white focus:border-[var(--color-accent)]'
              } text-[var(--color-text-primary)] outline-none transition-colors`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email (Read-Only per security guidelines) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]"
            >
              Email Address
            </label>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Primary identification
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Mail size={16} />
            </span>
            <input
              id="email"
              type="email"
              disabled
              value={profile?.email || user?.email || ''}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-muted)] cursor-not-allowed outline-none"
            />
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            To change your registered email, please reach out to STYLONE Concierge.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1.5"
          >
            Pakistan Mobile Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Phone size={16} />
            </span>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              placeholder="0300 1234567"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-[var(--radius-md)] border ${
                errors.phone
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-[var(--color-border-light)] bg-white focus:border-[var(--color-accent)]'
              } text-[var(--color-text-primary)] outline-none transition-colors`}
            />
          </div>
          {errors.phone ? (
            <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
          ) : (
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Used for courier dispatch notifications and order updates via SMS.
            </p>
          )}
        </div>

        {/* Security / Role Info (Customer role is fixed and cannot be changed client-side) */}
        <div className="pt-2">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] flex items-start gap-3">
            <Shield size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
              <p className="font-semibold text-[var(--color-text-primary)]">
                Account Privilege Tier: Standard Client
              </p>
              <p>
                In compliance with STYLONE RBAC security, role elevation is strictly managed through server-side administrative controls and cannot be modified by client input.
              </p>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 px-6 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
