'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui';

interface CategoryBanner {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  gradient: string;
}

const banners: CategoryBanner[] = [
  {
    title: 'Shop Shampoos',
    subtitle: 'Herbal Anti-Hairfall & Biotin Growth',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop&q=80',
    gradient: 'from-[#064e3b] via-[#047857] to-[#0f766e]',
  },
  {
    title: 'Shop Serums',
    subtitle: 'Rosemary Scalp Regrowth & Active Glow',
    href: '/category/skincare',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=300&fit=crop&q=80',
    gradient: 'from-[#047857] via-[#059669] to-[#10b981]',
  },
  {
    title: 'Shop Scalp Therapy',
    subtitle: 'Anti-Dandruff & Follicle Rejuvenation',
    href: '/category/haircare',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=300&fit=crop&q=80',
    gradient: 'from-[#065f46] via-[#047857] to-[#115e59]',
  },
  {
    title: 'Shop Moisturizers & Glow',
    subtitle: 'Hyaluronic Hydration & Barrier Repair',
    href: '/category/skincare',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=300&fit=crop&q=80',
    gradient: 'from-[#059669] via-[#10b981] to-[#34d399]',
  },
];

export function JenpharmCategoryBanners() {
  return (
    <section className="py-6 sm:py-8 bg-[#f8faf9]">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {banners.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r ${item.gradient} text-white shadow-md hover:shadow-xl transition-all duration-300 h-24 sm:h-28 flex items-center justify-between px-5 sm:px-6 group active:scale-[0.98] cursor-pointer`}
            >
              {/* Text */}
              <div className="relative z-10 max-w-[62%]">
                <h3 className="font-heading text-lg sm:text-xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-100 line-clamp-1 mt-0.5 font-semibold">
                  {item.subtitle}
                </p>
              </div>

              {/* Model / Product Image */}
              <div className="relative w-20 sm:w-24 h-full shrink-0 flex items-center justify-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/60 shadow-md">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* White Round Arrow Button */}
              <div className="absolute right-3 bottom-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 rounded-full bg-white text-emerald-900 flex items-center justify-center shadow-md group-hover:bg-emerald-950 group-hover:text-white transition-colors duration-200">
                <ChevronRight size={18} className="stroke-[2.5]" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
