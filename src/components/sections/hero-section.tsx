'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, ShieldCheck, Droplet, Leaf, ShoppingBag, Check } from 'lucide-react';
import { Container } from '@/components/ui';
import { gsap } from '@/lib/gsap';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/data/products';

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();

  // Find star products for quick actions
  const shampooProduct = products.find((p) => p.id === 'herbal-anti-hairfall-biotin-shampoo') || products[0];
  const serumProduct = products.find((p) => p.id === 'rosemary-caffeine-scalp-growth-serum') || products[1];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-badge',
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 }
      )
        .fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          trustRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          '.hero-product-card',
          { y: 60, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.2 },
          '-=0.7'
        )
        .fromTo(
          '.hero-floating-pill',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40 border-b border-emerald-100/60 overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-green-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle organic watermark grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[620px] py-12 lg:py-16">
          {/* Left Column: Hero Typography & Actions */}
          <div className="lg:col-span-6 xl:col-span-6 relative z-10">
            {/* Eyebrow Badge */}
            <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-bold tracking-wide shadow-2xs mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>🌿 100% Herbal Botanicals &amp; Active Serums</span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headingRef}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-emerald-950 leading-[1.08]"
            >
              Pure Herbal Shampoos
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                &amp; Active Glow Serums
              </span>
            </h1>

            {/* Subtitle */}
            <div ref={subtitleRef}>
              <p className="mt-5 text-base sm:text-lg text-emerald-900/80 leading-relaxed max-w-xl font-normal">
                Transform your hair and skin with Pakistan&apos;s clean botanical science. Handcrafted with cold-pressed rosemary oils, biotin root stimulants, and pure vitamins. 
                <strong className="text-emerald-950 font-semibold"> Zero sulfates, zero parabens, 100% visible results.</strong>
              </p>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link
                href="/category/haircare"
                className="group relative inline-flex items-center gap-2.5 px-7 py-4 text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-800 hover:to-green-700 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 active:scale-[0.96] cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">Shop Herbal Shampoos</span>
                <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/category/skincare"
                className="inline-flex items-center gap-2 px-7 py-4 text-sm sm:text-base font-bold border-2 border-emerald-300 text-emerald-950 bg-white/90 backdrop-blur-xs rounded-2xl hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-md transition-all duration-300 active:scale-[0.96] cursor-pointer"
              >
                <Sparkles size={18} className="text-emerald-600" />
                <span>Explore Glow Serums</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div
              ref={trustRef}
              className="mt-10 pt-6 border-t border-emerald-200/60 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Leaf size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950 leading-tight">100% Herbal</p>
                  <p className="text-[10px] text-emerald-800/70">No Sulfates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Droplet size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950 leading-tight">14-Day Efficacy</p>
                  <p className="text-[10px] text-emerald-800/70">Proven Results</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950 leading-tight">COD Available</p>
                  <p className="text-[10px] text-emerald-800/70">Across Pakistan</p>
                </div>
              </div>
            </div>

            {/* Social Proof Strip */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  SA
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-green-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  FK
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  ZN
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-900 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  +25k
                </div>
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                  <span className="font-bold text-emerald-950 ml-1">4.9/5</span>
                </div>
                <p className="text-emerald-800/70 text-[11px]">Trusted by 25,000+ Pakistani beauty lovers</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dual Product Showcase */}
          <div
            ref={cardsContainerRef}
            className="lg:col-span-6 xl:col-span-6 relative flex flex-col sm:flex-row gap-5 lg:gap-6 justify-center items-center py-6"
          >
            {/* Card 1: Star Shampoo */}
            <div className="hero-product-card animate-float-slow w-full sm:w-[270px] bg-white rounded-3xl p-4 shadow-xl shadow-emerald-900/10 border border-emerald-100 hover:border-emerald-300 transition-all duration-300 group">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-emerald-50/50 mb-3.5">
                <Image
                  src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=1000&fit=crop&q=80"
                  alt="Herbal Anti-Hairfall Biotin Growth Shampoo"
                  fill
                  sizes="(max-width: 640px) 100vw, 270px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-xs">
                  ★ Star Shampoo
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-xs text-emerald-900 shadow-xs">
                  Sulfate-Free
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700">Anti-Hairfall Ritual</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                    <Star size={11} fill="currentColor" /> 4.9 (420)
                  </span>
                </div>
                <Link
                  href="/product/herbal-anti-hairfall-biotin-shampoo"
                  className="block font-heading text-sm font-bold text-emerald-950 hover:text-emerald-700 line-clamp-1 transition-colors"
                >
                  Herbal Biotin Growth Shampoo
                </Link>
                <p className="text-[11px] text-emerald-900/60 line-clamp-1">
                  Saw Palmetto + Biotin + Shikakai
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-950 text-base">PKR 1,850</span>
                    <span className="text-xs text-slate-400 line-through ml-1.5">PKR 2,400</span>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: shampooProduct.id,
                        name: shampooProduct.name,
                        price: shampooProduct.price,
                        image: shampooProduct.image,
                        quantity: 1,
                        slug: shampooProduct.slug,
                        variantName: shampooProduct.variants?.[0]?.name,
                      });
                    }}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 shadow-xs active:scale-95 cursor-pointer"
                    aria-label="Add Herbal Shampoo to Bag"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Star Serum */}
            <div className="hero-product-card animate-float-delayed w-full sm:w-[270px] bg-white rounded-3xl p-4 shadow-xl shadow-emerald-900/10 border border-emerald-100 hover:border-emerald-300 transition-all duration-300 group sm:translate-y-8">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-emerald-50/50 mb-3.5">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop&q=80"
                  alt="Rosemary Scalp Regrowth & Glow Active Serum"
                  fill
                  sizes="(max-width: 640px) 100vw, 270px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-600 text-white shadow-xs">
                  ✨ Active Serum
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-xs text-emerald-900 shadow-xs">
                  Rosemary + 2% Caffeine
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700">Scalp Regrowth Elixir</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                    <Star size={11} fill="currentColor" /> 5.0 (580)
                  </span>
                </div>
                <Link
                  href="/product/rosemary-caffeine-scalp-growth-serum"
                  className="block font-heading text-sm font-bold text-emerald-950 hover:text-emerald-700 line-clamp-1 transition-colors"
                >
                  Rosemary Scalp Regrowth Serum
                </Link>
                <p className="text-[11px] text-emerald-900/60 line-clamp-1">
                  Pure Rosemary Essential Actives
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-950 text-base">PKR 2,650</span>
                    <span className="text-xs text-slate-400 line-through ml-1.5">PKR 3,300</span>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: serumProduct.id,
                        name: serumProduct.name,
                        price: serumProduct.price,
                        image: serumProduct.image,
                        quantity: 1,
                        slug: serumProduct.slug,
                        variantName: serumProduct.variants?.[0]?.name,
                      });
                    }}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 shadow-xs active:scale-95 cursor-pointer"
                    aria-label="Add Rosemary Serum to Bag"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Central Floating Guarantee Pill */}
            <div className="hero-floating-pill absolute -bottom-3 sm:bottom-2 z-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 shadow-lg shadow-emerald-900/10 flex items-center gap-2 whitespace-nowrap">
              <Check size={14} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-950">
                100% Organic &amp; Halal Certified
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { HeroSection };
