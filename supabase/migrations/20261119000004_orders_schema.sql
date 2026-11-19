-- ============================================================================
-- STYLONE Orders, Payments, Shipping & Atomic Inventory Engine Migration
-- Phase 08: Complete Order Management & Checkout Engine
-- Currency: PKR (Rs.)
-- ============================================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_name TEXT DEFAULT '',
    guest_email TEXT DEFAULT '',
    guest_phone TEXT NOT NULL DEFAULT '',
    shipping_address_snapshot JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'PKR',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        order_status IN (
            'pending',
            'confirmed',
            'processing',
            'packed',
            'shipped',
            'delivered',
            'cancelled',
            'failed_delivery',
            'returned',
            'refunded'
        )
    ),
    customer_notes TEXT DEFAULT '',
    internal_notes TEXT DEFAULT '',
    guest_access_token TEXT UNIQUE,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON public.orders(guest_access_token);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders RLS: Customers can see own orders, Admin/Staff can see and manage all
CREATE POLICY "Customers can view their own orders"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = customer_id OR public.is_admin_or_staff());

CREATE POLICY "Admins and staff can manage orders"
    ON public.orders
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 2. ORDER ITEMS TABLE (Point-in-time Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_details JSONB DEFAULT '{}'::jsonb,
    sku TEXT NOT NULL,
    product_image TEXT DEFAULT '',
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own order items"
    ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.customer_id = auth.uid() OR public.is_admin_or_staff())
        )
    );

CREATE POLICY "Admins and staff can manage order items"
    ON public.order_items
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 3. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_history_order ON public.order_status_history(order_id);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view status history of own orders"
    ON public.order_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_status_history.order_id
            AND (o.customer_id = auth.uid() OR public.is_admin_or_staff())
        )
    );

CREATE POLICY "Admins and staff can record status history"
    ON public.order_status_history
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer')),
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    transaction_reference TEXT DEFAULT '',
    proof_url TEXT DEFAULT '',
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own order payments"
    ON public.payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = payments.order_id
            AND (o.customer_id = auth.uid() OR public.is_admin_or_staff())
        )
    );

CREATE POLICY "Admins and staff can manage payments"
    ON public.payments
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 5. SHIPMENTS TABLE
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    courier_name TEXT NOT NULL DEFAULT 'TCS' CHECK (courier_name IN ('TCS', 'Leopards', 'Call Courier', 'Trax', 'Other')),
    tracking_number TEXT NOT NULL DEFAULT '',
    tracking_url TEXT DEFAULT '',
    shipping_status TEXT NOT NULL DEFAULT 'preparing' CHECK (
        shipping_status IN ('preparing', 'booked', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')
    ),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    delivery_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own order shipments"
    ON public.shipments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = shipments.order_id
            AND (o.customer_id = auth.uid() OR public.is_admin_or_staff())
        )
    );

CREATE POLICY "Admins and staff can manage shipments"
    ON public.shipments
    FOR ALL
    USING (public.is_admin_or_staff())
    WITH CHECK (public.is_admin_or_staff());


-- 6. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read business settings"
    ON public.business_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage business settings"
    ON public.business_settings
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Seed default business settings
INSERT INTO public.business_settings (key, value, description)
VALUES
    ('shipping', '{"standard_fee": 250, "free_shipping_threshold": 3000, "estimated_days": "2-4 business days"}'::jsonb, 'Pakistan shipping rates & free delivery threshold in PKR'),
    ('payment_cod', '{"enabled": true, "max_limit": 50000, "notes": "Cash payable to courier rider upon physical receipt"}'::jsonb, 'Cash on Delivery parameters'),
    ('payment_bank_transfer', '{"enabled": true, "bank_name": "Meezan Bank Limited", "account_title": "STYLONE (PVT) LTD", "account_number": "02010108992314", "iban": "PK45MEZN0002010108992314", "instructions": "Please transfer exact amount and upload transaction screenshot."}'::jsonb, 'Direct Bank Transfer account specifications'),
    ('cancellation_rules', '{"allow_customer_cancellation": true, "allowed_until_status": "processing"}'::jsonb, 'Customer self-service cancellation window')
ON CONFLICT (key) DO NOTHING;


