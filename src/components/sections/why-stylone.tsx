import { Container, SectionHeading } from '@/components/ui';
import { Sparkles, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';
import { demoBenefits } from '@/data/demo-data';

const iconMap = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  truck: Truck,
  heart: HeartHandshake,
} as const;

function WhyStylone() {
  return (
    <section className="py-14 md:py-20 bg-[var(--color-bg-secondary)]">
      <Container>
        <SectionHeading
          title="Why STYLONE"
          subtitle="A beauty shopping experience built on trust and care"
          align="center"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {demoBenefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-[var(--shadow-sm)] mb-4">
                  <Icon size={22} className="text-[var(--color-accent)]" />
                </div>
                <h3 className="font-heading text-base font-semibold text-[var(--color-text-primary)] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export { WhyStylone };
