import type { Metadata } from 'next';
import { getPublishedProducts } from '@/services/product-service';
import { products as fallbackProducts } from '@/data/products';
import {
  JenpharmHero,
  JenpharmCategoryBanners,
  JenpharmProvenProducts,
  JenpharmTieredDeals,
  JenpharmResults,
  JenpharmMatchQuiz,
  JenpharmVerifiedReviews,
  JenpharmCelebFavourites,
  JenpharmFooter,
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
      {/* 1. Promotional Hero Banner (Jenpharm style with Free Enzyme/Serum offer & Trust strip) */}
      <JenpharmHero />

      {/* 2. Visual Category Banners (4 Iconic Colored Cards with models) */}
      <JenpharmCategoryBanners />

      {/* 3. Clinically Proven Results Filterable Products (Filter Tabs, Ratings & Solid Add to Cart) */}
      <JenpharmProvenProducts products={allProducts} />

      {/* 4. Tiered Savings Deal Box (10% Off 3+ items, Free Gift on 2,500 Rs., Free Shipping) */}
      <JenpharmTieredDeals />

      {/* 5. Results You Can Trust (Real Customer Transformation Stories with timeframe pills) */}
      <JenpharmResults />

      {/* 6. Find Your Perfect Match (Diagnostic Routine / Hair & Skin Analysis Box) */}
      <JenpharmMatchQuiz />

      {/* 7. Verified Customer Reviews (English & Urdu Community Proof) */}
      <JenpharmVerifiedReviews />

      {/* 8. Celeb / Community Favourites (Video Reels Showcase with bottom Add to Cart dock) */}
      <JenpharmCelebFavourites />
    </div>
  );
}
