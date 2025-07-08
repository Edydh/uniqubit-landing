-- =====================================================
-- Fix Function Search Path for public.update_updated_at_column
-- =====================================================
-- This addresses the security warning about mutable search_path
-- in the public.update_updated_at_column function

-- ISSUE: Function public.update_updated_at_column has a role mutable search_path
-- RISK: This can lead to security vulnerabilities through "search path injection" attacks

-- STEP 1: Check current function definition
SELECT 
    proname as function_name,
    pronamespace::regnamespace as schema_name,
    prosrc as function_body,
    proconfig as current_config
FROM pg_proc 
WHERE proname = 'update_updated_at_column' 
    AND pronamespace = 'public'::regnamespace;

-- STEP 2: Fix the search path (RECOMMENDED - Most Secure)
-- Set empty search path to require schema-qualified names
ALTER FUNCTION public.update_updated_at_column() 
SET search_path = '';

-- STEP 3: Update function definition to use secure search path
-- This function is simple and doesn't need schema qualification
-- since it only uses built-in PostgreSQL functions like NOW()
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- ALTERNATIVE: If you prefer to keep existing function and just fix search path
-- ALTER FUNCTION public.update_updated_at_column() 
-- SET search_path = '';

-- STEP 4: Verify the fix
SELECT 
    proname as function_name,
    pronamespace::regnamespace as schema_name,
    proconfig as updated_config
FROM pg_proc 
WHERE proname = 'update_updated_at_column' 
    AND pronamespace = 'public'::regnamespace;

-- STEP 5: Check which tables use this trigger function
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_name,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE action_statement LIKE '%update_updated_at_column%'
ORDER BY table_schema, table_name;

-- SECURITY BENEFITS:
-- ✅ Prevents search path injection attacks
-- ✅ Makes function behavior predictable and secure  
-- ✅ Requires explicit schema qualification (good practice)
-- ✅ Follows PostgreSQL security best practices
-- ✅ Maintains trigger functionality for updated_at columns
