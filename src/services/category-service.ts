import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { demoCategories } from '@/data/demo-data';
import { adminCategories, AdminCategory } from '@/data/admin-demo';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * Fetch all active categories for the public storefront.
 */
export async function getActiveCategories(): Promise<CategoryItem[]> {
  if (!isSupabaseConfigured()) {
    return demoCategories.map((c, i) => ({
      id: `cat-demo-${i + 1}`,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      sortOrder: i + 1,
      isActive: true,
    }));
  }

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return demoCategories.map((c, i) => ({
        id: `cat-demo-${i + 1}`,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        sortOrder: i + 1,
        isActive: true,
      }));
    }

    return data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image_url || 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=800&q=80',
      sortOrder: cat.sort_order,
      isActive: cat.is_active,
    }));
  } catch {
    return demoCategories.map((c, i) => ({
      id: `cat-demo-${i + 1}`,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      sortOrder: i + 1,
      isActive: true,
    }));
  }
}

/**
 * Fetch a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  const all = await getActiveCategories();
  const found = all.find((c) => c.slug === slug);
  return found || null;
}

/**
 * Fetch all categories for the Admin dashboard.
 */
export async function getAdminCategories(): Promise<AdminCategory[]> {
  if (!isSupabaseConfigured()) {
    return adminCategories;
  }

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, sort_order, is_active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return adminCategories;
    }

    return data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
      productCount: 4,
      sortOrder: cat.sort_order,
      isActive: cat.is_active,
    }));
  } catch {
    return adminCategories;
  }
}
