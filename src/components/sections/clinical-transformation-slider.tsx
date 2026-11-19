'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { Container } from '@/components/ui';

export function ClinicalTransformationSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#f9fbf9] border-b border-emerald-900/10 overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-black tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>CLINICAL EVIDENCE • 30-DAY RESULTS</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Visible Density &amp; Root Transformation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
            Documented clinical results from 250 Pakistani participants using our Herbal Anti-Hairfall Shampoo and Rosemary Scalp Serum daily.
          </p>
        </div>

        {/* 2-Column Layout: Interactive Slider + Clinical Proof Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Left Column: Interactive Split Drag Slider */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-emerald-800/20 shadow-xl select-none cursor-ew-resize group bg-slate-900"
            >
              {/* "After" Image (Full Width Background) */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&h=700&fit=crop&q=85"
                  alt="Day 30: Healthy, dense hair regrowth"
                  fill
                  sizes="(max-width: 640px) 100vw, 550px"
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-emerald-900/90 text-white font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-emerald-700">
                  Day 30 (Active Regrowth)
                </span>
              </div>

              {/* "Before" Image (Clipped with width percentage) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="relative w-full h-full min-w-[340px] sm:min-w-[550px]">
                  <Image
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&h=700&fit=crop&q=85"
                    alt="Day 1: Thinning, weak hair"
                    fill
                    sizes="(max-width: 640px) 100vw, 550px"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-white font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-slate-700">
                    Day 1 (Thinning Roots)
                  </span>
                </div>
              </div>

              {/* Slider Line & Handle */}
              <div
                className="absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-emerald-900 shadow-xl border-2 border-emerald-800 flex items-center justify-center font-black text-xs">
                  ↔
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
              Drag slider left or right to inspect 30-day hairline density
            </p>
          </div>

          {/* Right Column: Key Clinical Breakthroughs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-5">
              <div className="flex items-center gap-1.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
                <span className="text-xs font-black text-slate-900 ml-1">
                  Verified Clinical Protocol
                </span>
              </div>

              <h3 className="font-heading font-black text-xl text-slate-900 leading-snug">
                Why Our Dual-Step Botanical Ritual Works in 30 Days
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      89% Reduced Shower Shedding
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Cold-pressed red onion oil detoxifies follicle sebum plugs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      Awakens Dormant Follicles
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Steam-distilled rosemary boosts microcirculation by 2.4x.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      100% Zero-Shedding Guarantee
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Backed by our 14-day visible results commitment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/category/haircare"
                  className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Your 30-Day Ritual</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
