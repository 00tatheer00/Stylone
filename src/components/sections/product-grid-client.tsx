'use client';

import Link from 'next/link';
import { Container, SectionHeading } from '@/components/ui';
import { ProductCard } from '@/components/shared/product-card';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types/product';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export interface ProductGridSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function ProductGridClient({
  title,
  subtitle,
  products,
  viewAllHref = '/shop',
  viewAllLabel = 'View All',
}: ProductGridSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-item',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
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
    <section ref={sectionRef} className="py-12 md:py-16">
      <Container>
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading title={title} subtitle={subtitle} className="mb-0" />
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-xs sm:text-sm font-bold text-emerald-800 transition-all shrink-0 active:scale-95 group cursor-pointer"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product, i) => (
            <div key={product.id} className="product-item">
              <ProductCard
                product={product}
                priority={i < 2}
              />
            </div>
          ))}
        </div>

        {/* Prominent Bottom View All CTA */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-950 hover:bg-emerald-700 hover:border-emerald-700 hover:text-white font-bold text-sm sm:text-base shadow-xs hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-300 active:scale-95 group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
