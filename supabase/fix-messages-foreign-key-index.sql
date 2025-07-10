-- Fix unindexed foreign key performance issue
-- Table: public.messages
-- Issue: Foreign key messages_sender_id_fkey without covering index

-- ✅ COMPLETED: Create index on sender_id foreign key for better JOIN performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- RECOMMENDED: Additional performance indexes based on your table structure
-- These match your actual columns: id, project_id, sender_id, content, attachments, created_at

-- Index for ordering messages by timestamp (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Index for project filtering (very important for multi-tenant messaging)
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);

-- Composite index for messages by sender in a specific project (optimal for user conversations)
CREATE INDEX IF NOT EXISTS idx_messages_sender_project ON public.messages(sender_id, project_id);

-- Composite index for project messages ordered by time (optimal for message feeds)
CREATE INDEX IF NOT EXISTS idx_messages_project_created_at ON public.messages(project_id, created_at DESC);

-- Index for full-text search on message content (if you plan to search messages)
CREATE INDEX IF NOT EXISTS idx_messages_content_search ON public.messages USING gin(to_tsvector('english', content));

-- Index for messages with attachments (if you need to filter by attachment presence)
CREATE INDEX IF NOT EXISTS idx_messages_with_attachments ON public.messages(project_id) WHERE attachments IS NOT NULL AND attachments != 'null'::jsonb;

-- Performance improvements:
-- ✅ JOINs on sender_id will be much faster
-- ✅ Query planner can optimize relationships better
-- ✅ Reduced CPU/IO load on message queries
-- ✅ Better performance as data grows

-- Note: Run these one at a time in Supabase SQL Editor
-- Monitor query performance before/after with EXPLAIN ANALYZE
