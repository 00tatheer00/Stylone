'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  updateOrderStatus,
  recordCodPayment,
  verifyBankTransfer,
  dispatchShipment,
  getCustomerOrders,
  getOrderByNumber,
  getOrderById,
  getAdminOrders,
} from '@/services/order-service';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import type { OrderStatus, CourierName } from '@/types/order';

const statusTransitionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  newStatus: z.enum([
    'pending',
    'confirmed',
    'processing',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
    'failed_delivery',
    'returned',
    'refunded',
  ]),
  notes: z.string().optional(),
});

export async function updateOrderStatusAction(formData: FormData) {
  const raw = {
    orderId: formData.get('orderId') as string,
    newStatus: formData.get('newStatus') as OrderStatus,
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = statusTransitionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || 'Invalid status transition input' };
  }

  const user = await getAuthenticatedUser();
  const res = await updateOrderStatus(parsed.data.orderId, parsed.data.newStatus, user?.id, parsed.data.notes);

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
  revalidatePath('/admin/inventory');
  return res;
}

const codPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().positive('Collection amount must be positive'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export async function recordCodPaymentAction(formData: FormData) {
  const raw = {
    orderId: formData.get('orderId') as string,
    amount: Number(formData.get('amount') || 0),
    reference: (formData.get('reference') as string) || '',
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = codPaymentSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || 'Invalid payment record input' };
  }

  const user = await getAuthenticatedUser();
  const res = await recordCodPayment(
    parsed.data.orderId,
    parsed.data.amount,
    user?.id,
    parsed.data.reference,
    parsed.data.notes
  );

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
  return res;
}

const verifyTransferSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  isApproved: z.boolean(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export async function verifyBankTransferAction(formData: FormData) {
  const raw = {
    orderId: formData.get('orderId') as string,
    isApproved: formData.get('isApproved') === 'true',
    reference: (formData.get('reference') as string) || '',
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = verifyTransferSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || 'Invalid verification input' };
  }

  const user = await getAuthenticatedUser();
  const res = await verifyBankTransfer(
    parsed.data.orderId,
    parsed.data.isApproved,
    user?.id,
    parsed.data.reference,
    parsed.data.notes
  );

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
  return res;
}

const dispatchShipmentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  courierName: z.enum(['TCS', 'Leopards', 'Call Courier', 'Trax', 'Other']),
  trackingNumber: z.string().min(2, 'Tracking consignment number is required'),
  trackingUrl: z.string().optional(),
  notes: z.string().optional(),
});

export async function dispatchShipmentAction(formData: FormData) {
  const raw = {
    orderId: formData.get('orderId') as string,
    courierName: (formData.get('courierName') as CourierName) || 'TCS',
    trackingNumber: formData.get('trackingNumber') as string,
    trackingUrl: (formData.get('trackingUrl') as string) || '',
    notes: (formData.get('notes') as string) || '',
  };

  const parsed = dispatchShipmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || 'Invalid consignment input' };
  }

  const user = await getAuthenticatedUser();
  const res = await dispatchShipment(
    parsed.data.orderId,
    parsed.data.courierName,
    parsed.data.trackingNumber,
    parsed.data.trackingUrl,
    parsed.data.notes,
    user?.id
  );

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
  return res;
}

export async function getCustomerOrdersAction() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, orders: [] };
  const orders = await getCustomerOrders(user.id);
  return { success: true, orders };
}

export async function getCustomerOrderAction(orderIdOrNumber: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, order: null };
  const order = await getOrderById(orderIdOrNumber, false);
  if (!order || (order.customerId && order.customerId !== user.id)) {
    return { success: false, order: null };
  }
  return { success: true, order };
}

export async function getAdminOrdersAction(filters?: {
  searchTerm?: string;
  orderStatus?: string;
  paymentStatus?: string;
}) {
  const orders = await getAdminOrders(filters);
  return { success: true, orders };
}

export async function getAdminOrderByIdAction(orderIdOrNumber: string) {
  const order = await getOrderById(orderIdOrNumber, true);
  return { success: true, order };
}

export async function getGuestOrderAction(orderNumber: string, guestAccessToken: string) {
  const order = await getOrderByNumber(orderNumber, guestAccessToken);
  return { success: Boolean(order), order };
}
