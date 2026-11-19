-- ============================================================================
-- STYLONE Storage Buckets Configuration Migration
-- Phase 07: Supabase Storage Buckets & Policies
-- ============================================================================

-- Create storage buckets for STYLONE cosmetics platform
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('category-images', 'category-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('brand-assets', 'brand-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('user-avatars', 'user-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1. PUBLIC READ ACCESS FOR ASSETS
CREATE POLICY "Public Read Product Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Public Read Category Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'category-images');

CREATE POLICY "Public Read Brand Assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'brand-assets');

CREATE POLICY "Public Read User Avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'user-avatars');

-- 2. ADMIN/STAFF WRITE PERMISSIONS FOR STORE ASSETS
CREATE POLICY "Admins and Staff Can Upload Product Images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'product-images' AND
        public.is_admin_or_staff()
    );

CREATE POLICY "Admins and Staff Can Update Product Images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'product-images' AND
        public.is_admin_or_staff()
    );

CREATE POLICY "Admins and Staff Can Delete Product Images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'product-images' AND
        public.is_admin_or_staff()
    );

CREATE POLICY "Admins and Staff Can Manage Category Images"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'category-images' AND
        public.is_admin_or_staff()
    )
    WITH CHECK (
        bucket_id = 'category-images' AND
        public.is_admin_or_staff()
    );

CREATE POLICY "Admins and Staff Can Manage Brand Assets"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'brand-assets' AND
        public.is_admin_or_staff()
    )
    WITH CHECK (
        bucket_id = 'brand-assets' AND
        public.is_admin_or_staff()
    );

-- 3. USER AVATAR MANAGEMENT (Authenticated Users manage their own avatar)
CREATE POLICY "Users Can Upload Own Avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users Can Update Own Avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users Can Delete Own Avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
