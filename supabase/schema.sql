-- Supabase Schema Draft for Nexa (SMB Business Intelligence Platform)

-- Enums
CREATE TYPE customer_status AS ENUM ('Active', 'At Risk', 'Trial');
CREATE TYPE order_status AS ENUM ('Pending', 'Processing', 'Fulfilled', 'Cancelled');
CREATE TYPE product_status AS ENUM ('In Stock', 'Low Stock', 'Backordered', 'Discontinued');
CREATE TYPE goal_status AS ENUM ('On Track', 'At Risk', 'Achieved', 'Exceeding Target');
CREATE TYPE notification_type AS ENUM ('system', 'warning', 'security', 'info', 'success');

-- 1. Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    tier TEXT NOT NULL,           -- e.g., 'Wholesale', 'Retail Partner', 'B2B Standard'
    status customer_status NOT NULL DEFAULT 'Active',
    joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Note: 'orders' count and 'ltv' (Lifetime Value) can be calculated dynamically from the orders table or maintained via triggers/materialized views.

-- 2. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    channel TEXT NOT NULL,        -- e.g., 'Shopify (Online)', 'POS (Retail)'
    amount NUMERIC(12, 2) NOT NULL,
    status order_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    name TEXT NOT NULL,
    category TEXT NOT NULL,       -- e.g., 'Consumables', 'Equipment'
    description TEXT,
    status product_status NOT NULL DEFAULT 'In Stock',
    monthly_sales_volume INT DEFAULT 0,
    margin_percentage NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Sales Channels (Analytics)
CREATE TABLE sales_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    name TEXT NOT NULL,           -- e.g., 'Shopify (Online Store)'
    monthly_orders INT DEFAULT 0,
    gross_revenue NUMERIC(15, 2) DEFAULT 0.00,
    net_margin_percentage NUMERIC(5, 2) DEFAULT 0.00,
    growth_mom_percentage NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Business Goals Table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    target_value TEXT NOT NULL,   -- Text to support formats like '$1.5M', '35.0%', or '3 Lines'
    current_value TEXT NOT NULL,
    progress_percentage INT DEFAULT 0,
    status goal_status NOT NULL DEFAULT 'On Track',
    deadline TEXT,                -- E.g. 'End of Q3 2026' or actual DATE type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AI Insights / Background Tasks Table
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    name TEXT NOT NULL,           -- e.g., 'Revenue Anomaly Detector'
    model TEXT NOT NULL,          -- e.g., 'Nexa Core'
    task_description TEXT NOT NULL,
    status TEXT NOT NULL,         -- e.g., 'Running', 'Completed'
    tokens_used INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    title TEXT NOT NULL,
    description TEXT,
    type notification_type NOT NULL DEFAULT 'info',
    badge_text TEXT,              -- e.g., 'Reorder', 'Milestone'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Reports Table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    period TEXT NOT NULL,         -- e.g., 'Q2 2026'
    file_size_bytes BIGINT DEFAULT 0,
    format TEXT DEFAULT 'PDF',
    status TEXT DEFAULT 'Draft',  -- e.g., 'Finalized', 'Verified'
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on tables for safe client-side access
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: The following are permissive placeholder policies for development.
-- They allow the 'anon' role to perform ALL operations (SELECT, INSERT, UPDATE, DELETE).
-- These MUST be replaced with proper authenticated per-user policies once auth is wired up.
CREATE POLICY "Allow anon all operations on customers" ON customers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on orders" ON orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on products" ON products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on sales_channels" ON sales_channels FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on goals" ON goals FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on ai_insights" ON ai_insights FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on notifications" ON notifications FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all operations on reports" ON reports FOR ALL TO anon USING (true) WITH CHECK (true);

-- Allow authenticated users to perform all operations
CREATE POLICY "Allow authenticated all operations on customers" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on sales_channels" ON sales_channels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on goals" ON goals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on ai_insights" ON ai_insights FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on notifications" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all operations on reports" ON reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
