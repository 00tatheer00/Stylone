import {
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
} from '@/services/product-service';
import type { Product } from '@/types/product';
import { ProductGridClient, type ProductGridSectionProps } from './product-grid-client';

export function ProductGridSection(props: ProductGridSectionProps) {
  return <ProductGridClient {...props} />;
}

async function FeaturedProducts({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const products = initialProducts || (await getFeaturedProducts(4));
  return (
    <ProductGridClient
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
    <ProductGridClient
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
    <ProductGridClient
      title="New Arrivals"
      subtitle="Fresh additions to our collection"
      products={products}
      viewAllLabel="See What's New"
    />
  );
}

export { FeaturedProducts, BestSellers, NewArrivals };
