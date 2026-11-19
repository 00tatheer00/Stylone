'use client';

import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  const variantType = variants[0].type;
  const label =
    variantType === 'shade'
      ? 'Select Shade'
      : variantType === 'size'
      ? 'Select Size'
      : 'Select Option';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
          {label}:{' '}
          <span className="font-normal text-[var(--color-text-secondary)]">
            {selectedVariant.name}
          </span>
        </span>
        <span className="text-[var(--color-text-muted)]">
          SKU: {selectedVariant.sku}
        </span>
      </div>

      {variantType === 'shade' ? (
        /* Shades: Swatches with tooltips and labels */
        <div className="flex flex-wrap gap-2.5">
          {variants.map((v) => {
            const isSelected = selectedVariant.id === v.id;
            const isOutOfStock = !v.inStock;

            return (
              <button
                key={v.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => onSelect(v)}
                className={cn(
                  'group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all select-none',
                  isSelected
                    ? 'border-[var(--color-text-primary)] ring-1 ring-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-primary)] bg-white',
                  isOutOfStock && 'opacity-40 cursor-not-allowed bg-[var(--color-bg-secondary)] line-through'
                )}
                title={`${v.name}${isOutOfStock ? ' (Sold Out)' : ''}`}
                aria-label={`Shade ${v.name}${isOutOfStock ? ' - Sold Out' : ''}`}
              >
                {v.colorHex && (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-xs"
                    style={{ backgroundColor: v.colorHex }}
                  />
                )}
                <span className="truncate max-w-[130px]">{v.name}</span>
                {isOutOfStock && (
                  <span className="text-[10px] text-[var(--color-error)] no-underline">
                    (Out)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Size / Pack Options: Clean Pills */
        <div className="flex flex-wrap gap-2.5">
          {variants.map((v) => {
            const isSelected = selectedVariant.id === v.id;
            const isOutOfStock = !v.inStock;

            return (
              <button
                key={v.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => onSelect(v)}
                className={cn(
                  'px-4 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all select-none',
                  isSelected
                    ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-white shadow-xs'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]',
                  isOutOfStock && 'opacity-40 cursor-not-allowed bg-[var(--color-bg-secondary)] line-through text-[var(--color-text-muted)]'
                )}
                aria-label={`${v.name}${isOutOfStock ? ' - Sold Out' : ''}`}
              >
                <span>{v.name}</span>
                {v.price !== selectedVariant.price && (
                  <span className={cn('ml-1.5 opacity-80', isSelected ? 'text-white' : 'text-[var(--color-text-muted)]')}>
                    Rs. {v.price.toLocaleString('en-PK')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
