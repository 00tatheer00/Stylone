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
    <section ref={sectionRef} className="py-14 md:py-20">
      <Container>
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading title={title} subtitle={subtitle} className="mb-0" />
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 group"
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

        {/* Mobile view-all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
