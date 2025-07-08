-- =====================================================
-- Fix RLS for ai_project_insights table
-- =====================================================
-- This addresses the security warning about RLS not being enabled
-- on the public.ai_project_insights table

-- 1. Enable Row Level Security on ai_project_insights table
ALTER TABLE public.ai_project_insights ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on ai_communications table as well (for consistency)
ALTER TABLE public.ai_communications ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for ai_project_insights
-- Only admins and project owners can view project insights
CREATE POLICY "Users can view project insights" ON public.ai_project_insights
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
        )
    ));

-- Only admins can manage (insert/update/delete) project insights
CREATE POLICY "Only admins can manage project insights" ON public.ai_project_insights
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- 4. Create RLS policies for ai_communications
-- Users can view AI communications for their projects, admins can view all
CREATE POLICY "Users can view AI communications" ON public.ai_communications
    FOR SELECT USING (
        -- Allow if user owns the project (for project-related communications)
        (project_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id AND (
                p.client_id = auth.uid() OR EXISTS (
                    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
                )
            )
        ))
        OR
        -- Allow if admin (for lead-related communications where project_id might be null)
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can manage AI communications
CREATE POLICY "Only admins can manage AI communications" ON public.ai_communications
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- 5. Create performance index for RLS policies
CREATE INDEX IF NOT EXISTS idx_ai_project_insights_project_id ON public.ai_project_insights(project_id);

-- 6. Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('ai_project_insights', 'ai_communications')
ORDER BY tablename;

-- 7. Check policies created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('ai_project_insights', 'ai_communications')
ORDER BY tablename, policyname;
