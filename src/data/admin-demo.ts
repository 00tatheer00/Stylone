/**
 * STYLONE — Admin Demonstration Dataset
 * Phase 06: Admin Dashboard & Business Management UI
 *
 * All records in this file are isolated demonstration models representing
 * typical operations for a luxury Pakistani cosmetics e-commerce store.
 * These are strictly for UI preview and are isolated from production databases.
 */

export interface AdminKPI {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
}

export interface AdminRevenueDataPoint {
  month: string;
  revenue: number; // in PKR
  orders: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  regularPrice: number;
  salePrice?: number;
  costPrice: number; // Strictly confidential purchase cost
  stockQuantity: number;
  lowStockThreshold: number;
  sourceType: 'Own' | 'Supplier';
  supplierName?: string;
  status: 'active' | 'draft' | 'archived';
  image: string;
  batchNumber?: string;
  expiryDate?: string;
  rating: number;
  salesCount: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  date: string;
  itemsCount: number;
  total: number;
  totalAmount?: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  paymentMethod: 'cod' | 'bank_transfer';
  paymentStatus: 'paid' | 'pending' | 'under_verification' | 'failed' | 'refunded';
  orderStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'packed'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  courier?: 'TCS' | 'Leopards' | 'Trax' | 'Call Courier';
  trackingNumber?: string;
  internalNotes?: string;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
    variant?: string;
  }>;
}

export interface AdminInventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  costPrice: number;
  retailPrice: number;
  batchNumber: string;
  expiryDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastMovement: string;
}

export interface AdminSupplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  categoriesSupplied: string[];
  totalBatchesReceived: number;
  inspectionPassRate: number; // percentage
  status: 'active' | 'inactive';
  notes: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  registeredDate: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Inventory Manager' | 'Order Dispatcher' | 'Customer Care';
  status: 'active' | 'invited';
  lastActive: string;
}

// -------------------------------------------------------------
// DEMONSTRATION KPI DATA
// -------------------------------------------------------------
export const adminKPIs: AdminKPI[] = [
  {
    label: 'Total Net Revenue',
    value: 'Rs. 2,485,000',
    change: '+14.8%',
    trend: 'up',
    timeframe: 'vs last month',
  },
  {
    label: 'Total Orders',
    value: '642',
    change: '+9.2%',
    trend: 'up',
    timeframe: 'vs last month',
  },
  {
    label: 'Pending Dispatches',
    value: '28',
    change: '-4.1%',
    trend: 'down',
    timeframe: 'requiring packing',
  },
  {
    label: 'Successful Deliveries',
    value: '584',
    change: '94.2%',
    trend: 'up',
    timeframe: 'fulfillment rate',
  },
  {
    label: 'Active Customers',
    value: '1,280',
    change: '+18.5%',
    trend: 'up',
    timeframe: 'registered clients',
  },
  {
    label: 'Low Stock Alerts',
    value: '6 Items',
    change: 'Action Needed',
    trend: 'neutral',
    timeframe: 'below safety limit',
  },
];

// -------------------------------------------------------------
// 12-MONTH REVENUE HISTORY
// -------------------------------------------------------------
export const adminRevenueHistory: AdminRevenueDataPoint[] = [
  { month: 'Jan', revenue: 1420000, orders: 380 },
  { month: 'Feb', revenue: 1650000, orders: 420 },
  { month: 'Mar', revenue: 1890000, orders: 490 },
  { month: 'Apr', revenue: 2150000, orders: 540 },
  { month: 'May', revenue: 1980000, orders: 510 },
  { month: 'Jun', revenue: 2240000, orders: 570 },
  { month: 'Jul', revenue: 2100000, orders: 530 },
  { month: 'Aug', revenue: 2380000, orders: 600 },
  { month: 'Sep', revenue: 2520000, orders: 630 },
  { month: 'Oct', revenue: 2410000, orders: 610 },
  { month: 'Nov', revenue: 2790000, orders: 710 },
  { month: 'Dec', revenue: 3150000, orders: 820 },
];

