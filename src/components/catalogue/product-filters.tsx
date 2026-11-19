'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterState, ProductCategorySlug } from '@/types/product';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  availableBrands: string[];
  availableProductTypes: string[];
  availableSkinTypes: string[];
  availableHairTypes: string[];
  lockCategory?: ProductCategorySlug;
  className?: string;
}

export function ProductFilters({
  filters,
  onChange,
  onClear,
  availableBrands,
  availableProductTypes,
  availableSkinTypes,
  availableHairTypes,
  lockCategory,
  className,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    skinType: true,
    hairType: true,
    productType: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (slug: ProductCategorySlug) => {
    const exists = filters.category.includes(slug);
    const updated = exists
      ? filters.category.filter((c) => c !== slug)
      : [...filters.category, slug];
    onChange({ ...filters, category: updated });
  };

  const handleBrandToggle = (brand: string) => {
    const exists = filters.brand.includes(brand);
    const updated = exists
      ? filters.brand.filter((b) => b !== brand)
      : [...filters.brand, brand];
    onChange({ ...filters, brand: updated });
  };

  const handleSkinTypeToggle = (type: string) => {
    const exists = filters.skinType.includes(type);
    const updated = exists
      ? filters.skinType.filter((t) => t !== type)
      : [...filters.skinType, type];
    onChange({ ...filters, skinType: updated });
  };

  const handleHairTypeToggle = (type: string) => {
    const exists = filters.hairType.includes(type);
    const updated = exists
      ? filters.hairType.filter((t) => t !== type)
      : [...filters.hairType, type];
    onChange({ ...filters, hairType: updated });
  };

  const handleProductTypeToggle = (type: string) => {
    const exists = filters.productType.includes(type);
    const updated = exists
      ? filters.productType.filter((t) => t !== type)
      : [...filters.productType, type];
    onChange({ ...filters, productType: updated });
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange({ ...filters, priceRange: [filters.priceRange[0], val] });
  };

  const handleAvailabilityToggle = (avail: 'all' | 'in-stock') => {
    onChange({ ...filters, availability: avail });
  };

  return (
    <div className={cn('space-y-6 text-sm', className)}>
      {/* Availability Filter */}
      <div className="border-b border-[var(--color-border-light)] pb-5">
        <div className="flex items-center justify-between">
          <span className="font-heading font-medium text-[var(--color-text-primary)]">
            Availability
          </span>
        </div>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === 'all'}
              onChange={() => handleAvailabilityToggle('all')}
              className="accent-[var(--color-accent)] cursor-pointer"
            />
            <span>All Products</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === 'in-stock'}
              onChange={() => handleAvailabilityToggle('in-stock')}
              className="accent-[var(--color-accent)] cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-[var(--color-border-light)] pb-5">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left font-heading font-medium text-[var(--color-text-primary)]"
        >
          <span>Price Range</span>
          {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.price && (
          <div className="mt-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span>Rs. {filters.priceRange[0].toLocaleString('en-PK')}</span>
              <span>Rs. {filters.priceRange[1].toLocaleString('en-PK')}</span>
            </div>
            <input
              type="range"
              min={500}
              max={6000}
              step={250}
              value={filters.priceRange[1]}
              onChange={handlePriceMaxChange}
              className="w-full accent-[var(--color-accent)] cursor-pointer"
              aria-label="Maximum price filter"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1500, 2500, 3500, 6000].map((bracket) => (
                <button
                  key={bracket}
                  type="button"
                  onClick={() => onChange({ ...filters, priceRange: [0, bracket] })}
                  className={cn(
                    'text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                    filters.priceRange[1] === bracket
                      ? 'bg-[var(--color-text-primary)] text-white border-[var(--color-text-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                  )}
                >
                  {bracket === 6000 ? 'All' : `Under Rs. ${bracket.toLocaleString('en-PK')}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories (only show when not viewing a locked single category page) */}
      {!lockCategory && (
        <div className="border-b border-[var(--color-border-light)] pb-5">
          <button
            type="button"
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-left font-heading font-medium text-[var(--color-text-primary)]"
          >
            <span>Category</span>
            {openSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.categories && (
            <div className="mt-3.5 space-y-2.5">
              {[
                { name: 'Skincare', slug: 'skincare' },
                { name: 'Makeup', slug: 'makeup' },
                { name: 'Haircare', slug: 'haircare' },
                { name: 'Beauty Accessories', slug: 'beauty-accessories' },
                { name: 'Personal Care', slug: 'personal-care' },
              ].map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <input
                    type="checkbox"
                    checked={filters.category.includes(cat.slug as ProductCategorySlug)}
                    onChange={() => handleCategoryToggle(cat.slug as ProductCategorySlug)}
                    className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="border-b border-[var(--color-border-light)] pb-5">
          <button
            type="button"
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between text-left font-heading font-medium text-[var(--color-text-primary)]"
          >
            <span>Brand</span>
            {openSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.brands && (
            <div className="mt-3.5 space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skin Type Filter (only relevant if skincare or mixed products present) */}
      {availableSkinTypes.length > 0 && (
        <div className="border-b border-[var(--color-border-light)] pb-5">
          <button
            type="button"
            onClick={() => toggleSection('skinType')}
            className="w-full flex items-center justify-between text-left font-heading font-medium text-[var(--color-text-primary)]"
          >
            <span>Skin Type</span>
            {openSections.skinType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.skinType && (
            <div className="mt-3.5 space-y-2.5">
              {availableSkinTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <input
                    type="checkbox"
                    checked={filters.skinType.includes(type)}
                    onChange={() => handleSkinTypeToggle(type)}
                    className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hair Type Filter (only relevant if haircare products present) */}
      {availableHairTypes.length > 0 && (
        <div className="border-b border-[var(--color-border-light)] pb-5">
          <button
            type="button"
            onClick={() => toggleSection('hairType')}
            className="w-full flex items-center justify-between text-left font-heading font-medium text-[var(--color-text-primary)]"
          >
            <span>Hair Type</span>
            {openSections.hairType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.hairType && (
            <div className="mt-3.5 space-y-2.5">
              {availableHairTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <input
                    type="checkbox"
                    checked={filters.hairType.includes(type)}
                    onChange={() => handleHairTypeToggle(type)}
                    className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Type Filter */}
      {availableProductTypes.length > 0 && (
        <div className="border-b border-[var(--color-border-light)] pb-5">
          <button
            type="button"
            onClick={() => toggleSection('productType')}
            className="w-full flex items-center justify-between text-left font-heading font-medium text-[var(--color-text-primary)]"
          >
            <span>Product Type</span>
            {openSections.productType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.productType && (
            <div className="mt-3.5 space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {availableProductTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <input
                    type="checkbox"
                    checked={filters.productType.includes(type)}
                    onChange={() => handleProductTypeToggle(type)}
                    className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reset Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onClear}
          className="w-full py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-text-primary)] rounded-[var(--radius-md)] transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
