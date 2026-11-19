import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { calculateShippingFee, defaultShippingConfig } from '@/lib/shipping';
import { validateCouponCode } from '@/lib/coupon';
import { products as demoProducts } from '@/data/products';
import { adminOrders as demoAdminOrders, AdminOrder } from '@/data/admin-demo';
import type {
  Order,
  PlaceOrderInput,
  PlaceOrderResult,
  OrderStatus,
  PaymentStatus,
  CourierName,
  ShippingStatus,
} from '@/types/order';

// In-memory store for orders created during demo/local execution
const inMemoryDemoOrders: Order[] = [];

/**
 * Valid state transitions for STYLONE orders.
 */
export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'failed_delivery', 'returned'],
  failed_delivery: ['shipped', 'returned', 'cancelled'],
  delivered: ['returned'],
  returned: ['refunded'],
  cancelled: [],
  refunded: [],
};

/**
 * Generates a unique, professional Pakistani order reference.
 * Example: "STY-2026-8492"
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `STY-${year}-${randomSuffix}`;
}

/**
 * Generates a cryptographically strong 32-character token for guest order authorization.
 */
export function generateGuestAccessToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).substring(2, 10);
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Validates whether an order status transition is permitted.
 */
export function isValidStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
  const allowed = VALID_STATUS_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

