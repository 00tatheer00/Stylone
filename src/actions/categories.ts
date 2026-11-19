'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  sortOrder: z.number().int().default(1),
  isActive: z.boolean().default(true),
});

export async function createCategoryAction(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: (formData.get('description') as string) || '',
    image: (formData.get('image') as string) || '',
    sortOrder: Number(formData.get('sortOrder') || 1),
    isActive: formData.get('isActive') !== 'false',
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Validation failed',
    };
  }

  const { data } = parsed;

  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/categories');
    revalidatePath('/shop');
    return {
      success: true,
      message: `Category "${data.name}" registered (Demo Mode).`,
    };
  }

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from('categories').insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.image || null,
      sort_order: data.sortOrder,
      is_active: data.isActive,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/shop');
    return {
      success: true,
      message: `Category "${data.name}" created successfully.`,
    };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Server error creating category' };
  }
}
