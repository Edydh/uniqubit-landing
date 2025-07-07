# AI Implementation - Required Information & Setup Guide

## 🎯 **Overview**

This document outlines all the information, credentials, and setup requirements needed for successful Vercel AI implementation in the uniQubit platform.

---

## 📋 **Required Information Checklist**

### **1. AI Service Provider Setup**

#### **OpenAI Account & API Key** (REQUIRED)
- [ ] **OpenAI Account**: Create account at https://platform.openai.com
- [ ] **API Key**: Generate API key with GPT-4 access
- [ ] **Billing Setup**: Add payment method for API usage
- [ ] **Usage Limits**: Set appropriate usage limits ($50-100/month recommended)
- [ ] **Model Access**: Ensure access to `gpt-4o` model

**Environment Variable:**
```env
OPENAI_API_KEY=sk-proj-...your-key-here
```

#### **Alternative: Anthropic Claude** (OPTIONAL)
- [ ] **Anthropic Account**: Create account at https://console.anthropic.com
- [ ] **API Key**: Generate API key
- [ ] **Model Access**: Ensure access to `claude-3-5-sonnet-20241022`

**Environment Variable:**
```env
ANTHROPIC_API_KEY=sk-ant-...your-key-here
```

### **2. Email Service Setup**

#### **Resend Email Service** (RECOMMENDED)
- [ ] **Resend Account**: Create account at https://resend.com
- [ ] **API Key**: Generate API key
- [ ] **Domain Verification**: Verify uniqubit.ca domain
- [ ] **From Email**: Set up noreply@uniqubit.ca
- [ ] **DKIM Setup**: Configure DKIM records for better deliverability

**Environment Variables:**
```env
RESEND_API_KEY=re_...your-key-here
FROM_EMAIL=noreply@uniqubit.ca
ADMIN_EMAIL=admin@uniqubit.ca
```

**DNS Records Needed:**
```
TXT record: resend._domainkey.uniqubit.ca
Value: [Provided by Resend]

MX record: uniqubit.ca
Value: [Provided by Resend if using custom domain]
```

#### **Alternative: SendGrid** (ALTERNATIVE)
- [ ] **SendGrid Account**: Create account
- [ ] **API Key**: Generate API key
- [ ] **Domain Authentication**: Verify domain

### **3. Database Schema Updates**

#### **New Tables Required**
```sql
-- Add these columns to existing leads table
ALTER TABLE leads ADD COLUMN ai_score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN ai_priority VARCHAR(10) DEFAULT 'medium';
ALTER TABLE leads ADD COLUMN ai_project_type VARCHAR(50);
ALTER TABLE leads ADD COLUMN ai_budget_estimate VARCHAR(20);
ALTER TABLE leads ADD COLUMN ai_urgency VARCHAR(20);
ALTER TABLE leads ADD COLUMN ai_complexity VARCHAR(20);
ALTER TABLE leads ADD COLUMN ai_analysis JSONB;
ALTER TABLE leads ADD COLUMN ai_response_sent BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN ai_response_content TEXT;

-- New AI insights table
CREATE TABLE ai_project_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  insight_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  data_sources JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI communication log
CREATE TABLE ai_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  project_id UUID REFERENCES projects(id),
  communication_type VARCHAR(50) NOT NULL,
  prompt_used TEXT,
  ai_response TEXT NOT NULL,
  human_approved BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **4. Environment Configuration**

#### **Complete .env.local Setup**
```env
# Existing Variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration (NEW)
OPENAI_API_KEY=sk-proj-...
AI_MODEL_PROVIDER=openai
AI_MODEL_NAME=gpt-4o
AI_MAX_TOKENS=1000
AI_TEMPERATURE=0.7

# Email Configuration (NEW)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@uniqubit.ca
ADMIN_EMAIL=admin@uniqubit.ca
SUPPORT_EMAIL=support@uniqubit.ca

# Vercel Analytics (OPTIONAL)
VERCEL_ANALYTICS_ID=your-analytics-id

