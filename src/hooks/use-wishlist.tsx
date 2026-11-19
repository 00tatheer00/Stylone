'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/components/ui';

const WISHLIST_STORAGE_KEY = 'stylone_wishlist_v1';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  count: number;
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount (deferred to avoid render cascades)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setWishlistIds(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to hydrate wishlist from localStorage:', err);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Persist to localStorage whenever wishlistIds change after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (err) {
      console.warn('Failed to save wishlist to localStorage:', err);
    }
  }, [wishlistIds, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const addToWishlist = useCallback(
    async (productId: string) => {
      setWishlistIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
      const product = products.find((p) => p.id === productId);
      toast.success(
        product ? `"${product.name}" saved to wishlist!` : 'Product saved to wishlist!',
        'Wishlist Updated'
      );

      // If Supabase is connected and user is logged in, optionally sync to DB
      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('wishlist_items').upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            );
          }
        } catch {
          // Graceful fallback to client storage
        }
      }
    },
    []
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      const product = products.find((p) => p.id === productId);
      toast.info(
        product ? `"${product.name}" removed from wishlist.` : 'Item removed from wishlist.',
        'Wishlist Updated'
      );

      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('wishlist_items')
              .delete()
              .match({ user_id: user.id, product_id: productId });
          }
        } catch {
          // Graceful fallback
        }
      }
    },
    []
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [wishlistIds, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  // Derived products from catalogue
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlistIds,
      wishlistProducts,
      count: wishlistIds.length,
      isHydrated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [
      wishlistIds,
      wishlistProducts,
      isHydrated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
