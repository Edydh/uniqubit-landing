-- Add business_name and country columns to users table
-- Run this in your Supabase SQL Editor

-- Add business_name column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Add country column  
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add comments to describe the columns
COMMENT ON COLUMN public.users.business_name IS 'Optional business or company name for clients';
COMMENT ON COLUMN public.users.country IS 'Optional country code or name for clients';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
