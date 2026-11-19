import type { CartItem } from '@/hooks/use-cart';
import type { OrderFinancials } from '@/lib/pricing';
import type { CheckoutFormData } from '@/lib/validations/checkout';
import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CourierName,
  ShippingStatus,
} from './database';

export type { OrderStatus, PaymentMethod, PaymentStatus, CourierName, ShippingStatus };

export interface OrderItemSnapshot {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantDetails?: Record<string, string>;
  sku: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderAddressSnapshot {
  fullName: string;
  phone: string;
  email?: string;
  province?: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderStatusHistoryRecord {
  id: string;
  orderId: string;
  previousStatus?: string | null;
  newStatus: OrderStatus;
  changedBy?: string | null;
  notes?: string;
  createdAt: string;
}

export interface OrderPaymentRecord {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionReference?: string;
  proofUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface OrderShipmentRecord {
  id: string;
  orderId: string;
  courierName: CourierName;
  trackingNumber: string;
  trackingUrl?: string;
  shippingStatus: ShippingStatus;
  shippedAt?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: OrderAddressSnapshot;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  customerNotes?: string;
  internalNotes?: string;
  guestAccessToken?: string;
  idempotencyKey?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemSnapshot[];
  shipment?: OrderShipmentRecord | null;
  payment?: OrderPaymentRecord | null;
  statusHistory?: OrderStatusHistoryRecord[];
}

export interface PlaceOrderInput {
  customerId?: string | null;
  customer: CheckoutFormData;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  couponCode?: string;
  idempotencyKey?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  guestAccessToken?: string;
  total?: number;
  error?: string;
}

/** Legacy type for backward compatibility */
export interface DemoOrder {
  orderReference: string;
  createdAt: string;
  customer: CheckoutFormData;
  items: CartItem[];
  financials: OrderFinancials;
  couponCode?: string;
  guestAccessToken?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  courier?: string;
  trackingNumber?: string;
}
