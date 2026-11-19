import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { getProductBySlug, getRelatedProducts } from '@/services/product-service';
import {
  ProductGallery,
  ProductPurchaseBox,
  ProductAccordion,
  FrequentlyBoughtTogether,
  RecentlyViewed,
} from '@/components/product';
import { ProductCard } from '@/components/shared/product-card';
import { Breadcrumbs, Container, SectionHeading } from '@/components/ui';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | STYLONE',
    };
  }

  return {
    title: `${product.name} | ${product.brand} | STYLONE`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ${product.brand} | STYLONE`,
      description: product.shortDescription,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.slug, product.categorySlug, 4);

  return (
    <div>
      {/* Breadcrumbs Bar */}
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Shop', href: '/shop' },
              {
                label: product.category,
                href: `/category/${product.categorySlug}`,
              },
              { label: product.name },
            ]}
          />
        </Container>
      </div>

      <div className="py-8 md:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Gallery Column */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Purchase & Details Column */}
            <div className="space-y-8">
              <ProductPurchaseBox product={product} />
              <FrequentlyBoughtTogether currentProduct={product} />
              <ProductAccordion product={product} />
            </div>
          </div>
        </Container>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-12 border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]/30">
          <Container>
            <SectionHeading
              title="You May Also Like"
              subtitle="Complementary formulas for your ritual"
              align="center"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Recently Viewed Component */}
      <RecentlyViewed currentProductSlug={product.slug} />
    </div>
  );
}
