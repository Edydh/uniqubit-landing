# Development Server Troubleshooting Guide

## 🐛 Common Issues & Solutions

### Issue 1: Next.js Configuration Warnings

**Symptoms:**
```
⚠ Invalid next.config.js options detected: 
⚠     Unrecognized key(s) in object: 'serverComponentsExternalPackages'
⚠     Unrecognized key(s) in object: 'sentry'
```

**Solution:** ✅ FIXED
- Moved `experimental.serverComponentsExternalPackages` → `serverExternalPackages`
- Removed deprecated `sentry` configuration object
- Updated to use proper Sentry webpack plugin options

### Issue 2: Build Manifest Errors

**Symptoms:**
```
⨯ [Error: ENOENT: no such file or directory, open '/.next/server/pages/_app/build-manifest.json']
```

**Solution:** ✅ FIXED
- Clean build cache: `npm run clean`
- Fresh build: `npm run build`
- Added npm script for easy cache cleaning

### Issue 3: Cross-Origin Development Warnings

**Symptoms:**
```
⚠ Cross origin request detected from 192.168.2.102 to /_next/* resource
```

**Solution:** ✅ FIXED
- Added `allowedDevOrigins: ['192.168.2.102']` to next.config.js
- Allows development access from network IP

### Issue 4: Missing Favicon/Touch Icon 404s

**Symptoms:**
```
GET /apple-touch-icon.png 404
GET /apple-touch-icon-precomposed.png 404
```

**Solution:** ✅ FIXED
- Added redirects in next.config.js to fallback to favicon.ico
- Created placeholder files in public directory

### Issue 5: Punycode Deprecation Warning

**Symptoms:**
```
(node:88546) [DEP0040] DeprecationWarning: The `punycode` module is deprecated
```

**Solution:** ⚠️ INFORMATIONAL ONLY
- This is a dependency warning from Node.js
- Not affecting functionality
- Will be resolved when dependencies update

### Issue 6: Password Reset Email Failures

**Symptoms:**
```
Error sending recovery email
Stack trace in fetch.ts → GoTrueClient.ts → auth.ts
handleError (fetch.ts:102:9)
```

**Root Causes & Solutions:**

1. **Rate Limiting (Most Common)** 🚫
   ```
   Too many requests / Email rate limit exceeded
   ```
   - **Check:** Supabase Dashboard → Project Settings → Rate limits
   - **Fix:** Increase "Email rate limit" from 2/hour to 50+/hour
   - **Workaround:** Wait 1 hour between attempts

2. **Missing Redirect URL Configuration** 🌐
   ```
   Invalid redirect URL / URL not whitelisted
   ```
   - **Check:** Supabase Dashboard → Authentication → URL Configuration
   - **Fix:** Add redirect URLs:
     - Development: `http://localhost:3000/reset-password`
     - Production: `https://uniqubit.ca/reset-password`

3. **Email Template Issues** 📧
   ```
   Email template not configured or disabled
   ```
   - **Check:** Supabase Dashboard → Authentication → Email Templates
   - **Fix:** Ensure "Reset Password" template is enabled
   - **Verify:** Template contains `{{ .ConfirmationURL }}` variable

4. **Project Email Settings** ⚙️
   ```
   Email delivery disabled or misconfigured
   ```
   - **Check:** Supabase Dashboard → Project Settings → General
   - **Fix:** Verify email delivery is enabled
   - **Note:** Free tier has stricter email limits

**Debugging Steps:**
```bash
# 1. Check browser console for detailed error
# 2. Go to Supabase Dashboard → Logs → Auth logs
# 3. Look for recent failed email attempts
# 4. Check your email's spam folder
# 5. Try with a different email address
```

**Environment Variables to Verify:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # For development
```

**Quick Test:**
- Open browser dev tools → Console
- The improved logging now shows the exact Supabase error
- Look for "Supabase reset password error:" in console

### Issue 7: Database Performance - Unindexed Foreign Keys

**Symptoms:**
```
Table public.messages has a foreign key messages_sender_id_fkey without a covering index
Slow query performance on JOINs involving messages table
```

**Root Cause:**
- Foreign key constraints without covering indexes
- Database performance degrades as data grows
- Query planner cannot optimize relationships effectively

**Solution:** ✅ CREATED SQL FIX
```sql
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
```

**Implementation:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL script: `supabase/fix-messages-foreign-key-index.sql`
3. Monitor performance improvements with `EXPLAIN ANALYZE`

**Performance Benefits:**
- ✅ Faster JOIN operations on sender_id
- ✅ Better query planner optimization
- ✅ Reduced CPU/IO load
- ✅ Scalable performance as data grows

## 🔧 Quick Fixes

### Clean Restart
```bash
npm run clean      # Clear cache
npm run fresh-start # Clean + restart dev server
```

### Check Configuration
```bash
npm run type-check  # Verify TypeScript
npm run build      # Test production build
```

### Test Sentry Integration
```bash
npm run sentry:test     # Quick Sentry test
npm run sentry:test-all # Comprehensive tests
```

## ✅ Current Status

All major issues have been resolved:

- ✅ **Next.js Configuration**: Updated for Next.js 15
- ✅ **Build System**: Clean builds without manifest errors
- ✅ **Development Server**: Network access configured
- ✅ **Asset Handling**: Favicon redirects in place
- ✅ **Sentry Integration**: Fully operational
- ✅ **TypeScript**: Clean compilation

## 🚀 Ready for Development

Your development environment is now properly configured and ready for use!

```bash
npm run dev  # Start development server (should run cleanly now)
```

---

**Note**: The server output shows successful page compilations and proper Supabase configuration, indicating the core platform is working correctly.
