/**
 * Demo data types — Preserved and extended for Phase 3
 */

import type { Product } from './product';

export type DemoProduct = Product;

export interface DemoCategory {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface DemoTestimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface DemoBenefit {
  title: string;
  description: string;
  icon: 'sparkles' | 'shield' | 'truck' | 'heart';
}