// -------------------------------------------------------------
// DEMO PRODUCTS
// -------------------------------------------------------------
export const adminProducts: AdminProduct[] = [
  {
    id: 'prod-01',
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    sku: 'STY-SKN-001',
    brand: 'LUMIÈRE',
    category: 'Skincare',
    regularPrice: 3850,
    salePrice: 3450,
    costPrice: 1950,
    stockQuantity: 42,
    lowStockThreshold: 10,
    sourceType: 'Own',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    batchNumber: 'LUM-2026-B1',
    expiryDate: '2028-06-30',
    rating: 4.9,
    salesCount: 312,
  },
  {
    id: 'prod-02',
    name: 'Hydrating Daily Moisturizer',
    slug: 'hydrating-daily-moisturizer',
    sku: 'STY-SKN-002',
    brand: 'ÉCLAT',
    category: 'Skincare',
    regularPrice: 2950,
    costPrice: 1400,
    stockQuantity: 28,
    lowStockThreshold: 12,
    sourceType: 'Supplier',
    supplierName: 'DermaCos Pak Ltd',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    batchNumber: 'ECL-2026-04',
    expiryDate: '2028-03-15',
    rating: 4.8,
    salesCount: 245,
  },
  {
    id: 'prod-03',
    name: 'Velvet Matte Lipstick (Ruby Noir)',
    slug: 'velvet-matte-lipstick',
    sku: 'STY-MKP-001',
    brand: 'ROUGE ÉTERNEL',
    category: 'Makeup',
    regularPrice: 2450,
    salePrice: 2150,
    costPrice: 950,
    stockQuantity: 18,
    lowStockThreshold: 15,
    sourceType: 'Own',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80',
    batchNumber: 'RGE-2026-RN',
    expiryDate: '2029-01-20',
    rating: 4.9,
    salesCount: 420,
  },
  {
    id: 'prod-04',
    name: 'Silk Infusion Hair Treatment Mask',
    slug: 'silk-infusion-hair-treatment-mask',
    sku: 'STY-HAR-001',
    brand: 'SOIE NOIRE',
    category: 'Haircare',
    regularPrice: 4200,
    costPrice: 2200,
    stockQuantity: 6,
    lowStockThreshold: 10,
    sourceType: 'Supplier',
    supplierName: 'PureHerb Botanicals Lahore',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80',
    batchNumber: 'SOI-2025-X2',
    expiryDate: '2027-11-30',
    rating: 4.7,
    salesCount: 188,
  },
  {
    id: 'prod-05',
    name: 'Rose Quartz Facial Sculpting Roller',
    slug: 'rose-quartz-facial-sculpting-roller',
    sku: 'STY-ACC-001',
    brand: 'AURA',
    category: 'Beauty Accessories',
    regularPrice: 2650,
    costPrice: 1100,
    stockQuantity: 34,
    lowStockThreshold: 8,
    sourceType: 'Own',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
    batchNumber: 'AUR-RQ-09',
    rating: 4.6,
    salesCount: 142,
  },
  {
    id: 'prod-06',
    name: 'Botanical Body Oil & Elixir',
    slug: 'botanical-body-oil-elixir',
    sku: 'STY-PER-001',
    brand: 'FLEUR DE NUIT',
    category: 'Personal Care',
    regularPrice: 3500,
    costPrice: 1750,
    stockQuantity: 4,
    lowStockThreshold: 10,
    sourceType: 'Supplier',
    supplierName: 'Glamour Imports Karachi',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1608248597359-3a322e70e303?w=400&q=80',
    batchNumber: 'FLR-2026-B8',
    expiryDate: '2028-09-10',
    rating: 4.8,
    salesCount: 95,
  },
];

// -------------------------------------------------------------
// DEMO CATEGORIES
// -------------------------------------------------------------
export const adminCategories: AdminCategory[] = [
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Serums, moisturizers, gentle cleansers, SPF and nourishing facial oils.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    productCount: 14,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-makeup',
    name: 'Makeup',
    slug: 'makeup',
    description: 'Lipsticks, foundations, setting powders, mascaras and eye pigments.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80',
    productCount: 12,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-haircare',
    name: 'Haircare',
    slug: 'haircare',
    description: 'Bond repair treatments, hair masks, botanical oils and styling elixirs.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80',
    productCount: 8,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-accessories',
    name: 'Beauty Accessories',
    slug: 'beauty-accessories',
    description: 'Facial rollers, blending sponges, luxury brushes and silk sleep masks.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
    productCount: 6,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Luxury body oils, fragrance mists, gentle exfoliators and hand salves.',
    image: 'https://images.unsplash.com/photo-1608248597359-3a322e70e303?w=400&q=80',
    productCount: 5,
    sortOrder: 5,
    isActive: true,
  },
];

