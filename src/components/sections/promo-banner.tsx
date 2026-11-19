import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

function PromoBanner() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)] min-h-[320px] sm:min-h-[380px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Text */}
            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
                The Skincare Edit
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
                Your Glow-Up
                <br />
                Starts Here
              </h2>
              <p className="mt-4 text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
                Explore our curated skincare collection — cleansers, serums
                and moisturizers chosen for real results.
              </p>
              <Link
                href="/category/skincare"
                className="inline-flex items-center gap-2 mt-7 px-6 py-3 text-sm font-medium bg-[var(--color-text-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                Shop Skincare
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Image */}
            <div className="relative h-[260px] sm:h-[320px] lg:h-full lg:absolute lg:right-0 lg:top-0 lg:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=700&h=500&fit=crop&q=80"
                alt="Skincare collection campaign — premium beauty products"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { PromoBanner };
