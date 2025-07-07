-- Fix infinite recursion in RLS policies
-- This happens when policies reference each other in a circular way

-- First, let's fix the users table policies to avoid recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create simpler policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Now fix the leads policies to avoid the circular reference
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;

-- Create simpler admin policies that don't cause recursion
-- Option 1: Allow service role to access leads (for admin operations)
CREATE POLICY "Service role can view leads" ON public.leads
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can update leads" ON public.leads
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can delete leads" ON public.leads
    FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role');

-- Option 2: Allow authenticated users with admin role in their JWT
CREATE POLICY "Authenticated admins can view leads" ON public.leads
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    );

CREATE POLICY "Authenticated admins can update leads" ON public.leads
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND 
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    );

CREATE POLICY "Authenticated admins can delete leads" ON public.leads
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND 
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    );
