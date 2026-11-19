'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';
import { products } from '@/data/products';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const [includeSecond, setIncludeSecond] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Find complementary pair
  const isShampoo = currentProduct.name.toLowerCase().includes('shampoo') || currentProduct.categorySlug === 'haircare';
  const partnerProduct = isShampoo
    ? products.find((p) => p.slug === 'rosemary-caffeine-scalp-growth-serum') || products[1]
    : products.find((p) => p.slug === 'herbal-anti-hairfall-biotin-shampoo') || products[0];

  const firstPrice = currentProduct.price;
  const secondPrice = partnerProduct.price;
  const combinedOriginal = firstPrice + secondPrice;
  const bundleDiscountPercent = 15;
  const bundleDiscount = Math.round((combinedOriginal * bundleDiscountPercent) / 100);
  const bundlePrice = combinedOriginal - bundleDiscount;

  const handleAddBundle = () => {
    setIsAdding(true);

    // Add first item
    addItem({
      id: currentProduct.id,
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      slug: currentProduct.slug,
      quantity: 1,
    });

    // Add second item if checked
    if (includeSecond) {
      setTimeout(() => {
        addItem({
          id: partnerProduct.id,
          productId: partnerProduct.id,
          name: partnerProduct.name,
          price: secondPrice - bundleDiscount, // discounted bundle price
          image: partnerProduct.image,
          slug: partnerProduct.slug,
          variantName: 'Bundle Special (15% Off)',
          quantity: 1,
        });
      }, 100);
    }

    setIsAdding(false);
    setAdded(true);
    toast.success('Bundle added to your shopping bag with discount!', 'Bundle Added');

    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-[#f8faf9] border-2 border-emerald-800/15 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-2 border-b border-emerald-900/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-700" />
          <h3 className="font-heading font-black text-base sm:text-lg text-slate-900">
            Frequently Paired Together
          </h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-200">
          Save 15% on Bundle
        </span>
      </div>

      {/* Visual Product Pair */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Item 1 */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0">
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">This Item</p>
            <p className="font-heading font-black text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
              {currentProduct.name}
            </p>
            <p className="font-black text-xs text-slate-900 mt-0.5">
              {formatPrice(firstPrice)}
            </p>
          </div>
        </div>

        {/* Plus Symbol */}
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
          <Plus size={16} />
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0">
            <Image
              src={partnerProduct.image}
              alt={partnerProduct.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSecond}
                onChange={(e) => setIncludeSecond(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-emerald-700 w-3.5 h-3.5"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Recommended Pair
              </span>
            </label>
            <p className="font-heading font-black text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
              {partnerProduct.name}
            </p>
            <p className="font-black text-xs text-slate-900 mt-0.5">
              {formatPrice(secondPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-500 font-bold block">
            Combined Ritual Price:
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-xl text-slate-900">
              {includeSecond ? formatPrice(bundlePrice) : formatPrice(firstPrice)}
            </span>
            {includeSecond && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(combinedOriginal)}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Save {formatPrice(bundleDiscount)} + Free Delivery
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddBundle}
          disabled={isAdding}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
            added
              ? 'bg-emerald-600'
              : 'bg-emerald-800 hover:bg-emerald-900 shadow-emerald-900/15'
          }`}
        >
          {added ? (
            <>
              <Check size={16} className="stroke-[3]" />
              <span>Bundle Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>{includeSecond ? 'Add Both to Bag' : 'Add to Bag'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