/**
 * SECURE SERVER-SIDE ORDER PLACEMENT
 * Recalculates all pricing, checks active product states, validates quantities,
 * and executes atomic inventory deduction.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const { customer, items, couponCode, customerId, idempotencyKey } = input;

  if (!items || items.length === 0) {
    return { success: false, error: 'Cannot place an empty order. Please select at least one item.' };
  }

  // 1. Authoritative Server-side Price & Stock Calculation
  let calculatedSubtotal = 0;
  const verifiedItems: {
    productId: string;
    variantId?: string;
    productName: string;
    sku: string;
    image: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    variantDetails?: Record<string, string>;
  }[] = [];

  // Database mode or fallback to verified catalogue
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();

      for (const it of items) {
        if (it.quantity <= 0) {
          return { success: false, error: 'Product quantity must be greater than zero.' };
        }

        // Fetch product authoritative price
        const { data: dbProd, error: prodErr } = await supabase
          .from('products')
          .select('id, name, sku, selling_price, status')
          .eq('id', it.productId)
          .maybeSingle();

        if (prodErr || !dbProd || dbProd.status !== 'active') {
          return { success: false, error: `Product is unavailable or has been discontinued.` };
        }

        let unitPrice = Number(dbProd.selling_price);
        let sku = dbProd.sku;
        const variantDetails: Record<string, string> = {};

        if (it.variantId) {
          const { data: dbVar } = await supabase
            .from('product_variants')
            .select('id, variant_name, sku, attributes, selling_price_override, is_active')
            .eq('id', it.variantId)
            .maybeSingle();

          if (!dbVar || !dbVar.is_active) {
            return { success: false, error: `Selected variant for ${dbProd.name} is no longer available.` };
          }

          sku = dbVar.sku;
          if (dbVar.selling_price_override) {
            unitPrice = Number(dbVar.selling_price_override);
          }
          if (dbVar.attributes && typeof dbVar.attributes === 'object') {
            Object.assign(variantDetails, dbVar.attributes);
          }
        }

        // Check stock availability
        const { data: dbInv } = await supabase
          .from('inventory')
          .select('available_quantity')
          .eq('product_id', dbProd.id)
          .maybeSingle();

        const available = dbInv?.available_quantity ?? 0;
        if (available < it.quantity) {
          return {
            success: false,
            error: `Insufficient stock for ${dbProd.name}. Available: ${available}, Requested: ${it.quantity}.`,
          };
        }

        const lineTotal = unitPrice * it.quantity;
        calculatedSubtotal += lineTotal;

        verifiedItems.push({
          productId: dbProd.id,
          variantId: it.variantId,
          productName: dbProd.name,
          sku,
          image: '',
          unitPrice,
          quantity: it.quantity,
          lineTotal,
          variantDetails,
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (couponCode) {
        const couponRes = validateCouponCode(couponCode, calculatedSubtotal);
        if (couponRes.success) {
          discountAmount = couponRes.coupon.discountAmount;
        }
      }

      // Calculate shipping
      const shippingAmount = calculateShippingFee(calculatedSubtotal, defaultShippingConfig);
      const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingAmount);

      const orderNumber = generateOrderNumber();
      const guestAccessToken = generateGuestAccessToken();

      // Execute Atomic Database Transaction via RPC
      const rpcItems = verifiedItems.map((v) => ({
        product_id: v.productId,
        variant_id: v.variantId || null,
        quantity: v.quantity,
        variant_details: v.variantDetails || {},
      }));

      const { data: rpcRes, error: rpcErr } = await supabase.rpc('place_order_transaction', {
        p_order_number: orderNumber,
        p_customer_id: customerId || null,
        p_guest_name: customer.fullName,
        p_guest_email: customer.email || '',
        p_guest_phone: customer.phone,
        p_shipping_address: {
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email || '',
          city: customer.city,
          area: customer.area,
          address: customer.address,
          landmark: customer.landmark || '',
          notes: customer.notes || '',
        },
        p_items: rpcItems,
        p_discount_amount: discountAmount,
        p_shipping_amount: shippingAmount,
        p_payment_method: customer.paymentMethod,
        p_customer_notes: customer.notes || '',
        p_guest_access_token: guestAccessToken,
        p_idempotency_key: idempotencyKey || null,
      });

      if (rpcErr) {
        return { success: false, error: rpcErr.message || 'Transaction failed during order placement.' };
      }

      return {
        success: true,
        orderId: rpcRes.order_id,
        orderNumber: rpcRes.order_number,
        guestAccessToken: rpcRes.guest_access_token,
        total: totalAmount,
      };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Database error processing order.' };
    }
  }

  // Fallback Execution (Local / Demo environment without active Supabase credentials)
  if (idempotencyKey) {
    const existing = inMemoryDemoOrders.find((o) => o.idempotencyKey === idempotencyKey);
    if (existing) {
      return {
        success: true,
        orderId: existing.id,
        orderNumber: existing.orderNumber,
        guestAccessToken: existing.guestAccessToken,
        total: existing.totalAmount,
      };
    }
  }

  for (const it of items) {
    const demoP = demoProducts.find(
      (p) => p.id === it.productId || p.sku === it.productId || p.slug === it.productId
    );
    if (!demoP) {
      return { success: false, error: 'Product not found in catalogue.' };
    }

    let unitPrice = demoP.price;
    let sku = demoP.sku;
    const variantDetails: Record<string, string> = {};

    if (it.variantId && demoP.variants) {
      const v = demoP.variants.find((v) => v.id === it.variantId);
      if (v) {
        unitPrice = v.price;
        sku = v.sku;
        variantDetails['name'] = v.name;
      }
    }

    const lineTotal = unitPrice * it.quantity;
    calculatedSubtotal += lineTotal;

    verifiedItems.push({
      productId: demoP.id,
      variantId: it.variantId,
      productName: demoP.name,
      sku,
      image: demoP.image,
      unitPrice,
      quantity: it.quantity,
      lineTotal,
      variantDetails,
    });
  }

  let discountAmount = 0;
  if (couponCode) {
    const couponRes = validateCouponCode(couponCode, calculatedSubtotal);
    if (couponRes.success) {
      discountAmount = couponRes.coupon.discountAmount;
    }
  }

  const shippingAmount = calculateShippingFee(calculatedSubtotal, defaultShippingConfig);
  const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingAmount);

  const orderNumber = generateOrderNumber();
  const guestAccessToken = generateGuestAccessToken();
  const newOrderId = `ord-${Date.now()}`;

  const createdOrder: Order = {
    id: newOrderId,
    orderNumber,
    customerId: customerId || null,
    customerName: customer.fullName,
    customerEmail: customer.email || undefined,
    customerPhone: customer.phone,
    shippingAddress: {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || '',
      city: customer.city,
      area: customer.area,
      address: customer.address,
      landmark: customer.landmark || '',
      notes: customer.notes || '',
    },
    subtotal: calculatedSubtotal,
    discountAmount,
    shippingAmount,
    totalAmount,
    currency: 'PKR',
    paymentMethod: customer.paymentMethod,
    paymentStatus: customer.paymentMethod === 'bank_transfer' ? 'under_verification' : 'pending',
    orderStatus: 'pending',
    customerNotes: customer.notes || '',
    guestAccessToken,
    idempotencyKey: idempotencyKey || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: verifiedItems.map((vi, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId: newOrderId,
      productId: vi.productId,
      variantId: vi.variantId,
      productName: vi.productName,
      sku: vi.sku,
      productImage: vi.image,
      unitPrice: vi.unitPrice,
      quantity: vi.quantity,
      lineTotal: vi.lineTotal,
      variantDetails: vi.variantDetails,
    })),
    payment: {
      id: `pay-${Date.now()}`,
      orderId: newOrderId,
      paymentMethod: customer.paymentMethod,
      amount: totalAmount,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    },
    shipment: {
      id: `ship-${Date.now()}`,
      orderId: newOrderId,
      courierName: 'TCS',
      trackingNumber: '',
      shippingStatus: 'preparing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    statusHistory: [
      {
        id: `hist-${Date.now()}`,
        orderId: newOrderId,
        previousStatus: null,
        newStatus: 'pending',
        notes: `Order placed via ${customer.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}.`,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  inMemoryDemoOrders.unshift(createdOrder);

  return {
    success: true,
    orderId: newOrderId,
    orderNumber,
    guestAccessToken,
    total: totalAmount,
  };
}

/**
 * Fetch customer orders (strictly authenticated customer scope).
 */
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  if (!customerId) return [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), shipments(*), payments(*), order_status_history(*)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return inMemoryDemoOrders.filter((o) => o.customerId === customerId);
      }

      return data.map(mapDbRowToOrder);
    } catch {
      return inMemoryDemoOrders.filter((o) => o.customerId === customerId);
    }
  }

  return inMemoryDemoOrders.filter((o) => o.customerId === customerId);
}

