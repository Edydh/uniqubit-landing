-- QUICK USER CHECK - Run this to verify user is completely gone
-- This should return 0 rows for all queries if cleanup was successful

SELECT 'auth.users' as table_name, count(*) as count, 'Should be 0' as expected
FROM auth.users 
WHERE email = 'edydhm@gmail.com'

UNION ALL

SELECT 'auth.identities' as table_name, count(*) as count, 'Should be 0' as expected
FROM auth.identities 
WHERE email = 'edydhm@gmail.com'

UNION ALL

SELECT 'public.users' as table_name, count(*) as count, 'Should be 0' as expected
FROM public.users 
WHERE email = 'edydhm@gmail.com'

UNION ALL

SELECT 'public.leads' as table_name, count(*) as count, 'Can be > 0' as expected
FROM public.leads 
WHERE email = 'edydhm@gmail.com';

-- If you want to see actual records (should be empty):
SELECT 'ACTUAL RECORDS CHECK' as type, 'auth.users' as source, email, id::text as identifier
FROM auth.users 
WHERE email = 'edydhm@gmail.com'

UNION ALL

SELECT 'ACTUAL RECORDS CHECK' as type, 'public.users' as source, email, id::text as identifier
FROM public.users 
WHERE email = 'edydhm@gmail.com';
