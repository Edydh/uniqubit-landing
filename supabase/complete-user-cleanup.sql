-- COMPLETE USER CLEANUP for edydhm@gmail.com
-- This will remove the user from ALL Supabase tables including auth system
-- Run this in your Supabase SQL Editor with caution

-- Step 1: First, let's see what exists
SELECT 'BEFORE CLEANUP - auth.users' as status, id, email, created_at 
FROM auth.users 
WHERE email = 'edydhm@gmail.com';

SELECT 'BEFORE CLEANUP - public.users' as status, id, email, role, created_at 
FROM public.users 
WHERE email = 'edydhm@gmail.com';

SELECT 'BEFORE CLEANUP - leads' as status, id, email, created_at 
FROM public.leads 
WHERE email = 'edydhm@gmail.com';

-- Step 2: Delete from all public tables first
DELETE FROM public.projects 
WHERE client_id IN (
  SELECT id FROM public.users WHERE email = 'edydhm@gmail.com'
);

DELETE FROM public.messages 
WHERE sender_id IN (
  SELECT id FROM public.users WHERE email = 'edydhm@gmail.com'
);

DELETE FROM public.leads 
WHERE email = 'edydhm@gmail.com';

DELETE FROM public.users 
WHERE email = 'edydhm@gmail.com';

-- Step 3: Delete from auth system (THIS IS THE KEY STEP)
-- Delete auth identities first
DELETE FROM auth.identities 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'edydhm@gmail.com'
);

-- Delete from auth.users (this removes the authentication record)
DELETE FROM auth.users 
WHERE email = 'edydhm@gmail.com';

-- Step 4: Verify complete cleanup
SELECT 'AFTER CLEANUP - auth.users' as status, count(*) as count 
FROM auth.users 
WHERE email = 'edydhm@gmail.com';

SELECT 'AFTER CLEANUP - public.users' as status, count(*) as count 
FROM public.users 
WHERE email = 'edydhm@gmail.com';

SELECT 'AFTER CLEANUP - leads' as status, count(*) as count 
FROM public.leads 
WHERE email = 'edydhm@gmail.com';

-- Step 5: Final verification - should return no rows
SELECT 'FINAL CHECK' as status, 'auth.users' as table_name, email, id::text as user_id
FROM auth.users 
WHERE email = 'edydhm@gmail.com'
UNION ALL
SELECT 'FINAL CHECK' as status, 'public.users' as table_name, email, id::text as user_id
FROM public.users 
WHERE email = 'edydhm@gmail.com';