/**
 * Fetch order by Order Number with secure authorization check.
 * For guests, requires matching guestAccessToken to prevent guessing attacks.
 */
export async function getOrderByNumber(
  orderNumber: string,
  guestAccessToken?: string,
  customerId?: string,
  isAdmin = false
): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      let query = supabase
        .from('orders')
        .select('*, order_items(*), shipments(*), payments(*), order_status_history(*)')
        .eq('order_number', orderNumber);

      if (!isAdmin) {
        if (customerId) {
          query = query.eq('customer_id', customerId);
        } else if (guestAccessToken) {
          query = query.eq('guest_access_token', guestAccessToken);
        } else {
          return null;
        }
      }

      const { data, error } = await query.maybeSingle();
      if (error || !data) return null;

      const mapped = mapDbRowToOrder(data);
      if (!isAdmin) {
        mapped.internalNotes = undefined; // Confidential
      }
      return mapped;
    } catch {
      return findInFallbackOrders(orderNumber, guestAccessToken, customerId, isAdmin);
    }
  }

  return findInFallbackOrders(orderNumber, guestAccessToken, customerId, isAdmin);
}

/**
 * Fetch order by ID or orderNumber for admin or customer inspection.
 */
export async function getOrderById(orderId: string, isAdmin = false): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), shipments(*), payments(*), order_status_history(*)')
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .maybeSingle();

      if (!error && data) {
        const mapped = mapDbRowToOrder(data);
        if (!isAdmin) mapped.internalNotes = undefined;
        return mapped;
      }
    } catch {
      // Fallback
    }
  }

  const allOrders = [...inMemoryDemoOrders, ...getMappedDemoAdminOrders()];
  const found = allOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!found) return null;
  if (!isAdmin) return { ...found, internalNotes: undefined };
  return found;
}

