'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, ShoppingBag, Heart } from 'lucide-react';
import { Container } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/data/products';

export function JenpharmCelebFavourites() {
  const { addItem } = useCart();
  const serumProduct = products.find((p) => p.id === 'rosemary-caffeine-scalp-growth-serum') || products[0];
  const shampooProduct = products.find((p) => p.id === 'herbal-anti-hairfall-biotin-shampoo') || products[1];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Discover Favourites From STYLONE</span>
            <span>💛</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Real routines shared by Pakistan&apos;s beauty community
          </p>
        </div>

        {/* Video / UGC Card Showcase (Jenpharm Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card 1 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 h-[380px] sm:h-[420px] group">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=1000&fit=crop&q=80"
              alt="Herbal Anti-Hairfall Routine"
              fill
              sizes="400px"
              className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                <Play size={24} className="fill-current ml-1" />
              </div>
            </div>

            {/* Bottom Docked Product Card (Exact Jenpharm Look) */}
            <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                  <span>★★★★★</span>
                  <span className="text-slate-500">(1,420)</span>
                </div>
                <p className="font-heading font-black text-xs text-slate-900 truncate">
                  Herbal Biotin Shampoo (300ml)
                </p>
              </div>
              <button
                onClick={() => {
                  addItem({
                    id: shampooProduct.id,
                    productId: shampooProduct.id,
                    variantId: shampooProduct.variants?.[0]?.id,
                    name: shampooProduct.name,
                    price: shampooProduct.price,
                    image: shampooProduct.image,
                    quantity: 1,
                  });
                }}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <ShoppingBag size={12} />
                <span>Add | Rs. 1,850</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 h-[380px] sm:h-[420px] group">
            <Image
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop&q=80"
              alt="Rosemary Scalp Serum Routine"
              fill
              sizes="400px"
              className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                <Play size={24} className="fill-current ml-1" />
              </div>
            </div>

            {/* Bottom Docked Product Card */}
            <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                  <span>★★★★★</span>
                  <span className="text-slate-500">(2,180)</span>
                </div>
                <p className="font-heading font-black text-xs text-slate-900 truncate">
                  Rosemary Scalp Regrowth Elixir
                </p>
              </div>
              <button
                onClick={() => {
                  addItem({
                    id: serumProduct.id,
                    productId: serumProduct.id,
                    variantId: serumProduct.variants?.[0]?.id,
                    name: serumProduct.name,
                    price: serumProduct.price,
                    image: serumProduct.image,
                    quantity: 1,
                  });
                }}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <ShoppingBag size={12} />
                <span>Add | Rs. 2,650</span>
              </button>
            </div>
          </div>
        </div>

        {/* Team Love Note (Exact Jenpharm Footer Note) */}
        <div className="mt-14 max-w-xl mx-auto text-center space-y-3">
          <p className="font-heading text-base sm:text-lg font-bold text-slate-800 italic leading-relaxed">
            &ldquo;Rooted in botanical science, driven by clinical results, and crafted with so much love for your hair &amp; skin. We&apos;re so grateful to be part of your daily ritual.&rdquo;
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-emerald-800 flex items-center justify-center gap-1">
            <span>With love, Team STYLONE</span>
            <span className="text-rose-500">🤍</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
