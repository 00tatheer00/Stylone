'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice, cn } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    freeShippingRemaining,
    freeShippingThreshold,
    updateQuantity,
    removeItem,
    isDrawerOpen,
    closeDrawer,
    addItem,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const upsellProduct = {
    id: 'prod-serum-star-01',
    name: 'Rosemary & Caffeine Scalp Regrowth Serum',
    price: 2650,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop&q=80',
    slug: 'rosemary-caffeine-scalp-growth-serum',
  };

  const isUpsellInCart = items.some((i) => i.productId === upsellProduct.id || i.id === upsellProduct.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300',
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your Shopping Bag"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#f8faf9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag size={15} />
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-slate-900 leading-tight">
                Your Shopping Bag
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Progress Strip */}
        <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-b border-emerald-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-900">
              <Truck size={14} className="text-emerald-700" />
              <span>Free Delivery</span>
            </span>
            <span className="text-emerald-800 font-extrabold text-[11px]">
              {freeShippingRemaining > 0
                ? `Add ${formatPrice(freeShippingRemaining)} more`
                : '🎉 Unlocked!'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-green-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div className="space-y-1">
                <p className="font-heading font-black text-base text-slate-900">
                  Your bag is currently empty
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover our clinically formulated herbal shampoos and cold-pressed regrowth serums.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="px-6 py-2.5 rounded-full bg-emerald-800 text-white font-black text-xs shadow-md hover:bg-emerald-900 transition-all cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-heading font-black text-xs text-slate-900 leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    {item.variantName && (
                      <p className="text-[10px] text-slate-500 font-medium">
                        {item.variantName}
                      </p>
                    )}
                    <p className="font-black text-xs text-slate-900">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-l-lg cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-r-lg cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 1-Click Clinical Pair Upsell */}
          {items.length > 0 && !isUpsellInCart && (
            <div className="mt-4 p-3.5 rounded-2xl bg-[#f6faf7] border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-black text-[11px] uppercase tracking-wide">
                <Sparkles size={13} />
                <span>Recommended Regimen Pair</span>
              </div>
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                    <Image
                      src={upsellProduct.image}
                      alt={upsellProduct.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {upsellProduct.name}
                    </p>
                    <p className="text-[11px] font-black text-emerald-800">
                      {formatPrice(upsellProduct.price)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: upsellProduct.id,
                      productId: upsellProduct.id,
                      name: upsellProduct.name,
                      price: upsellProduct.price,
                      image: upsellProduct.image,
                      slug: upsellProduct.slug,
                      quantity: 1,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  + Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Subtotal
              </span>
              <span className="font-heading font-black text-xl text-slate-900">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Taxes included. Nationwide delivery calculated at checkout.
            </p>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/cart"
                onClick={closeDrawer}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                View Full Bag Details
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-700" />
                <span>Cash on Delivery</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-700" />
                <span>7-Day Guarantee</span>
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
