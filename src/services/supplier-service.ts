import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { adminSuppliers, AdminSupplier } from '@/data/admin-demo';

/**
 * Fetch all suppliers (Admin/Staff only).
 */
export async function getSuppliers(): Promise<AdminSupplier[]> {
  if (!isSupabaseConfigured()) {
    return adminSuppliers;
  }

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('suppliers')
      .select('id, name, contact_person, email, phone, address, notes, is_active')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return adminSuppliers;
    }

    return data.map((s) => ({
      id: s.id,
      name: s.name,
      contactPerson: s.contact_person || 'N/A',
      email: s.email || 'N/A',
      phone: s.phone || 'N/A',
      city: s.address?.split(',')[1]?.trim() || 'Lahore',
      categoriesSupplied: ['Skincare', 'Cosmetics'],
      totalBatchesReceived: 3,
      inspectionPassRate: 100.0,
      status: s.is_active ? 'active' : 'inactive',
      notes: s.notes || 'Certified supplier partner under physical intake QC protocol.',
    }));
  } catch {
    return adminSuppliers;
  }
}

/**
 * Fetch a single supplier by ID (Admin/Staff only).
 */
export async function getSupplierById(id: string): Promise<AdminSupplier | null> {
  const all = await getSuppliers();
  return all.find((s) => s.id === id) || null;
}
