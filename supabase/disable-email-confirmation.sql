-- Temporarily disable email confirmation for testing
-- Run this in your Supabase SQL Editor

-- Method 1: Check if auth.config table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth' AND table_name = 'config';

-- Method 2: Try alternative auth configuration (if available)
-- UPDATE auth.config 
-- SET enable_confirmations = false 
-- WHERE true;

-- Method 3: Alternative schema check
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'auth';

-- ⚠️  IMPORTANT: If the above SQL commands don't work, 
-- you MUST use the Supabase Dashboard UI instead:
--
-- 1. Go to Supabase Dashboard → Authentication → Settings
-- 2. Find "Email confirmations" section
-- 3. Toggle OFF "Enable email confirmations"
-- 4. Click "Save"
--
-- This is the most reliable method for most Supabase projects.

-- After disabling email confirmation, test user registration:
-- Users should be created immediately without requiring email verification
