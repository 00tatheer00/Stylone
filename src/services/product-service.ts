import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { products as demoProducts } from '@/data/products';
import { adminProducts as demoAdminProducts, AdminProduct } from '@/data/admin-demo';
import type { Product, ProductCategoryName, ProductCategorySlug } from '@/types/product';

/**
 * Maps a Supabase row to the public Product model.
 * purchase_cost and supplier details are NEVER mapped or returned here.
 */
function mapDatabaseToPublicProduct(
  p: Record<string, unknown>,
  variantsMap: Map<string, Record<string, unknown>[]> = new Map(),
  imagesMap: Map<string, string[]> = new Map(),
  inventoryMap: Map<string, number> = new Map()
): Product {
  const id = p.id as string;
  const productImages = imagesMap.get(id) || [];
  const primaryImage =
    productImages[0] ||
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop&q=80';

  const brandObj = p.brands as Record<string, unknown> | null;
  const catObj = p.categories as Record<string, unknown> | null;
  const specs = (typeof p.specifications === 'object' && p.specifications ? p.specifications : {}) as Record<string, string>;

  const productVariants = (variantsMap.get(id) || []).map((v) => {
    const attrs = (v.attributes as Record<string, unknown>) || {};
    return {
      id: v.id as string,
      name: v.variant_name as string,
      sku: v.sku as string,
      type: (attrs.type || 'size') as 'size' | 'shade' | 'pack',
      price: Number(v.selling_price_override || p.selling_price),
      originalPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
      inStock: true,
      colorHex: attrs.hex as string | undefined,
    };
  });

  const stock = inventoryMap.get(id) ?? 25;

  return {
    id,
    slug: p.slug as string,
    sku: p.sku as string,
    name: p.name as string,
    brand: (brandObj?.name as string) || 'STYLONE Atelier',
    category: ((catObj?.name as string) || 'Skincare') as ProductCategoryName,
    categorySlug: ((catObj?.slug as string) || 'skincare') as ProductCategorySlug,
    productType: (specs['Formulation'] || 'Beauty Essential') as string,
    shortDescription: (p.short_description as string) || '',
    description: (p.description as string) || '',
    benefits: Array.isArray(p.benefits) ? (p.benefits as string[]) : [],
    ingredients: Array.isArray(p.ingredients) ? (p.ingredients as string[]) : [],
    howToUse: (p.how_to_use as string) || '',
    specifications: specs,
    image: primaryImage,
    images: productImages.length > 0 ? productImages : [primaryImage],
    price: Number(p.selling_price),
    originalPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
    inStock: stock > 0,
    stockQuantity: stock,
    isFeatured: Boolean(p.is_featured),
    isBestSeller: Boolean(p.is_bestseller),
    isNew: Boolean(p.is_new_arrival),
    variants: productVariants.length > 0 ? productVariants : undefined,
  };
}

/**
 * Fetch featured products for the storefront homepage.
 */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return demoProducts.filter((p) => p.isFeatured).slice(0, limit);
  }

  try {
    const supabase = await createServerSupabase();
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name, slug, short_description, description, selling_price, compare_at_price, sku, is_featured, is_bestseller, is_new_arrival, benefits, ingredients, how_to_use, specifications, categories(id, name, slug), brands(id, name, slug)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(limit);

    if (error || !dbProducts || dbProducts.length === 0) {
      return demoProducts.filter((p) => p.isFeatured).slice(0, limit);
    }

    return dbProducts.map((p) => mapDatabaseToPublicProduct(p));
  } catch {
    return demoProducts.filter((p) => p.isFeatured).slice(0, limit);
  }
}

/**
 * Fetch best-selling products for the storefront homepage.
 */
export async function getBestSellers(limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return demoProducts.filter((p) => p.isBestSeller).slice(0, limit);
  }

  try {
    const supabase = await createServerSupabase();
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name, slug, short_description, description, selling_price, compare_at_price, sku, is_featured, is_bestseller, is_new_arrival, benefits, ingredients, how_to_use, specifications, categories(id, name, slug), brands(id, name, slug)')
      .eq('status', 'active')
      .eq('is_bestseller', true)
      .limit(limit);

    if (error || !dbProducts || dbProducts.length === 0) {
      return demoProducts.filter((p) => p.isBestSeller).slice(0, limit);
    }

    return dbProducts.map((p) => mapDatabaseToPublicProduct(p));
  } catch {
    return demoProducts.filter((p) => p.isBestSeller).slice(0, limit);
  }
}

/**
 * Fetch new arrival products for the storefront homepage.
 */
