'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ShoppingBag,
  Check,
  ArrowRight,
  ShieldCheck,
  Droplet,
  Leaf,
  Sparkles,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { Container, useToast } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';

interface HeroCardItem {
  id: string;
  badge: string;
  badgeType: 'emerald' | 'amber';
  title: string;
  category: string;
  description: string;
  keyActives: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  slug: string;
  productId: string;
  variantId?: string;
  ctaText: string;
}

const heroCards: HeroCardItem[] = [
  {
    id: 'shampoo',
    badge: 'Best Seller • 0% Sulfates',
    badgeType: 'emerald',
    category: 'Herbal Shampoo Ritual',
    title: 'Anti-Hairfall Biotin & Red Onion Shampoo',
    description: 'Cold-pressed red onion oil, pure biotin, and amla clinically formulated to curb excessive shedding.',
    keyActives: ['Red Onion Seed Oil', 'Biotin B7', 'Amla', 'Saw Palmetto'],
    price: 1850,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 1420,
    slug: 'herbal-anti-hairfall-biotin-shampoo',
    productId: 'prod-hair-star-01',
    variantId: 'var-shm-01-300',
    ctaText: 'Add Shampoo to Bag',
  },
  {
    id: 'serum',
    badge: 'Dermatologist Endorsed',
    badgeType: 'emerald',
    category: 'Active Scalp Elixir',
    title: 'Rosemary & Caffeine Scalp Regrowth Serum',
    description: 'Weightless liquid tonic with pure steam-distilled rosemary oil and 2% active caffeine to wake dormant roots.',
    keyActives: ['Pure Rosemary Oil', '2% Caffeine', 'Peptides', 'B5'],
    price: 2650,
    originalPrice: 3300,
    rating: 5.0,
    reviewsCount: 980,
    slug: 'rosemary-caffeine-scalp-growth-serum',
    productId: 'prod-serum-star-01',
    variantId: 'var-srm-01-50',
    ctaText: 'Add Serum to Bag',
  },
  {
    id: 'bundle',
    badge: 'Save 30% • Best Value',
    badgeType: 'amber',
    category: 'Complete Clinical Kit',
    title: 'Complete Hairfall Regrowth Power Duo',
    description: 'Full 300ml Herbal Shampoo + 50ml Active Regrowth Serum. Maximum anti-hairfall efficacy when paired.',
    keyActives: ['2-Step Regimen', 'Free Scalp Massager', 'Free Shipping'],
    price: 3950,
    originalPrice: 5700,
    rating: 4.9,
    reviewsCount: 3120,
    slug: 'herbal-anti-hairfall-biotin-shampoo',
    productId: 'prod-hair-star-01',
    variantId: 'var-shm-01-300',
    ctaText: 'Add Duo Kit to Bag',
  },
];

export function JenpharmHero() {
  const { addItem } = useCart();
  const toast = useToast();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (card: HeroCardItem) => {
    const cartItemId = card.variantId ? `${card.productId}-${card.variantId}` : card.productId;

    addItem({
      id: cartItemId,
      productId: card.productId,
      variantId: card.variantId,
      name: card.title,
      price: card.price,
      image: card.id === 'serum' 
        ? 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&h=600&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop&q=80',
      slug: card.slug,
      variantName: card.category,
      quantity: 1,
    });

    toast.success(`Added ${card.title} to your bag!`, 'Bag Updated');
    setAddedIds((prev) => ({ ...prev, [card.id]: true }));

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [card.id]: false }));
    }, 1800);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#f4f8f5] via-white to-white border-b border-emerald-900/10 overflow-hidden">
      {/* Subtle Luxury Green Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="pt-10 pb-12 sm:pt-14 sm:pb-16 text-center">
          {/* Eyebrow Credential */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black tracking-wide shadow-2xs mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>CLINICALLY PROVEN BOTANICAL SCIENCE • 100% SULPHATE FREE</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Targeted Botanical Care For Hairfall With
            <span className="block mt-1 sm:mt-2 text-emerald-800">
              Pure Herbal Shampoos &amp; Active Serums
            </span>
          </h1>

          {/* Clinical Subtext */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed pt-4">
            Prescribed by Pakistan&apos;s leading dermatologists. Infused with cold-pressed red onion oil, therapeutic rosemary extract, and active biotin peptides to halt hairfall and stimulate dense, resilient roots in 14 days.
          </p>

          {/* Direct Navigation Links */}
          <div className="pt-6 pb-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/category/haircare"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-900/15 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Explore Herbal Shampoos</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/category/skincare"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Explore Active Serums</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>View All Products</span>
            </Link>
          </div>

          {/* 3 High-Converting Product Feature Cards (No big image, 100% clean luxury cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left max-w-5xl mx-auto">
            {heroCards.map((card) => {
              const isAdded = Boolean(addedIds[card.id]);
              const discountPercent = Math.round(
                ((card.originalPrice - card.price) / card.originalPrice) * 100
              );

              return (
                <div
                  key={card.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between ${
                    card.id === 'bundle'
                      ? 'border-emerald-600/60 ring-2 ring-emerald-600/10'
                      : 'border-slate-200 hover:border-emerald-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badge & Discount */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          card.badgeType === 'amber'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {card.badge}
                      </span>
                      <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        {discountPercent}% OFF
                      </span>
                    </div>

                    {/* Category & Title */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                        {card.category}
                      </p>
                      <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 leading-snug mt-1">
                        <Link
                          href={`/product/${card.slug}`}
                          className="hover:text-emerald-800 transition-colors"
                        >
                          {card.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Actives Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {card.keyActives.map((act) => (
                        <span
                          key={act}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f6faf7] text-emerald-900 border border-emerald-100"
                        >
                          {act}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-amber-500 pt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        {card.rating}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        ({card.reviewsCount.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-5 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-black text-xl text-slate-900">
                          {formatPrice(card.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(card.originalPrice)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        COD Available
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(card)}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/15'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} className="stroke-[3]" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} />
                          <span>{card.ctaText}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Nationwide Assurance Strip */}
      <div className="bg-white border-t border-slate-200/80 py-3.5 text-xs font-bold text-slate-700">
        <Container>
          <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-12">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Free Express Delivery on Rs. 2,500+</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Cash on Delivery (COD) Across Pakistan</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>100% Halal Botanical Actives • 0% Sulfates</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