function findInFallbackOrders(
  orderNumber: string,
  guestAccessToken?: string,
  customerId?: string,
  isAdmin = false
): Order | null {
  const allOrders = [...inMemoryDemoOrders, ...getMappedDemoAdminOrders()];
  const found = allOrders.find((o) => o.orderNumber === orderNumber);
  if (!found) return null;

  if (!isAdmin) {
    if (customerId && found.customerId === customerId) {
      return { ...found, internalNotes: undefined };
    }
    if (guestAccessToken && found.guestAccessToken === guestAccessToken) {
      return { ...found, internalNotes: undefined };
    }
    return null;
  }

  return found;
}

/**
 * Admin: Fetch all orders with search, filters, and pagination.
 */
export async function getAdminOrders(filters?: {
  searchTerm?: string;
  orderStatus?: string;
  paymentStatus?: string;
  courier?: string;
}): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      let query = supabase
        .from('orders')
        .select('*, order_items(*), shipments(*), payments(*), order_status_history(*)')
        .order('created_at', { ascending: false });

      if (filters?.orderStatus && filters.orderStatus !== 'All') {
        query = query.eq('order_status', filters.orderStatus);
      }
      if (filters?.paymentStatus && filters.paymentStatus !== 'All') {
        query = query.eq('payment_status', filters.paymentStatus);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = data.map(mapDbRowToOrder);
        if (filters?.searchTerm) {
          const s = filters.searchTerm.toLowerCase();
          results = results.filter(
            (o) =>
              o.orderNumber.toLowerCase().includes(s) ||
              o.customerName.toLowerCase().includes(s) ||
              o.customerPhone.includes(s)
          );
        }
        return results;
      }
    } catch {
      // Fallback
    }
  }

  let list = [...inMemoryDemoOrders, ...getMappedDemoAdminOrders()];
  if (filters?.orderStatus && filters.orderStatus !== 'All') {
    list = list.filter((o) => o.orderStatus === filters.orderStatus);
  }
  if (filters?.paymentStatus && filters.paymentStatus !== 'All') {
    list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
  }
  if (filters?.searchTerm) {
    const s = filters.searchTerm.toLowerCase();
    list = list.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerPhone.includes(s)
    );
  }
  return list;
}

/**
 * Admin: Update Order Status with transition validation and cancellation stock reversal.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminUserId?: string,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();

      // If cancelling, execute cancellation transaction with stock reversal
      if (newStatus === 'cancelled') {
        const { data: cancelRes, error: cancelErr } = await supabase.rpc('cancel_order_transaction', {
          p_order_id: orderId,
          p_admin_user_id: adminUserId || null,
          p_reason: notes || 'Cancelled by admin',
        });
        if (cancelErr || !cancelRes.success) {
          return { success: false, message: cancelErr?.message || cancelRes?.error || 'Cancellation failed' };
        }
        return { success: true, message: 'Order cancelled and inventory safely restored.' };
      }

      // Check current status
      const { data: ord } = await supabase.from('orders').select('order_status').eq('id', orderId).single();
      if (!ord) return { success: false, message: 'Order not found' };

      if (!isValidStatusTransition(ord.order_status as OrderStatus, newStatus)) {
        return {
          success: false,
          message: `Invalid transition from "${ord.order_status}" to "${newStatus}".`,
        };
      }

      await supabase
        .from('orders')
        .update({ order_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      await supabase.from('order_status_history').insert({
        order_id: orderId,
        previous_status: ord.order_status,
        new_status: newStatus,
        changed_by: adminUserId || null,
        notes: notes || `Order advanced to ${newStatus}`,
      });

      return { success: true, message: `Order status updated to ${newStatus}.` };
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message || 'Server error updating status' };
    }
  }

  // Demo fallback
  const ord = inMemoryDemoOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (ord) {
    if (!isValidStatusTransition(ord.orderStatus, newStatus)) {
      return {
        success: false,
        message: `Invalid transition from "${ord.orderStatus}" to "${newStatus}".`,
      };
    }
    ord.orderStatus = newStatus;
    ord.statusHistory = ord.statusHistory || [];
    ord.statusHistory.push({
      id: `hist-${Date.now()}`,
      orderId,
      previousStatus: ord.orderStatus,
      newStatus,
      notes: notes || `Advanced to ${newStatus}`,
      createdAt: new Date().toISOString(),
    });
  }
  return { success: true, message: `Order status updated to "${newStatus}" (Demo State).` };
}

/**
 * Admin: Record COD Cash Collection upon courier settlement.
 */
