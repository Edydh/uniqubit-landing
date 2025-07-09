# Client Journey & Testing Guide

## 🎯 Complete Client Journey Overview

This guide maps the entire client experience from initial contact to project completion, including testing procedures and troubleshooting steps.

## 🚀 **THE COMPLETE CLIENT JOURNEY**

### **Phase 1: Initial Contact**
```
Client visits uniQubit.ca → Fills contact form → Submits inquiry
```

**What Happens:**
1. ✅ Contact form validates all fields (name, email, phone, message)
2. ✅ AI analyzes the inquiry and generates lead score (0-100)
3. ✅ Lead is created in database with status "new"
4. ✅ Admin receives email notification with AI insights
5. ✅ Client sees "Thank you" confirmation message

**Testing:**
```bash
# Test contact form submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "+1 (555) 123-4567",
    "company": "Test Company",
    "message": "I need a website for my business"
  }'
```

---

### **Phase 2: Admin Review & Lead Conversion**
```
Admin reviews lead → Evaluates opportunity → Converts to project → Creates client account
```

**What Happens:**
1. ✅ Admin logs into admin dashboard
2. ✅ Views leads table with AI scoring and insights
3. ✅ Clicks "Convert" on qualified lead
4. ✅ Creates project with details and timeline
5. ✅ Optionally creates user account for client
6. ✅ Project is linked to client (if user created)

**Testing:**
1. Navigate to: http://localhost:3000/admin/leads
2. Find your test lead in the table
3. Click "Convert to Project" button
4. Fill project form:
   - **Project Name**: "Test Company Website"
   - **Description**: "Modern website with booking system"
   - **Create User**: ✅ Yes
   - **Client Email**: test@example.com
   - **Client Name**: Test Client
5. Submit form and verify success

---

### **Phase 3: Client Account Access**
```
Client receives credentials → Registers/logs in → Accesses dashboard → Views project
```

**What Happens:**
1. ✅ Client receives welcome email (if admin created account)
2. ✅ Client navigates to login page
3. ✅ Either logs in (if account exists) or registers new account
4. ✅ Accesses personalized dashboard
5. ✅ Views assigned projects and status

**Testing:**
1. Open: http://localhost:3000/login
2. Try logging in with test@example.com
3. If no account exists, go to: http://localhost:3000/register
4. Create account with same email as lead
5. Verify dashboard shows assigned projects

---

### **Phase 4: Project Management & Communication**
```
Client tracks progress → Communicates with team → Receives updates → Project completion
```

**What Happens:**
1. ✅ Client sees project timeline and milestones
2. ✅ Receives email updates on progress
3. ✅ Can message admin through platform
4. ✅ Views project deliverables and files
5. ✅ Approves final deliverables

**Currently Implemented:**
- ✅ Project status tracking
- ✅ Basic messaging interface
- ✅ Email notification system
- 🔜 File sharing (planned)
- 🔜 Milestone tracking (planned)

---

## 🧪 **COMPREHENSIVE TESTING SCENARIOS**

### **Scenario A: Admin-First Flow (Recommended)**

**Steps:**
1. **Client submits contact form**
2. **Admin converts lead → creates project + user**
3. **Client logs in → sees project immediately**

**Expected Result:** ✅ Smooth experience, client sees their project right away

**Test Commands:**
```bash
# 1. Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin First Test","email":"admin-first@example.com","message":"Test admin first flow"}'

# 2. Admin converts (manual step in UI)
# Navigate to admin dashboard and convert lead

# 3. Test client login
# Try logging in with admin-first@example.com
```

---

### **Scenario B: Client-First Flow (Edge Case)**

**Steps:**
1. **Client submits contact form**
2. **Client registers account before admin conversion**
3. **Admin later converts lead**

**Expected Result:** ⚠️ Client initially sees empty dashboard, then projects appear after admin conversion

**Test Commands:**
```bash
# 1. Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Client First Test","email":"client-first@example.com","message":"Test client first flow"}'

# 2. Client registers immediately (manual step)
# Register at /register with client-first@example.com

# 3. Check dashboard (should be empty)
# 4. Admin converts lead (manual step)
# 5. Check dashboard again (should show project)
```

---

### **Scenario C: Email Confirmation Flow (Currently Disabled)**

**Steps:**
1. **Client registers account**
2. **Email confirmation sent (currently disabled)**
3. **Client confirms email**
4. **Account activated**

**Current Status:** ❌ Disabled due to Supabase SMTP issues

**Workaround:** Email confirmation disabled, accounts work immediately

---

### **Scenario D: Password Reset Flow**

**Steps:**
1. **Client forgets password**
2. **Clicks "Forgot Password"**
3. **Receives reset email**
4. **Resets password**

**Current Status:** ❌ Not working due to email delivery issues

**Workaround:** Admin can reset passwords manually in Supabase dashboard

