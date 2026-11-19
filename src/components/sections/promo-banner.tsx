'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

function PromoBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.promo-inner',
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 md:py-20">
      <Container>
        <div className="promo-inner relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-bg-secondary)] to-[#d1fae5] min-h-[320px] sm:min-h-[380px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Text */}
            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3 flex items-center gap-1.5">
                <span>🌿 Clinical Herbal Regrowth</span>
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight">
                Stop Hair Fall.
                <br />
                Restore Real Density.
              </h2>
              <p className="mt-4 text-[var(--color-text-secondary)] max-w-sm leading-relaxed text-sm sm:text-base">
                Discover our best-selling Onion &amp; Biotin Shampoo paired with Rosemary Scalp Therapy Serum — formulated to strengthen follicles and curb shedding within 3 weeks.
              </p>
              <Link
                href="/category/haircare"
                className="group inline-flex items-center gap-2 mt-7 px-7 py-3.5 text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 hover:shadow-[var(--shadow-green)] transition-all duration-300 active:scale-[0.95]"
              >
                <span>Shop Anti-Hairfall Duo</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Image */}
            <div className="relative h-[280px] sm:h-[340px] lg:h-full lg:absolute lg:right-0 lg:top-0 lg:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1617897903246-719242758050?w=800&h=600&fit=crop&q=80"
                alt="Herbal Scalp Serum and Anti-Hairfall therapy collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { PromoBanner };