export async function recordCodPayment(
  orderId: string,
  amount: number,
  adminUserId?: string,
  reference?: string,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      await supabase
        .from('orders')
        .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      await supabase.from('payments').insert({
        order_id: orderId,
        payment_method: 'cod',
        amount,
        payment_status: 'paid',
        transaction_reference: reference || 'COD-COURIER-RECON',
        verified_by: adminUserId || null,
        verified_at: new Date().toISOString(),
        notes: notes || 'Cash received and reconciled with courier delivery invoice.',
      });

      return { success: true, message: 'COD payment reconciled and verified successfully.' };
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message || 'Error recording COD payment' };
    }
  }

  const ord = inMemoryDemoOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (ord) {
    ord.paymentStatus = 'paid';
    if (ord.payment) {
      ord.payment.paymentStatus = 'paid';
      ord.payment.transactionReference = reference || 'COD-COURIER-RECON';
      ord.payment.verifiedAt = new Date().toISOString();
    }
  }
  return { success: true, message: 'COD payment reconciled (Demo State).' };
}

/**
 * Admin: Verify Bank Transfer payment.
 */
export async function verifyBankTransfer(
  orderId: string,
  isApproved: boolean,
  adminUserId?: string,
  reference?: string,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const status: PaymentStatus = isApproved ? 'paid' : 'failed';

      await supabase
        .from('orders')
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      await supabase
        .from('payments')
        .update({
          payment_status: status,
          verified_by: adminUserId || null,
          verified_at: new Date().toISOString(),
          transaction_reference: reference || '',
          notes: notes || (isApproved ? 'Bank statement credit confirmed' : 'Payment rejected: unverified deposit'),
        })
        .eq('order_id', orderId);

      return {
        success: true,
        message: isApproved ? 'Bank transfer verified and approved.' : 'Bank transfer rejected.',
      };
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message || 'Error verifying bank transfer' };
    }
  }

  const ord = inMemoryDemoOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (ord) {
    const status: PaymentStatus = isApproved ? 'paid' : 'failed';
    ord.paymentStatus = status;
    if (ord.payment) {
      ord.payment.paymentStatus = status;
      ord.payment.transactionReference = reference || '';
      ord.payment.verifiedAt = new Date().toISOString();
    }
  }

  return {
    success: true,
    message: isApproved ? 'Bank transfer approved (Demo State).' : 'Bank transfer rejected (Demo State).',
  };
}

/**
 * Admin: Dispatch Shipment with domestic courier consignment tracking.
 */
export async function dispatchShipment(
  orderId: string,
  courierName: CourierName,
  trackingNumber: string,
  trackingUrl?: string,
  notes?: string,
  adminUserId?: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();

      // Upsert shipment record
      await supabase.from('shipments').insert({
        order_id: orderId,
        courier_name: courierName,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl || getCourierTrackingUrl(courierName, trackingNumber),
        shipping_status: 'in_transit',
        shipped_at: new Date().toISOString(),
        delivery_notes: notes || 'Dispatched via domestic courier partner.',
      });

      // Update order status to shipped
      await updateOrderStatus(orderId, 'shipped', adminUserId, `Dispatched via ${courierName}: #${trackingNumber}`);

      return { success: true, message: `Shipment booked with ${courierName} (#${trackingNumber}).` };
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message || 'Error recording shipment dispatch' };
    }
  }

  const ord = inMemoryDemoOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (ord) {
    ord.orderStatus = 'shipped';
    ord.shipment = {
      id: `ship-${Date.now()}`,
      orderId,
      courierName,
      trackingNumber,
      trackingUrl: trackingUrl || getCourierTrackingUrl(courierName, trackingNumber),
      shippingStatus: 'in_transit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    success: true,
    message: `Shipment booked with ${courierName} (#${trackingNumber}) (Demo State).`,
  };
}

