-- =====================================================
-- Fix RLS for public.leads table
-- =====================================================
-- This addresses the security warning about RLS not being enabled
-- on the public.leads table

-- 1. Ensure Row Level Security is enabled on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing conflicting policies to start clean
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can view leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can update leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated admins can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous lead creation" ON public.leads;

-- 3. Create user policies (non-recursive)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 4. Create leads policies
-- Allow anonymous users to insert leads (contact form submissions)
CREATE POLICY "Allow anonymous lead creation" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Allow admins to view all leads
CREATE POLICY "Admins can view all leads" ON public.leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to update leads
CREATE POLICY "Admins can update leads" ON public.leads
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to delete leads
CREATE POLICY "Admins can delete leads" ON public.leads
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Create performance indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 6. Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename = 'leads'
ORDER BY tablename;

-- 7. Check policies created for leads
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename = 'leads'
ORDER BY policyname;
