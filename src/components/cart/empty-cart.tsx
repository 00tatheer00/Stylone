import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
      <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-100 via-green-50 to-emerald-200 text-emerald-700 mb-6 shadow-sm">
        <ShoppingBag size={42} strokeWidth={1.5} className="animate-float" />
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
          <Sparkles size={14} />
        </div>
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
        Your Shopping Bag is Empty
      </h2>
      <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
        Your beauty ritual awaits! Discover curated halal skincare, radiant makeup, and hair treatments formulated for genuine glow.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs hover:shadow-[var(--shadow-green)] transition-all duration-200 active:scale-95"
        >
          <span>Start Shopping</span>
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/category/skincare"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold border border-emerald-300 text-emerald-900 bg-white hover:bg-emerald-50 rounded-xl transition-all duration-200"
        >
          Explore Skincare
        </Link>
      </div>
    </div>
  );
}
