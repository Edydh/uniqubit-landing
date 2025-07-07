-- Simple fix for RLS recursion issue
-- Use service role for admin access to avoid circular references

-- Clean up all problematic policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can view leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can update leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated admins can delete leads" ON public.leads;

-- Create simple, non-recursive policies for users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- For leads, use service role access (this is what your admin dashboard will use)
CREATE POLICY "Service role can manage leads" ON public.leads
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Keep the anonymous insert policy for contact form
-- (this should already exist from before)
CREATE POLICY "Allow anonymous lead creation" ON public.leads
    FOR INSERT WITH CHECK (true);
