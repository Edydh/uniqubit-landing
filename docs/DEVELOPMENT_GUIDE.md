# Development Guide

## 🏗️ Architecture Overview

### Frontend Architecture
- **Next.js 15** with App Router and TypeScript
- **Component Structure**: Modular components with clear separation of concerns
- **State Management**: React hooks and context for state management
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture
- **Supabase**: PostgreSQL database with real-time subscriptions
- **API Routes**: Next.js API routes for server-side logic
- **Authentication**: Supabase Auth with role-based access control
- **Email Service**: Resend for transactional emails
- **AI Integration**: Vercel AI SDK with OpenAI GPT-4

### Database Schema

```sql
-- Core Tables
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  ai_score INTEGER,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  client_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  budget_estimate DECIMAL,
  timeline_weeks INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'client',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📁 Project Structure

```
├── components/
│   ├── AuthLayout.tsx          # Authentication layout wrapper
│   ├── ContactForm.tsx         # Contact form with AI integration
│   ├── Hero.tsx               # Landing page hero section
│   ├── Navigation.tsx         # Main navigation component
│   ├── PhoneInput.tsx         # International phone input component
│   ├── Admin/
│   │   ├── AdminLayout.tsx    # Admin dashboard layout
│   │   ├── AdminNavigation.tsx # Admin navigation sidebar
│   │   ├── Dashboard.tsx      # Admin dashboard overview
│   │   ├── LeadsTable.tsx     # Advanced leads management table
│   │   ├── ProjectList.tsx    # Project management component
│   │   └── StatCard.tsx       # Statistics card component
│   └── Client/
│       ├── ClientLayout.tsx   # Client portal layout
│       ├── ClientNavigation.tsx # Client navigation
│       ├── Dashboard.tsx      # Client dashboard
│       ├── MessageCenter.tsx  # Real-time messaging
│       ├── ProjectStatus.tsx  # Project status display
│       └── ProjectTimeline.tsx # Project timeline view
├── pages/
│   ├── index.tsx              # Landing page
│   ├── login.tsx              # Authentication pages
│   ├── register.tsx
│   ├── dashboard.tsx          # Main dashboard router
│   ├── admin/
│   │   ├── dashboard.tsx      # Admin dashboard
│   │   ├── leads.tsx          # Lead management page
│   │   ├── projects.tsx       # Project management page
│   │   └── clients.tsx        # Client management page
│   └── api/
│       ├── contact.ts         # Contact form API
│       ├── contact-ai.ts      # AI-enhanced contact API
│       ├── convert-lead.ts    # Lead conversion API
│       ├── test-email.ts      # Email testing endpoint
│       └── test-supabase.ts   # Database connection test
├── lib/
│   ├── supabase.ts            # Supabase client configuration
│   ├── auth.ts                # Authentication utilities
│   ├── types.ts               # TypeScript type definitions
│   ├── ai/
│   │   ├── config.ts          # AI configuration
│   │   ├── services/
│   │   │   ├── contactAI.ts   # Contact form AI processing
│   │   │   └── emailService.ts # Email service integration
│   │   └── types/
│   │       └── leadAnalysis.ts # AI analysis type definitions
│   ├── security/
│   │   ├── rateLimiter.ts     # Rate limiting implementation
│   │   ├── spamDetection.ts   # Spam detection algorithms
│   │   └── turnstile.ts       # Cloudflare Turnstile integration
│   └── validation/
│       └── phoneValidation.ts # Phone number validation utilities
├── database/
│   ├── schema.sql             # Main database schema
│   └── ai_schema.sql          # AI-specific tables
└── supabase/
    ├── schema.sql             # Supabase schema definitions
    └── *.sql                  # Various migration and fix scripts
```

## 🔌 API Documentation

### Contact Form API (`/api/contact`)

**Endpoint**: `POST /api/contact`

**Request Body**:
```typescript
{
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  leadId?: string;
  message: string;
  aiAnalysis?: {
    score: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    projectType: string;
    budgetEstimate: string;
    insights: string[];
  };
}
```

### Lead Conversion API (`/api/convert-lead`)

**Endpoint**: `POST /api/convert-lead`

**Request Body**:
```typescript
{
  leadId: string;
  projectName: string;
  projectDescription?: string;
  createUser?: boolean;
  userEmail?: string;
  userName?: string;
}
```

### AI Contact Analysis (`/api/contact-ai`)

**Endpoint**: `POST /api/contact-ai`

Enhanced contact form with AI analysis and automated email responses.

## 🔐 Authentication & Security

### Supabase Auth Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

### Role-Based Access Control

```typescript
// User roles: 'admin', 'client', 'user'
export type UserRole = 'admin' | 'client' | 'user'

