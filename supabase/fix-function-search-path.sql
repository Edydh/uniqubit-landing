-- =====================================================
-- Fix Function Search Path for public.handle_new_user
-- =====================================================
-- This addresses the security warning about mutable search_path
-- in the public.handle_new_user function

-- ISSUE: Function public.handle_new_user has a role mutable search_path
-- RISK: This can lead to security vulnerabilities through "search path injection" attacks

-- STEP 1: Check current function definition
SELECT 
    proname as function_name,
    pronamespace::regnamespace as schema_name,
    prosrc as function_body,
    proconfig as current_config
FROM pg_proc 
WHERE proname = 'handle_new_user' 
    AND pronamespace = 'public'::regnamespace;

-- STEP 2: Fix the search path (RECOMMENDED - Most Secure)
-- Set empty search path to require schema-qualified names
ALTER FUNCTION public.handle_new_user() 
SET search_path = '';

-- STEP 3: Update function definition to use schema-qualified names
-- Since we're using empty search path, ensure all objects are schema-qualified
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'client');
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- ALTERNATIVE: If you prefer to keep existing function and just fix search path
-- ALTER FUNCTION public.handle_new_user() 
-- SET search_path = 'public, auth';

-- STEP 4: Verify the fix
SELECT 
    proname as function_name,
    pronamespace::regnamespace as schema_name,
    proconfig as updated_config
FROM pg_proc 
WHERE proname = 'handle_new_user' 
    AND pronamespace = 'public'::regnamespace;

-- STEP 5: Test the function (optional)
-- The function should still work correctly but now with secure search path
-- You can test by creating a new user account

-- SECURITY BENEFITS:
-- ✅ Prevents search path injection attacks
-- ✅ Makes function behavior predictable and secure  
-- ✅ Requires explicit schema qualification (good practice)
-- ✅ Follows PostgreSQL security best practices
