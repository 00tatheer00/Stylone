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
    subtitle: 'Anti-Hairfall & Biotin',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&h=300&fit=crop&q=80',
  },
  {
    title: 'Active Serums',
    subtitle: 'Rosemary Scalp Growth',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop&q=80',
  },
  {
    title: 'Anti-Dandruff',
    subtitle: 'Neem & Scalp Therapy',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
  },
  {
    title: 'Radiance Serums',
    subtitle: 'Vitamin C & Glow',
    href: '/category/skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop&q=80',
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
              className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-[#f8faf9] border border-slate-200/90 hover:border-emerald-700 hover:bg-[#edf5f0] transition-all duration-200 group active:scale-[0.98] cursor-pointer shadow-2xs"
            >
              {/* Circular Thumbnail */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white shrink-0 border-2 border-emerald-100 shadow-2xs">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 48px, 56px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Text Container: Full Text Visible (NO Truncate) */}
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {cat.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-800 font-bold leading-tight mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              {/* Arrow: Visible on Desktop, Hidden on Narrow Mobile to maximize text room */}
              <div className="hidden sm:flex w-7 h-7 rounded-full bg-white text-slate-400 group-hover:bg-emerald-800 group-hover:text-white items-center justify-center shrink-0 border border-slate-200 group-hover:border-emerald-800 transition-all">
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
