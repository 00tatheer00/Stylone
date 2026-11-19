import type { Metadata } from 'next';
import { getPublishedProducts } from '@/services/product-service';
import { products as fallbackProducts } from '@/data/products';
import {
  JenpharmHero,
  JenpharmCategoryBanners,
  JenpharmProvenProducts,
  JenpharmResults,
} from '@/components/sections';

export const metadata: Metadata = {
  title: 'STYLONE — Clinically Proven Botanical Haircare & Skincare',
  description:
    'Pakistan\'s leading botanical skincare and anti-hairfall solutions. Clinically formulated herbal shampoos, rosemary regrowth serums, and radiant skin elixirs.',
  openGraph: {
    title: 'STYLONE — Clinically Proven Botanical Haircare & Skincare',
    description:
      'Pakistan\'s leading botanical skincare and anti-hairfall solutions. Prescribed by dermatologists, loved nationwide.',
  },
};

export default async function HomePage() {
  let allProducts = await getPublishedProducts();
  if (!allProducts || allProducts.length === 0) {
    allProducts = fallbackProducts;
  }

  return (
    <div className="bg-white text-slate-900">
      {/* 1. Promotional Emerald Hero Banner with Free Gift & Trust Strip */}
      <JenpharmHero />

      {/* 2. 4 Botanical Green Category Cards */}
      <JenpharmCategoryBanners />

      {/* 3. Clinically Proven Formulations (Instant Filter Tabs & Add to Cart) */}
      <JenpharmProvenProducts products={allProducts} />

      {/* 4. Results You Can Trust (Real Customer Transformation Stories) */}
      <JenpharmResults />
    </div>
  );
}