export async function getNewArrivals(limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return demoProducts.filter((p) => p.isNew).slice(0, limit);
  }

  try {
    const supabase = await createServerSupabase();
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name, slug, short_description, description, selling_price, compare_at_price, sku, is_featured, is_bestseller, is_new_arrival, benefits, ingredients, how_to_use, specifications, categories(id, name, slug), brands(id, name, slug)')
      .eq('status', 'active')
      .eq('is_new_arrival', true)
      .limit(limit);

    if (error || !dbProducts || dbProducts.length === 0) {
      return demoProducts.filter((p) => p.isNew).slice(0, limit);
    }

    return dbProducts.map((p) => mapDatabaseToPublicProduct(p));
  } catch {
    return demoProducts.filter((p) => p.isNew).slice(0, limit);
  }
}

/**
 * Fetch published products for the Shop All catalogue.
 */
export async function getPublishedProducts(options?: {
  categorySlug?: string;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let result = demoProducts;
    if (options?.categorySlug) {
      result = result.filter((p) => p.categorySlug === options.categorySlug);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    return result;
  }

  try {
    const supabase = await createServerSupabase();
    let query = supabase
      .from('products')
      .select('id, name, slug, short_description, description, selling_price, compare_at_price, sku, is_featured, is_bestseller, is_new_arrival, benefits, ingredients, how_to_use, specifications, categories(id, name, slug), brands(id, name, slug)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }

    const { data: dbProducts, error } = await query;

    if (error || !dbProducts || dbProducts.length === 0) {
      let fallback = demoProducts;
      if (options?.categorySlug) {
        fallback = fallback.filter((p) => p.categorySlug === options.categorySlug);
      }
      return fallback;
    }

    let mapped = dbProducts.map((p) => mapDatabaseToPublicProduct(p));
    if (options?.categorySlug) {
      mapped = mapped.filter((p) => p.categorySlug === options.categorySlug);
    }
    return mapped;
  } catch {
    let fallback = demoProducts;
    if (options?.categorySlug) {
      fallback = fallback.filter((p) => p.categorySlug === options.categorySlug);
    }
    return fallback;
  }
}

/**
 * Fetch a single product by its unique slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = demoProducts.find((p) => p.slug === slug);
    return found || null;
  }

  try {
    const supabase = await createServerSupabase();
    const { data: p, error } = await supabase
      .from('products')
      .select('id, name, slug, short_description, description, selling_price, compare_at_price, sku, is_featured, is_bestseller, is_new_arrival, benefits, ingredients, how_to_use, specifications, categories(id, name, slug), brands(id, name, slug)')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !p) {
      return demoProducts.find((item) => item.slug === slug) || null;
    }

    // Fetch images and variants
    const [imagesRes, variantsRes] = await Promise.all([
      supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', p.id)
        .order('sort_order', { ascending: true }),
      supabase
        .from('product_variants')
        .select('id, variant_name, sku, attributes, selling_price_override')
        .eq('product_id', p.id)
        .eq('is_active', true),
    ]);

    const imagesList = imagesRes.data?.map((img) => img.image_url) || [];
    const imagesMap = new Map([[p.id, imagesList]]);
    const variantsMap = new Map([[p.id, variantsRes.data || []]]);

    return mapDatabaseToPublicProduct(p, variantsMap, imagesMap);
  } catch {
    return demoProducts.find((item) => item.slug === slug) || null;
  }
}

/**
 * Fetch related products for product detail page.
 */
export async function getRelatedProducts(currentSlug: string, categorySlug: string, limit = 4): Promise<Product[]> {
  const all = await getPublishedProducts({ categorySlug });
  return all.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

/**
 * Fetch products for the Admin management panel.
 * Includes confidential purchase_cost and supplier details.
 */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  if (!isSupabaseConfigured()) {
    return demoAdminProducts;
  }

  try {
    const supabase = await createServerSupabase();
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name, slug, sku, purchase_cost, selling_price, compare_at_price, status, product_source, is_featured, is_bestseller, is_new_arrival, categories(name), brands(name), suppliers(name)')
      .order('created_at', { ascending: false });

    if (error || !dbProducts || dbProducts.length === 0) {
      return demoAdminProducts;
    }

    return dbProducts.map((p: Record<string, unknown>) => {
      const brandObj = p.brands as Record<string, unknown> | null;
      const catObj = p.categories as Record<string, unknown> | null;
      const supObj = p.suppliers as Record<string, unknown> | null;

      return {
        id: p.id as string,
        name: p.name as string,
        slug: p.slug as string,
        sku: p.sku as string,
        brand: (brandObj?.name as string) || 'STYLONE Atelier',
        category: (catObj?.name as string) || 'Skincare',
        regularPrice: Number(p.selling_price),
        salePrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
        costPrice: Number(p.purchase_cost || 0),
        stockQuantity: 45,
        lowStockThreshold: 10,
        sourceType: (p.product_source === 'supplier' ? 'Supplier' : 'Own') as 'Own' | 'Supplier',
        supplierName: (supObj?.name as string) || undefined,
        status: p.status as 'active' | 'draft' | 'archived',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
        rating: 4.9,
        salesCount: 85,
      };
    });
  } catch {
    return demoAdminProducts;
  }
}