// -------------------------------------------------------------
// DEMO ORDERS
// -------------------------------------------------------------
export const adminOrders: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'STY-782910',
    customerName: 'Amina Tariq',
    customerEmail: 'amina.t@example.com',
    customerPhone: '0301-4458921',
    city: 'Lahore',
    area: 'Gulberg III',
    address: 'House 42, Street 8, Block B',
    landmark: 'Near Mini Market',
    date: '2026-11-18 14:32',
    itemsCount: 3,
    subtotal: 9250,
    discount: 500,
    shippingFee: 0,
    total: 8750,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    courier: 'TCS',
    trackingNumber: 'TCS-991204812',
    internalNotes: 'Client requested evening delivery after 5 PM.',
  },
  {
    id: 'ord-102',
    orderNumber: 'STY-782909',
    customerName: 'Zainab Qureshi',
    customerEmail: 'zainab.q@example.com',
    customerPhone: '0321-9871234',
    city: 'Karachi',
    area: 'DHA Phase 6',
    address: 'Bungalow 12-C, 24th Commercial Street',
    date: '2026-11-18 11:15',
    itemsCount: 2,
    subtotal: 6800,
    discount: 680,
    shippingFee: 0,
    total: 6120,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    courier: 'Leopards',
    trackingNumber: 'LEO-48192041',
    internalNotes: 'Bank receipt verified on WhatsApp by accounts desk.',
  },
  {
    id: 'ord-103',
    orderNumber: 'STY-782908',
    customerName: 'Hira Shah',
    customerEmail: 'hira.s@example.com',
    customerPhone: '0333-5128901',
    city: 'Islamabad',
    area: 'Sector F-7/2',
    address: 'House 19, Street 41',
    date: '2026-11-17 19:40',
    itemsCount: 1,
    subtotal: 2950,
    discount: 0,
    shippingFee: 250,
    total: 3200,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'packed',
    courier: 'TCS',
    trackingNumber: 'TCS-819283120',
  },
  {
    id: 'ord-104',
    orderNumber: 'STY-782907',
    customerName: 'Mahnoor Khan',
    customerEmail: 'mahnoor.k@example.com',
    customerPhone: '0300-8812903',
    city: 'Faisalabad',
    area: 'Civil Lines',
    address: '14-A Stadium Road',
    date: '2026-11-17 16:05',
    itemsCount: 4,
    subtotal: 12400,
    discount: 1000,
    shippingFee: 0,
    total: 11400,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    courier: 'Trax',
    trackingNumber: 'TRX-19283819',
  },
  {
    id: 'ord-105',
    orderNumber: 'STY-782906',
    customerName: 'Fatima Siddiqui',
    customerEmail: 'fatima.s@example.com',
    customerPhone: '0312-3498120',
    city: 'Rawalpindi',
    area: 'Bahria Town Phase 4',
    address: 'Villa 55, Street 12',
    date: '2026-11-16 10:20',
    itemsCount: 2,
    subtotal: 5800,
    discount: 0,
    shippingFee: 0,
    total: 5800,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    courier: 'TCS',
    trackingNumber: 'TCS-710293812',
  },
  {
    id: 'ord-106',
    orderNumber: 'STY-782905',
    customerName: 'Sara Bilal',
    customerEmail: 'sara.b@example.com',
    customerPhone: '0345-1209381',
    city: 'Multan',
    area: 'Cantt',
    address: 'House 88, Officers Colony',
    date: '2026-11-15 15:55',
    itemsCount: 1,
    subtotal: 2450,
    discount: 0,
    shippingFee: 250,
    total: 2700,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'pending',
  },
];