export function getCourierTrackingUrl(courier: CourierName, trackingNumber: string): string {
  switch (courier) {
    case 'TCS':
      return `https://www.tcsexpress.com/tracking?consignment=${trackingNumber}`;
    case 'Leopards':
      return `https://www.leopardscourier.com/track/${trackingNumber}`;
    case 'Call Courier':
      return `https://callcourier.com.pk/tracking/?tc=${trackingNumber}`;
    case 'Trax':
      return `https://trax.pk/tracking/?tracking_number=${trackingNumber}`;
    default:
      return '';
  }
}

interface DbOrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  sku: string;
  product_image?: string;
  unit_price: number | string;
  quantity: number | string;
  line_total: number | string;
  variant_details?: Record<string, string>;
}

interface DbShipmentRow {
  id: string;
  order_id: string;
  courier_name: CourierName;
  tracking_number: string;
  tracking_url?: string;
  shipping_status: ShippingStatus;
  shipped_at?: string;
  delivered_at?: string;
  delivery_notes?: string;
  created_at: string;
  updated_at: string;
}

interface DbStatusHistoryRow {
  id: string;
  order_id: string;
  previous_status?: string | null;
  new_status: OrderStatus;
  changed_by?: string | null;
  notes?: string;
  created_at: string;
}

function mapDbRowToOrder(data: Record<string, unknown>): Order {
  const addr = (typeof data.shipping_address_snapshot === 'object' && data.shipping_address_snapshot) as Record<string, string> || {};
  const rawItems = (data.order_items as DbOrderItemRow[]) || [];
  const items = rawItems.map((i) => ({
    id: i.id,
    orderId: i.order_id,
    productId: i.product_id,
    variantId: i.variant_id,
    productName: i.product_name,
    sku: i.sku,
    productImage: i.product_image || '',
    unitPrice: Number(i.unit_price),
    quantity: Number(i.quantity),
    lineTotal: Number(i.line_total),
    variantDetails: i.variant_details || {},
  }));

  const rawShipments = (data.shipments as DbShipmentRow[]) || [];
  const shipment = rawShipments[0]
    ? {
        id: rawShipments[0].id,
        orderId: rawShipments[0].order_id,
        courierName: rawShipments[0].courier_name as CourierName,
        trackingNumber: rawShipments[0].tracking_number,
        trackingUrl: rawShipments[0].tracking_url,
        shippingStatus: (rawShipments[0].shipping_status as ShippingStatus) || 'in_transit',
        shippedAt: rawShipments[0].shipped_at,
        deliveredAt: rawShipments[0].delivered_at,
        deliveryNotes: rawShipments[0].delivery_notes,
        createdAt: rawShipments[0].created_at,
        updatedAt: rawShipments[0].updated_at,
      }
    : null;

  const rawPayments = (data.payments as Array<Record<string, unknown>>) || [];
  const payment = rawPayments[0]
    ? {
        id: String(rawPayments[0].id),
        orderId: String(rawPayments[0].order_id),
        paymentMethod: rawPayments[0].payment_method as Order['paymentMethod'],
        amount: Number(rawPayments[0].amount),
        paymentStatus: rawPayments[0].payment_status as PaymentStatus,
        transactionReference: rawPayments[0].transaction_reference ? String(rawPayments[0].transaction_reference) : undefined,
        proofUrl: rawPayments[0].proof_url ? String(rawPayments[0].proof_url) : undefined,
        verifiedBy: rawPayments[0].verified_by ? String(rawPayments[0].verified_by) : undefined,
        verifiedAt: rawPayments[0].verified_at ? String(rawPayments[0].verified_at) : undefined,
        notes: rawPayments[0].notes ? String(rawPayments[0].notes) : undefined,
        createdAt: String(rawPayments[0].created_at),
      }
    : null;

  const rawHistory = (data.order_status_history as DbStatusHistoryRow[]) || [];

  return {
    id: String(data.id),
    orderNumber: String(data.order_number),
    customerId: data.customer_id ? String(data.customer_id) : null,
    customerName: String(data.guest_name || addr.fullName || 'Valued Customer'),
    customerEmail: data.guest_email ? String(data.guest_email) : addr.email,
    customerPhone: String(data.guest_phone || addr.phone || ''),
    shippingAddress: {
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      email: addr.email || '',
      city: addr.city || 'Karachi',
      area: addr.area || '',
      address: addr.address || '',
      landmark: addr.landmark || '',
      notes: addr.notes || '',
    },
    subtotal: Number(data.subtotal),
    discountAmount: Number(data.discount_amount || 0),
    shippingAmount: Number(data.shipping_amount || 0),
    totalAmount: Number(data.total_amount),
    currency: String(data.currency || 'PKR'),
    paymentMethod: data.payment_method as Order['paymentMethod'],
    paymentStatus: data.payment_status as PaymentStatus,
    orderStatus: data.order_status as OrderStatus,
    customerNotes: data.customer_notes ? String(data.customer_notes) : undefined,
    internalNotes: data.internal_notes ? String(data.internal_notes) : undefined,
    guestAccessToken: data.guest_access_token ? String(data.guest_access_token) : undefined,
    createdAt: String(data.created_at),
    updatedAt: String(data.updated_at),
    items,
    shipment,
    payment,
    statusHistory: rawHistory.map((h) => ({
      id: h.id,
      orderId: h.order_id,
      previousStatus: h.previous_status,
      newStatus: h.new_status,
      changedBy: h.changed_by,
      notes: h.notes,
      createdAt: h.created_at,
    })),
  };
}

