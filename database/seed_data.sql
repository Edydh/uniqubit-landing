-- Seed Data for Enhanced uniQubit Platform
-- Phase 2.1: Project Types and Default Configurations
-- Created: July 8, 2025

-- Insert default project types with stage templates
INSERT INTO project_types (name, description, default_stages, estimated_duration_weeks, base_price_range) VALUES
(
  'Web Development',
  'Full-stack web application development with modern technologies',
  '[
    {"name": "Discovery & Planning", "description": "Requirements gathering and technical planning", "estimated_hours": 20, "deliverables": ["Project brief", "Technical specification", "Wireframes"]},
    {"name": "Design & Prototyping", "description": "UI/UX design and interactive prototypes", "estimated_hours": 30, "deliverables": ["Design mockups", "Interactive prototype", "Style guide"]},
    {"name": "Development", "description": "Frontend and backend development", "estimated_hours": 80, "deliverables": ["Working application", "Admin panel", "API documentation"]},
    {"name": "Testing & QA", "description": "Quality assurance and bug fixes", "estimated_hours": 20, "deliverables": ["Test reports", "Bug fixes", "Performance optimization"]},
    {"name": "Deployment & Launch", "description": "Production deployment and go-live", "estimated_hours": 10, "deliverables": ["Live website", "Deployment documentation", "Training materials"]}
  ]'::jsonb,
  8,
  '$5,000 - $25,000'
),
(
  'Mobile App Development',
  'Native or cross-platform mobile application development',
  '[
    {"name": "Concept & Strategy", "description": "App concept validation and strategy development", "estimated_hours": 25, "deliverables": ["App strategy", "User personas", "Feature specification"]},
    {"name": "Design & User Experience", "description": "Mobile UI/UX design and user flow", "estimated_hours": 35, "deliverables": ["App designs", "User flow diagrams", "Interactive prototype"]},
    {"name": "Development & Integration", "description": "App development and API integration", "estimated_hours": 100, "deliverables": ["Beta app", "API integration", "Core features"]},
    {"name": "Testing & Optimization", "description": "App testing and performance optimization", "estimated_hours": 25, "deliverables": ["Test results", "Performance report", "Bug fixes"]},
    {"name": "App Store Launch", "description": "App store submission and launch", "estimated_hours": 15, "deliverables": ["Published app", "App store assets", "Launch strategy"]}
  ]'::jsonb,
  10,
  '$10,000 - $50,000'
),
(
  'E-commerce Platform',
  'Complete e-commerce solution with payment processing',
  '[
    {"name": "Requirements & Planning", "description": "E-commerce requirements and platform selection", "estimated_hours": 20, "deliverables": ["Requirements document", "Platform recommendation", "Project timeline"]},
    {"name": "Store Design & Setup", "description": "Store design and initial configuration", "estimated_hours": 30, "deliverables": ["Store design", "Product catalog setup", "Payment configuration"]},
    {"name": "Custom Development", "description": "Custom features and integrations", "estimated_hours": 60, "deliverables": ["Custom features", "Third-party integrations", "Admin tools"]},
    {"name": "Content & Product Setup", "description": "Product import and content creation", "estimated_hours": 20, "deliverables": ["Product catalog", "Content pages", "SEO optimization"]},
    {"name": "Testing & Go-Live", "description": "Store testing and launch preparation", "estimated_hours": 15, "deliverables": ["Test orders", "Launch checklist", "Live store"]}
  ]'::jsonb,
  6,
  '$8,000 - $30,000'
),
(
  'Brand Identity & Design',
  'Complete brand identity and visual design package',
  '[
    {"name": "Brand Discovery", "description": "Brand research and strategy development", "estimated_hours": 15, "deliverables": ["Brand brief", "Competitor analysis", "Brand strategy"]},
    {"name": "Logo & Visual Identity", "description": "Logo design and visual identity system", "estimated_hours": 25, "deliverables": ["Logo variations", "Color palette", "Typography system"]},
    {"name": "Brand Guidelines", "description": "Comprehensive brand guidelines and assets", "estimated_hours": 20, "deliverables": ["Brand guidelines", "Business cards", "Letterhead design"]},
    {"name": "Marketing Materials", "description": "Marketing collateral and digital assets", "estimated_hours": 15, "deliverables": ["Brochure design", "Social media templates", "Website banners"]},
    {"name": "Brand Package Delivery", "description": "Final brand package and training", "estimated_hours": 5, "deliverables": ["Complete brand package", "Asset library", "Usage training"]}
  ]'::jsonb,
  4,
  '$3,000 - $15,000'
),
(
  'Digital Marketing Campaign',
  'Comprehensive digital marketing strategy and implementation',
  '[
    {"name": "Marketing Audit", "description": "Current marketing analysis and audit", "estimated_hours": 10, "deliverables": ["Marketing audit", "Competitor analysis", "Opportunity assessment"]},
    {"name": "Strategy Development", "description": "Marketing strategy and campaign planning", "estimated_hours": 15, "deliverables": ["Marketing strategy", "Campaign plan", "Content calendar"]},
    {"name": "Campaign Creation", "description": "Ad creation and landing page development", "estimated_hours": 25, "deliverables": ["Ad creatives", "Landing pages", "Campaign setup"]},
    {"name": "Campaign Launch", "description": "Campaign launch and initial optimization", "estimated_hours": 10, "deliverables": ["Live campaigns", "Tracking setup", "Initial reports"]},
    {"name": "Optimization & Reporting", "description": "Ongoing optimization and performance reporting", "estimated_hours": 20, "deliverables": ["Performance reports", "Optimization recommendations", "Final campaign analysis"]}
  ]'::jsonb,
  3,
  '$2,000 - $10,000'
),
(
  'Consultation & Advisory',
  'Strategic consultation and technical advisory services',
  '[
    {"name": "Initial Assessment", "description": "Current state analysis and goal setting", "estimated_hours": 5, "deliverables": ["Assessment report", "Goal definition", "Success metrics"]},
    {"name": "Strategy Development", "description": "Strategic planning and roadmap creation", "estimated_hours": 10, "deliverables": ["Strategic plan", "Implementation roadmap", "Resource requirements"]},
    {"name": "Implementation Support", "description": "Ongoing support and guidance", "estimated_hours": 15, "deliverables": ["Weekly check-ins", "Progress reports", "Course corrections"]},
    {"name": "Results Review", "description": "Results analysis and future planning", "estimated_hours": 5, "deliverables": ["Results analysis", "Lessons learned", "Future recommendations"]}
  ]'::jsonb,
  2,
  '$1,500 - $8,000'
)
ON CONFLICT (name) DO NOTHING;

