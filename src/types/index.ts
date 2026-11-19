/**
 * STYLONE — Shared TypeScript Types
 *
 * Central type definitions used across the application.
 * Domain-specific types (Product, Order, etc.) will be added in later phases.
 */

/** Common API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export * from './product';
export * from './order';
export * from './customer';
export type {
  Database,
  Json,
  ProductSource,
  ProductStatus,
  InventoryMovementType,
} from './database';

