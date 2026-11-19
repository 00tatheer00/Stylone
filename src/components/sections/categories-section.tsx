import Image from 'next/image';
import Link from 'next/link';
import { Container, SectionHeading } from '@/components/ui';
import { getActiveCategories, CategoryItem } from '@/services/category-service';

async function CategoriesSection({
  initialCategories,
}: {
  initialCategories?: CategoryItem[];
} = {}) {
  const categories = initialCategories || (await getActiveCategories());

  return (
    <section className="py-14 md:py-20">
      <Container>
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our curated collections"
          align="center"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[3/4] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-bg-secondary)]"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <h3 className="font-heading text-sm sm:text-base font-semibold text-white leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 hidden sm:block">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export { CategoriesSection };
