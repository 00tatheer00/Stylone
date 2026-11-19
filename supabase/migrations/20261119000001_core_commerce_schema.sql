-- ============================================================================
-- STYLONE E-Commerce Schema Migration
-- Phase 07: Core Commerce Database & Backend Integration
-- Target Market: Pakistan (Currency: PKR)
-- ============================================================================

-- 1. ENHANCE PROFILES TABLE (Extend Phase 05 foundation)
-- Ensure avatar_url exists and add staff/admin query policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT DEFAULT '';
    END IF;
END $$;

-- Enable helper function to securely check user role server-side
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Staff/Admin can view profiles for business operations
CREATE POLICY "Admins and staff can view all customer profiles"
    ON public.profiles
    FOR SELECT
    USING (public.is_admin_or_staff());


-- 2. ENHANCE SAVED ADDRESSES TABLE (Support province & postal code)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'addresses' AND column_name = 'province'
    ) THEN
        ALTER TABLE public.addresses ADD COLUMN province TEXT NOT NULL DEFAULT 'Punjab';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'addresses' AND column_name = 'postal_code'
    ) THEN
        ALTER TABLE public.addresses ADD COLUMN postal_code TEXT DEFAULT '';
    END IF;
END $$;


-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active, sort_order);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Category Policies
CREATE POLICY "Anyone can view active categories"
    ON public.categories
    FOR SELECT
    USING (is_active = true OR public.is_admin_or_staff());

CREATE POLICY "Admins and staff can manage categories"
    ON public.categories
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 4. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    logo_url TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON public.brands(is_active);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Brand Policies
CREATE POLICY "Anyone can view active brands"
    ON public.brands
    FOR SELECT
    USING (is_active = true OR public.is_admin_or_staff());

CREATE POLICY "Admins and staff can manage brands"
    ON public.brands
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 5. SUPPLIERS TABLE
-- Strictly confidential supplier details; NO direct dropshipping to customers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_suppliers_active ON public.suppliers(is_active);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Supplier Policies: Restricted strictly to Staff and Admin
CREATE POLICY "Staff and Admins can view suppliers"
    ON public.suppliers
    FOR SELECT
    USING (public.is_admin_or_staff());

CREATE POLICY "Staff and Admins can manage suppliers"
    ON public.suppliers
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 6. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    product_source TEXT NOT NULL DEFAULT 'own' CHECK (product_source IN ('own', 'supplier')),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    purchase_cost NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (purchase_cost >= 0), -- CONFIDENTIAL
    selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
    compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    benefits JSONB DEFAULT '[]'::jsonb,
    ingredients JSONB DEFAULT '[]'::jsonb,
    how_to_use TEXT DEFAULT '',
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_flags ON public.products(is_featured, is_bestseller, is_new_arrival);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product Policies
-- Public customers can only read active published products
CREATE POLICY "Public can view active products"
    ON public.products
    FOR SELECT
    USING (status = 'active' OR public.is_admin_or_staff());

CREATE POLICY "Admins and staff can manage products"
    ON public.products
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());

-- 7. SAFE STOREFRONT PRODUCTS VIEW
-- Excludes purchase_cost and internal supplier references from public view
CREATE OR REPLACE VIEW public.storefront_products AS
SELECT
    p.id,
    p.name,
    p.slug,
    p.short_description,
    p.description,
    p.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    p.brand_id,
    b.name AS brand_name,
    b.slug AS brand_slug,
    p.selling_price,
    p.compare_at_price,
    p.sku,
    p.status,
    p.is_featured,
    p.is_bestseller,
    p.is_new_arrival,
    p.meta_title,
    p.meta_description,
    p.benefits,
    p.ingredients,
    p.how_to_use,
    p.specifications,
    p.created_at,
    p.updated_at
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.brands b ON p.brand_id = b.id
WHERE p.status = 'active';


-- 8. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    selling_price_override NUMERIC(10,2) CHECK (selling_price_override IS NULL OR selling_price_override >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_active ON public.product_variants(is_active);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active product variants"
    ON public.product_variants
    FOR SELECT
    USING (is_active = true OR public.is_admin_or_staff());

CREATE POLICY "Admins and staff can manage product variants"
    ON public.product_variants
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 9. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_images_product ON public.product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_images_variant ON public.product_images(variant_id);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product images"
    ON public.product_images
    FOR SELECT
    USING (true);

CREATE POLICY "Admins and staff can manage product images"
    ON public.product_images
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 10. INVENTORY TABLE
-- One inventory record per product or product variant
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    reorder_level INT NOT NULL DEFAULT 5 CHECK (reorder_level >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_inventory_product_variant UNIQUE NULLS NOT DISTINCT (product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON public.inventory(variant_id);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Customers can view safe availability (whether in stock)
CREATE POLICY "Public can check inventory availability"
    ON public.inventory
    FOR SELECT
    USING (true);

CREATE POLICY "Admins and staff can manage inventory"
    ON public.inventory
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 11. INVENTORY MOVEMENTS TABLE (Auditable Ledger)
-- Strictly immutable history of stock changes
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    movement_type TEXT NOT NULL CHECK (
        movement_type IN ('stock_received', 'stock_adjustment', 'damaged', 'expired', 'return_received', 'correction')
    ),
    quantity INT NOT NULL,
    reference TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_movements_product ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_created ON public.inventory_movements(created_at DESC);

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Restricted strictly to Staff and Admin
CREATE POLICY "Staff and Admins can view inventory movements"
    ON public.inventory_movements
    FOR SELECT
    USING (public.is_admin_or_staff());

CREATE POLICY "Staff and Admins can record inventory movements"
    ON public.inventory_movements
    FOR INSERT
    WITH CHECK (public.is_admin_or_staff());


-- 12. INVENTORY BATCHES TABLE
-- Expiry tracking for skincare & active cosmetic formulations
CREATE TABLE IF NOT EXISTS public.inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_received INT NOT NULL CHECK (quantity_received > 0),
    remaining_quantity INT NOT NULL CHECK (remaining_quantity >= 0),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_batches_product ON public.inventory_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry ON public.inventory_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_batches_number ON public.inventory_batches(batch_number);

ALTER TABLE public.inventory_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff and Admins can view inventory batches"
    ON public.inventory_batches
    FOR SELECT
    USING (public.is_admin_or_staff());

CREATE POLICY "Staff and Admins can manage inventory batches"
    ON public.inventory_batches
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 13. AUTOMATED UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_brands_updated_at ON public.brands;
CREATE TRIGGER trg_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER trg_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON public.inventory;
CREATE TRIGGER trg_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
