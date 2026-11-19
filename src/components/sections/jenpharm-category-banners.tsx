'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui';

interface CategoryItem {
  title: string;
  subtitle: string;
  href: string;
  image: string;
}

const categories: CategoryItem[] = [
  {
    title: 'Herbal Shampoos',
    subtitle: 'Biotin & Anti-Hairfall',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
  },
  {
    title: 'Active Serums',
    subtitle: 'Rosemary Scalp Regrowth',
    href: '/category/skincare',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop&q=80',
  },
  {
    title: 'Scalp Therapy',
    subtitle: 'Neem & Anti-Dandruff',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&q=80',
  },
  {
    title: 'Radiance & Glow',
    subtitle: 'Hyaluronic & Vitamin C',
    href: '/category/skincare',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop&q=80',
  },
];

export function JenpharmCategoryBanners() {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-100">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#f8faf9] border border-slate-200/70 hover:border-emerald-600 hover:bg-[#edf5f0] transition-all duration-200 group active:scale-[0.98] cursor-pointer shadow-2xs"
            >
              {/* Circular Thumbnail */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 shadow-2xs">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="56px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <div className="w-7 h-7 rounded-full bg-white text-slate-400 group-hover:bg-emerald-800 group-hover:text-white flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-emerald-800 transition-all">
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
