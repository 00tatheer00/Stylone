'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-tag',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          headingRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.3',
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4',
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3',
        )
        .fromTo(
          imageRef.current,
          { x: 60, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 1 },
          '-=0.8',
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-br from-[var(--color-bg-secondary)] via-[var(--color-bg-primary)] to-[#d1fae5] overflow-hidden"
    >
      {/* Decorative green glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[var(--color-accent)]/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-center min-h-[480px] sm:min-h-[520px] lg:min-h-[600px] py-10 lg:py-0">
          {/* Text */}
          <div className="relative z-10 max-w-lg">
            <p className="hero-tag text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4 flex items-center gap-1.5">
              <span>🌿 Pure Botanicals & Clinical Actives</span>
            </p>
            <h1
              ref={headingRef}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-[1.1]"
            >
              Herbal Shampoos &amp;
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Glow Serums</span>
            </h1>
            <div ref={subtitleRef}>
              <p className="mt-5 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                Experience Pakistan&apos;s finest anti-hairfall herbal shampoo rituals, rosemary scalp regrowth tonics, and clinical face radiance serums.
              </p>
            </div>
            <div ref={ctaRef} className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link
                href="/category/haircare"
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white rounded-xl hover:from-emerald-700 hover:to-green-800 hover:shadow-[var(--shadow-green)] transition-all duration-300 active:scale-[0.95]"
              >
                <span>Shop Herbal Shampoos</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/category/skincare"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold border border-emerald-300 text-emerald-950 bg-white/80 backdrop-blur-xs rounded-xl hover:bg-white hover:border-emerald-600 transition-all duration-300 active:scale-[0.95] shadow-2xs"
              >
                Explore Serums
              </Link>
            </div>
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className="relative h-[320px] sm:h-[400px] lg:h-[560px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[52%]"
          >
            <Image
              src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=900&h=1100&fit=crop&q=85"
              alt="STYLONE Botanical Shampoos and Herbal Serums collection"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover rounded-2xl lg:rounded-l-3xl lg:rounded-r-none shadow-xl"
              priority
            />
            {/* Green tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent rounded-2xl lg:rounded-l-3xl lg:rounded-r-none pointer-events-none" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export { HeroSection };