// Route protection
export const requireAuth = (role?: UserRole) => {
  // Implementation for route protection
}
```

### Security Features

1. **Rate Limiting**: 10 requests per hour per IP
2. **Spam Detection**: AI-powered content analysis
3. **Input Validation**: Zod schemas for all forms
4. **XSS Protection**: Content sanitization
5. **CSRF Protection**: Built-in Next.js protection
6. **Honeypot Fields**: Hidden form fields for bot detection

## 📧 Email System

### Resend Integration (Working)

```typescript
// lib/ai/services/emailService.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (options: EmailOptions) => {
  return await resend.emails.send({
    from: 'noreply@uniqubit.ca',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
```

### Email Templates

- **Welcome Email**: Sent to new clients
- **Lead Notification**: Sent to admin for new leads
- **Project Update**: Sent to clients for project updates
- **AI Analysis**: Sent to admin with lead insights

### Supabase Auth Emails (Currently Not Working)

- Email confirmation disabled in Supabase dashboard
- Password reset emails not delivering
- Requires SMTP configuration fix

## 🧪 Testing Procedures

### Manual Testing Checklist

#### Contact Form Flow
1. ✅ Submit contact form with valid data
2. ✅ Verify lead created in database
3. ✅ Check admin receives notification email
4. ✅ Confirm AI analysis is generated

#### Admin Lead Conversion
1. ✅ Navigate to admin leads page
2. ✅ Click "Convert" on a lead
3. ✅ Fill out project details
4. ✅ Create project with/without user
5. ✅ Verify project appears in admin dashboard

#### Client Registration & Login
1. ⚠️ Register new client account
2. ⚠️ Login with credentials (email confirmation disabled)
3. ✅ Access client dashboard
4. ✅ View assigned projects

### API Testing

```bash
# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'

# Test email service
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","message":"Test email"}'

# Test Supabase connection
curl http://localhost:3000/api/test-supabase
```

## 🎨 Design System

### Colors
```css
:root {
  --bg-primary: #0c0c0c;
  --bg-secondary: #111827;
  --glass-light: rgba(255, 255, 255, 0.05);
  --glass-medium: rgba(255, 255, 255, 0.08);
  --accent-blue: #38bdf8;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
}
```

### Glassmorphism Components
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter
- **Consistent hierarchy**: h1-h6 with proper spacing

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Resend
RESEND_API_KEY=your_resend_key

# Sentry (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Cloudflare Turnstile (optional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

### Build & Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐛 Known Issues & Troubleshooting

### Email Issues
- **Supabase Auth emails not delivering**: SMTP not properly configured
- **Solution**: Use custom email endpoints or configure Supabase SMTP

### Database Issues
- **RLS policies**: Ensure proper row-level security policies
- **Service role**: Use service role key for admin operations

### Authentication Issues
- **Email confirmation**: Currently disabled for testing
- **Password reset**: Not working due to email delivery issues

### Performance Issues
- **Large bundle size**: Consider code splitting
- **Image optimization**: Implement Next.js Image component

### Sentry Setup Issues
- **Source maps not uploading**: Check `SENTRY_AUTH_TOKEN` environment variable
- **Development errors being captured**: Ensure `NODE_ENV=development` filters are working
- **Missing error context**: Verify custom error tracking is implemented in API routes

### Sentry Troubleshooting Commands
```bash
# Test Sentry configuration
npm run sentry:test

# Verify source map upload
npx @sentry/cli info

# Check Sentry project configuration
npx @sentry/cli projects list
```

## 📊 Monitoring & Analytics

### **Sentry Error Monitoring**

The uniQubit platform uses Sentry for comprehensive error tracking, performance monitoring, and business metrics collection.

#### **Sentry Configuration**

```typescript
// Automatic setup via configuration files
// - sentry.client.config.js: Client-side error tracking
// - sentry.server.config.js: Server-side API monitoring  
// - sentry.edge.config.js: Edge runtime monitoring
```

#### **Custom Error Tracking**

```typescript
import { UniQubitSentry } from '@/lib/sentry';

// Track business-critical errors
UniQubitSentry.captureBusinessError(error, {
  action: 'lead_conversion',
  userId: user.id,
  leadId: lead.id
});

// Track AI service errors
UniQubitSentry.captureAIError(error, {
  service: 'openai',
  prompt: userPrompt,
  leadData: leadInfo
});

// Track email delivery issues
UniQubitSentry.captureEmailError(error, {
  service: 'resend',
  emailType: 'welcome',
  recipient: user.email
});

// Track database operations
UniQubitSentry.captureDatabaseError(error, {
  operation: 'create',
  table: 'leads',
  userId: user.id
});
```

#### **React Error Boundaries**

```tsx
import { UniQubitErrorBoundary, withSentryErrorBoundary } from '@/lib/sentry';

// Option 1: Wrap component with error boundary
export default function MyPage() {
  return (
    <UniQubitErrorBoundary componentName="MyPage">
      <YourPageContent />
    </UniQubitErrorBoundary>
  );
}

// Option 2: HOC pattern for automatic error tracking
const SafeComponent = withSentryErrorBoundary(MyComponent, 'MyComponent');
```

#### **User Journey Tracking**

```typescript
// Track user interactions for better debugging
UniQubitSentry.captureUserJourney('contact_form_submitted', {
  userId: user.id,
  userRole: 'client',
  page: '/contact',
  action: 'form_submission'
});
```

#### **Performance Monitoring**

- **Transaction Tracking**: Automatic API route performance monitoring
- **Page Load Metrics**: Client-side performance tracking
- **Business Metrics**: Custom metrics for lead conversion, email delivery
- **Real User Monitoring**: Session replay for critical errors

#### **Alert Configuration**

**High Priority Alerts:**
- AI service failures (OpenAI API errors)
- Email delivery failures (Resend/Supabase)
- Database connection issues
- Authentication failures

**Business Alerts:**
- Lead conversion failures
- Contact form submission errors
- Project creation failures
- User registration issues

#### **Dashboard Categories**

**Error Categories:**
- `business_critical`: Lead conversion, project creation
- `ai_service`: OpenAI, lead analysis, contact AI
- `email_delivery`: Resend, Supabase auth emails
- `database`: Supabase operations
- `component_boundary`: React component errors

**Performance Categories:**
- `api_route`: API endpoint performance
- `user_journey`: User interaction tracking
- `business_metric`: Conversion and engagement metrics
