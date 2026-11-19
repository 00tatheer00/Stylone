import type { Metadata } from 'next';
import { OrderConfirmationClient } from './order-confirmation-client';
import { Breadcrumbs, Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Order Confirmation | STYLONE',
  description: 'Thank you for your order with STYLONE.',
};

export default function OrderConfirmationPage() {
  return (
    <div>
      <div className="bg-[var(--color-bg-secondary)]/50 py-3 border-b border-[var(--color-border-light)]">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Shopping Bag', href: '/cart' },
              { label: 'Order Confirmation' },
            ]}
          />
        </Container>
      </div>

      <OrderConfirmationClient />
    </div>
  );
}
