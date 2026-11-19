/**
 * STYLONE — Temporary demonstration product data
 *
 * Re-exports the unified typed products and maintains demo mock structures.
 * Focused on core hero lines: Herbal & Anti-Hairfall Shampoos and Active Serums.
 */

import type { DemoCategory, DemoTestimonial, DemoBenefit } from '@/types/demo';
import { products } from './products';

export const demoProducts = products;

export const demoCategories: DemoCategory[] = [
  {
    name: 'Herbal Shampoos',
    slug: 'haircare',
    description: 'Anti-hairfall, herbal & sulfate-free cleansers',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Botanical Serums',
    slug: 'skincare',
    description: 'Active face glow & hair growth scalp serums',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Anti-Hairfall Care',
    slug: 'haircare',
    description: 'Rosemary scalp tonics, oils & hair masks',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Radiance Skincare',
    slug: 'skincare',
    description: 'Ceramide creams, mineral sunscreens & toners',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Luxury Accessories',
    slug: 'beauty-accessories',
    description: 'Scalp massagers, jade rollers & applicator tools',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop&q=80',
  },
];

export const demoBenefits: DemoBenefit[] = [
  {
    title: '100% Herbal & Pure',
    description: 'Formulated with organic cold-pressed botanicals, rosemary, onion extract, and pure essential oils.',
    icon: 'sparkles',
  },
  {
    title: 'Clinical Anti-Hairfall',
    description: 'Proven scalp stimulation with caffeine, biotin, and peptides to reduce hair shedding.',
    icon: 'shield',
  },
  {
    title: 'Express COD Delivery',
    description: 'Speedy courier dispatch across Karachi, Lahore, Islamabad, and nationwide in Pakistan.',
    icon: 'truck',
  },
  {
    title: 'Safe & Cruelty Free',
    description: 'Completely free from harsh sulfates, parabens, mineral oils, and synthetic silicones.',
    icon: 'heart',
  },
];

export const demoTestimonials: DemoTestimonial[] = [
  {
    id: 'test-1',
    name: 'Ayesha Khan, Lahore',
    rating: 5,
    text: 'The Herbal Anti-Hairfall Shampoo and Rosemary Serum completely stopped my postpartum hair thinning within 4 weeks. My scalp feels invigorated and healthy!',
  },
  {
    id: 'test-2',
    name: 'Fatima Zahra, Karachi',
    rating: 5,
    text: 'STYLONE Vitamin C 15% Serum is hands down the best serum in Pakistan. It faded my dark acne marks without any stinging. Fast delivery too!',
  },
  {
    id: 'test-3',
    name: 'Dr. Mariam Bilal, Islamabad',
    rating: 5,
    text: 'As a dermatologist, I appreciate the clean ingredient lists. The Keratin sulfate-free shampoo leaves hair silky without stripping natural oils.',
  },
];

export const demoSocialImages: string[] = [
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80',
];
