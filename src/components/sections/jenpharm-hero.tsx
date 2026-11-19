'use client';

import Link from 'next/link';
import {
  Star,
  ArrowRight,
  ShieldCheck,
  Droplet,
  Leaf,
  Sparkles,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '@/components/ui';

export function JenpharmHero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#f3f8f5] via-[#f9fcf9] to-white border-b border-emerald-900/10 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. FADED EMERALD GRID PATTERN WITH RADIAL MASK
          ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(4, 120, 87, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(4, 120, 87, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 80%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. LUMINOUS SHIMMER BEAM EFFECT ACROSS THE GRID
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated diagonal shimmer sweep */}
        <div
          className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] pointer-events-none animate-[shimmerSweep_9s_ease-in-out_infinite]"
          style={{
            background:
              'linear-gradient(115deg, transparent 38%, rgba(16, 185, 129, 0.08) 46%, rgba(52, 211, 153, 0.22) 50%, rgba(16, 185, 129, 0.08) 54%, transparent 62%)',
          }}
        />

        {/* Ambient Pulsing Emerald Glow Orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-r from-emerald-200/30 via-emerald-300/20 to-teal-100/30 rounded-full blur-[110px] pointer-events-none animate-[pulseGlow_6s_ease-in-out_infinite]" />
      </div>

      {/* Local keyframes for the shimmer animation */}
      <style jsx>{`
        @keyframes shimmerSweep {
          0% {
            transform: translate(-30%, -30%);
            opacity: 0.2;
          }
          50% {
            transform: translate(15%, 15%);
            opacity: 0.85;
          }
          100% {
            transform: translate(-30%, -30%);
            opacity: 0.2;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.45;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────
          3. FULL-WIDTH SUPER PREMIUM HERO CONTENT
          ───────────────────────────────────────────────────────────── */}
      <Container>
        <div className="relative z-10 pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 text-center max-w-4xl mx-auto">
          {/* Eyebrow Clinical Credential */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-black tracking-wider uppercase shadow-xs mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>CLINICALLY FORMULATED • 100% HALAL BOTANICAL SCIENCE</span>
          </div>

          {/* Majestic Power Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
            Targeted Botanical Care For Hairfall With
            <span className="block mt-2 sm:mt-3 text-emerald-800">
              Pure Herbal Shampoos &amp; Active Serums
            </span>
          </h1>

          {/* Subtitle / Clinical Reassurance */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed pt-5 sm:pt-6">
            Prescribed by Pakistan&apos;s leading dermatologists. Powered by cold-pressed red onion oil, therapeutic rosemary extract, and active biotin peptides to halt hairfall and stimulate dense, resilient roots in 14 days.
          </p>

          {/* Social Proof Star Pill */}
          <div className="flex items-center justify-center gap-2 pt-4 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900">4.9 / 5</span>
            <span className="text-xs text-slate-500 font-semibold">
              from 50,000+ happy customers across Pakistan
            </span>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. PRIMARY ACTION BUTTONS
              ───────────────────────────────────────────────────────────── */}
          <div className="pt-8 sm:pt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
            {/* Button 1: Explore Herbal Shampoos (100% Pure White Text) */}
            <Link
              href="/category/haircare"
              className="h-12 sm:h-13 px-7 sm:px-8 rounded-full bg-[#064e3b] hover:bg-[#047857] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-950/20 transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer select-none border border-emerald-700"
            >
              <span>Explore Herbal Shampoos</span>
              <ArrowRight size={17} className="text-white shrink-0" />
            </Link>

            {/* Button 2: Explore Active Serums */}
            <Link
              href="/category/skincare"
              className="h-12 sm:h-13 px-7 sm:px-8 rounded-full bg-white hover:bg-emerald-50 text-[#064e3b] border-2 border-[#064e3b] font-extrabold text-sm sm:text-base shadow-sm transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer select-none"
            >
              <span>Explore Active Serums</span>
              <ArrowRight size={17} className="text-[#064e3b] shrink-0" />
            </Link>

            {/* Button 3: View All Products */}
            <Link
              href="/shop"
              className="h-12 sm:h-13 px-6 sm:px-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-sm transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer select-none"
            >
              <span>View All Products</span>
              <ArrowRight size={15} className="text-emerald-700 shrink-0" />
            </Link>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. SUPER PREMIUM CLINICAL EFFICACY METRICS (REPLACES CARDS)
              ───────────────────────────────────────────────────────────── */}
          <div className="mt-12 sm:mt-16 pt-10 border-t border-emerald-900/10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-1">
              <p className="font-heading font-black text-3xl sm:text-4xl text-emerald-800">
                94%
              </p>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Reduction in Hair Fall
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Visible density in 14 days
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-heading font-black text-3xl sm:text-4xl text-emerald-800">
                100%
              </p>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Sulfate &amp; Paraben Free
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Zero harsh synthetic chemicals
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-heading font-black text-3xl sm:text-4xl text-emerald-800">
                2.4x
              </p>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Active Root Regrowth
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Cold-pressed rosemary &amp; caffeine
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-heading font-black text-3xl sm:text-4xl text-emerald-800">
                50K+
              </p>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Verified Customer Orders
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Delivered across all Pakistan
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* ─────────────────────────────────────────────────────────────
          6. NATIONWIDE ASSURANCE STRIP
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white/95 backdrop-blur-xs border-t border-slate-200/80 py-3.5 text-xs font-bold text-slate-700">
        <Container>
          <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-12">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Free Express Delivery on Rs. 2,500+</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Cash on Delivery (COD) Across Pakistan</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>100% Halal Botanical Actives • Zero Sulfates</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
