# Sentry Setup Guide for uniQubit Platform

This guide will help you set up Sentry error monitoring and performance tracking for the uniQubit platform.

## 🎯 Why Sentry for uniQubit?

Sentry provides comprehensive monitoring for our platform:

- **Error Tracking**: Real-time error monitoring across client and server
- **Performance Monitoring**: API response times, page load performance
- **Business Metrics**: Lead conversion rates, email delivery success
- **AI Service Monitoring**: OpenAI API errors and performance
- **User Journey Tracking**: Debug user experience issues

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Sentry Account

1. Visit [sentry.io](https://sentry.io/signup/)
2. Sign up with your email or GitHub account
3. Create an organization (e.g., "uniQubit")

### Step 2: Create Project

1. Click "Create Project"
2. Select **"Next.js"** as your platform
3. Name your project: **"uniqubit-platform"**
4. Choose your team/organization

### Step 3: Get Configuration Values

After creating the project, you'll see a setup page with your DSN. Copy these values:

```bash
# Your DSN will look like this:
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/7890123
```

### Step 4: Get Auth Token

1. Go to **Settings** → **Auth Tokens**
2. Click **"Create New Token"**
3. Name: "uniQubit Platform"
4. Scopes: Select all (or at minimum: `project:read`, `project:write`, `project:releases`)
5. Copy the token

### Step 5: Get Organization and Project Slugs

- **Organization slug**: Found in your Sentry URL (e.g., `sentry.io/organizations/uniqubit/`)
- **Project slug**: Usually your project name in lowercase with dashes

### Step 6: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Sentry Configuration (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=uniqubit-platform
SENTRY_AUTH_TOKEN=your-auth-token-here
```

## 🧪 Test Your Setup

### Method 1: Run the Setup Script
```bash
./scripts/setup-sentry.sh
```

### Method 2: Test API Endpoint
```bash
# Start your development server
npm run dev

# Test error tracking
curl -X POST http://localhost:3000/api/test-sentry \
  -H "Content-Type: application/json" \
  -d '{"testType": "error"}'

# Test business error tracking
curl -X POST http://localhost:3000/api/test-sentry \
  -H "Content-Type: application/json" \
  -d '{"testType": "business_error"}'

# Test AI error tracking
curl -X POST http://localhost:3000/api/test-sentry \
  -H "Content-Type: application/json" \
  -d '{"testType": "ai_error"}'
```

### Method 3: Check Sentry Dashboard
1. Go to your Sentry project dashboard
2. Look for incoming events in the "Issues" tab
3. Check "Performance" tab for transaction data

## 📊 What You'll Monitor

### Automatic Tracking
- **API Errors**: All `/api/*` route errors
- **Page Load Performance**: Client-side performance metrics
- **Database Errors**: Supabase connection and query issues
- **Build Errors**: Source map uploads and build issues

### Custom Business Tracking
- **Lead Conversion Errors**: When lead conversion fails
- **AI Service Errors**: OpenAI API failures
- **Email Delivery Issues**: Resend/Supabase email problems
- **User Registration Issues**: Authentication failures

### Performance Metrics
- **API Response Times**: Track slow endpoints
- **Page Load Speeds**: Monitor user experience
- **AI Processing Time**: Monitor OpenAI response times
- **Database Query Performance**: Track slow queries

## 🎛️ Sentry Dashboard Setup

### 1. Configure Alerts

**High Priority Alerts:**
- Error rate > 5% in last hour
- AI service failures
- Email delivery failures
- Database connection issues

**Business Alerts:**
- Lead conversion failures
- Contact form errors
- Project creation failures

### 2. Create Custom Dashboards

**Business Dashboard:**
- Lead conversion success rate
- Contact form submission rate
- Email delivery success rate
- User registration success rate

**Technical Dashboard:**
- API response times
- Error rates by endpoint
- Performance by page
- AI service performance

## 🔧 Advanced Configuration

### Environment-Specific Settings

**Development:**
```bash
# Disable Sentry in development to avoid noise
NODE_ENV=development
```

**Staging:**
```bash
NEXT_PUBLIC_SENTRY_DSN=your-staging-dsn
SENTRY_ENVIRONMENT=staging
```

**Production:**
```bash
NEXT_PUBLIC_SENTRY_DSN=your-production-dsn
SENTRY_ENVIRONMENT=production
```

### Custom Error Context

Our platform automatically adds context to errors:

```typescript
// Automatic context for all errors:
{
  user: { id, email, role },
  page: "/admin/leads",
  component: "LeadsTable",
  business_action: "lead_conversion"
}
```

## 🚨 Troubleshooting

### Common Issues

**1. Source Maps Not Uploading**
```bash
# Check auth token
npx @sentry/cli info

# Verify token permissions
npx @sentry/cli projects list
```

**2. No Events in Dashboard**
```bash
# Check DSN configuration
echo $NEXT_PUBLIC_SENTRY_DSN

# Test with API endpoint
curl -X POST localhost:3000/api/test-sentry \
  -d '{"testType": "error"}'
```

**3. Development Errors Being Captured**
- Ensure `NODE_ENV=development` is set
- Check Sentry filters in config files

### Debugging Commands

```bash
# Check Sentry configuration
npx @sentry/cli info

# Test source map upload
npm run build

# Verify project settings
npx @sentry/cli projects list

# Check recent events
npx @sentry/cli events list
```

## 📈 Business Value

With Sentry configured, you'll have:

### Immediate Benefits
- **Zero Downtime Alerts**: Get notified immediately when critical errors occur
- **Performance Insights**: Identify slow API endpoints and pages
- **User Experience Monitoring**: Track how errors affect user journeys

### Long-term Benefits
- **Business Intelligence**: Track lead conversion rates and patterns
- **Proactive Issue Resolution**: Fix issues before users report them
- **Performance Optimization**: Data-driven performance improvements

## 🎉 You're All Set!

Once configured, Sentry will automatically:

1. **Track all errors** across your platform
2. **Monitor performance** of critical business flows
3. **Alert you** when issues occur
4. **Provide insights** for continuous improvement

Your uniQubit platform now has enterprise-grade monitoring! 🚀

---

**Need Help?**
- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Integration Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- Platform-specific issues: Check the troubleshooting section above
