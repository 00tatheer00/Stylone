'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { X, Search as SearchIcon, ArrowRight, Sparkles } from 'lucide-react';
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
        'fixed inset-0 z-[80] bg-white/98 backdrop-blur-md transition-opacity duration-300 overflow-y-auto',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <Container>
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 h-20 border-b border-emerald-100">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <SearchIcon size={20} />
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skincare, serums, shade finder, lipsticks..."
            className="flex-1 bg-transparent text-base sm:text-xl text-[var(--color-text-primary)] placeholder:text-stone-400 outline-none font-medium"
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            className="p-2.5 rounded-full text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
            onClick={handleClose}
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </form>

        {/* Results / Suggestions Area */}
        <div className="py-8 max-w-2xl mx-auto">
          {query.trim() ? (
            matches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-500" />
                    <span>Matching Products ({matches.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    View all results
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="divide-y divide-emerald-50">
                  {matches.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 group hover:bg-emerald-50/70 px-3 rounded-2xl transition-all duration-200"
                    >
                      <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-emerald-50 shrink-0 border border-emerald-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                          {product.brand}
                        </p>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate group-hover:text-emerald-700 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-7 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs hover:shadow-[var(--shadow-green)] transition-all duration-200"
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <SearchIcon size={22} />
                </div>
                <p className="text-lg font-heading font-semibold text-[var(--color-text-primary)]">
                  No products found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-stone-500 mt-1.5 max-w-sm mx-auto">
                  Try checking your spelling or explore our popular beauty collections below.
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-emerald-800 mb-3 text-center sm:text-left flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-500" />
                <span>Trending Searches & Categories</span>
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {[
                  { label: '✨ Vitamin C Glow Serum', href: '/search?q=Vitamin+C' },
                  { label: 'Herbal Anti-Hairfall Shampoo', href: '/search?q=Shampoo' },
                  { label: 'Rosemary Scalp Regrowth Serum', href: '/search?q=Rosemary' },
                  { label: 'Vitamin C Radiance Serum', href: '/search?q=Serum' },
                  { label: 'Neem Anti-Dandruff Shampoo', href: '/search?q=Dandruff' },
                  { label: 'Hyaluronic Acid Plump Serum', href: '/search?q=Hyaluronic' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold rounded-full border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-900 transition-all duration-200 shadow-2xs"
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
