/**
 * STYLONE — Customer Domain Types
 * Phase 05: Customer Authentication & Account Management
 */

import { Product } from './product';
import type { OrderStatus } from './order';

export type UserRole = 'customer' | 'admin' | 'staff';

export interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface SavedAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  addressLine1: string;
  landmark?: string;
  label: AddressLabel;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  addressLine1: string;
  landmark?: string;
  label: AddressLabel;
  isDefault: boolean;
}

export type { OrderStatus };

export interface CustomerOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnail: string;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  paymentMethod: 'cod' | 'bank_transfer';
  status: OrderStatus;
  itemCount: number;
}

export interface CustomerOrderDetail extends CustomerOrderSummary {
  subtotal: number;
  shippingFee: number;
  discount: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    city: string;
    area: string;
    addressLine1: string;
    landmark?: string;
  };
  items: CustomerOrderItem[];
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: Product;
}
