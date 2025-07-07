-- Fix leads table RLS policy to allow anonymous form submissions
-- This allows the contact form to work for anonymous users

-- Drop the restrictive policy that blocks anonymous inserts
DROP POLICY "Only admins can manage leads" ON public.leads;

-- Create separate policies for different operations
-- Allow anonymous users to insert leads (contact form submissions)
CREATE POLICY "Allow anonymous lead creation" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Only admins can view leads" ON public.leads
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Only admins can update/delete leads
CREATE POLICY "Only admins can update leads" ON public.leads
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Only admins can delete leads" ON public.leads
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));
