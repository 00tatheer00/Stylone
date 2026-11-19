-- ============================================================================
-- STYLONE Initial Seed Data Migration
-- Phase 07: Categories, Brands, Approved Suppliers, Formulations & Inventory
-- All prices in PKR (Rs.)
-- ============================================================================

-- 1. SEED INITIAL CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Skincare', 'skincare', 'Active facial cleansers, antioxidant serums, restorative barrier creams & sunscreens formulated for the Pakistani climate.', 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=800&q=80', 1, true),
    ('c0000001-0000-0000-0000-000000000002', 'Makeup', 'makeup', 'High-pigment complexion enhancers, velvet lip coatings, primers and mineral powders tailored for warm undertones.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', 2, true),
    ('c0000001-0000-0000-0000-000000000003', 'Haircare', 'haircare', 'Nourishing hair oils, strengthening bond elixirs, anti-frizz masks and botanical shampoos.', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80', 3, true),
    ('c0000001-0000-0000-0000-000000000004', 'Beauty Accessories', 'beauty-accessories', 'Handcrafted vegan makeup brushes, sculpted gua sha stones, satin hair accessories and travel cosmetic organisers.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', 4, true),
    ('c0000001-0000-0000-0000-000000000005', 'Personal Care', 'personal-care', 'Luxurious body balms, gentle exfoliators, ceramides hand treatments and restorative wellness essentials.', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80', 5, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order;

-- 2. SEED BRANDS
INSERT INTO public.brands (id, name, slug, description, logo_url, is_active)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'STYLONE Atelier', 'stylone-atelier', 'STYLONE in-house signature formulations developed with clinical actives and botanical extracts.', '', true),
    ('b0000001-0000-0000-0000-000000000002', 'Lumière Laboratories', 'lumiere-laboratories', 'Advanced dermatological skincare targeting hyperpigmentation and barrier restoration.', '', true),
    ('b0000001-0000-0000-0000-000000000003', 'Velvet & Silk', 'velvet-and-silk', 'Editorial cosmetics engineered for seamless finish and high longevity.', '', true),
    ('b0000001-0000-0000-0000-000000000004', 'Nourish Botanics', 'nourish-botanics', 'Pure cold-pressed organic hair elixirs and restorative scalp formulations.', '', true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- 3. SEED APPROVED SUPPLIERS (Strictly Staff/Admin Accessible; Pakistani partners)
INSERT INTO public.suppliers (id, name, contact_person, email, phone, address, notes, is_active)
VALUES
    ('s0000001-0000-0000-0000-000000000001', 'Indus Botanicals Lahore', 'Tariq Mehmood', 'procurement@indusbotanicals.pk', '+92-42-35789901', 'Plot 44, Industrial Estate Kot Lakhpat, Lahore, Punjab', 'Certified ISO-9001 cosmetic laboratory partner. Physical batch inspection required upon warehouse intake.', true),
    ('s0000001-0000-0000-0000-000000000002', 'Karachi Essence Labs', 'Fatima Zahra', 'orders@karachiessence.com', '+92-21-34567890', 'Korangi Industrial Area, Sector 15, Karachi, Sindh', 'Supplies imported cosmetic grade raw ingredients and dermatological active formulations.', true),
    ('s0000001-0000-0000-0000-000000000003', 'Islamabad Herbals & Tools', 'Hamza Abbasi', 'supply@isbherbals.pk', '+92-51-2299881', 'I-9/3 Industrial Area, Islamabad, ICT', 'Specialized manufacturer of handcrafted rose quartz beauty tools and natural boar-bristle accessories.', true)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED PRODUCTS (20 Core Products from the STYLONE Catalogue)
INSERT INTO public.products (
    id, name, slug, short_description, description, category_id, brand_id, product_source, supplier_id,
    purchase_cost, selling_price, compare_at_price, sku, status, is_featured, is_bestseller, is_new_arrival,
    meta_title, meta_description, benefits, ingredients, how_to_use, specifications
) VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'Vitamin C Brightening Serum 15%',
    'vitamin-c-brightening-serum',
    'Potent 15% L-Ascorbic Acid antioxidant serum for radiant, even-toned skin.',
    'Formulated with 15% pure L-Ascorbic Acid, Ferulic Acid, and Vitamin E, this lightweight, fast-absorbing serum targets stubborn dark spots, sun damage, and dullness. Suitable for daily morning use under sunscreen, it neutralizes free radicals and enhances skin elasticity.',
    'c0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000002',
    'supplier',
    's0000001-0000-0000-0000-000000000001',
    1450.00,
    2850.00,
    3400.00,
    'STY-SKN-001',
    'active',
    true,
    true,
    false,
    'Vitamin C Brightening Serum 15% | STYLONE',
    'Potent 15% L-Ascorbic Acid antioxidant serum for radiant, even-toned skin.',
    '["Visibly fades hyperpigmentation and sun spots", "Boosts natural collagen synthesis for firmer skin", "Provides daily antioxidant defense against environmental stressors", "Restores luminous clarity and refined skin texture"]'::jsonb,
    '["Aqua (Purified Water)", "15% L-Ascorbic Acid", "1% Ferulic Acid", "1% Alpha-Tocopherol (Vitamin E)", "Sodium Hyaluronate", "Glycerin", "Panthenol (Pro-Vitamin B5)", "Phenoxyethanol"]'::jsonb,
    'Apply 4–5 drops onto cleansed, dry face and neck in the morning. Gently press into skin with fingertips until absorbed. Follow with moisturizer and broad-spectrum SPF 50.',
    '{"Volume": "30ml / 50ml", "Formulation": "Concentrated Liquid Dropper", "Target Concerns": "Dullness, Hyperpigmentation, Fine Lines", "Country of Origin": "Carefully sourced & quality inspected in Pakistan", "Shelf Life": "12 Months after opening"}'::jsonb
),
(
    'p0000001-0000-0000-0000-000000000002',
    'Hydrating Daily Moisturizer',
    'hydrating-daily-moisturizer',
    'Lightweight barrier-repair cream with multi-weight hyaluronic acid and ceramides.',
    'A cushiony, non-comedogenic daily cream that floods dehydrated skin with continuous 24-hour hydration. Enriched with five biomimetic ceramides and squalane to lock in moisture without clogging pores or leaving greasy residue.',
    'c0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'own',
    NULL,
    950.00,
    1950.00,
    2300.00,
    'STY-SKN-002',
    'active',
    true,
    true,
    false,
    'Hydrating Daily Moisturizer | STYLONE',
    'Lightweight barrier-repair cream with multi-weight hyaluronic acid and ceramides.',
    '["Deep 24-hour hydration without oiliness", "Restores compromised skin barriers within 7 days", "Soothes redness and environmental sensitivity", "Ideal base for smooth makeup application"]'::jsonb,
    '["Aqua", "Glycerin", "Caprylic/Capric Triglyceride", "Squalane", "Ceramide NP", "Ceramide AP", "Ceramide EOP", "Phytosphingosine", "Sodium Hyaluronate", "Niacinamide (2%)", "Allantoin"]'::jsonb,
    'Smooth a dime-sized amount over face and neck every morning and evening after serum. Massage in upward motions until fully absorbed.',
    '{"Volume": "50ml Jar / 100ml Value Pump", "Formulation": "Lightweight Gel-Cream", "Skin Types": "Normal, Dry, Dehydrated, Combination, Sensitive"}'::jsonb
),
(
    'p0000001-0000-0000-0000-000000000003',
    'Gentle Foaming Cleanser',
    'gentle-foaming-cleanser',
    'Sulfate-free pH-balanced gel-to-foam cleanser with chamomile and green tea.',
    'Carefully formulated at a skin-neutral pH of 5.5, this purifying cleanser removes stubborn makeup, excess sebum, and daily urban pollutants without stripping delicate lipid barriers.',
    'c0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'own',
    NULL,
    650.00,
    1450.00,
    NULL,
    'STY-SKN-003',
    'active',
    false,
    false,
    true,
    'Gentle Foaming Cleanser | STYLONE',
    'Sulfate-free pH-balanced gel-to-foam cleanser with chamomile and green tea.',
    '["Removes 99% of impurities and light makeup in one wash", "pH 5.5 protects acid mantle and natural microbiome", "Zero tight or dry feeling post-cleanse", "Calms reactive and redness-prone skin"]'::jsonb,
    '["Aqua", "Cocamidopropyl Betaine", "Sodium Lauroyl Sarcosinate", "Glycerin", "Chamomilla Recutita Extract", "Camellia Sinensis (Green Tea) Leaf Extract", "Centella Asiatica Leaf Extract", "Citric Acid"]'::jsonb,
    'Dispense 1-2 pumps onto damp hands. Gently massage onto face in circular motions for 60 seconds. Rinse thoroughly with lukewarm water.',
    '{"Volume": "150ml Pump Bottle", "pH Level": "5.5 (Skin-Neutral)", "Formulation": "Sulfate-free Gel-to-Foam"}'::jsonb
),
(
    'p0000001-0000-0000-0000-000000000004',
    'Velvet Matte Liquid Lipstick',
    'velvet-matte-liquid-lipstick',
    'Long-wearing, transfer-resistant liquid lipstick with comforting jojoba oil.',
    'A full-coverage liquid lipstick that glides on smoothly and sets to an airbrushed, weightless velvet matte finish. Delivers intense, fade-proof color payoff that stays comfortable throughout the day without flaking or settling into lip lines.',
    'c0000001-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000003',
    'supplier',
    's0000001-0000-0000-0000-000000000002',
    750.00,
    1650.00,
    1950.00,
    'STY-MKP-001',
    'active',
    true,
    true,
    false,
    'Velvet Matte Liquid Lipstick | STYLONE',
    'Long-wearing, transfer-resistant liquid lipstick with comforting jojoba oil.',
    '["Transfer-resistant wear for up to 12 hours", "Enriched with Jojoba and Argan oil for lip nourishment", "Precision teardrop applicator for clean, defined lip contours", "Highly pigmented single-swipe color deposit"]'::jsonb,
    '["Isododecane", "Dimethicone", "Simmondsia Chinensis (Jojoba) Seed Oil", "Argania Spinosa Kernel Oil", "Silica Dimethyl Silylate", "Tocopheryl Acetate", "CI 77491", "CI 77492", "CI 15850"]'::jsonb,
    'Outline lips using the precision tip of the doe-foot applicator, then fill in color across upper and lower lips. Allow 60 seconds to set before eating or drinking.',
    '{"Weight": "5ml Tube with Precision Applicator", "Finish": "Soft Velvet Matte", "Coverage": "Full Opaque"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    purchase_cost = EXCLUDED.purchase_cost,
    status = EXCLUDED.status;

-- 5. SEED PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order, is_primary)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop&q=80', 'Vitamin C Brightening Serum front view', 1, true),
    ('p0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=1000&fit=crop&q=80', 'Vitamin C Serum dropper dispensing', 2, false),
    ('p0000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=1000&fit=crop&q=80', 'Hydrating Daily Moisturizer jar', 1, true),
    ('p0000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1556228722-d0b50326f74a?w=800&h=1000&fit=crop&q=80', 'Gentle Foaming Cleanser pump bottle', 1, true),
    ('p0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=1000&fit=crop&q=80', 'Velvet Matte Liquid Lipstick wand', 1, true)
ON CONFLICT DO NOTHING;

-- 6. SEED PRODUCT VARIANTS
INSERT INTO public.product_variants (id, product_id, variant_name, sku, attributes, selling_price_override, is_active)
VALUES
    ('v0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', '30ml Dropper', 'STY-SKN-001-30M', '{"volume": "30ml"}'::jsonb, 2850.00, true),
    ('v0000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000001', '50ml Deluxe', 'STY-SKN-001-50M', '{"volume": "50ml"}'::jsonb, 3950.00, true),
    ('v0000001-0000-0000-0000-000000000004', 'p0000001-0000-0000-0000-000000000004', 'Rose Petal', 'STY-MKP-001-ROS', '{"shade": "Rose Petal", "hex": "#C26D68"}'::jsonb, 1650.00, true),
    ('v0000001-0000-0000-0000-000000000005', 'p0000001-0000-0000-0000-000000000004', 'Lahore Crimson', 'STY-MKP-001-CRM', '{"shade": "Lahore Crimson", "hex": "#9B1B30"}'::jsonb, 1650.00, true)
ON CONFLICT (sku) DO NOTHING;

-- 7. SEED INVENTORY (Warehoused physically at STYLONE facility)
INSERT INTO public.inventory (product_id, variant_id, available_quantity, reserved_quantity, reorder_level)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000001', 48, 2, 10),
    ('p0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000002', 22, 1, 5),
    ('p0000001-0000-0000-0000-000000000002', NULL, 65, 0, 15),
    ('p0000001-0000-0000-0000-000000000003', NULL, 80, 0, 15),
    ('p0000001-0000-0000-0000-000000000004', 'v0000001-0000-0000-0000-000000000004', 35, 0, 8),
    ('p0000001-0000-0000-0000-000000000004', 'v0000001-0000-0000-0000-000000000005', 40, 0, 8)
ON CONFLICT DO NOTHING;

-- 8. SEED INVENTORY BATCHES (Cosmetic Batch & Expiry Records)
INSERT INTO public.inventory_batches (
    product_id, variant_id, batch_number, expiry_date, quantity_received, remaining_quantity, supplier_id
) VALUES
    ('p0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000001', 'STY-2026-B1', '2028-06-30', 50, 48, 's0000001-0000-0000-0000-000000000001'),
    ('p0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000002', 'STY-2026-B2', '2028-06-30', 25, 22, 's0000001-0000-0000-0000-000000000001'),
    ('p0000001-0000-0000-0000-000000000002', NULL, 'STY-2026-M1', '2028-11-30', 70, 65, NULL),
    ('p0000001-0000-0000-0000-000000000004', 'v0000001-0000-0000-0000-000000000004', 'STY-2026-L1', '2027-12-31', 40, 35, 's0000001-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- 9. SEED AUDITABLE INVENTORY MOVEMENTS (Receiving Ledger)
INSERT INTO public.inventory_movements (
    product_id, variant_id, movement_type, quantity, reference, notes
) VALUES
    ('p0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000001', 'stock_received', 50, 'RCV-2026-001', 'Initial consignment received from Indus Botanicals Lahore. QC pass 100%.'),
    ('p0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000002', 'stock_received', 25, 'RCV-2026-001', 'Initial consignment received from Indus Botanicals Lahore. QC pass 100%.'),
    ('p0000001-0000-0000-0000-000000000002', NULL, 'stock_received', 70, 'MFG-2026-001', 'Signature production run completed at STYLONE Lahore Atelier.'),
    ('p0000001-0000-0000-0000-000000000004', 'v0000001-0000-0000-0000-000000000004', 'stock_received', 40, 'RCV-2026-002', 'Received from Karachi Essence Labs. Shade Rose Petal approved.');
