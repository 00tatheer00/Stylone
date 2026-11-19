import { Suspense } from 'react';
import { AnnouncementBar, Header, Footer, MobileBottomBar } from '@/components/layout';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { AuthProvider } from '@/hooks/use-auth';
import { ToastProvider } from '@/components/ui';

/**
 * (store) route group layout — Public storefront pages.
 * Includes announcement bar, header, footer, auth, cart, wishlist, mobile bottom dock and toast context.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <MobileBottomBar />
            </Suspense>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
