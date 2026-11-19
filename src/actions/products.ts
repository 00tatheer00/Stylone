'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  regularPrice: z.number().positive('Selling price must be greater than 0'),
  costPrice: z.number().min(0, 'Purchase cost cannot be negative'),
  salePrice: z.number().optional(),
  stockQuantity: z.number().int().min(0, 'Stock cannot be negative'),
  sourceType: z.enum(['Own', 'Supplier']),
  status: z.enum(['active', 'draft', 'archived']),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
});

export async function createProductAction(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    sku: formData.get('sku') as string,
    categoryId: (formData.get('categoryId') as string) || undefined,
    brand: (formData.get('brand') as string) || 'STYLONE Atelier',
    regularPrice: Number(formData.get('regularPrice') || 0),
    costPrice: Number(formData.get('costPrice') || 0),
    salePrice: formData.get('salePrice') ? Number(formData.get('salePrice')) : undefined,
    stockQuantity: Number(formData.get('stockQuantity') || 0),
    sourceType: (formData.get('sourceType') as 'Own' | 'Supplier') || 'Own',
    status: (formData.get('status') as 'active' | 'draft' | 'archived') || 'active',
    description: (formData.get('description') as string) || '',
    image: (formData.get('image') as string) || '',
    batchNumber: (formData.get('batchNumber') as string) || '',
    expiryDate: (formData.get('expiryDate') as string) || '',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Validation failed',
    };
  }

  const { data } = parsed;

  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return {
      success: true,
      message: `Formulation "${data.name}" staged in catalogue (Demo Environment).`,
    };
  }

  try {
    const supabase = await createServerSupabase();

    const { data: newProd, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        selling_price: data.regularPrice,
        purchase_cost: data.costPrice,
        compare_at_price: data.salePrice || null,
        product_source: data.sourceType === 'Supplier' ? 'supplier' : 'own',
        status: data.status,
        description: data.description || '',
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert Image if provided
    if (data.image) {
      await supabase.from('product_images').insert({
        product_id: newProd.id,
        image_url: data.image,
        is_primary: true,
        sort_order: 1,
      });
    }

    // Initialize Inventory
    await supabase.from('inventory').insert({
      product_id: newProd.id,
      available_quantity: data.stockQuantity,
      reserved_quantity: 0,
      reorder_level: 5,
    });

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return {
      success: true,
      message: `Formulation "${data.name}" added to database with initial stock of ${data.stockQuantity} units.`,
    };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Server error creating product' };
  }
}

export async function archiveProductAction(id: string) {
  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true, message: 'Product archived (Demo Environment).' };
  }

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from('products')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true, message: 'Product archived successfully.' };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
