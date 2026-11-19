import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'STYLONE — Premium Cosmetics & Beauty',
    template: '%s | STYLONE',
  },
  description:
    'Pakistan\'s luxury destination for premium skincare, makeup, haircare and beauty accessories.',
  keywords: [
    'cosmetics',
    'beauty',
    'skincare',
    'makeup',
    'haircare',
    'Pakistan',
    'premium beauty',
  ],
  authors: [{ name: 'STYLONE' }],
  creator: 'STYLONE',
  metadataBase: new URL('https://stylone.pk'),
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'STYLONE',
    title: 'STYLONE — Premium Cosmetics & Beauty',
    description:
      'Pakistan\'s luxury destination for premium skincare, makeup, haircare and beauty accessories.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F0FAF0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
