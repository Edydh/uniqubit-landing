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

## 📊 Monitoring & Analytics

### Performance Monitoring
- Lighthouse scores
- Core Web Vitals
- Bundle analysis

### Error Tracking
- Console errors
- API error rates
- User feedback

### Business Metrics
- Lead conversion rates
- User engagement
- Project completion rates

---

*This guide is continuously updated as the platform evolves.*

## 🤖 **AI AGENT SYSTEM ARCHITECTURE**

### **Dual AI Agent Overview**

The uniQubit platform features two specialized AI agents designed to enhance both admin and client experiences:

#### **🧠 uniAgent (Admin AI Assistant)**
- **Purpose**: Streamline admin operations and decision-making
- **Context**: Full access to leads, projects, clients, and business data
- **Personality**: Professional, analytical, efficiency-focused

#### **🤝 Quibi (Client AI Assistant)**  
- **Purpose**: Guide clients through their project journey
- **Context**: Client-specific project data and stage information
- **Personality**: Friendly, helpful, supportive

### **Technical Implementation**

#### **AI Agent API Structure**
```typescript
// lib/ai/agents/uniAgent.ts
export class UniAgent {
  async summarizeLead(leadId: string): Promise<LeadSummary> {
    const lead = await this.getLeadData(leadId);
    const analysis = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are uniAgent, an AI assistant for uniQubit admin operations. 
                   Analyze leads and provide concise, actionable summaries.`
        },
        {
          role: "user", 
          content: `Summarize this lead: ${JSON.stringify(lead)}`
        }
      ]
    });
    return this.parseLeadSummary(analysis.choices[0].message.content);
  }

  async suggestProjectSetup(requirements: ProjectRequirements): Promise<ProjectSetup> {
    // AI-powered project type and stage recommendations
  }

  async generateQuote(projectDetails: ProjectDetails): Promise<QuoteEstimate> {
    // AI-generated pricing and timeline estimates
  }
}

// lib/ai/agents/quibi.ts
export class Quibi {
  async explainCurrentStage(projectId: string, clientId: string): Promise<StageExplanation> {
    const project = await this.getClientProjectData(projectId, clientId);
    const explanation = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Quibi, a friendly AI assistant helping clients navigate their projects.
                   Be encouraging, clear, and helpful in your explanations.`
        },
        {
          role: "user",
          content: `Explain the current stage for: ${JSON.stringify(project)}`
        }
      ]
    });
    return this.parseStageExplanation(explanation.choices[0].message.content);
  }

  async answerClientQuestion(question: string, context: ClientContext): Promise<string> {
    // Context-aware client support responses
  }
}
```

#### **Chat Interface Components**
```typescript
// components/AI/UniAgentChat.tsx
export const UniAgentChat: React.FC<{ leadId?: string; projectId?: string }> = ({ 
  leadId, 
  projectId 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleUniAgentQuery = async (query: string) => {
    setIsTyping(true);
    const response = await fetch('/api/ai/uni-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, leadId, projectId, context: 'admin' })
    });
    const result = await response.json();
    setMessages(prev => [...prev, result.message]);
    setIsTyping(false);
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <div className="ai-avatar">🧠</div>
        <span>uniAgent</span>
      </div>
      {/* Chat interface implementation */}
    </div>
  );
};

// components/AI/QuibiChat.tsx  
export const QuibiChat: React.FC<{ projectId: string }> = ({ projectId }) => {
  // Similar implementation for client-facing AI
  return (
    <div className="ai-chat-container client-theme">
      <div className="chat-header">
        <div className="ai-avatar">🤝</div>
        <span>Quibi</span>
      </div>
      {/* Client-optimized chat interface */}
    </div>
  );
};
```

#### **API Endpoints**
```typescript
// pages/api/ai/uni-agent.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, leadId, projectId, context } = req.body;
  
  const uniAgent = new UniAgent();
  let response;

  // Route to appropriate uniAgent capability
  if (query.includes('summarize lead')) {
    response = await uniAgent.summarizeLead(leadId);
  } else if (query.includes('project setup')) {
    response = await uniAgent.suggestProjectSetup(req.body.requirements);
  } else if (query.includes('quote')) {
    response = await uniAgent.generateQuote(req.body.projectDetails);
  } else {
    response = await uniAgent.generalQuery(query, { leadId, projectId });
  }

  res.status(200).json({ message: response });
}

// pages/api/ai/quibi.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, projectId, clientId } = req.body;
  
  const quibi = new Quibi();
  const response = await quibi.handleClientQuery(query, { projectId, clientId });
  
  res.status(200).json({ message: response });
}
```

### **AI Agent Capabilities Matrix**

#### **uniAgent Admin Functions**
| Function | Input | Output | Priority |
|----------|-------|--------|----------|
| Lead Summary | Lead ID, form data | Concise analysis, score, recommendations | High |
| Project Setup | Requirements, client info | Suggested project type, stages, timeline | High |
| Stage Planning | Project type, current stage | Recommended tasks, deliverables | Medium |
| Quote Generation | Project details, requirements | Pricing estimate, milestone breakdown | High |
| Response Suggestions | Client message, context | Suggested admin responses | Medium |
| Progress Recap | Project ID, timeline | Current status, delays, next steps | Low |

#### **Quibi Client Functions**  
| Function | Input | Output | Priority |
|----------|-------|--------|----------|
| Stage Explanation | Project ID, current stage | Clear explanation of current/next steps | High |
| File Guidance | Upload context, file type | Purpose explanation, requirements | Medium |
| Progress Update | Project ID, recent activity | Summary of recent changes | High |
| General Support | Client question, project context | Helpful, contextual response | High |
| Approval Reminders | Pending approvals, deadlines | Friendly reminder with context | Medium |

### **Context Management System**

#### **Admin Context (uniAgent)**
```typescript
interface AdminContext {
  leadData: Lead[];
  projectData: Project[];
  clientData: Client[];
  businessMetrics: {
    conversionRates: number;
    averageProjectValue: number;
    timelineAccuracy: number;
  };
  teamCapacity: TeamMember[];
}
```

#### **Client Context (Quibi)**
```typescript
interface ClientContext {
  projectId: string;
  clientId: string;
  currentStage: ProjectStage;
  completedMilestones: Milestone[];
  pendingApprovals: Approval[];
  uploadedFiles: File[];
  communicationHistory: Message[];
}
```

### **Integration Points**

#### **Admin Dashboard Integration**
- Embedded chat widget in leads table for instant summaries
- Project setup wizard with AI recommendations
- Quick response suggestions in admin messaging
- Automated progress reports in project dashboard

#### **Client Portal Integration**  
- Welcome message with current stage explanation
- File upload assistance with contextual guidance
- Progress updates with friendly explanations
- Help chat available on all client pages

### **Privacy & Security**

#### **Data Access Controls**
- uniAgent: Full admin-level access to platform data
- Quibi: Restricted to client's own project data only
- All AI interactions logged for quality and security
- No sensitive data (passwords, payment info) exposed to AI

#### **Conversation Management**
- Client conversations isolated per project
- Admin conversations can span multiple leads/projects
- Chat history stored securely with encryption
- Option to clear/export conversation history
