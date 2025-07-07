-- Fix leads table RLS policy to allow anonymous form submissions
-- This script handles existing policies properly

-- First, drop all existing policies for leads table
DROP POLICY IF EXISTS "Only admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous lead creation" ON public.leads;
DROP POLICY IF EXISTS "Only admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;

-- Create new granular policies
-- Allow anonymous users to insert leads (contact form submissions)
CREATE POLICY "Allow anonymous lead creation" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Only admins can view leads" ON public.leads
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Only admins can update leads
CREATE POLICY "Only admins can update leads" ON public.leads
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Only admins can delete leads
CREATE POLICY "Only admins can delete leads" ON public.leads
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));
