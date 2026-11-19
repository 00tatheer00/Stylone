'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { receiveStock, adjustStock } from '@/services/inventory-service';

export interface InventoryActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

const receiveStockSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  variantId: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be greater than zero'),
  supplierId: z.string().optional(),
  batchNumber: z.string().min(2, 'Batch number is required for cosmetics tracking'),
  expiryDate: z.string().min(4, 'Expiry date is required for quality control'),
  notes: z.string().optional(),
});

const adjustStockSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  variantId: z.string().optional(),
  quantityChange: z.number().int().refine((val) => val !== 0, 'Quantity change cannot be zero'),
  movementType: z.enum(['stock_adjustment', 'damaged', 'expired', 'correction']),
  notes: z.string().optional(),
});

export async function receiveStockAction(formData: FormData): Promise<InventoryActionResult> {
  const raw = {
    productId: formData.get('productId') as string,
    variantId: (formData.get('variantId') as string) || undefined,
    quantity: Number(formData.get('quantity') || 0),
    supplierId: (formData.get('supplierId') as string) || undefined,
    batchNumber: formData.get('batchNumber') as string,
    expiryDate: formData.get('expiryDate') as string,
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = receiveStockSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Validation failed',
    };
  }

  const res = await receiveStock(parsed.data);
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');
  return {
    success: res.success,
    message: res.message,
    error: res.error,
  };
}

export async function adjustStockAction(formData: FormData): Promise<InventoryActionResult> {
  const raw = {
    productId: formData.get('productId') as string,
    variantId: (formData.get('variantId') as string) || undefined,
    quantityChange: Number(formData.get('quantityChange') || 0),
    movementType:
      (formData.get('movementType') as
        | 'stock_adjustment'
        | 'damaged'
        | 'expired'
        | 'correction') || 'stock_adjustment',
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = adjustStockSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Validation failed',
    };
  }

  const res = await adjustStock(parsed.data);
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');
  return {
    success: res.success,
    message: res.message,
    error: res.error,
  };
}
