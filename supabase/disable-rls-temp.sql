-- Temporarily disable RLS to view data in Supabase dashboard
-- WARNING: This removes security temporarily - only for testing

-- Disable RLS on leads table
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- You can now view the data in the Supabase Table Editor
-- Remember to re-enable RLS after checking:
-- ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
