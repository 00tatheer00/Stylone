'use client';

import { useState } from 'react';
import Image from 'next/image';
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

interface HeroSpotlightItem {
  id: string;
  tabLabel: string;
  tabIcon: string;
  category: string;
  badge: string;
  badgeType: 'emerald' | 'amber';
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  slug: string;
  keyIngredients: string[];
  clinicalResult: string;
  productId: string;
  variantId?: string;
}

const spotlightItems: HeroSpotlightItem[] = [
  {
    id: 'shampoo',
    tabLabel: 'Herbal Shampoos',
    tabIcon: '🧴',
    category: 'Hair Regrowth Ritual',
    badge: "Pakistan's #1 Anti-Hairfall Shampoo",
    badgeType: 'emerald',
    title: 'Herbal Anti-Hairfall Biotin & Red Onion Shampoo',
    subtitle: '300ml Pump Bottle • 100% Sulfate & Paraben Free',
    price: 1850,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=900&fit=crop&q=85',
    slug: 'herbal-anti-hairfall-biotin-shampoo',
    keyIngredients: ['Cold-Pressed Red Onion Oil', 'Pure Biotin B7', 'Amla & Shikakai', 'Saw Palmetto'],
    clinicalResult: 'Clinically proven to reduce hair shedding by 89% in 14 days',
    productId: 'prod-hair-star-01',
    variantId: 'var-shm-01-300',
  },
  {
    id: 'serum',
    tabLabel: 'Active Serums',
    tabIcon: '💧',
    category: 'Intensive Follicle Therapy',
    badge: 'Dermatologist Endorsed',
    badgeType: 'emerald',
    title: 'Rosemary & Caffeine Scalp Therapy Growth Serum',
    subtitle: '50ml Glass Pipette Dropper • Weightless Liquid Elixir',
    price: 2650,
    originalPrice: 3300,
    rating: 5.0,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&h=900&fit=crop&q=85',
    slug: 'rosemary-caffeine-scalp-growth-serum',
    keyIngredients: ['Pure Rosemary Leaf Oil', '2% Active Caffeine', 'Copper Peptides', 'Panthenol B5'],
    clinicalResult: 'Reactivates dormant roots & stimulates visible hair density',
    productId: 'prod-serum-star-01',
    variantId: 'var-srm-01-50',
  },
  {
    id: 'bundle',
    tabLabel: 'Regrowth Duo Kit',
    tabIcon: '👑',
    category: 'Complete Clinical System',
    badge: 'Save 30% Today + Free Shipping',
    badgeType: 'amber',
    title: 'Ultimate Hairfall Rescue Duo (Shampoo + Serum)',
    subtitle: 'Full 300ml Herbal Shampoo + 50ml Active Regrowth Serum',
    price: 3950,
    originalPrice: 5700,
    rating: 4.9,
    reviewsCount: 3120,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=900&fit=crop&q=85',
    slug: 'herbal-anti-hairfall-biotin-shampoo',
    keyIngredients: ['Complete 2-Step Protocol', 'Cleanses & Stimulates', 'Free Scalp Massager', 'Zero Sulfates'],
    clinicalResult: 'Maximum anti-hairfall efficacy when paired together daily',
    productId: 'prod-hair-star-01',
    variantId: 'var-shm-01-300',
  },
];