-- 7. ATOMIC ORDER PLACEMENT TRANSACTION RPC
-- Handles concurrency, row locking (FOR UPDATE), stock deduction and order creation atomically.
CREATE OR REPLACE FUNCTION public.place_order_transaction(
    p_order_number TEXT,
    p_customer_id UUID,
    p_guest_name TEXT,
    p_guest_email TEXT,
    p_guest_phone TEXT,
    p_shipping_address JSONB,
    p_items JSONB, -- Array of { product_id, variant_id, quantity, expected_price }
    p_discount_amount NUMERIC,
    p_shipping_amount NUMERIC,
    p_payment_method TEXT,
    p_customer_notes TEXT,
    p_guest_access_token TEXT,
    p_idempotency_key TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_prod RECORD;
    v_var RECORD;
    v_inv RECORD;
    v_subtotal NUMERIC := 0;
    v_unit_price NUMERIC := 0;
    v_line_total NUMERIC := 0;
    v_final_total NUMERIC := 0;
    v_item_count INT := 0;
    v_sku TEXT;
    v_prod_name TEXT;
    v_image TEXT;
    v_existing_order_id UUID;
BEGIN
    -- Idempotency Check: if already placed with this key, return existing order
    IF p_idempotency_key IS NOT NULL AND p_idempotency_key <> '' THEN
        SELECT id INTO v_existing_order_id FROM public.orders WHERE idempotency_key = p_idempotency_key;
        IF v_existing_order_id IS NOT NULL THEN
            RETURN jsonb_build_object(
                'success', true,
                'order_id', v_existing_order_id,
                'order_number', p_order_number,
                'is_idempotent', true
            );
        END IF;
    END IF;

    -- Validate at least one item
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    -- 1. Create the Order Shell
    INSERT INTO public.orders (
        order_number,
        customer_id,
        guest_name,
        guest_email,
        guest_phone,
        shipping_address_snapshot,
        subtotal,
        discount_amount,
        shipping_amount,
        total_amount,
        currency,
        payment_method,
        payment_status,
        order_status,
        customer_notes,
        guest_access_token,
        idempotency_key
    ) VALUES (
        p_order_number,
        p_customer_id,
        COALESCE(p_guest_name, ''),
        COALESCE(p_guest_email, ''),
        p_guest_phone,
        p_shipping_address,
        0, -- recalculated below
        COALESCE(p_discount_amount, 0),
        COALESCE(p_shipping_amount, 0),
        0, -- recalculated below
        'PKR',
        p_payment_method,
        'pending',
        'pending',
        COALESCE(p_customer_notes, ''),
        p_guest_access_token,
        p_idempotency_key
    ) RETURNING id INTO v_order_id;

    -- 2. Process each item: Validate authoritative DB price & lock inventory row
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Fetch authoritative product from DB
        SELECT * INTO v_prod FROM public.products
        WHERE id = (v_item->>'product_id')::UUID AND status = 'active';

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % is inactive or does not exist.', (v_item->>'product_id');
        END IF;

        v_unit_price := v_prod.selling_price;
        v_sku := v_prod.sku;
        v_prod_name := v_prod.name;

        -- Check variant if provided
        IF v_item->>'variant_id' IS NOT NULL AND (v_item->>'variant_id') <> '' THEN
            SELECT * INTO v_var FROM public.product_variants
            WHERE id = (v_item->>'variant_id')::UUID AND product_id = v_prod.id AND is_active = true;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Invalid or inactive variant for product %.', v_prod.name;
            END IF;

            v_sku := v_var.sku;
            IF v_var.selling_price_override IS NOT NULL THEN
                v_unit_price := v_var.selling_price_override;
            END IF;
        END IF;

        -- Lock Inventory row with FOR UPDATE to prevent race conditions / overselling
        SELECT * INTO v_inv FROM public.inventory
        WHERE product_id = v_prod.id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Inventory record not found for product %.', v_prod_name;
        END IF;

        IF v_inv.available_quantity < (v_item->>'quantity')::INT THEN
            RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %',
                v_prod_name, v_inv.available_quantity, (v_item->>'quantity')::INT;
        END IF;

        -- Deduct inventory atomically
        UPDATE public.inventory
        SET available_quantity = available_quantity - (v_item->>'quantity')::INT,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_inv.id;

        -- Record Immutable Inventory Movement
        INSERT INTO public.inventory_movements (
            product_id,
            variant_id,
            movement_type,
            quantity,
            reference,
            notes,
            created_by
        ) VALUES (
            v_prod.id,
            CASE WHEN (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') <> ''
                 THEN (v_item->>'variant_id')::UUID
                 ELSE NULL END,
            'stock_adjustment',
            -((v_item->>'quantity')::INT),
            p_order_number,
            'Inventory allocated for customer order: ' || p_order_number,
            p_customer_id
        );

        -- Fetch Primary Image
        SELECT image_url INTO v_image FROM public.product_images
        WHERE product_id = v_prod.id
        ORDER BY is_primary DESC, sort_order ASC
        LIMIT 1;

        v_line_total := v_unit_price * (v_item->>'quantity')::INT;
        v_subtotal := v_subtotal + v_line_total;
        v_item_count := v_item_count + 1;

        -- Insert Order Item Snapshot
        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_details,
            sku,
            product_image,
            unit_price,
            quantity,
            line_total
        ) VALUES (
            v_order_id,
            v_prod.id,
            CASE WHEN (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') <> ''
                 THEN (v_item->>'variant_id')::UUID
                 ELSE NULL END,
            v_prod_name,
            COALESCE(v_item->'variant_details', '{}'::jsonb),
            v_sku,
            COALESCE(v_image, ''),
            v_unit_price,
            (v_item->>'quantity')::INT,
            v_line_total
        );
    END LOOP;

    -- Calculate final authoritative total
    v_final_total := GREATEST(0, v_subtotal - COALESCE(p_discount_amount, 0) + COALESCE(p_shipping_amount, 0));

    -- Update Order with recomputed financials
    UPDATE public.orders
    SET subtotal = v_subtotal,
        total_amount = v_final_total,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_order_id;

    -- 3. Insert Initial Order Status History
    INSERT INTO public.order_status_history (
        order_id,
        previous_status,
        new_status,
        changed_by,
        notes
    ) VALUES (
        v_order_id,
        NULL,
        'pending',
        p_customer_id,
        'Order submitted by customer via ' || UPPER(p_payment_method)
    );

    -- 4. Insert Initial Payment Record
    INSERT INTO public.payments (
        order_id,
        payment_method,
        amount,
        payment_status,
        notes
    ) VALUES (
        v_order_id,
        p_payment_method,
        v_final_total,
        'pending',
        'Payment pending customer delivery collection or verification'
    );

    -- 5. Return success payload
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', p_order_number,
        'subtotal', v_subtotal,
        'total', v_final_total,
        'guest_access_token', p_guest_access_token
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. ATOMIC ORDER CANCELLATION & STOCK RESTORATION RPC
CREATE OR REPLACE FUNCTION public.cancel_order_transaction(
    p_order_id UUID,
    p_admin_user_id UUID,
    p_reason TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    IF v_order.order_status IN ('cancelled', 'refunded', 'delivered') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order cannot be cancelled in status: ' || v_order.order_status);
    END IF;

    -- Update order status
    UPDATE public.orders
    SET order_status = 'cancelled',
        payment_status = CASE WHEN payment_status = 'paid' THEN 'refunded' ELSE 'failed' END,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_order_id;

    -- Record Status History
    INSERT INTO public.order_status_history (
        order_id,
        previous_status,
        new_status,
        changed_by,
        notes
    ) VALUES (
        p_order_id,
        v_order.order_status,
        'cancelled',
        p_admin_user_id,
        COALESCE(p_reason, 'Order cancelled by administration')
    );

    -- Restore inventory for each item
    FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id
    LOOP
        UPDATE public.inventory
        SET available_quantity = available_quantity + v_item.quantity,
            updated_at = timezone('utc'::text, now())
        WHERE product_id = v_item.product_id;

        -- Record auditable inventory movement
        INSERT INTO public.inventory_movements (
            product_id,
            variant_id,
            movement_type,
            quantity,
            reference,
            notes,
            created_by
        ) VALUES (
            v_item.product_id,
            v_item.variant_id,
            'correction',
            v_item.quantity,
            v_order.order_number,
            'Restocked upon order cancellation: ' || COALESCE(p_reason, ''),
            p_admin_user_id
        );
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', 'Order cancelled and stock safely restored.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 9. GUEST ORDER SECURE RETRIEVAL FUNCTION
-- Prevents order number enumeration. Guest MUST provide both order_number and guest_access_token.
CREATE OR REPLACE FUNCTION public.get_guest_order(
    p_order_number TEXT,
    p_guest_access_token TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_shipment RECORD;
    v_history JSONB;
BEGIN
    SELECT * INTO v_order FROM public.orders
    WHERE order_number = p_order_number
      AND guest_access_token = p_guest_access_token;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_agg(row_to_json(i)) INTO v_items
    FROM public.order_items i
    WHERE i.order_id = v_order.id;

    SELECT row_to_json(s) INTO v_shipment
    FROM public.shipments s
    WHERE s.order_id = v_order.id
    LIMIT 1;

    SELECT jsonb_agg(row_to_json(h)) INTO v_history
    FROM (
        SELECT new_status, notes, created_at
        FROM public.order_status_history
        WHERE order_id = v_order.id
        ORDER BY created_at ASC
    ) h;

    RETURN jsonb_build_object(
        'order', row_to_json(v_order),
        'items', COALESCE(v_items, '[]'::jsonb),
        'shipment', v_shipment,
        'history', COALESCE(v_history, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at on orders and shipments
DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_shipments_updated_at ON public.shipments;
CREATE TRIGGER trg_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
