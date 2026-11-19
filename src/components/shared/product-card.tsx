'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const { addItem } = useCart();

  const wishlisted = isInWishlist(product.id);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const isAvailable = product.inStock !== false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable) return;

    addItem({
      id: product.variants && product.variants.length > 0 ? `${product.id}-${product.variants[0].id}` : product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      variantName: product.variants && product.variants.length > 0 ? product.variants[0].name : undefined,
      quantity: 1,
    });

    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const productUrl = `/product/${product.slug}`;

  return (
    <div
      className={cn(
        'group relative flex flex-col bg-white rounded-2xl',
        'border border-[var(--color-border-light)] overflow-hidden shadow-xs',
        'transition-all duration-300 hover:shadow-[var(--shadow-green-lg)] hover:border-[var(--color-accent)]/40 hover:-translate-y-1',
        className,
      )}
    >
      {/* Clickable Image Container */}
      <Link href={productUrl} className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#f2fbf4] to-[var(--color-bg-secondary)]">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-xs sm:text-sm">
            Image unavailable
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
          {!isAvailable && (
            <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-stone-900/80 backdrop-blur-md text-white rounded-full shadow-xs">
              Sold Out
            </span>
          )}
          {isAvailable && product.isNew && (
            <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-full shadow-xs">
              New Drop
            </span>
          )}
          {isAvailable && hasDiscount && (
            <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={cn(
            'absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs',
            'text-[var(--color-text-secondary)] transition-all duration-300',
            'hover:bg-white hover:text-rose-600 hover:scale-110 active:scale-95',
            wishlisted && 'text-rose-500 bg-white ring-1 ring-rose-200',
          )}
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            fill={wishlisted ? 'currentColor' : 'none'}
            className="transition-transform duration-300"
          />
        </button>
      </Link>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-[var(--color-accent-hover)] truncate max-w-[65%]">
            {product.brand}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] font-medium">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <Link href={productUrl} className="block group-hover:text-[var(--color-accent-hover)] transition-colors">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2.5 mb-4">
          <span className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Add to Bag CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={cn(
            'w-full flex items-center justify-center gap-2 mt-auto',
            'py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl',
            'transition-all duration-300 select-none shadow-xs',
            !isAvailable
              ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] cursor-not-allowed'
              : addedAnim
                ? 'bg-emerald-600 text-white scale-[1.02] shadow-[var(--shadow-green)]'
                : 'bg-emerald-50 text-[var(--color-text-primary)] border border-emerald-200 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white hover:shadow-[var(--shadow-green)] active:scale-95'
          )}
          aria-label={
            !isAvailable
              ? `${product.name} is sold out`
              : `Add ${product.name} to cart`
          }
        >
          {addedAnim ? (
            <>
              <Check size={16} className="stroke-[3] animate-bounce" />
              <span>Added to Bag!</span>
            </>
          ) : !isAvailable ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag size={16} className="transition-transform group-hover:-translate-y-0.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
