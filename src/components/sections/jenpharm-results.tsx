'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Container } from '@/components/ui';

interface TransformationStory {
  name: string;
  duration: string;
  quote: string;
  product: string;
}

const stories: TransformationStory[] = [
  {
    name: 'Huma K.',
    duration: '6 weeks',
    product: 'Herbal Anti-Hairfall Shampoo & Rosemary Serum',
    quote:
      'Herbal Anti-Hairfall Shampoo paired with the Rosemary Serum helped stop my excessive postpartum hair shedding within 3 weeks. New baby hair are visibly sprouting at my temples, and my roots feel twice as strong!',
  },
  {
    name: 'Zoha M.',
    duration: '4 weeks',
    product: 'Rosemary & Caffeine Scalp Regrowth Elixir',
    quote:
      'Rosemary Scalp Elixir keeps my scalp invigorated all day without any greasiness. Thinning patches around my parting have filled in significantly. Absolutely obsessed with this formula!',
  },
  {
    name: 'Ayesha T.',
    duration: '8 weeks',
    product: 'Hyaluronic Acid & Vitamin C Glow Duo',
    quote:
      'My skin was super dehydrated and dull from Karachi weather. This serum duo restored deep moisture, smoothed my fine texture, and gave me an effortless everyday radiance with zero filters.',
  },
];

export function JenpharmResults() {
  return (
    <section className="py-12 sm:py-16 bg-[#f0f9ff]/70 border-b border-sky-100">
      <Container>
        {/* Header (Exact Jenpharm copy) */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Results You Can Trust</span>
            <span className="text-sky-600">💙</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Real Hair &amp; Skin. Real Results. Zero Filters.
          </p>
        </div>

        {/* Swipeable Testimonial Cards */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible">
          {stories.map((story) => (
            <div
              key={story.name}
              className="w-[280px] sm:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-sky-100 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-base text-slate-900">
                    {story.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1b4b8a] text-white">
                    {story.duration}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-sky-700 truncate">
                Verified: {story.product}
              </div>
            </div>
          ))}
        </div>

        {/* Read All Reviews Button */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Read All Reviews
          </Link>
        </div>
      </Container>
    </section>
  );
}
