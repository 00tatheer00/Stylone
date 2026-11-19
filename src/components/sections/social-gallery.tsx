'use client';

import Image from 'next/image';
import { Container, SectionHeading } from '@/components/ui';
import { InstagramIcon } from '@/components/icons/social-icons';
import { demoSocialImages } from '@/data/demo-data';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

function SocialGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.social-item',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
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
          title="Follow @STYLONE"
          subtitle="Join our community for daily beauty rituals, glow secrets and new drops"
          align="center"
        />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
          {demoSocialImages.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-item group relative aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] hover:border-[var(--color-accent)]/50 hover:shadow-[var(--shadow-green)] transition-all duration-300"
              aria-label={`Social gallery post ${i + 1}`}
            >
              <Image
                src={src}
                alt={`Beauty inspiration ${i + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-white">
                <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md mb-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <InstagramIcon width={20} height={20} className="text-white drop-shadow-sm" />
                </div>
                <span className="text-[11px] font-medium tracking-wide uppercase">@stylone</span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-[var(--color-text-muted)]">
          Tag <span className="font-semibold text-[var(--color-accent-hover)]">#StyloneBeauty</span> to be featured on our official showcase.
        </p>
      </Container>
    </section>
  );
}

export { SocialGallery };
