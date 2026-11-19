'use client';

import { X } from 'lucide-react';
import type { FilterState, ProductCategorySlug } from '@/types/product';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveCategory: (slug: ProductCategorySlug) => void;
  onRemoveBrand: (brand: string) => void;
  onRemoveSkinType: (type: string) => void;
  onRemoveHairType: (type: string) => void;
  onRemoveProductType: (type: string) => void;
  onResetPrice: () => void;
  onResetAvailability: () => void;
  onClearAll: () => void;
  lockCategory?: ProductCategorySlug;
}

export function ActiveFilters({
  filters,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveSkinType,
  onRemoveHairType,
  onRemoveProductType,
  onResetPrice,
  onResetAvailability,
  onClearAll,
  lockCategory,
}: ActiveFiltersProps) {
  const hasPriceFilter = filters.priceRange[1] < 6000;
  const hasAvailFilter = filters.availability !== 'all';
  const displayedCategories = lockCategory
    ? []
    : filters.category;

  const totalActive =
    displayedCategories.length +
    filters.brand.length +
    filters.skinType.length +
    filters.hairType.length +
    filters.productType.length +
    (hasPriceFilter ? 1 : 0) +
    (hasAvailFilter ? 1 : 0);

  if (totalActive === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-3" aria-label="Active filters">
      <span className="text-xs text-[var(--color-text-muted)] font-medium mr-1">
        Active ({totalActive}):
      </span>

      {displayedCategories.map((slug) => (
        <button
          key={slug}
          onClick={() => onRemoveCategory(slug)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={`Remove category filter: ${slug}`}
        >
          <span className="capitalize">{slug.replace('-', ' ')}</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      ))}

      {filters.brand.map((brand) => (
        <button
          key={brand}
          onClick={() => onRemoveBrand(brand)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={`Remove brand filter: ${brand}`}
        >
          <span>{brand}</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      ))}

      {filters.skinType.map((type) => (
        <button
          key={type}
          onClick={() => onRemoveSkinType(type)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={`Remove skin type filter: ${type}`}
        >
          <span>{type}</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      ))}

      {filters.hairType.map((type) => (
        <button
          key={type}
          onClick={() => onRemoveHairType(type)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={`Remove hair type filter: ${type}`}
        >
          <span>{type}</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      ))}

      {filters.productType.map((type) => (
        <button
          key={type}
          onClick={() => onRemoveProductType(type)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={`Remove product type filter: ${type}`}
        >
          <span>{type}</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      ))}

      {hasPriceFilter && (
        <button
          onClick={onResetPrice}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title="Reset price filter"
        >
          <span>Under Rs. {filters.priceRange[1].toLocaleString('en-PK')}</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      )}

      {hasAvailFilter && (
        <button
          onClick={onResetAvailability}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title="Reset availability filter"
        >
          <span>In Stock Only</span>
          <X size={12} className="text-[var(--color-text-muted)]" />
        </button>
      )}

      <button
        onClick={onClearAll}
        className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-2 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
