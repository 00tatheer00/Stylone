'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import { adminReviews, AdminReview } from '@/data/admin-demo';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(adminReviews);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setFeedback(`Review marked as ${newStatus} (Demo Mode).`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this review permanently?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Feedback &amp; Review Moderation"
        subtitle="Curate client product testimonials, ratings and verify authenticity before storefront publishing."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Reviews' }]}
      />

      {feedback && (
        <div className="p-3.5 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{feedback}</p>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Product Formulation</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[var(--color-text-primary)] whitespace-nowrap">
                    {rev.customerName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
                    {rev.productName}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </td>
                  <td className="py-3.5 px-4 text-[var(--color-text-muted)] font-mono text-[11px] whitespace-nowrap">
                    {rev.date}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rev.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rev.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(rev.id, 'approved')}
                          className="p-1.5 rounded text-emerald-700 hover:bg-emerald-50"
                          title="Approve Review"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(rev.id, 'rejected')}
                          className="p-1.5 rounded text-amber-700 hover:bg-amber-50"
                          title="Reject Review"
                        >
                          <XCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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
