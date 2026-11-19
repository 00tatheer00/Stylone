import { Container, SectionHeading } from '@/components/ui';
import { Star } from 'lucide-react';
import { demoTestimonials } from '@/data/demo-data';

function Testimonials() {
  return (
    <section className="py-14 md:py-20">
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
              className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-6 sm:p-7"
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
