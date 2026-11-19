'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[540px] pb-1 sm:pb-0 scrollbar-none shrink-0">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shrink-0 border transition-all',
                activeIndex === idx
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-emerald-100 hover:border-emerald-300 opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${idx + 1} of ${productName}`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative flex-1 aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)]">
        <Image
          src={galleryImages[activeIndex]}
          alt={`${productName} - View ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Navigation arrows (if multiple images) */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-all"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter indicator */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white select-none">
            {activeIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>
    </div>
  );
}