-- Create some sample project stages for existing projects (if any exist)
-- This will help populate the new structure with data

-- First, let's create a function to migrate existing projects to the new structure
CREATE OR REPLACE FUNCTION migrate_existing_projects() RETURNS void AS $$
DECLARE
    project_record RECORD;
    web_dev_type_id UUID;
    stage_order INTEGER;
    stage_data JSONB;
BEGIN
    -- Get the Web Development project type ID
    SELECT id INTO web_dev_type_id FROM project_types WHERE name = 'Web Development';
    
    -- Update existing projects without project_type_id to use Web Development as default
    UPDATE projects 
    SET project_type_id = web_dev_type_id 
    WHERE project_type_id IS NULL;
    
    -- For each existing project, create stages if they don't exist
    FOR project_record IN SELECT * FROM projects LOOP
        -- Check if this project already has stages
        IF NOT EXISTS (SELECT 1 FROM project_stages WHERE project_id = project_record.id) THEN
            -- Get the default stages for this project type
            SELECT default_stages INTO stage_data 
            FROM project_types 
            WHERE id = project_record.project_type_id;
            
            -- Create stages based on the template
            stage_order := 0;
            FOR stage_data IN SELECT * FROM jsonb_array_elements(stage_data) LOOP
                INSERT INTO project_stages (
                    project_id,
                    name,
                    description,
                    order_index,
                    status,
                    estimated_hours,
                    deliverables
                ) VALUES (
                    project_record.id,
                    (stage_data->>'name')::VARCHAR(100),
                    (stage_data->>'description')::TEXT,
                    stage_order,
                    CASE WHEN stage_order = 0 THEN 'in_progress' ELSE 'pending' END,
                    COALESCE((stage_data->>'estimated_hours')::INTEGER, 0),
                    COALESCE(
                        ARRAY(SELECT jsonb_array_elements_text(stage_data->'deliverables')),
                        '{}'::TEXT[]
                    )
                );
                stage_order := stage_order + 1;
            END LOOP;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration function
SELECT migrate_existing_projects();

-- Create sample notifications for testing
INSERT INTO notifications (user_id, project_id, type, title, message, priority)
SELECT 
    p.client_id as user_id,
    p.id as project_id,
    'stage_update' as type,
    'Project Stage Updated' as title,
    'Your project "' || p.title || '" has moved to the ' || p.current_stage || ' stage.' as message,
    'normal' as priority
FROM projects p
WHERE p.client_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create indexes for performance
REINDEX TABLE project_types;
REINDEX TABLE project_stages;
REINDEX TABLE project_files;
REINDEX TABLE project_messages;
REINDEX TABLE notifications;
