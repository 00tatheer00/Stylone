'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Droplet, Leaf, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui';

export function JenpharmHero() {
  return (
    <section className="relative bg-gradient-to-b from-[#f6faf7] via-white to-[#f6faf7] border-b border-slate-200/80 overflow-hidden">
      {/* Subtle organic background blur orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-green-100/30 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center py-12 lg:py-20">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>CLINICALLY PROVEN BOTANICAL SCIENCE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Pure Herbal Shampoos
              <span className="block mt-1 sm:mt-2 text-emerald-800">
                &amp; Scalp Regrowth Serums
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Formulated with therapeutic cold-pressed rosemary oil, biotin root stimulants, and active peptides. Proven to arrest hairfall and stimulate dense, healthy growth —{' '}
              <strong className="text-slate-900 font-bold">100% sulfate-free, 100% visible results.</strong>
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-900/15 transition-all duration-200 active:scale-95 group cursor-pointer"
              >
                <span>Shop Star Formulations</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/category/haircare"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-700 text-slate-800 hover:text-emerald-900 font-bold text-sm sm:text-base transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
              >
                Explore Herbal Shampoos
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <Leaf size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">100% Herbal</p>
                  <p className="text-[10px] text-slate-500">Zero Sulfates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <Droplet size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">14-Day Efficacy</p>
                  <p className="text-[10px] text-slate-500">Root Regrowth</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">COD Available</p>
                  <p className="text-[10px] text-slate-500">Across Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Product Staging Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white group">
              <Image
                src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=900&h=1100&fit=crop&q=85"
                alt="STYLONE Herbal Botanical Formulations"
                fill
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />

              {/* Floating Glassmorphism Badge */}
              <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                    <span className="text-xs font-extrabold text-slate-900 ml-1">4.9 / 5</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    Best Seller
                  </span>
                </div>
                <p className="font-heading font-black text-sm text-slate-900 mt-1">
                  Herbal Anti-Hairfall &amp; Rosemary Duo
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Trusted by 25,000+ Pakistani women &amp; men
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Nationwide Assurance Strip */}
      <div className="bg-white border-t border-slate-200/70 py-3 text-xs font-bold text-slate-700">
        <Container>
          <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-12">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Free Express Shipping on Rs. 2,500+</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Cash on Delivery Across Pakistan</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
