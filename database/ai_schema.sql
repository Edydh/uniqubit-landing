-- AI-Enhanced Lead Management - Add columns to existing leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_priority VARCHAR(10) DEFAULT 'medium';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_project_type VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_budget_estimate VARCHAR(20);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_urgency VARCHAR(20);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_complexity VARCHAR(20);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_response_sent BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_response_content TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_type VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'contact_form';

-- AI Communications Log
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

-- AI Project Insights (for future use)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_ai_priority ON leads(ai_priority);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score);
CREATE INDEX IF NOT EXISTS idx_ai_communications_lead ON ai_communications(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_communications_type ON ai_communications(communication_type);
