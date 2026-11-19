'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const supplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().default('Lahore'),
  notes: z.string().optional(),
});

export async function createSupplierAction(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    contactPerson: (formData.get('contactPerson') as string) || '',
    email: (formData.get('email') as string) || '',
    phone: (formData.get('phone') as string) || '',
    city: (formData.get('city') as string) || 'Lahore',
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = supplierSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Validation failed',
    };
  }

  const { data } = parsed;

  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/suppliers');
    return {
      success: true,
      message: `Supplier "${data.name}" added to approved directory (Demo Environment).`,
    };
  }

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from('suppliers').insert({
      name: data.name,
      contact_person: data.contactPerson,
      email: data.email || null,
      phone: data.phone || null,
      address: `${data.city}, Pakistan`,
      notes: data.notes,
      is_active: true,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/suppliers');
    return {
      success: true,
      message: `Supplier partner "${data.name}" created and verified.`,
    };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Error creating supplier' };
  }
}
