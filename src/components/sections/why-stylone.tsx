'use client';

import { Container, SectionHeading } from '@/components/ui';
import { Sparkles, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';
import { demoBenefits } from '@/data/demo-data';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

const iconMap = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  truck: Truck,
  heart: HeartHandshake,
} as const;

function WhyStylone() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.benefit-card',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 md:py-20 bg-[var(--color-bg-secondary)] relative overflow-hidden">
      <Container>
        <SectionHeading
          title="Why STYLONE"
          subtitle="A premium beauty shopping experience built on trust, care and authenticity"
          align="center"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {demoBenefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div
                key={benefit.title}
                className="benefit-card group text-center p-6 rounded-2xl bg-white/70 backdrop-blur-xs border border-[var(--color-border-light)] hover:bg-white hover:border-[var(--color-accent)]/40 hover:shadow-[var(--shadow-green)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-green-50 text-[var(--color-accent-hover)] shadow-xs mb-4 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-emerald-500 group-hover:to-green-400 group-hover:text-white transition-all duration-300">
                  <Icon size={26} className="transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-hover)] transition-colors">
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
