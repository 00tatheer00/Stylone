/**
 * STYLONE — Temporary demonstration product data
 *
 * Re-exports the unified typed products and maintains demo mock structures.
 */

import type { DemoCategory, DemoTestimonial, DemoBenefit } from '@/types/demo';
import { products } from './products';

export const demoProducts = products;

export const demoCategories: DemoCategory[] = [
  {
    name: 'Skincare',
    slug: 'skincare',
    description: 'Premium cleansers, serums & moisturizers',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=600&h=700&fit=crop&q=80',
  },
  {
    name: 'Makeup',
    slug: 'makeup',
    description: 'Foundations, lipsticks & palettes',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=700&fit=crop&q=80',
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    description: 'Shampoos, treatments & styling',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=700&fit=crop&q=80',
  },
  {
    name: 'Beauty Accessories',
    slug: 'beauty-accessories',
    description: 'Brushes, tools & organisers',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=700&fit=crop&q=80',
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Body care & self-care essentials',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=700&fit=crop&q=80',
  },
];

export const demoBenefits: DemoBenefit[] = [
  {
    title: 'Carefully Selected',
    description: 'Every product is hand-picked and quality-checked before it reaches you.',
    icon: 'sparkles',
  },
  {
    title: 'Quality Focused',
    description: 'We source from trusted brands and inspect every item in our facility.',
    icon: 'shield',
  },
  {
    title: 'Convenient Delivery',
    description: 'Fast, reliable delivery across Pakistan with careful packaging.',
    icon: 'truck',
  },
  {
    title: 'Customer First',
    description: 'Dedicated support to help you find the perfect products for your needs.',
    icon: 'heart',
  },
];

export const demoTestimonials: DemoTestimonial[] = [
  {
    id: 't-1',
    name: 'Ayesha R.',
    text: 'The packaging was beautiful and the products arrived in perfect condition. Very impressed with the quality.',
    rating: 5,
  },
  {
    id: 't-2',
    name: 'Fatima K.',
    text: 'Finally a beauty store in Pakistan that feels premium. The skincare selection is excellent.',
    rating: 5,
  },
  {
    id: 't-3',
    name: 'Sana M.',
    text: 'Quick delivery and genuine products. STYLONE has become my go-to for beauty shopping.',
    rating: 4,
  },
];

export const demoSocialImages = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&q=75',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=75',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop&q=75',
  'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=300&h=300&fit=crop&q=75',
  'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=300&h=300&fit=crop&q=75',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop&q=75',
];