---

## 🔧 **TROUBLESHOOTING GUIDE**

### **Issue: Contact Form Not Working**

**Symptoms:**
- Form doesn't submit
- No lead created in database
- No email received

**Debug Steps:**
```bash
# Check API endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Debug Test","email":"debug@example.com","message":"Debug message"}'

# Check response and look for errors
# Verify database connection
curl http://localhost:3000/api/test-supabase
```

**Common Fixes:**
- Check environment variables
- Verify Supabase connection
- Check form validation errors

---

### **Issue: Lead Not Appearing in Admin Dashboard**

**Symptoms:**
- Contact form submits successfully
- Lead not visible in admin leads table

**Debug Steps:**
1. Check browser console for errors
2. Verify admin authentication
3. Check database directly:
```sql
SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;
```

**Common Fixes:**
- Refresh admin page
- Check RLS policies in Supabase
- Verify admin role permissions

---

### **Issue: Client Cannot Access Dashboard**

**Symptoms:**
- Login successful but dashboard empty
- Projects not showing
- Permission errors

**Debug Steps:**
1. Verify user account exists
2. Check project assignments
3. Verify RLS policies
```sql
SELECT * FROM profiles WHERE email = 'test@example.com';
SELECT * FROM projects WHERE client_id = 'user-id';
```

**Common Fixes:**
- Admin needs to assign projects to user
- Check client_id in projects table
- Verify role permissions

---

### **Issue: Email Notifications Not Working**

**Symptoms:**
- Contact form submits but no admin email
- Client doesn't receive welcome email
- Password reset emails not delivered

**Debug Steps:**
```bash
# Test custom email service
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","message":"Test email"}'
```

**Common Fixes:**
- Check Resend API key
- Verify domain verification
- Check email template configuration

---

## 📋 **MANUAL TESTING CHECKLIST**

### **Contact Form Testing**
- [ ] Submit with valid data
- [ ] Submit with invalid email
- [ ] Submit with missing required fields
- [ ] Submit with honeypot field filled (should be blocked)
- [ ] Submit multiple times quickly (should be rate limited)
- [ ] Verify lead appears in admin dashboard
- [ ] Verify admin receives notification email

### **Admin Dashboard Testing**
- [ ] Login as admin
- [ ] View leads table
- [ ] Sort and filter leads
- [ ] Convert lead to project
- [ ] Create project without user
- [ ] Create project with user
- [ ] View project in admin projects page

### **Client Dashboard Testing**
- [ ] Register new client account
- [ ] Login with client credentials
- [ ] View dashboard (empty if no projects)
- [ ] View assigned projects (after admin conversion)
- [ ] Test project status display
- [ ] Test messaging interface

### **Authentication Testing**
- [ ] Register new account
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Test role-based access (admin vs client pages)
- [ ] Test protected routes

### **Email System Testing**
- [ ] Test custom email API endpoint
- [ ] Verify contact form sends admin notification
- [ ] Test welcome email template
- [ ] Check Supabase auth emails (currently not working)

---

## 🎯 **USER JOURNEY OPTIMIZATION**

### **Current Pain Points**
1. **Email Confirmation**: Currently disabled, users can't reset passwords
2. **Lead-User Linking**: Manual process, could be automated
3. **Empty Dashboard**: Clients see empty dashboard before admin conversion

### **Proposed Improvements**
1. **Smart Lead Matching**: Auto-link users to existing leads by email
2. **Onboarding Flow**: Guide new clients through setup process
3. **Email System Fix**: Complete Supabase SMTP integration
4. **Progressive Project Creation**: Allow clients to provide more details

### **Future Enhancements**
1. **Real-time Notifications**: Live updates on project progress
2. **File Sharing**: Document upload and sharing system
3. **Payment Integration**: Stripe integration for deposits and payments
4. **Mobile App**: React Native app for mobile access

---

## 🚀 **PRODUCTION TESTING PLAN**

### **Pre-Launch Testing**
1. **Load Testing**: Test with multiple concurrent users
2. **Email Testing**: Verify all email templates in production
3. **Security Testing**: Test rate limiting and validation
4. **Mobile Testing**: Test on various mobile devices
5. **Browser Testing**: Test on Chrome, Safari, Firefox, Edge

### **Launch Day Testing**
1. **Smoke Tests**: Verify core functionality works
2. **User Acceptance Testing**: Real client testing
3. **Performance Monitoring**: Watch for slow queries or errors
4. **Email Deliverability**: Monitor email delivery rates

### **Post-Launch Monitoring**
1. **Error Tracking**: Monitor error rates and fix issues
2. **User Feedback**: Collect and analyze user feedback
3. **Performance Metrics**: Track page load times and conversions
4. **Business Metrics**: Monitor lead conversion rates

---

*This guide is continuously updated based on platform changes and user feedback.*
