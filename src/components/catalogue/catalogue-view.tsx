'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X, ArrowUpDown, PackageOpen, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui';
import { ProductCard } from '@/components/shared/product-card';
import { ProductFilters } from './product-filters';
import { ActiveFilters } from './active-filters';
import { cn } from '@/lib/utils';
import type {
  Product,
  ProductCategorySlug,
  SortOption,
  FilterState,
} from '@/types/product';

interface CatalogueViewProps {
  initialProducts: Product[];
  title: string;
  description?: string;
  categorySlug?: ProductCategorySlug;
  breadcrumbTrail?: { label: string; href?: string }[];
  searchQuery?: string;
}

const DEFAULT_FILTERS: FilterState = {
  category: [],
  brand: [],
  priceRange: [0, 6000],
  availability: 'all',
  skinType: [],
  hairType: [],
  productType: [],
};

const PAGE_SIZE = 8;

export function CatalogueView({
  initialProducts,
  title,
  description,
  categorySlug,
  searchQuery,
}: CatalogueViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: categorySlug ? [categorySlug] : [],
  });
  const [sort, setSort] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Extract distinct facets from current pool
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [initialProducts]);

  const availableProductTypes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.productType) set.add(p.productType);
    });
    return Array.from(set).sort();
  }, [initialProducts]);

  const availableSkinTypes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      p.skinType?.forEach((st) => set.add(st));
    });
    return Array.from(set).sort();
  }, [initialProducts]);

  const availableHairTypes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      p.hairType?.forEach((ht) => set.add(ht));
    });
    return Array.from(set).sort();
  }, [initialProducts]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter (if not locked to single category)
      if (
        !categorySlug &&
        filters.category.length > 0 &&
        !filters.category.includes(product.categorySlug)
      ) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Price filter
      if (product.price > filters.priceRange[1]) {
        return false;
      }

      // Availability filter
      if (filters.availability === 'in-stock' && !product.inStock) {
        return false;
      }

      // Skin type filter
      if (filters.skinType.length > 0) {
        const matchesSkin = product.skinType?.some((st) =>
          filters.skinType.includes(st)
        );
        if (!matchesSkin) return false;
      }

      // Hair type filter
      if (filters.hairType.length > 0) {
        const matchesHair = product.hairType?.some((ht) =>
          filters.hairType.includes(ht)
        );
        if (!matchesHair) return false;
      }

      // Product type filter
      if (
        filters.productType.length > 0 &&
        !filters.productType.includes(product.productType)
      ) {
        return false;
      }

      return true;
    });
  }, [initialProducts, filters, categorySlug]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case 'newest':
        return list.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (b.isFeatured !== a.isFeatured) return b.isFeatured ? 1 : -1;
          if (b.isBestSeller !== a.isBestSeller) return b.isBestSeller ? 1 : -1;
          return 0;
        });
    }
  }, [filteredProducts, sort]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleClearAllFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      category: categorySlug ? [categorySlug] : [],
    });
  };

  const activeCount =
    (categorySlug ? 0 : filters.category.length) +
    filters.brand.length +
    filters.skinType.length +
    filters.hairType.length +
    filters.productType.length +
    (filters.priceRange[1] < 6000 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0);

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Header Block */}
        <div className="border-b border-[var(--color-border-light)] pb-6 mb-6">
          <div className="max-w-3xl">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {title}
            </h1>
            {searchQuery && (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Showing search results for &ldquo;
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {searchQuery}
                </span>
                &rdquo;
              </p>
            )}
            {description && (
              <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Action Row: Count, Mobile Filter Trigger, Sort Control */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-border-light)]">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
                {sortedProducts.length}{' '}
                {sortedProducts.length === 1 ? 'Product' : 'Products'}
              </span>
              {activeCount > 0 && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  (filtered)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                aria-label="Open filter menu"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold bg-[var(--color-accent)] text-white rounded-full">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative inline-block w-full sm:w-48">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="w-full appearance-none px-3 py-2 text-xs sm:text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] cursor-pointer pr-8"
                    aria-label="Sort products"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                  <ArrowUpDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilters
            filters={filters}
            onRemoveCategory={(slug) =>
              setFilters((prev) => ({
                ...prev,
                category: prev.category.filter((c) => c !== slug),
              }))
            }
            onRemoveBrand={(brand) =>
              setFilters((prev) => ({
                ...prev,
                brand: prev.brand.filter((b) => b !== brand),
              }))
            }
            onRemoveSkinType={(st) =>
              setFilters((prev) => ({
                ...prev,
                skinType: prev.skinType.filter((t) => t !== st),
              }))
            }
            onRemoveHairType={(ht) =>
              setFilters((prev) => ({
                ...prev,
                hairType: prev.hairType.filter((t) => t !== ht),
              }))
            }
            onRemoveProductType={(pt) =>
              setFilters((prev) => ({
                ...prev,
                productType: prev.productType.filter((t) => t !== pt),
              }))
            }
            onResetPrice={() =>
              setFilters((prev) => ({ ...prev, priceRange: [0, 6000] }))
            }
            onResetAvailability={() =>
              setFilters((prev) => ({ ...prev, availability: 'all' }))
            }
            onClearAll={handleClearAllFilters}
            lockCategory={categorySlug}
          />
        </div>

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24 bg-white/60 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-light)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-light)]">
              <span className="font-heading font-semibold text-base text-[var(--color-text-primary)]">
                Filters
              </span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>

            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onClear={handleClearAllFilters}
              availableBrands={availableBrands}
              availableProductTypes={availableProductTypes}
              availableSkinTypes={availableSkinTypes}
              availableHairTypes={availableHairTypes}
              lockCategory={categorySlug}
            />
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
                  {displayedProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={idx < 4}
                    />
                  ))}
                </div>

                {/* Load More Action */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">
                      Showing {displayedProducts.length} of{' '}
                      {sortedProducts.length} products
                    </p>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-white transition-all shadow-[var(--shadow-sm)]"
                    >
                      Load More Products
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="py-20 text-center bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-bg-secondary)] mb-4 text-[var(--color-accent)]">
                  <PackageOpen size={28} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
                  No matching products found
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
                  We couldn&apos;t find any items matching your selected filter
                  criteria. Try clearing filters or searching for something else.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-md)] transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </Container>

      {/* Mobile Drawer / Bottom Sheet */}
      <div
        className={cn(
          'fixed inset-0 z-[70] bg-black/40 backdrop-blur-xs transition-opacity lg:hidden',
          mobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileFilterOpen(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters modal"
        className={cn(
          'fixed inset-y-0 right-0 z-[80] w-full max-w-sm bg-white shadow-[var(--shadow-xl)] flex flex-col transition-transform duration-300 ease-out lg:hidden',
          mobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border-light)]">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-lg text-[var(--color-text-primary)]">
              Filters
            </span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold bg-[var(--color-accent)] text-white rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(false)}
            className="p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onClear={handleClearAllFilters}
            availableBrands={availableBrands}
            availableProductTypes={availableProductTypes}
            availableSkinTypes={availableSkinTypes}
            availableHairTypes={availableHairTypes}
            lockCategory={categorySlug}
          />
        </div>

        <div className="p-4 border-t border-[var(--color-border-light)] bg-[var(--color-bg-primary)] flex items-center gap-3">
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="w-1/3 py-3 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] bg-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(false)}
            className="w-2/3 py-3 text-xs font-semibold uppercase tracking-wider bg-[var(--color-text-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)]"
          >
            Show {sortedProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );
}
