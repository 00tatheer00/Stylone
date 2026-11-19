import type { Metadata } from 'next';
import { getPublishedProducts } from '@/services/product-service';
import { products as fallbackProducts } from '@/data/products';
import {
  JenpharmHero,
  JenpharmCategoryBanners,
  JenpharmProvenProducts,
  ClinicalTransformationSlider,
  BotanicalIngredientsShowcase,
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
      {/* 1. Super-Premium Hero with Faded Emerald Grid & Shimmer */}
      <JenpharmHero />

      {/* 2. 4 Botanical Green Category Navigation Cards */}
      <JenpharmCategoryBanners />

      {/* 3. Clinically Proven Formulations (Instant Filter Tabs & Hover Flip) */}
      <JenpharmProvenProducts products={allProducts} />

      {/* 4. Interactive Before & After 30-Day Clinical Transformation Slider */}
      <ClinicalTransformationSlider />

      {/* 5. Star Active Botanical Ingredients Spotlight */}
      <BotanicalIngredientsShowcase />

      {/* 6. Results You Can Trust (Real Customer Transformation Stories) */}
      <JenpharmResults />
    </div>
  );
}