// -------------------------------------------------------------
// DEMO INVENTORY ITEMS
// -------------------------------------------------------------
export const adminInventory: AdminInventoryItem[] = [
  {
    id: 'inv-01',
    productId: 'prod-01',
    productName: 'Vitamin C Brightening Serum',
    sku: 'STY-SKN-001',
    category: 'Skincare',
    currentStock: 42,
    lowStockThreshold: 10,
    costPrice: 1950,
    retailPrice: 3850,
    batchNumber: 'LUM-2026-B1',
    expiryDate: '2028-06-30',
    status: 'in_stock',
    lastMovement: '2026-11-15 (+50 units received)',
  },
  {
    id: 'inv-02',
    productId: 'prod-02',
    productName: 'Hydrating Daily Moisturizer',
    sku: 'STY-SKN-002',
    category: 'Skincare',
    currentStock: 28,
    lowStockThreshold: 12,
    costPrice: 1400,
    retailPrice: 2950,
    batchNumber: 'ECL-2026-04',
    expiryDate: '2028-03-15',
    status: 'in_stock',
    lastMovement: '2026-11-12 (-4 units shipped)',
  },
  {
    id: 'inv-03',
    productId: 'prod-04',
    productName: 'Silk Infusion Hair Treatment Mask',
    sku: 'STY-HAR-001',
    category: 'Haircare',
    currentStock: 6,
    lowStockThreshold: 10,
    costPrice: 2200,
    retailPrice: 4200,
    batchNumber: 'SOI-2025-X2',
    expiryDate: '2027-11-30',
    status: 'low_stock',
    lastMovement: '2026-11-18 (-2 units shipped)',
  },
  {
    id: 'inv-04',
    productId: 'prod-06',
    productName: 'Botanical Body Oil & Elixir',
    sku: 'STY-PER-001',
    category: 'Personal Care',
    currentStock: 4,
    lowStockThreshold: 10,
    costPrice: 1750,
    retailPrice: 3500,
    batchNumber: 'FLR-2026-B8',
    expiryDate: '2028-09-10',
    status: 'low_stock',
    lastMovement: '2026-11-17 (-1 unit shipped)',
  },
  {
    id: 'inv-05',
    productId: 'prod-07',
    productName: 'Niacinamide Pore Refining Toner',
    sku: 'STY-SKN-004',
    category: 'Skincare',
    currentStock: 0,
    lowStockThreshold: 15,
    costPrice: 1250,
    retailPrice: 2650,
    batchNumber: 'LUM-2025-N9',
    expiryDate: '2027-08-20',
    status: 'out_of_stock',
    lastMovement: '2026-11-14 (Depleted)',
  },
];

// -------------------------------------------------------------
// DEMO SUPPLIERS
// -------------------------------------------------------------
export const adminSuppliers: AdminSupplier[] = [
  {
    id: 'sup-01',
    name: 'DermaCos Pak Ltd',
    contactPerson: 'Mr. Tariq Mehmood',
    email: 'procurement@dermacos.pk',
    phone: '042-35891200',
    city: 'Lahore',
    categoriesSupplied: ['Skincare', 'Personal Care'],
    totalBatchesReceived: 24,
    inspectionPassRate: 98.5,
    status: 'active',
    notes: 'Primary supplier for certified dermatological formulations. Prompt delivery.',
  },
  {
    id: 'sup-02',
    name: 'PureHerb Botanicals Lahore',
    contactPerson: 'Dr. Shahida Parveen',
    email: 'info@pureherb.com.pk',
    phone: '042-37812900',
    city: 'Lahore',
    categoriesSupplied: ['Haircare', 'Personal Care'],
    totalBatchesReceived: 16,
    inspectionPassRate: 96.0,
    status: 'active',
    notes: 'Organic cold-pressed oils and herbal hair masks. High purity standard.',
  },
  {
    id: 'sup-03',
    name: 'Glamour Imports Karachi',
    contactPerson: 'Kamran Merchant',
    email: 'k.merchant@glamourimports.pk',
    phone: '021-34589012',
    city: 'Karachi',
    categoriesSupplied: ['Makeup', 'Beauty Accessories'],
    totalBatchesReceived: 31,
    inspectionPassRate: 99.1,
    status: 'active',
    notes: 'Direct importer of European luxury pigments and accessories. Quality inspected at Port Qasim.',
  },
  {
    id: 'sup-04',
    name: 'Luxe Precision Brushes Sialkot',
    contactPerson: 'Rizwan Butt',
    email: 'orders@luxeprecision.com',
    phone: '052-4291820',
    city: 'Sialkot',
    categoriesSupplied: ['Beauty Accessories'],
    totalBatchesReceived: 12,
    inspectionPassRate: 100.0,
    status: 'active',
    notes: 'Export-quality artisanal cosmetic brushes, eyelash curlers and tweezer tools.',
  },
];

