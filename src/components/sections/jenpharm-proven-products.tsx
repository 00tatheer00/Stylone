'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Container, useToast } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';

interface JenpharmProvenProductsProps {
  products: Product[];
}

export function JenpharmProvenProducts({ products }: JenpharmProvenProductsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'hairfall' | 'shampoo' | 'serum'>('all');
  const { addItem } = useCart();
  const toast = useToast();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filterTabs = [
    { id: 'all', label: 'All Products' },
    { id: 'bestseller', label: 'Best Sellers' },
    { id: 'hairfall', label: 'Anti Hairfall' },
    { id: 'shampoo', label: 'Herbal Shampoos' },
    { id: 'serum', label: 'Active Serums' },
  ] as const;

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bestseller') return p.isBestSeller;
    if (activeTab === 'hairfall') return p.hairType?.some((h) => h.includes('Hairfall') || h.includes('Thinning')) || p.categorySlug === 'haircare';
    if (activeTab === 'shampoo') return p.name.toLowerCase().includes('shampoo') || p.categorySlug === 'haircare';
    if (activeTab === 'serum') return p.name.toLowerCase().includes('serum') || p.categorySlug === 'skincare';
    return true;
  });

  const handleAddToCart = (product: Product) => {
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addItem({
      id: variant ? `${product.id}-${variant.id}` : product.id,
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      price: variant ? variant.price : product.price,
      image: product.image,
      slug: product.slug,
      variantName: variant?.name,
      quantity: 1,
    });

    toast.success(`Added ${product.name} to your cart!`, 'Bag Updated');
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-slate-900 font-black ml-1">2,000,000+ Happy Customers</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Clinically Proven Botanical Formulations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
            Targeted active care for hair fall, thinning follicles, and radiant skin health
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 px-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer select-none ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
              : 0;
            const isAdded = Boolean(addedIds[product.id]);

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600 transition-all duration-300"
              >
                {/* Top Badge Strip */}
                <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1 bg-white">
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 truncate max-w-[60%]">
                    {product.hairType?.[1] || product.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-800 text-white shadow-2xs">
                    {product.badge || (product.isBestSeller ? 'Best Seller' : 'New')}
                  </span>
                </div>

                {/* Product Image */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative block aspect-[4/5] bg-gradient-to-b from-[#f8faf9] to-white overflow-hidden p-2"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-col flex-1 p-3 sm:p-4 text-center">
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">(82)</span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="block font-heading text-xs sm:text-sm font-extrabold text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2 min-h-[2.2rem] leading-snug"
                  >
                    {product.name}
                  </Link>

                  {/* Pricing */}
                  <div className="flex items-center justify-center gap-2 mt-2 mb-3">
                    <span className="font-black text-sm sm:text-base text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPrice!)}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {discountPercent}% off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Full-Width Solid Emerald Button: "Add to cart" */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-black text-white transition-all duration-200 select-none shadow-xs active:scale-95 cursor-pointer mt-auto flex items-center justify-center gap-1.5 ${
                      isAdded
                        ? 'bg-emerald-600'
                        : 'bg-emerald-800 hover:bg-emerald-900'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} className="stroke-[3]" />
                        <span>Added to cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-800 hover:text-white font-black text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <span>View All Clinical Products</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
