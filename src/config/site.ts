export const siteConfig = {
  name: 'STYLONE',
  description: 'Premium Cosmetics & Beauty — Pakistan\'s luxury beauty destination.',
  url: 'https://stylone.pk',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  locale: 'en-PK',
  categories: [
    'Skincare',
    'Makeup',
    'Haircare',
    'Beauty Accessories',
    'Personal Care',
  ] as const,
} as const;

export type Category = (typeof siteConfig.categories)[number];
