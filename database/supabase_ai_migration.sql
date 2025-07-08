-- =====================================================
-- uniQubit AI Enhancement - Database Schema Update
-- =====================================================
-- Run this in your Supabase Dashboard > SQL Editor

-- 1. Add AI columns to existing leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_priority VARCHAR(10) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS ai_project_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS ai_budget_estimate VARCHAR(20),
ADD COLUMN IF NOT EXISTS ai_urgency VARCHAR(20),
ADD COLUMN IF NOT EXISTS ai_complexity VARCHAR(20),
ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
ADD COLUMN IF NOT EXISTS ai_response_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_response_content TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS project_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'contact_form';

-- 1.1. Ensure RLS is enabled on leads table (in case it wasn't enabled before)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Create AI Communications Log table
CREATE TABLE IF NOT EXISTS ai_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  project_id UUID REFERENCES projects(id),
  communication_type VARCHAR(50) NOT NULL,
  prompt_used TEXT,
  ai_response TEXT NOT NULL,
  human_approved BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create AI Project Insights table (for future use)
CREATE TABLE IF NOT EXISTS ai_project_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  insight_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  data_sources JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_ai_priority ON leads(ai_priority);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_ai_communications_lead ON ai_communications(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_communications_type ON ai_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_ai_project_insights_project_id ON ai_project_insights(project_id);

-- 5. Enable Row Level Security on new AI tables
ALTER TABLE public.ai_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_project_insights ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for ai_project_insights
-- Users can view project insights for their projects, admins can view all
CREATE POLICY "Users can view project insights" ON public.ai_project_insights
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
        )
    ));

-- Only admins can manage project insights
CREATE POLICY "Only admins can manage project insights" ON public.ai_project_insights
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- 7. Create RLS policies for ai_communications
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

-- Query to verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
    AND table_schema = 'public'
    AND column_name LIKE '%ai_%'
ORDER BY column_name;
