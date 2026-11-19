'use client';

import { Container, SectionHeading } from '@/components/ui';
import { Star } from 'lucide-react';
import { demoTestimonials } from '@/data/demo-data';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
        { y: 30, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 md:py-20">
      <Container>
        <SectionHeading
          title="What Customers Say"
          subtitle="Real feedback from our community"
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {demoTestimonials.map((t) => (
            <div
              key={t.id}
              className="testimonial-card bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 sm:p-7 transition-all duration-300 hover:shadow-[var(--shadow-green)] hover:border-[var(--color-accent)]/20 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < t.rating
                        ? 'text-[var(--color-accent)] fill-[var(--color-accent)]'
                        : 'text-[var(--color-border)]'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {t.name}
              </p>
            </div>
          ))}
        </div>

        {/* Disclosure */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          * Testimonials shown are illustrative sample content for design purposes.
        </p>
      </Container>
    </section>
  );
}

export { Testimonials };
