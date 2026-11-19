'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui';

interface CustomerReview {
  name: string;
  date: string;
  product: string;
  reviewEn: string;
  reviewUrdu?: string;
  badge: string;
}

const reviews: CustomerReview[] = [
  {
    name: 'Hannah R.',
    date: 'Verified Buyer',
    product: 'Rosemary Scalp Regrowth Elixir',
    reviewUrdu:
      'میں نے ابھی 3 ہفتے ہی استعمال کیا ہے اور بالوں کا گرنا تقریباً بالکل رک گیا ہے۔ اس کی خوشبو بہت پرسکون ہے اور سر میں کوئی چپچپاہٹ نہیں ہوتی۔ 100 فیصد تجویز کرتی ہوں!',
    reviewEn:
      'I have been using this for 3 weeks and hair shedding has visibly stopped. Scalp feels invigorated with no grease. 100% recommended for thinning hair!',
    badge: 'GREAT SERVICE & AUTHENTIC QUALITY',
  },
  {
    name: 'Dr. Sarah K.',
    date: 'Verified Buyer',
    product: 'Herbal Anti-Hairfall Biotin Shampoo',
    reviewEn:
      'As a dermatological professional in Lahore, finding a true sulfate-free herbal shampoo that genuinely foams well and strengthens hair roots without drying out the scalp was difficult. STYLONE nailed the formulation.',
    badge: 'CLINICALLY VERIFIED FORMULA',
  },
  {
    name: 'Fatima Z.',
    date: 'Verified Buyer',
    product: 'Hyaluronic Acid & Vitamin C Glow Duo',
    reviewEn:
      'Delivery was super fast within 2 days in Islamabad! The packaging was luxurious and the serum gives a non-sticky glass skin glow that lasts throughout the work day.',
    badge: 'RAPID NATIONWIDE DELIVERY',
  },
];

export function JenpharmVerifiedReviews() {
  return (
    <section className="py-12 sm:py-16 bg-[#fafafa] border-b border-slate-200">
      <Container>
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-8 space-y-1">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Verified Customer Reviews</span>
            <span>🌼</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Real feedback from Pakistani homes across all provinces
          </p>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Stars & Date */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-slate-400 font-medium">{rev.date}</span>
                </div>

                {/* Product Tag */}
                <p className="font-heading font-black text-sm text-emerald-800">
                  {rev.product}
                </p>

                {/* Review Urdu text if present */}
                {rev.reviewUrdu && (
                  <p
                    dir="rtl"
                    className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed font-serif bg-slate-50 p-3 rounded-2xl border border-slate-100"
                  >
                    &ldquo;{rev.reviewUrdu}&rdquo;
                  </p>
                )}

                {/* Review English */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{rev.reviewEn}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    {rev.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Verified Order
                  </span>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-tight bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {rev.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
