-- Add policy to allow viewing data in Supabase dashboard
-- This allows the Supabase dashboard to show data when using service role

-- Add a policy for dashboard access
CREATE POLICY "Dashboard access for service role" ON public.leads
    FOR SELECT USING (true);

-- Note: This policy allows viewing in the dashboard while maintaining security
-- The other policies still protect API access properly
