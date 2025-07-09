# uniQubit Platform - Feature Reference Guide

## 🚀 **Quick Start Testing Guide**

### **🌐 Main Landing Page**
- **URL**: `http://localhost:3001`
- **Features**: Hero section, services, about, AI-enhanced contact form
- **Test**: Submit contact form with different project types

### **📱 Phone Validation Demo**  
- **URL**: `http://localhost:3001/phone-test`
- **Features**: Interactive phone validation testing
- **Test**: Try different international formats

---

## 📋 **Contact Form Testing Scenarios**

### ✅ **Valid Submissions**
```
Name: John Doe
Email: john@example.com
Phone: (555) 123-4567
Project: Web Development
Message: I need a professional website for my business
```

### ❌ **Spam Detection Tests**
```
Message: "Buy cheap products now! Click here! Make money fast!"
→ Expected: Spam detected, submission blocked
```

### ❌ **Rate Limiting Test**
```
Submit form 11+ times rapidly
→ Expected: "Too many requests" error after 10th submission
```

### ❌ **Honeypot Test**
```
Fill hidden "website" field with any value
→ Expected: Silent rejection, no error shown
```

---

## 📞 **Phone Number Testing**

### ✅ **US/Canada Formats**
- `(555) 123-4567` → `+1 (555) 123-4567`
- `555-123-4567` → `+1 (555) 123-4567`
- `5551234567` → `+1 (555) 123-4567`
- `+1 555 123 4567` → `+1 (555) 123-4567`

### ✅ **International Formats**
- `+44 20 1234 5678` → UK number ✅
- `+61 2 1234 5678` → Australia ✅
- `+49 30 1234 5678` → Germany ✅

### ❌ **Invalid Formats**
- `123` → Too short ❌
- `invalid-phone` → Invalid format ❌
- `999-999-9999` → Invalid area code ❌

---

## 🤖 **AI Features in Action**

### **Lead Scoring Algorithm**
The AI analyzes:
- **Project complexity** (1-10 scale)
- **Budget indicators** (low/medium/high/enterprise)
- **Urgency level** (low/medium/high/urgent)
- **Business priority** (1-100 score)

### **Project Classification**
- **Web Development**: Websites, web apps
- **Mobile Development**: iOS/Android apps
- **E-commerce**: Online stores, marketplaces
- **AI/ML**: AI integration, machine learning
- **Consulting**: Strategy, optimization
- **Other**: Custom projects

### **Response Personalization**
AI generates responses based on:
- Project type and complexity
- Company size and industry
- Urgency and timeline
- Budget indicators from message content

---

## 🛡️ **Security Features Active**

### **Rate Limiting**
- **Contact Form**: 10 requests per hour per IP
- **AI Analysis**: 50 requests per hour per IP
- **Resets**: Every hour

### **Spam Protection Layers**
1. **Content Analysis**: AI scans for spam patterns
2. **Input Validation**: All fields validated
3. **Honeypot Fields**: Hidden bot traps
4. **Rate Limiting**: Prevents rapid submissions
5. **Phone Validation**: Blocks invalid numbers

### **Input Sanitization**
- **XSS Protection**: All inputs sanitized
- **SQL Injection**: Protected by parameterized queries
- **CSRF Protection**: Built-in Next.js protection
- **Data Validation**: Zod schema validation

---

## 📊 **Database Schema Overview**

### **Enhanced Leads Table**
```sql
leads (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),          -- ✅ NEW
  company VARCHAR(255),
  project_type VARCHAR(50),   -- ✅ NEW
  message TEXT,
  ai_score INTEGER,           -- ✅ NEW (0-100)
  ai_priority VARCHAR(10),    -- ✅ NEW (low/medium/high/urgent)
  ai_project_type VARCHAR(50), -- ✅ NEW
  ai_budget_estimate VARCHAR(20), -- ✅ NEW
  ai_urgency VARCHAR(20),     -- ✅ NEW
  ai_complexity VARCHAR(20),  -- ✅ NEW
  ai_analysis JSONB,          -- ✅ NEW
  ai_response_sent BOOLEAN,   -- ✅ NEW
  ai_response_content TEXT,   -- ✅ NEW
  source VARCHAR(50),         -- ✅ NEW
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### **AI Communications Log**
```sql
ai_communications (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  communication_type VARCHAR(50),
  prompt_used TEXT,
  ai_response TEXT,
  human_approved BOOLEAN,
  sent_at TIMESTAMP,
  created_at TIMESTAMP
)
```

---

## 🧪 **Testing Commands**

### **Start Development Server**
```bash
npm run dev
# Opens at http://localhost:3001
```

### **Test AI Contact Endpoint**
```bash
curl -X POST http://localhost:3001/api/contact-ai \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "I need a website",
    "projectType": "web-development"
  }'
```

### **Test Phone Validation**
```bash
# Valid US number
curl -X POST http://localhost:3001/api/validate-phone \
  -H "Content-Type: application/json" \
  -d '{"phone": "5551234567", "country": "US"}'
```

### **Check Database Records**
```bash
node check-db.js  # Run database verification script
```

---

## 📚 **Documentation Files**

- **[AI_IMPLEMENTATION_STATUS.md](./AI_IMPLEMENTATION_STATUS.md)** - Complete status report
- **[VERCEL_AI_IMPLEMENTATION.md](./VERCEL_AI_IMPLEMENTATION.md)** - Technical implementation guide
- **[MASTER_ACTION_PLAN.md](./MASTER_ACTION_PLAN.md)** - Overall project roadmap
- **[README.md](./README.md)** - Main project documentation

---

## 🎯 **Next Steps**

### **Immediate (This Week)**
1. **Admin Dashboard**: Build lead management interface
2. **Analytics**: Add charts and lead conversion tracking
3. **Email Templates**: Customize AI response templates

### **Short Term (Next 2 Weeks)**
1. **Project Management**: AI-powered project timeline estimation
2. **Client Portal**: Enhanced client communication features
3. **Advanced Analytics**: Predictive lead scoring

### **Long Term (Next Month)**
1. **Automated Workflows**: Lead nurturing sequences
2. **Integration APIs**: Connect with popular CRM tools
3. **Advanced AI**: Sentiment analysis and conversation intelligence

---

*Last Updated: January 7, 2025*  
*Platform Status: Production Ready with AI Features* ✅
