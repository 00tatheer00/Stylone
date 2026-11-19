import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

function HeroSection() {
  return (
    <section className="relative bg-[var(--color-bg-secondary)] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-center min-h-[480px] sm:min-h-[520px] lg:min-h-[600px] py-10 lg:py-0">
          {/* Text */}
          <div className="relative z-10 max-w-lg">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
              Premium Beauty Collection
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.1]">
              Elevate Your
              <br />
              Beauty Routine
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-md">
              Discover carefully curated skincare, makeup and beauty essentials
              from trusted brands — delivered across Pakistan.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium bg-[var(--color-text-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/category/skincare"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] hover:bg-white transition-colors duration-200"
              >
                Explore Skincare
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[320px] sm:h-[400px] lg:h-[560px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[52%]">
            <Image
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&h=1100&fit=crop&q=85"
              alt="Premium beauty products arrangement — editorial campaign image"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover rounded-[var(--radius-xl)] lg:rounded-l-[var(--radius-xl)] lg:rounded-r-none"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export { HeroSection };
