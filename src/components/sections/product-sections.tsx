import Link from 'next/link';
import { Container, SectionHeading } from '@/components/ui';
import { ProductCard } from '@/components/shared/product-card';
import {
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
} from '@/services/product-service';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductGridSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

function ProductGridSection({
  title,
  subtitle,
  products,
  viewAllHref = '/shop',
  viewAllLabel = 'View All',
}: ProductGridSectionProps) {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading title={title} subtitle={subtitle} className="mb-0" />
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            {viewAllLabel}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={i < 2}
            />
          ))}
        </div>

        {/* Mobile view-all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            {viewAllLabel}
            <ArrowRight size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

async function FeaturedProducts({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const products = initialProducts || (await getFeaturedProducts(4));
  return (
    <ProductGridSection
      title="Featured Products"
      subtitle="Hand-picked essentials for your beauty routine"
      products={products}
      viewAllLabel="View All Products"
    />
  );
}

async function BestSellers({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const products = initialProducts || (await getBestSellers(4));
  return (
    <ProductGridSection
      title="Best Sellers"
      subtitle="Most loved by our customers"
      products={products}
      viewAllLabel="Shop Best Sellers"
    />
  );
}

async function NewArrivals({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const products = initialProducts || (await getNewArrivals(4));
  return (
    <ProductGridSection
      title="New Arrivals"
      subtitle="Fresh additions to our collection"
      products={products}
      viewAllLabel="See What's New"
    />
  );
}

export { FeaturedProducts, BestSellers, NewArrivals, ProductGridSection };
