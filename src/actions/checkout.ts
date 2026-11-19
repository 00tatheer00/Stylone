'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { checkoutFormSchema } from '@/lib/validations/checkout';
import { placeOrder } from '@/services/order-service';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import type { PlaceOrderResult } from '@/types/order';

const checkoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be greater than zero'),
});

const placeOrderPayloadSchema = z.object({
  customer: checkoutFormSchema,
  items: z.array(checkoutItemSchema).min(1, 'Shopping bag must contain at least one item'),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export type PlaceOrderPayload = z.infer<typeof placeOrderPayloadSchema>;

export async function placeOrderAction(payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
  const parsed = placeOrderPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid checkout payload.',
    };
  }

  const { customer, items, couponCode, idempotencyKey } = parsed.data;

  // Retrieve authenticated customer ID if logged in
  let customerId: string | null = null;
  try {
    const user = await getAuthenticatedUser();
    if (user) {
      customerId = user.id;
    }
  } catch {
    customerId = null;
  }

  const result = await placeOrder({
    customerId,
    customer,
    items,
    couponCode,
    idempotencyKey,
  });

  if (result.success) {
    revalidatePath('/admin/orders');
    revalidatePath('/admin/inventory');
    revalidatePath('/account/orders');
  }

  return result;
}
