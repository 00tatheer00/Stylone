import Image from 'next/image';
import { Container, SectionHeading } from '@/components/ui';
import { InstagramIcon } from '@/components/icons/social-icons';
import { demoSocialImages } from '@/data/demo-data';

function SocialGallery() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <SectionHeading
          title="Follow @STYLONE"
          subtitle="Join our beauty community"
          align="center"
        />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {demoSocialImages.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-bg-secondary)]"
              aria-label={`Social gallery image ${i + 1} (placeholder)`}
            >
              <Image
                src={src}
                alt={`Beauty inspiration ${i + 1} — social gallery placeholder`}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                <InstagramIcon
                  width={20}
                  height={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            </a>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
          Images shown are placeholder content for design purposes.
        </p>
      </Container>
    </section>
  );
}

export { SocialGallery };
