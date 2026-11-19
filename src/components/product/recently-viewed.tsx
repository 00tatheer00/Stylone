'use client';

import { useEffect, useState } from 'react';
import { Container, SectionHeading } from '@/components/ui';
import { ProductCard } from '@/components/shared/product-card';
import { products } from '@/data/products';
import type { Product } from '@/types/product';

interface RecentlyViewedProps {
  currentProductSlug: string;
}

export function RecentlyViewed({ currentProductSlug }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const STORAGE_KEY = 'stylone_recent_views';
      const stored = sessionStorage.getItem(STORAGE_KEY);
      let list: string[] = stored ? JSON.parse(stored) : [];

      // Remove current if exists, then prepend
      list = list.filter((slug) => slug !== currentProductSlug);
      list.unshift(currentProductSlug);
      // Keep top 6
      list = list.slice(0, 6);

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));

      // Resolve items for display (excluding current product)
      const displaySlugs = list.filter((slug) => slug !== currentProductSlug).slice(0, 4);
      const matched = displaySlugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is Product => Boolean(p));

      const t = setTimeout(() => {
        setRecentProducts(matched);
      }, 0);

      return () => clearTimeout(t);
    } catch {
      // Gracefully ignore session storage errors (e.g. private browsing restrictions)
    }
  }, [currentProductSlug]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]/30">
      <Container>
        <SectionHeading
          title="Recently Viewed"
          subtitle="Pick up where you left off"
          align="left"
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {recentProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
