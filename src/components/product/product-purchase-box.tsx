'use client';

import { useState } from 'react';
import { Heart, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { VariantSelector } from './variant-selector';
import type { Product, ProductVariant } from '@/types/product';

interface ProductPurchaseBoxProps {
  product: Product;
}

export function ProductPurchaseBox({ product }: ProductPurchaseBoxProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Active pricing and availability driven by variant if present
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const isAvailable = selectedVariant ? selectedVariant.inStock : product.inStock;

  const hasDiscount = currentOriginalPrice && currentOriginalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((currentOriginalPrice! - currentPrice) / currentOriginalPrice!) * 100)
    : 0;

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => (prev < 10 ? prev + 1 : prev));
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      slug: product.slug,
      variantName: selectedVariant ? selectedVariant.name : undefined,
      quantity,
    });

    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Brand & Stock Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
          {product.brand}
        </span>
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            isAvailable
              ? 'bg-emerald-50 text-[var(--color-success)] border-emerald-200'
              : 'bg-red-50 text-[var(--color-error)] border-red-200'
          )}
        >
          {isAvailable ? 'In Stock' : 'Sold Out'}
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {product.shortDescription}
        </p>
      </div>

      {/* Pricing Block */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base text-[var(--color-text-muted)] line-through">
              {formatPrice(currentOriginalPrice!)}
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-[var(--color-error)] text-white rounded-sm">
              Save {discountPercent}%
            </span>
          </>
        )}
      </div>

      <div className="border-t border-[var(--color-border-light)]" />

      {/* Variant Selector (if variants exist) */}
      {product.variants && product.variants.length > 0 && selectedVariant && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelect={(v) => {
            setSelectedVariant(v);
            setQuantity(1);
          }}
        />
      )}

      {/* Quantity & CTA Area */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)] bg-white h-12 shrink-0">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || !isAvailable}
              className="w-10 h-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed text-base font-medium select-none"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center font-medium text-sm text-[var(--color-text-primary)] select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= 10 || !isAvailable}
              className="w-10 h-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed text-base font-medium select-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={cn(
              'flex-1 h-12 flex items-center justify-center gap-2 px-6 text-sm font-bold uppercase tracking-wider rounded-xl transition-all select-none shadow-sm',
              !isAvailable
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : addedAnim
                ? 'bg-emerald-600 text-white scale-[1.02] shadow-[var(--shadow-green)]'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white hover:from-emerald-700 hover:to-green-800 hover:shadow-[var(--shadow-green)] active:scale-[0.98]'
            )}
            aria-label={
              !isAvailable
                ? 'This product is out of stock'
                : `Add ${quantity} to shopping bag`
            }
          >
            {addedAnim ? (
              <>
                <Check size={18} className="stroke-[3] animate-bounce" />
                <span>Added to Bag!</span>
              </>
            ) : !isAvailable ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setWishlisted(!wishlisted)}
            className={cn(
              'w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)] border transition-all',
              wishlisted
                ? 'border-[var(--color-error)] text-[var(--color-error)] bg-red-50/50'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
            )}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Assurance Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
        <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-light)] text-[11px] text-[var(--color-text-secondary)]">
          <Truck size={16} className="text-[var(--color-accent)] shrink-0" />
          <span>Free delivery over Rs. 3,000</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-light)] text-[11px] text-[var(--color-text-secondary)]">
          <ShieldCheck size={16} className="text-[var(--color-accent)] shrink-0" />
          <span>100% Quality Inspected</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-light)] text-[11px] text-[var(--color-text-secondary)]">
          <RefreshCw size={16} className="text-[var(--color-accent)] shrink-0" />
          <span>7-Day Return Guarantee</span>
        </div>
      </div>
    </div>
  );
}
