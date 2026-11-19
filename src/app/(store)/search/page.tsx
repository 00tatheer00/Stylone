import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPublishedProducts } from '@/services/product-service';
import { CatalogueView } from '@/components/catalogue';
import { Breadcrumbs, Container, LoadingIndicator } from '@/components/ui';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const term = q ? `"${q}"` : 'Products';
  return {
    title: `Search: ${term} | STYLONE`,
    description: `Search results for ${term} on STYLONE — Pakistan's premium beauty destination.`,
  };
}

async function SearchContent({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const matchedProducts = await getPublishedProducts({ search: query });

  return (
    <div>
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Shop', href: '/shop' },
              { label: query ? `Search: "${query}"` : 'Search' },
            ]}
          />
        </Container>
      </div>

      <CatalogueView
        initialProducts={matchedProducts}
        title={query ? `Results for "${query}"` : 'All Products'}
        description={
          query
            ? `Showing results matching your query. Found ${matchedProducts.length} ${
                matchedProducts.length === 1 ? 'product' : 'products'
              }.`
            : 'Explore our full cosmetics and beauty collection.'
        }
      />
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center">
          <LoadingIndicator label="Searching products..." />
        </div>
      }
    >
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}