export function JenpharmHero() {
  const [activeTab, setActiveTab] = useState<'shampoo' | 'serum' | 'bundle'>('shampoo');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const toast = useToast();

  const currentItem = spotlightItems.find((item) => item.id === activeTab) || spotlightItems[0];
  const discountPercent = Math.round(
    ((currentItem.originalPrice - currentItem.price) / currentItem.originalPrice) * 100
  );

  const handleAddToCart = () => {
    setIsAdding(true);

    const cartItemId = currentItem.variantId
      ? `${currentItem.productId}-${currentItem.variantId}`
      : currentItem.productId;

    addItem({
      id: cartItemId,
      productId: currentItem.productId,
      variantId: currentItem.variantId,
      name: currentItem.title,
      price: currentItem.price,
      image: currentItem.image,
      slug: currentItem.slug,
      variantName: currentItem.subtitle,
      quantity: 1,
    });

    setIsAdding(false);
    setIsAdded(true);
    toast.success(`Added ${currentItem.title} to your bag!`, 'Bag Updated');

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#f4f8f5] via-white to-white border-b border-emerald-900/10 overflow-hidden">
      {/* Subtle Luxury Green Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-green-100/30 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-16">
          {/* Top Pill / Trust Credential */}
          <div className="flex justify-center lg:justify-start mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>CLINICALLY FORMULATED • 100% PURE BOTANICAL SCIENCE</span>
            </div>
          </div>

          {/* Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Bold Editorial & Conversion Controls */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Targeted Care For Hairfall &amp; Thinning Roots With
                <span className="block mt-1 sm:mt-2 text-emerald-800">
                  Herbal Shampoos &amp; Active Serums
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Prescribed by Pakistan&apos;s leading dermatologists. Powered by cold-pressed red onion, pure rosemary extract, and active biotin peptides to arrest shedding and awaken dormant follicles in 14 days —{' '}
                <strong className="text-slate-900 font-bold">100% sulfate-free, 100% visible results.</strong>
              </p>

              {/* Interactive 3-Pill Product Switcher */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Select Flagship Category:
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5">
                  {spotlightItems.map((item) => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id as any)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer active:scale-95 select-none ${
                          isSelected
                            ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-800 ring-offset-2'
                            : 'bg-white text-slate-700 border border-slate-200/90 hover:border-emerald-600 hover:bg-emerald-50/50 shadow-2xs'
                        }`}
                      >
                        <span className="text-sm">{item.tabIcon}</span>
                        <span>{item.tabLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-900/15 transition-all duration-200 active:scale-95 group cursor-pointer"
                >
                  <span>Shop All Formulations</span>
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={currentItem.slug === 'shop' ? '/shop' : `/product/${currentItem.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-50 font-bold text-sm sm:text-base transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
                >
                  <span>View Clinical Details</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <Leaf size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">100% Herbal</p>
                    <p className="text-[10px] text-slate-500">Zero Sulfates</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <Droplet size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">14-Day Efficacy</p>
                    <p className="text-[10px] text-slate-500">Hair Regrowth</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <Truck size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Free Delivery</p>
                    <p className="text-[10px] text-slate-500">Over Rs. 2,500</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Nationwide COD</p>
                    <p className="text-[10px] text-slate-500">Pay at Doorstep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Converting Star Product Spotlight Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[420px] bg-white rounded-3xl border-2 border-emerald-800/15 p-4 sm:p-5 shadow-xl shadow-emerald-950/5 relative overflow-hidden transition-all duration-300">
                {/* Product Header / Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wide uppercase shadow-2xs ${
                      currentItem.badgeType === 'amber'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-800 text-white'
                    }`}
                  >
                    {currentItem.badge}
                  </span>
                  <span className="text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    Save {discountPercent}%
                  </span>
                </div>

                {/* Product Staging Image */}
                <Link
                  href={currentItem.slug === 'shop' ? '/shop' : `/product/${currentItem.slug}`}
                  className="relative block w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#f8faf9] to-[#edf5f0] overflow-hidden group mb-4 border border-slate-100"
                >
                  <Image
                    src={currentItem.image}
                    alt={currentItem.title}
                    fill
                    sizes="(max-width: 640px) 90vw, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />

                  {/* Floating Rating Pill */}
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1 shadow-sm">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[11px] font-black text-slate-900 ml-0.5">
                      {currentItem.rating}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      ({currentItem.reviewsCount.toLocaleString()})
                    </span>
                  </div>
                </Link>

                {/* Product Meta */}
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                      {currentItem.category}
                    </p>
                    <Link
                      href={currentItem.slug === 'shop' ? '/shop' : `/product/${currentItem.slug}`}
                      className="block font-heading font-black text-base sm:text-lg text-slate-900 hover:text-emerald-800 transition-colors leading-snug line-clamp-2 mt-0.5"
                    >
                      {currentItem.title}
                    </Link>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {currentItem.subtitle}
                    </p>
                  </div>

                  {/* Key Actives Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentItem.keyIngredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-100"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>

                  {/* Clinical Efficacy Banner */}
                  <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-emerald-100/80 flex items-start gap-2">
                    <Sparkles size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-700 font-bold leading-tight">
                      {currentItem.clinicalResult}
                    </p>
                  </div>

                  {/* Pricing Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block">Special Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-black text-xl sm:text-2xl text-slate-900">
                          {formatPrice(currentItem.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(currentItem.originalPrice)}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                      In Stock
                    </span>
                  </div>

                  {/* Direct 1-Click Action Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-black text-white transition-all duration-200 select-none shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                      isAdded
                        ? 'bg-emerald-600'
                        : 'bg-emerald-800 hover:bg-emerald-900 shadow-emerald-900/20'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={18} className="stroke-[3]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={17} />
                        <span>Add to Cart • {formatPrice(currentItem.price)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Nationwide Assurance Strip */}
      <div className="bg-white border-t border-slate-200/80 py-3 text-xs font-bold text-slate-700">
        <Container>
          <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-12">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Free Express Shipping on Rs. 2,500+</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>Cash on Delivery Across Pakistan</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>100% Halal Botanical Actives</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
