import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const headingFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

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
  themeColor: '#F6F0E8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