// -------------------------------------------------------------
// DEMO CUSTOMERS
// -------------------------------------------------------------
export const adminCustomers: AdminCustomer[] = [
  {
    id: 'cust-01',
    name: 'Amina Tariq',
    email: 'amina.t@example.com',
    phone: '0301-4458921',
    city: 'Lahore',
    registeredDate: '2026-03-12',
    totalOrders: 6,
    totalSpend: 34500,
    lastOrderDate: '2026-11-18',
    status: 'active',
  },
  {
    id: 'cust-02',
    name: 'Zainab Qureshi',
    email: 'zainab.q@example.com',
    phone: '0321-9871234',
    city: 'Karachi',
    registeredDate: '2026-04-05',
    totalOrders: 4,
    totalSpend: 28400,
    lastOrderDate: '2026-11-18',
    status: 'active',
  },
  {
    id: 'cust-03',
    name: 'Hira Shah',
    email: 'hira.s@example.com',
    phone: '0333-5128901',
    city: 'Islamabad',
    registeredDate: '2026-07-20',
    totalOrders: 2,
    totalSpend: 7800,
    lastOrderDate: '2026-11-17',
    status: 'active',
  },
  {
    id: 'cust-04',
    name: 'Mahnoor Khan',
    email: 'mahnoor.k@example.com',
    phone: '0300-8812903',
    city: 'Faisalabad',
    registeredDate: '2026-02-14',
    totalOrders: 8,
    totalSpend: 54900,
    lastOrderDate: '2026-11-17',
    status: 'active',
  },
  {
    id: 'cust-05',
    name: 'Fatima Siddiqui',
    email: 'fatima.s@example.com',
    phone: '0312-3498120',
    city: 'Rawalpindi',
    registeredDate: '2026-05-30',
    totalOrders: 3,
    totalSpend: 16200,
    lastOrderDate: '2026-11-16',
    status: 'active',
  },
];

// -------------------------------------------------------------
// DEMO COUPONS
// -------------------------------------------------------------
export const adminCoupons: AdminCoupon[] = [
  {
    id: 'cpn-01',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 2000,
    maxDiscount: 1000,
    usageCount: 184,
    usageLimit: 1000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'cpn-02',
    code: 'STYLONE500',
    discountType: 'fixed',
    discountValue: 500,
    minSpend: 4000,
    usageCount: 92,
    usageLimit: 500,
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'cpn-03',
    code: 'BEAUTY20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 6000,
    maxDiscount: 2000,
    usageCount: 45,
    usageLimit: 200,
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    isActive: true,
  },
];

// -------------------------------------------------------------
// DEMO REVIEWS (MODERATION)
// -------------------------------------------------------------
export const adminReviews: AdminReview[] = [
  {
    id: 'rev-01',
    productName: 'Vitamin C Brightening Serum',
    customerName: 'Amina Tariq',
    rating: 5,
    comment: 'The texture is exquisite and non-greasy. Noticeable radiance in under two weeks.',
    date: '2026-11-16',
    status: 'approved',
  },
  {
    id: 'rev-02',
    productName: 'Velvet Matte Lipstick',
    customerName: 'Zainab Q.',
    rating: 5,
    comment: 'Ruby Noir is the quintessential red. Highly pigmented without drying the lips.',
    date: '2026-11-17',
    status: 'approved',
  },
  {
    id: 'rev-03',
    productName: 'Silk Infusion Hair Treatment Mask',
    customerName: 'Sundas A.',
    rating: 4,
    comment: 'Restored hair softness after heat styling. Beautiful floral jasmine scent.',
    date: '2026-11-18',
    status: 'pending',
  },
  {
    id: 'rev-04',
    productName: 'Rose Quartz Facial Roller',
    customerName: 'Anonymous',
    rating: 1,
    comment: 'Test comment with promotional spam link.',
    date: '2026-11-18',
    status: 'rejected',
  },
];

// -------------------------------------------------------------
// DEMO STAFF MEMBERS
// -------------------------------------------------------------
export const adminStaffMembers: AdminStaff[] = [
  {
    id: 'staff-01',
    name: 'Executive Operations',
    email: 'admin@stylone.pk',
    role: 'Super Admin',
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'staff-02',
    name: 'Bilal Ahmed',
    email: 'warehouse@stylone.pk',
    role: 'Inventory Manager',
    status: 'active',
    lastActive: '25 mins ago',
  },
  {
    id: 'staff-03',
    name: 'Mariam Farooq',
    email: 'support@stylone.pk',
    role: 'Customer Care',
    status: 'active',
    lastActive: '1 hour ago',
  },
];
