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
    setTimeout(() => setAddedAnim(false), 1500);
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
        'group relative flex flex-col bg-white rounded-[var(--radius-lg)]',
        'border border-[var(--color-border-light)] overflow-hidden',
        'transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border)]',
        className,
      )}
    >
      {/* Clickable Image Container */}
      <Link href={productUrl} className="relative block aspect-[4/5] overflow-hidden bg-[var(--color-bg-secondary)]">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-xs sm:text-sm">
            Image unavailable
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 z-10">
          {!isAvailable && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-black/75 backdrop-blur-sm text-white rounded-sm">
              Sold Out
            </span>
          )}
          {isAvailable && product.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-text-primary)] text-white rounded-sm">
              New
            </span>
          )}
          {isAvailable && hasDiscount && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-error)] text-white rounded-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={cn(
            'absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/85 backdrop-blur-sm',
            'text-[var(--color-text-secondary)] transition-all duration-200',
            'hover:bg-white hover:text-[var(--color-error)] hover:shadow-[var(--shadow-sm)]',
            wishlisted && 'text-[var(--color-error)] bg-white',
          )}
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </Link>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-1">
          <span className="font-medium uppercase tracking-wider truncate max-w-[70%]">
            {product.brand}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]/80">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <Link href={productUrl} className="block group-hover:text-[var(--color-accent-hover)] transition-colors">
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2 mb-3.5">
          <span className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
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
            'w-full flex items-center justify-center gap-1.5 mt-auto',
            'py-2 px-3 text-xs sm:text-sm font-medium rounded-[var(--radius-md)]',
            'border transition-all duration-200 select-none',
            !isAvailable
              ? 'bg-[var(--color-bg-secondary)] border-[var(--color-border-light)] text-[var(--color-text-muted)] cursor-not-allowed'
              : addedAnim
                ? 'bg-[var(--color-success)] text-white border-[var(--color-success)]'
                : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-white hover:border-[var(--color-text-primary)] active:scale-[0.98]'
          )}
          aria-label={
            !isAvailable
              ? `${product.name} is sold out`
              : `Add ${product.name} to cart`
          }
        >
          {addedAnim ? (
            <>
              <Check size={14} className="stroke-[2.5]" />
              Added to Bag
            </>
          ) : !isAvailable ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag size={14} />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
}
