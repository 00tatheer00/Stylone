'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container, SectionHeading } from '@/components/ui';
import type { CategoryItem } from '@/services/category-service';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export function CategoriesClient({
  categories,
}: {
  categories: CategoryItem[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cat-card',
        { y: 35, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
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
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our curated skincare, makeup and luxury care collections"
          align="center"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="cat-card group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#eaf6ec] to-[var(--color-bg-secondary)] border border-emerald-100/80 transition-all duration-300 hover:shadow-[var(--shadow-green-lg)] hover:border-emerald-400 hover:-translate-y-1"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-black/20 to-transparent group-hover:from-emerald-900/90 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                <h3 className="font-heading text-sm sm:text-base font-bold text-white leading-tight drop-shadow-xs">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-emerald-100/80 mt-1 hidden sm:block line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
