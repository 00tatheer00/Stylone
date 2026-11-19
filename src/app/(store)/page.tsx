import type { Metadata } from 'next';
import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
  BestSellers,
  NewArrivals,
  PromoBanner,
  WhyStylone,
  Testimonials,
  Newsletter,
  SocialGallery,
} from '@/components/sections';
import { Separator } from '@/components/ui';

export const metadata: Metadata = {
  title: 'STYLONE | Beauty, Skincare & Cosmetics',
  description:
    'Premium cosmetics, skincare, makeup and beauty essentials — delivered across Pakistan. Discover trusted brands and carefully curated products at STYLONE.',
  openGraph: {
    title: 'STYLONE | Beauty, Skincare & Cosmetics',
    description:
      'Premium cosmetics, skincare, makeup and beauty essentials — delivered across Pakistan.',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <Separator className="max-w-[var(--container-max)] mx-auto" />
      <FeaturedProducts />
      <PromoBanner />
      <BestSellers />
      <WhyStylone />
      <NewArrivals />
      <Testimonials />
      <Newsletter />
      <SocialGallery />
    </>
  );
}
