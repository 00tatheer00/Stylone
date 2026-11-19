'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { CheckCircle2, Save } from 'lucide-react';

export default function AdminContentPage() {
  const [content, setContent] = useState({
    announcementText: 'Complimentary Nationwide Shipping on Orders Above Rs. 3,000 across Pakistan.',
    heroTitle: 'HAUTE PARFUMERIE & BEAUTÉ',
    heroSubtitle: 'Pakistan’s premier destination for curated skincare, makeup, haircare and artisanal beauty accessories.',
    ctaText: 'Discover Collection',
    promoNotice: 'Use code WELCOME10 for 10% off your initial acquisition.',
  });

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Storefront content and announcement bar updated (Demo State).');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Storefront Content &amp; Editorial Banners"
        subtitle="Manage announcement ticker text, homepage hero headlines and seasonal promotional banners."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Content' }]}
      />

      {savedMsg && (
        <div className="p-4 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{savedMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Announcement Bar */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
            Top Announcement Bar
          </h3>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
              Promotional Banner Copy
            </label>
            <input
              type="text"
              value={content.announcementText}
              onChange={(e) => setContent({ ...content, announcementText: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none focus:border-[var(--color-accent)]"
            />
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Displayed prominently at the very top of all customer boutique storefront pages.
            </p>
          </div>
        </div>

        {/* Homepage Hero Editorial */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-light)] pb-2">
            Homepage Hero Editorial
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
              Headline Title
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs font-heading font-bold rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
              Editorial Subtitle
            </label>
            <textarea
              rows={2}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
              Primary Button Text
            </label>
            <input
              type="text"
              value={content.ctaText}
              onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[var(--radius-md)] border border-[var(--color-border-light)] outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          <Save size={14} />
          <span>Save Storefront Content</span>
        </button>
      </form>
    </div>
  );
}
