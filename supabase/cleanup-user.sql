-- Complete user cleanup for edydhm@gmail.com
-- Run this in your Supabase SQL Editor

-- 1. Check what users exist in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'edydhm@gmail.com';

-- 2. Check what users exist in your custom users table
SELECT id, email, role, created_at 
FROM public.users 
WHERE email = 'edydhm@gmail.com';

-- 3. Delete from custom users table
DELETE FROM public.users 
WHERE email = 'edydhm@gmail.com';

-- 4. Check auth identities (if they exist)
SELECT * FROM auth.identities 
WHERE email = 'edydhm@gmail.com';

-- 5. If needed, delete from auth.users (use carefully!)
-- DELETE FROM auth.users WHERE email = 'edydhm@gmail.com';

-- 6. Verify cleanup
SELECT 'auth.users' as table_name, count(*) as count 
FROM auth.users WHERE email = 'edydhm@gmail.com'
UNION ALL
SELECT 'public.users' as table_name, count(*) as count 
FROM public.users WHERE email = 'edydhm@gmail.com';
