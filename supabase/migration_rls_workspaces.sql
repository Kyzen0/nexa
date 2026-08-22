-- 1. Create workspaces table
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE RESTRICT,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- (Optional but recommended) Enable RLS on the new tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workspace" ON public.workspaces FOR SELECT TO authenticated USING (id IN (SELECT workspace_id FROM public.profiles WHERE profiles.id = auth.uid()));
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

-- 3. Insert the single static workspace
INSERT INTO public.workspaces (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'Aura Goods')
ON CONFLICT (id) DO NOTHING;

-- 4. Create trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, workspace_id, email)
    VALUES (
        new.id, 
        '11111111-1111-1111-1111-111111111111'::uuid, -- Default everyone to the single workspace for now
        new.email
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Insert profile for your existing user(s)
-- (This automatically links any users you already created to the workspace)
INSERT INTO public.profiles (id, workspace_id, email)
SELECT 
    id, 
    '11111111-1111-1111-1111-111111111111'::uuid, 
    email 
FROM auth.users 
ON CONFLICT (id) DO NOTHING;

-- 6. Drop old permissive policies
DROP POLICY IF EXISTS "Allow anon all operations on customers" ON customers;
DROP POLICY IF EXISTS "Allow anon all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow anon all operations on products" ON products;
DROP POLICY IF EXISTS "Allow anon all operations on sales_channels" ON sales_channels;
DROP POLICY IF EXISTS "Allow anon all operations on goals" ON goals;
DROP POLICY IF EXISTS "Allow anon all operations on ai_insights" ON ai_insights;
DROP POLICY IF EXISTS "Allow anon all operations on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow anon all operations on reports" ON reports;

DROP POLICY IF EXISTS "Allow authenticated all operations on customers" ON customers;
DROP POLICY IF EXISTS "Allow authenticated all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated all operations on products" ON products;
DROP POLICY IF EXISTS "Allow authenticated all operations on sales_channels" ON sales_channels;
DROP POLICY IF EXISTS "Allow authenticated all operations on goals" ON goals;
DROP POLICY IF EXISTS "Allow authenticated all operations on ai_insights" ON ai_insights;
DROP POLICY IF EXISTS "Allow authenticated all operations on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated all operations on reports" ON reports;

-- 7. Add new strict RLS policies (scoping to the user's workspace_id)
CREATE POLICY "Users can access workspace customers" ON customers FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace orders" ON orders FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace products" ON products FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace sales_channels" ON sales_channels FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace goals" ON goals FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace ai_insights" ON ai_insights FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace notifications" ON notifications FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can access workspace reports" ON reports FOR ALL TO authenticated USING (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid())) WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.profiles WHERE id = auth.uid()));
