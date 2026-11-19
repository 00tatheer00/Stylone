'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
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
    <div className="flex gap-3 sm:gap-4 py-4 sm:py-5 border-b border-[var(--color-border-light)] items-start">
      {/* Thumbnail */}
      <Link
        href={productHref}
        className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-bg-secondary)] shrink-0 border border-[var(--color-border-light)]"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Link
              href={productHref}
              className="text-sm sm:text-base font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-hover)] transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            {item.variantName && (
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Option: <span className="font-medium text-[var(--color-text-secondary)]">{item.variantName}</span>
              </p>
            )}
            <p className="text-xs font-semibold text-[var(--color-text-primary)] sm:hidden mt-1">
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors rounded-sm"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Bottom row: Stepper + Total */}
        <div className="flex items-center justify-between gap-3 mt-3 sm:mt-0">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)] bg-white h-9 select-none">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="w-8 h-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
              {formatPrice(itemTotal)}
            </span>
            <span className="hidden sm:block text-[11px] text-[var(--color-text-muted)]">
              {formatPrice(item.price)} each
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
