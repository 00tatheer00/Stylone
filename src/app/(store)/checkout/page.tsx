import type { Metadata } from 'next';
import { CheckoutView } from '@/components/checkout';
import { Breadcrumbs, Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Checkout | STYLONE',
  description: 'Fast, secure checkout with Cash on Delivery across Pakistan.',
  openGraph: {
    title: 'Checkout | STYLONE',
    description: 'Fast, secure checkout with Cash on Delivery across Pakistan.',
  },
};

export default function CheckoutPage() {
  return (
    <div>
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Shopping Bag', href: '/cart' },
              { label: 'Checkout' },
            ]}
          />
        </Container>
      </div>

      <CheckoutView />
    </div>
  );
}
