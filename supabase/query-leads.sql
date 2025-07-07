-- Query to view all leads data in SQL Editor
-- This bypasses RLS when run in the SQL Editor

SELECT * FROM public.leads ORDER BY created_at DESC;

-- You can also see the count of leads:
SELECT COUNT(*) as total_leads FROM public.leads;

-- Or see leads by status:
SELECT status, COUNT(*) as count 
FROM public.leads 
GROUP BY status;
