'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types/product';

interface StickyMobileAtcProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  currentPrice: number;
  isAvailable: boolean;
  onAddToCart: () => void;
  addedAnim: boolean;
}

export function StickyMobileAtc({
  product,
  selectedVariant,
  currentPrice,
  isAvailable,
  onAddToCart,
  addedAnim,
}: StickyMobileAtcProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero/header
      if (window.scrollY > 380) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'lg:hidden fixed bottom-14 sm:bottom-16 left-0 right-0 z-30',
        'bg-white/95 backdrop-blur-xl border-t border-emerald-100 shadow-[0_-6px_24px_rgba(16,185,129,0.12)]',
        'px-4 py-2.5 transition-all duration-300 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Thumbnail & Product Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-emerald-50 shrink-0 border border-emerald-100 shadow-2xs">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-emerald-950 truncate leading-tight">
              {product.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-extrabold text-emerald-700">
                {formatPrice(currentPrice)}
              </span>
              {selectedVariant && (
                <span className="text-[10px] text-stone-500 truncate">
                  ({selectedVariant.name})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!isAvailable}
          className={cn(
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 select-none shadow-xs shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer',
            !isAvailable
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : addedAnim
              ? 'bg-emerald-600 text-white scale-[1.02]'
              : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-700/20'
          )}
        >
          {addedAnim ? (
            <>
              <Check size={14} className="stroke-[3] animate-bounce" />
              <span>Added!</span>
            </>
          ) : !isAvailable ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
