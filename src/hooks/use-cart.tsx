'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  type AppliedCoupon,
  type DemoCoupon,
  validateAndApplyCoupon,
} from '@/lib/coupon';
import { defaultShippingConfig, calculateShippingFee, getRemainingForFreeShipping } from '@/lib/shipping';
import { toast } from '@/components/ui';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug?: string;
  variantName?: string;
  productId?: string;
  variantId?: string;
}

export interface AddItemInput {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  slug?: string;
  variantName?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingRemaining: number;
  freeShippingThreshold: number;
  appliedCoupon: AppliedCoupon | null;
  addItem: (item: AddItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'stylone_cart_items_v1';
const COUPON_STORAGE_KEY = 'stylone_cart_coupon_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<DemoCoupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedItems = localStorage.getItem(CART_STORAGE_KEY);
        const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
          }
        }
        if (storedCoupon) {
          const parsedCoupon = JSON.parse(storedCoupon);
          if (parsedCoupon?.code) {
            setCoupon(parsedCoupon);
          }
        }
      } catch {
        // Storage unavailable or private mode
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Sync back to localStorage whenever items or coupon change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Ignore write errors
    }
  }, [items, coupon, isHydrated]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Derived applied coupon and discount (pure derivation, no effect cascades)
  const appliedCoupon: AppliedCoupon | null = useMemo(() => {
    if (!coupon || subtotal === 0) return null;
    if (subtotal < coupon.minPurchase) return null;

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, subtotal);

    return {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      discountAmount: discount,
    };
  }, [coupon, subtotal]);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = calculateShippingFee(subtotal);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const itemCount = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const freeShippingRemaining = useMemo(() => {
    return getRemainingForFreeShipping(subtotal);
  }, [subtotal]);

  // Actions
  const addItem = useCallback((newItem: AddItemInput) => {
    const qty = newItem.quantity && newItem.quantity > 0 ? newItem.quantity : 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: Math.min(10, i.quantity + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          quantity: Math.min(10, qty),
          slug: newItem.slug,
          variantName: newItem.variantName,
        },
      ];
    });
    toast.success(`"${newItem.name}" added to shopping bag!`, 'Added to Bag');
  }, []);

  const updateQuantity = useCallback((id: string, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(10, newQty) } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        toast.info(`"${item.name}" removed from bag.`, 'Bag Updated');
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    toast.info('All items cleared from your bag.', 'Bag Cleared');
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const res = validateAndApplyCoupon(code, subtotal);
      if (res.success) {
        setCoupon({
          code: res.coupon.code,
          type: res.coupon.type,
          value: res.coupon.value,
          description: res.coupon.description,
          minPurchase: 0, // already validated
        });
        toast.success(res.message, 'Coupon Applied');
        return { success: true, message: res.message };
      }
      toast.error(res.message, 'Coupon Error');
      return { success: false, message: res.message };
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    toast.info('Promotional coupon removed.', 'Coupon Removed');
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingRemaining,
        freeShippingThreshold: defaultShippingConfig.freeShippingThreshold,
        appliedCoupon,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
