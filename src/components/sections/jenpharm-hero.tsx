'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { Container } from '@/components/ui';

export function JenpharmHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Main Promotional Cyan/Blue/Green Gradient Banner */}
      <div className="relative bg-gradient-to-br from-[#38bdf8] via-[#0284c7] to-[#047857] text-white py-10 sm:py-14 md:py-16">
        {/* Ambient glow circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & Offer */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-extrabold uppercase tracking-widest shadow-xs">
                <Sparkles size={14} className="text-amber-300" />
                <span>Special Promotion</span>
              </div>

              <div className="space-y-1">
                <div className="inline-block px-4 py-1 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xl sm:text-2xl tracking-tight shadow-md uppercase mb-2">
                  FREE
                </div>
                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-sm text-white">
                  Enzyme Scalp Cleanser &amp; Growth Serum
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-sky-100 tracking-wide">
                  with every order above PKR 2,500!
                </p>
              </div>

              <p className="text-sm sm:text-base text-white/90 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                Experience Pakistan&apos;s leading clinical botanical formulas. Handcrafted with cold-pressed rosemary, biotin, and pure vitamins. Zero sulfates, 100% visible results.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-sky-50 font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group cursor-pointer"
                >
                  <span>Claim Free Gift &amp; Shop</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-emerald-600" />
                </Link>
                <Link
                  href="/category/haircare"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 font-bold text-sm sm:text-base transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Explore Shampoos
                </Link>
              </div>
            </div>

            {/* Right Bottle Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-[240px] sm:w-[280px] h-[320px] sm:h-[370px] drop-shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=1000&fit=crop&q=85"
                  alt="Free Enzyme Cleanser & Scalp Therapy Bottle"
                  fill
                  sizes="(max-width: 640px) 240px, 280px"
                  className="object-cover rounded-3xl border-4 border-white/30 shadow-2xl"
                  priority
                />
                {/* Floating "FREE" badge like Jenpharm */}
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-xl border-2 border-white animate-bounce">
                  FREE
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Trust Badges Strip (Matches Jenpharm directly below hero) */}
      <div className="bg-white border-b border-slate-200/80 py-3 shadow-2xs">
        <Container>
          <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-12 text-xs sm:text-sm font-bold text-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-extrabold text-base">🩺</span>
              <span className="leading-tight">Prescribed By Dermatologists</span>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-extrabold text-base">⭐</span>
              <span className="leading-tight">1000s Of Success Stories</span>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <span className="text-emerald-600 font-extrabold text-base">🌿</span>
              <span className="leading-tight">100% Halal &amp; Cruelty Free</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
