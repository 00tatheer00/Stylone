import type { Metadata } from 'next';
import { CartView } from '@/components/cart';
import { Breadcrumbs, Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Shopping Bag | STYLONE',
  description: 'Review your selected premium cosmetics, skincare, and beauty items.',
  openGraph: {
    title: 'Shopping Bag | STYLONE',
    description: 'Review your selected premium cosmetics, skincare, and beauty items.',
  },
};

export default function CartPage() {
  return (
    <div>
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />
        </Container>
      </div>

      <CartView />
    </div>
  );
}