# Security & Rate Limiting (NEW)
AI_RATE_LIMIT_PER_HOUR=100
AI_RATE_LIMIT_PER_DAY=1000
```

### **5. Project Dependencies**

#### **Required NPM Packages**
```bash
# AI Dependencies
npm install ai @ai-sdk/openai @ai-sdk/anthropic zod

# Email Dependencies
npm install resend

# Utility Dependencies
npm install uuid date-fns

# Development Dependencies
npm install @types/uuid --save-dev
```

#### **Package.json Updates Needed**
```json
{
  "dependencies": {
    "ai": "^3.0.0",
    "@ai-sdk/openai": "^0.0.0",
    "@ai-sdk/anthropic": "^0.0.0",
    "zod": "^3.22.0",
    "resend": "^3.0.0",
    "uuid": "^9.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.0"
  }
}
```

---

## 🛠️ **Setup Instructions**

### **Step 1: Create OpenAI Account**
1. Go to https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Add billing information
6. Set usage limits ($50-100/month)

### **Step 2: Set Up Email Service**
1. Create Resend account at https://resend.com
2. Verify your domain (uniqubit.ca)
3. Generate API key
4. Configure DNS records as provided
5. Test email sending

### **Step 3: Update Environment Variables**
1. Add all required variables to `.env.local`
2. Ensure no spaces around equals signs
3. Use proper quote formatting for complex values
4. Test environment variables load correctly

### **Step 4: Install Dependencies**
```bash
cd /Users/edydh/Documents/uniqubit.ca/uniqubit-landing
npm install ai @ai-sdk/openai zod resend uuid date-fns
npm install @types/uuid --save-dev
```

### **Step 5: Database Updates**
1. Run the SQL schema updates in Supabase
2. Verify all tables and columns created successfully
3. Test database connections
4. Set up proper RLS policies

---

## 🧪 **Testing Requirements**

### **AI Service Testing**
- [ ] Test OpenAI API connection
- [ ] Verify model access (gpt-4o)
- [ ] Test rate limiting
- [ ] Validate response quality

### **Email Testing**
- [ ] Test email sending functionality
- [ ] Verify delivery to admin email
- [ ] Check spam folder placement
- [ ] Test HTML email formatting

### **Integration Testing**
- [ ] Test contact form with AI responses
- [ ] Verify lead scoring accuracy
- [ ] Test admin notification system
- [ ] Validate database storage

---

## 💰 **Cost Estimation**

### **Monthly AI Costs (Estimated)**
- **OpenAI GPT-4o**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Expected Usage**: 100-500 inquiries/month
- **Estimated Cost**: $20-50/month

### **Email Service Costs**
- **Resend**: 3,000 emails/month free, then $20/month
- **Expected Usage**: 200-500 emails/month
- **Estimated Cost**: $0-20/month

### **Total Monthly Cost**: $20-70/month

---

## 🚨 **Security Considerations**

### **API Key Security**
- [ ] Store API keys in environment variables only
- [ ] Never commit API keys to version control
- [ ] Use different keys for development/production
- [ ] Rotate keys regularly (quarterly)

### **Rate Limiting**
- [ ] Implement API rate limiting
- [ ] Monitor usage patterns
- [ ] Set up usage alerts
- [ ] Have fallback mechanisms

### **Data Privacy**
- [ ] Ensure GDPR compliance for AI processing
- [ ] Implement data retention policies
- [ ] Secure AI communication logs
- [ ] Add user consent mechanisms

---

## 📞 **Support & Troubleshooting**

### **Common Issues**
1. **API Key Invalid**: Verify key format and permissions
2. **Rate Limit Exceeded**: Check usage and increase limits
3. **Email Not Delivered**: Check DNS records and spam folders
4. **Database Connection Failed**: Verify Supabase credentials

### **Monitoring Setup**
- [ ] Set up error logging for AI failures
- [ ] Monitor API usage and costs
- [ ] Track email delivery rates
- [ ] Set up performance alerts

---

**Last Updated**: July 7, 2025  
**Status**: Ready for Implementation  
**Next Review**: After successful setup

---

*This document should be referenced throughout the AI implementation process to ensure all requirements are met and setup is completed successfully.*