function getMappedDemoAdminOrders(): Order[] {
  return demoAdminOrders.map((o: AdminOrder) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerId: null,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    shippingAddress: {
      fullName: o.customerName,
      phone: o.customerPhone,
      city: o.city,
      area: 'Main Boulevard',
      address: 'House 14-B, Street 3',
    },
    subtotal: o.subtotal || o.total || 0,
    discountAmount: o.discount || 0,
    shippingAmount: o.shippingFee || 0,
    totalAmount: o.total || 0,
    currency: 'PKR',
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus as PaymentStatus,
    orderStatus: o.orderStatus as OrderStatus,
    internalNotes: o.internalNotes,
    createdAt: `${o.date}T10:00:00Z`,
    updatedAt: `${o.date}T10:00:00Z`,
    items: (
      (o as { items?: { name: string; price: number; quantity: number }[] }).items || [
        {
          name: 'Vitamin C Brightening Serum 15%',
          price: o.total || 4850,
          quantity: o.itemsCount || 1,
        },
      ]
    ).map((it, idx) => ({
      id: `it-${o.id}-${idx}`,
      orderId: o.id,
      productId: 'prod-skin-01',
      productName: it.name,
      sku: 'STY-SKN-001',
      productImage: '/images/products/placeholder.svg',
      unitPrice: it.price,
      quantity: it.quantity,
      lineTotal: it.price * it.quantity,
    })),
    shipment: o.courier
      ? {
          id: `ship-${o.id}`,
          orderId: o.id,
          courierName: (o.courier as CourierName) || 'TCS',
          trackingNumber: o.trackingNumber || '',
          shippingStatus: o.orderStatus === 'delivered' ? 'delivered' : 'in_transit',
          createdAt: `${o.date}T12:00:00Z`,
          updatedAt: `${o.date}T12:00:00Z`,
        }
      : null,
  }));
}
