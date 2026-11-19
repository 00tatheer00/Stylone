'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/hooks/use-cart';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const itemTotal = item.price * item.quantity;
  const productHref = item.slug ? `/product/${item.slug}` : '/shop';

  return (
    <div className="flex gap-4 sm:gap-5 py-5 border-b border-emerald-100/80 items-start group hover:bg-emerald-50/30 p-2 sm:p-3 rounded-2xl transition-colors duration-200">
      {/* Thumbnail */}
      <Link
        href={productHref}
        className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-b from-white to-emerald-50 shrink-0 border border-emerald-100 shadow-2xs group-hover:border-emerald-300 transition-colors"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Link
              href={productHref}
              className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] hover:text-emerald-700 transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            {item.variantName && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100/60 font-medium text-emerald-800">
                <span>Option:</span>
                <span className="font-bold">{item.variantName}</span>
              </p>
            )}
            <p className="text-xs font-bold text-emerald-700 sm:hidden mt-1.5">
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-xl"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Bottom row: Stepper + Total */}
        <div className="flex items-center justify-between gap-3 mt-4 sm:mt-0">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-emerald-200 rounded-xl bg-white h-9.5 select-none shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-9 h-full flex items-center justify-center text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-9 text-center text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="w-9 h-full flex items-center justify-center text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <span className="text-base sm:text-lg font-extrabold text-[var(--color-text-primary)]">
              {formatPrice(itemTotal)}
            </span>
            <span className="hidden sm:block text-[11px] text-[var(--color-text-muted)] font-medium">
              {formatPrice(item.price)} each
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
