'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, Check } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { formatPKR } from '@/lib/utils';
import { useState } from 'react';

export default function WishlistPage() {
  const { wishlistProducts, removeFromWishlist, clearWishlist, count } = useWishlist();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (product: (typeof wishlistProducts)[0]) => {
    addItem({
      id: product.variants && product.variants.length > 0 ? `${product.id}-${product.variants[0].id}` : product.id,
      productId: product.id,
      variantId: product.variants && product.variants.length > 0 ? product.variants[0].id : undefined,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      variantName: product.variants && product.variants.length > 0 ? product.variants[0].name : undefined,
      quantity: 1,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-xs">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            My Curated Wishlist
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {count} {count === 1 ? 'essential item' : 'essential items'} saved for future acquisition
          </p>
        </div>
        {count > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-[var(--color-text-muted)] hover:text-rose-600 underline transition-colors"
          >
            Clear Entire Wishlist
          </button>
        )}
      </div>

      {/* Advisory regarding device storage */}
      <div className="p-3.5 rounded-[var(--radius-md)] bg-stone-50 border border-stone-200 text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
        <strong>Client Note:</strong> Wishlist items are securely saved to your current browser profile.
        When connected to your Supabase account, your wishlist is seamlessly synchronized with your private customer portal.
      </div>

      {/* Wishlist Grid */}
      {count === 0 ? (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-10 sm:p-14 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] flex items-center justify-center mb-5">
            <Heart size={26} />
          </div>
          <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mb-6 leading-relaxed">
            Explore our curated selection of fine cosmetics, fragrance and skincare, and tap the heart icon to save your desired items.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[var(--radius-md)] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent)] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <ShoppingBag size={14} />
            <span>Explore Boutique</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {wishlistProducts.map((product) => {
            const isAdded = addedId === product.id;
            return (
              <div
                key={product.id}
                className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] overflow-hidden shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-[var(--color-bg-secondary)] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white shadow-xs transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                    {product.brand && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-black/60 backdrop-blur-sm text-[10px] uppercase font-semibold text-white tracking-wider">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-heading text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1 block mb-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs font-bold text-[var(--color-text-primary)]">
                      {formatPKR(product.price)}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 px-3 rounded-[var(--radius-md)] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent)]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
