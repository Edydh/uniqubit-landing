-- Final fix for RLS recursion issue
-- Handle all existing policies properly

-- Clean up ALL policies first to avoid conflicts
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

-- Create simple, non-recursive policies for users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for leads table
-- 1. Allow anonymous users to insert leads (contact form)
CREATE POLICY "Allow anonymous lead creation" ON public.leads
    FOR INSERT WITH CHECK (true);

-- 2. Allow service role to manage all leads (admin operations)
CREATE POLICY "Service role can manage leads" ON public.leads
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
