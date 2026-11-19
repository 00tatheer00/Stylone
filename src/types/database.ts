/**
-- STYLONE Database Schema Types
-- Generated & validated for Supabase PostgreSQL
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin' | 'staff';
export type ProductSource = 'own' | 'supplier';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type InventoryMovementType =
  | 'stock_received'
  | 'stock_adjustment'
  | 'damaged'
  | 'expired'
  | 'return_received'
  | 'correction';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed_delivery'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'cod' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'under_verification' | 'paid' | 'failed' | 'refunded';
export type CourierName = 'TCS' | 'Leopards' | 'Call Courier' | 'Trax' | 'Other';
export type ShippingStatus =
  | 'preparing'
  | 'booked'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'returned';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          province: string;
          city: string;
          area: string;
          address_line1: string;
          landmark: string | null;
          postal_code: string | null;
          label: 'Home' | 'Work' | 'Other';
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          province?: string;
          city: string;
          area: string;
          address_line1: string;
          landmark?: string | null;
          postal_code?: string | null;
          label?: 'Home' | 'Work' | 'Other';
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          province?: string;
          city?: string;
          area?: string;
          address_line1?: string;
          landmark?: string | null;
          postal_code?: string | null;
          label?: 'Home' | 'Work' | 'Other';
          is_default?: boolean;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          notes?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          category_id: string | null;
          brand_id: string | null;
          product_source: ProductSource;
          supplier_id: string | null;
          purchase_cost: number; // Confidential
          selling_price: number;
          compare_at_price: number | null;
          sku: string;
          barcode: string | null;
          status: ProductStatus;
          is_featured: boolean;
          is_bestseller: boolean;
          is_new_arrival: boolean;
          meta_title: string | null;
          meta_description: string | null;
          benefits: Json;
          ingredients: Json;
          how_to_use: string | null;
          specifications: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          product_source?: ProductSource;
          supplier_id?: string | null;
          purchase_cost?: number;
          selling_price: number;
          compare_at_price?: number | null;
          sku: string;
          barcode?: string | null;
          status?: ProductStatus;
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_new_arrival?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          benefits?: Json;
          ingredients?: Json;
          how_to_use?: string | null;
          specifications?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          product_source?: ProductSource;
          supplier_id?: string | null;
          purchase_cost?: number;
          selling_price?: number;
          compare_at_price?: number | null;
          sku?: string;
          barcode?: string | null;
          status?: ProductStatus;
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_new_arrival?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          benefits?: Json;
          ingredients?: Json;
          how_to_use?: string | null;
          specifications?: Json;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          variant_name: string;
          sku: string;
          attributes: Json;
          selling_price_override: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_name: string;
          sku: string;
          attributes?: Json;
          selling_price_override?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_name?: string;
          sku?: string;
          attributes?: Json;
          selling_price_override?: number | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          available_quantity: number;
          reserved_quantity: number;
          reorder_level: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          available_quantity?: number;
          reserved_quantity?: number;
          reorder_level?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          available_quantity?: number;
          reserved_quantity?: number;
          reorder_level?: number;
          updated_at?: string;
        };
      };
      inventory_movements: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          movement_type: InventoryMovementType;
          quantity: number;
          reference: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          movement_type: InventoryMovementType;
          quantity: number;
          reference?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          movement_type?: InventoryMovementType;
          quantity?: number;
          reference?: string | null;
          notes?: string | null;
        };
      };
      inventory_batches: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          batch_number: string;
          expiry_date: string;
          quantity_received: number;
          remaining_quantity: number;
          supplier_id: string | null;
          received_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          batch_number: string;
          expiry_date: string;
          quantity_received: number;
          remaining_quantity: number;
          supplier_id?: string | null;
          received_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          batch_number?: string;
          expiry_date?: string;
          quantity_received?: number;
          remaining_quantity?: number;
          supplier_id?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          guest_name: string | null;
          guest_email: string | null;
          guest_phone: string;
          shipping_address_snapshot: Json;
          subtotal: number;
          discount_amount: number;
          shipping_amount: number;
          total_amount: number;
          currency: string;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          order_status: OrderStatus;
          customer_notes: string | null;
          internal_notes: string | null;
          guest_access_token: string | null;
          idempotency_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone: string;
          shipping_address_snapshot: Json;
          subtotal: number;
          discount_amount?: number;
          shipping_amount?: number;
          total_amount: number;
          currency?: string;
          payment_method: PaymentMethod;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          customer_notes?: string | null;
          internal_notes?: string | null;
          guest_access_token?: string | null;
          idempotency_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string;
          shipping_address_snapshot?: Json;
          subtotal?: number;
          discount_amount?: number;
          shipping_amount?: number;
          total_amount?: number;
          currency?: string;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          customer_notes?: string | null;
          internal_notes?: string | null;
          guest_access_token?: string | null;
          idempotency_key?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          product_name: string;
          variant_details: Json;
          sku: string;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          product_name: string;
          variant_details?: Json;
          sku: string;
          product_image?: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          product_name?: string;
          variant_details?: Json;
          sku?: string;
          product_image?: string | null;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          previous_status: string | null;
          new_status: string;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          previous_status?: string | null;
          new_status: string;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          previous_status?: string | null;
          new_status?: string;
          changed_by?: string | null;
          notes?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          payment_method: PaymentMethod;
          amount: number;
          payment_status: PaymentStatus;
          transaction_reference: string | null;
          proof_url: string | null;
          verified_by: string | null;
          verified_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          payment_method: PaymentMethod;
          amount: number;
          payment_status?: PaymentStatus;
          transaction_reference?: string | null;
          proof_url?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          payment_method?: PaymentMethod;
          amount?: number;
          payment_status?: PaymentStatus;
          transaction_reference?: string | null;
          proof_url?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
        };
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          courier_name: CourierName;
          tracking_number: string | null;
          tracking_url: string | null;
          shipping_status: ShippingStatus;
          shipped_at: string | null;
          delivered_at: string | null;
          delivery_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          courier_name?: CourierName;
          tracking_number?: string | null;
          tracking_url?: string | null;
          shipping_status?: ShippingStatus;
          shipped_at?: string | null;
          delivered_at?: string | null;
          delivery_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          courier_name?: CourierName;
          tracking_number?: string | null;
          tracking_url?: string | null;
          shipping_status?: ShippingStatus;
          shipped_at?: string | null;
          delivered_at?: string | null;
          delivery_notes?: string | null;
          updated_at?: string;
        };
      };
      business_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      storefront_products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          category_id: string | null;
          category_name: string | null;
          category_slug: string | null;
          brand_id: string | null;
          brand_name: string | null;
          brand_slug: string | null;
          selling_price: number;
          compare_at_price: number | null;
          sku: string;
          status: ProductStatus;
          is_featured: boolean;
          is_bestseller: boolean;
          is_new_arrival: boolean;
          meta_title: string | null;
          meta_description: string | null;
          benefits: Json;
          ingredients: Json;
          how_to_use: string | null;
          specifications: Json;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
