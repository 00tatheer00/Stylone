/**
 * STYLONE — Product & Catalogue Types
 */

export type ProductCategoryName =
  | 'Skincare'
  | 'Makeup'
  | 'Haircare'
  | 'Beauty Accessories'
  | 'Personal Care';

export type ProductCategorySlug =
  | 'skincare'
  | 'makeup'
  | 'haircare'
  | 'beauty-accessories'
  | 'personal-care';

export type SkinType =
  | 'All Skin Types'
  | 'Dry'
  | 'Oily'
  | 'Combination'
  | 'Sensitive'
  | 'Normal'
  | 'Dehydrated'
  | 'Acne-Prone';

export type HairType =
  | 'All Hair Types'
  | 'Dry & Damaged'
  | 'Curly & Wavy'
  | 'Fine & Limp'
  | 'Color-Treated'
  | 'Thinning & Hairfall'
  | 'Weak & Brittle'
  | 'Dandruff Prone'
  | 'Oily Scalp';

export interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'shade' | 'pack';
  sku: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  colorHex?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategoryName;
  categorySlug: ProductCategorySlug;
  productType: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  specifications: Record<string, string>;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  badge?: string;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  skinType?: SkinType[];
  hairType?: HairType[];
  variants?: ProductVariant[];
  shade?: string;
  shadeHex?: string;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc';

export interface FilterState {
  category: ProductCategorySlug[];
  brand: string[];
  priceRange: [number, number];
  availability: 'all' | 'in-stock';
  skinType: string[];
  hairType: string[];
  productType: string[];
}
