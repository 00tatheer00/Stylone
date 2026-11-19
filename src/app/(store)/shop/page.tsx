import type { Metadata } from 'next';
import { getPublishedProducts } from '@/services/product-service';
import { CatalogueView } from '@/components/catalogue';
import { Breadcrumbs } from '@/components/ui';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Shop All Beauty & Cosmetics | STYLONE',
  description:
    'Browse our full collection of premium skincare, makeup, haircare, beauty accessories, and personal care. Delivered across Pakistan.',
  openGraph: {
    title: 'Shop All Beauty & Cosmetics | STYLONE',
    description:
      'Browse our full collection of premium skincare, makeup, haircare, and beauty essentials.',
  },
};

export default async function ShopPage() {
  const products = await getPublishedProducts();

  return (
    <div>
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs items={[{ label: 'Shop All' }]} />
        </Container>
      </div>

      <CatalogueView
        initialProducts={products}
        title="All Products"
        description="Explore the complete STYLONE beauty collection. Every formula and tool is physically inspected and authenticated in our facility before dispatch."
      />
    </div>
  );
}
