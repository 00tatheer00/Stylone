import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryMeta } from '@/data/products';
import { getPublishedProducts } from '@/services/product-service';
import { CatalogueView } from '@/components/catalogue';
import { Breadcrumbs, Container } from '@/components/ui';
import type { ProductCategorySlug } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const validSlugs: ProductCategorySlug[] = [
  'skincare',
  'makeup',
  'haircare',
  'beauty-accessories',
  'personal-care',
];

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug as ProductCategorySlug];

  if (!meta) {
    return {
      title: 'Category Not Found | STYLONE',
    };
  }

  return {
    title: `${meta.name} | STYLONE Premium Beauty`,
    description: meta.description,
    openGraph: {
      title: `${meta.name} | STYLONE Premium Beauty`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!validSlugs.includes(slug as ProductCategorySlug)) {
    notFound();
  }

  const categorySlug = slug as ProductCategorySlug;
  const meta = categoryMeta[categorySlug];
  const categoryProducts = await getPublishedProducts({ categorySlug });

  return (
    <div>
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Shop', href: '/shop' },
              { label: meta.name },
            ]}
          />
        </Container>
      </div>

      <CatalogueView
        initialProducts={categoryProducts}
        title={meta.title}
        description={meta.description}
        categorySlug={categorySlug}
      />
    </div>
  );
}
