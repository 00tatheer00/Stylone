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
  const products = initialProducts || (await getFeaturedProducts(8));
  return (
    <ProductGridClient
      title="Featured Herbal Formulations"
      subtitle="Pure botanical shampoos, scalp tonics, and clinical face elixirs"
      products={products}
      viewAllHref="/shop"
      viewAllLabel="View All Products"
    />
  );
}

async function BestSellers({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const products = initialProducts || (await getBestSellers(8));
  return (
    <ProductGridClient
      title="Best Sellers"
      subtitle="Most loved hair & skincare essentials across Pakistan"
      products={products}
      viewAllHref="/shop"
      viewAllLabel="Explore All Best Sellers"
    />
  );
}

async function NewArrivals({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const products = initialProducts || (await getNewArrivals(8));
  return (
    <ProductGridClient
      title="New Arrivals"
      subtitle="Freshly crafted botanical drops for your daily ritual"
      products={products}
      viewAllHref="/shop"
      viewAllLabel="Discover All Products"
    />
  );
}

export { FeaturedProducts, BestSellers, NewArrivals };
