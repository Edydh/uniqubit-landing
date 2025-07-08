-- =====================================================
-- FOUND: Enable Leaked Password Protection in Email Settings
-- =====================================================
-- This addresses the security warning about leaked password protection
-- being disabled in Supabase Auth

-- LOCATION FOUND: Authentication > Sign In / Providers > Email
-- The setting is available in the Email provider configuration!

-- STEP-BY-STEP INSTRUCTIONS:

-- STEP 1: Access Email Provider Settings
--   1. Go to Authentication > Sign In / Providers
--   2. Click on "Email" (as shown in screenshot)

-- STEP 2: Enable Leaked Password Protection
--   3. Scroll down to find "Prevent use of leaked passwords"
--   4. Toggle ON the setting (currently disabled in screenshot)
--   5. Description: "Rejects the use of known or easy to guess passwords on sign up or 
--      password change. Powered by the HaveIBeenPwned.org Pwned Passwords API."

-- STEP 3: Configure Additional Security (Recommended)
--   6. Consider enabling other security settings visible in the screenshot:
--      - "Secure password change" (currently disabled)
--      - Increase "Minimum password length" from 6 to 8+ characters
--      - Set "Password Requirements" to require mixed characters

-- STEP 4: Save Changes
--   7. Scroll to bottom and click "Save" or "Update"

-- VERIFICATION: After enabling, the security warning should be resolved.

-- Verification queries (to check auth schema structure)
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'auth'
ORDER BY tablename;
