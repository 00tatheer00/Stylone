'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui';
import { products } from '@/data/products';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, handleClose]);

  // Live matching results
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q)
        );
      })
      .slice(0, 5);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className={cn(
        'fixed inset-0 z-[80] bg-white/98 backdrop-blur-sm transition-opacity duration-200 overflow-y-auto',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <Container>
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 h-16 lg:h-20">
          <SearchIcon size={20} className="shrink-0 text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands (e.g. PureSkin, Vitamin C, Lipstick)..."
            className="flex-1 bg-transparent text-base sm:text-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            className="p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={handleClose}
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </form>

        <div className="border-t border-[var(--color-border-light)]" />

        {/* Results / Suggestions Area */}
        <div className="py-8 max-w-2xl mx-auto">
          {query.trim() ? (
            matches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                    Products ({matches.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium"
                  >
                    View all results
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="divide-y divide-[var(--color-border-light)]">
                  {matches.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 group hover:bg-[var(--color-bg-secondary)]/50 px-2 rounded-[var(--radius-md)] transition-colors"
                    >
                      <div className="relative w-12 h-14 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] tracking-wider">
                          {product.brand}
                        </p>
                        <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-hover)] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-md)] transition-colors"
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-base font-heading font-medium text-[var(--color-text-primary)]">
                  No products found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  Check your spelling or explore one of our popular categories below.
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-3 text-center sm:text-left">
                Popular Searches & Categories
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {[
                  { label: 'Vitamin C Serum', href: '/search?q=Vitamin+C' },
                  { label: 'Sunscreen SPF 50', href: '/search?q=Sunscreen' },
                  { label: 'Lipsticks', href: '/category/makeup' },
                  { label: 'Argan Hair Oil', href: '/search?q=Argan' },
                  { label: 'Skincare', href: '/category/skincare' },
                  { label: 'Brushes & Tools', href: '/category/beauty-accessories' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
