'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui';

export function JenpharmTieredDeals() {
  const deals = [
    {
      top: 'Get',
      headline: '10% OFF',
      sub: 'When You Bundle 3+ Items',
      href: '/shop',
    },
    {
      top: 'Get A',
      headline: 'FREE GIFT',
      sub: 'On Orders Above 2,500 Rs.',
      href: '/shop',
    },
    {
      top: 'Enjoy',
      headline: 'FREE SHIPPING',
      sub: 'On All Orders Today',
      href: '/shop',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#1b4b8a] bg-sky-50 px-3.5 py-1 rounded-full">
              BIG SAVINGS 💸
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Clock&apos;s Ticking On These Deals:
              <span className="block text-[#1b4b8a]">Free Samples</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
              Big botanical savings are here for a short time only! Explore limited-time offers on cult-favorite essentials before these deals disappear.
            </p>
          </div>

          {/* 3 Clickable Offer Bars (Exact Jenpharm Look) */}
          <div className="space-y-3 pt-2">
            {deals.map((deal) => (
              <Link
                key={deal.headline}
                href={deal.href}
                className="w-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all duration-200 shadow-md group active:scale-[0.99] cursor-pointer"
              >
                <div className="text-left">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-200">
                    {deal.top}
                  </span>
                  <p className="font-heading text-lg sm:text-2xl font-black tracking-tight leading-tight">
                    {deal.headline}
                  </p>
                  <p className="text-xs sm:text-sm text-sky-100 font-medium">
                    {deal.sub}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#1b4b8a] transition-colors">
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>

          {/* Bundle CTA Button */}
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Build Your Own Bundle
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
