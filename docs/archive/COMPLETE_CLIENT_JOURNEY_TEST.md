# 🎯 UniQubit Platform - Complete Client Journey Test Guide

## **Current Status: Database Connection Issue**

⚠️ **Before testing**: The Supabase service role key has a JWT payload typo that needs to be fixed in your Supabase dashboard.

**Issue**: Service role key JWT contains `"rose": "service_role"` instead of `"role": "service_role"`

**Fix**: Generate a new service role key from your Supabase project dashboard and update `.env.local`

---

## **🔄 Complete Client Journey Test (Once DB Fixed)**

### **Prerequisites**
1. ✅ Next.js server running: `npm run dev` (http://localhost:3001)
2. ⚠️ Fix Supabase service role key 
3. ✅ Supabase project with tables: `leads`, `users`, `projects`, `messages`

---

## **📋 Step-by-Step Test Procedure**

### **Phase 1: Lead Generation** 🎯

#### **Test 1: Contact Form Submission**
1. **Open browser**: http://localhost:3001
2. **Scroll to contact form** or navigate to http://localhost:3001/#contact
3. **Fill out form**:
   ```
   Name: John Smith
   Email: john.smith@testclient.com
   Company: Test Corp
   Project Type: Web Development
   Phone: +1-555-TEST-123
   Message: We need a modern e-commerce website with payment integration. Budget: $15k-50k. Timeline: 3 months.
   ```
4. **Submit form**
5. **Expected**: Success message appears
6. **Verify**: Check http://localhost:3001/api/test-leads shows your lead

#### **Test 2: Lead Database Verification**
```bash
# Test API endpoint
curl http://localhost:3001/api/test-leads
```
**Expected Output**:
```json
{
  "success": true,
  "count": 1,
  "leads": [
    {
      "id": "uuid",
      "name": "John Smith",
      "email": "john.smith@testclient.com",
      "company": "Test Corp",
      "message": "We need a modern e-commerce website...",
      "status": "new",
      "created_at": "2025-01-xx..."
    }
  ]
}
```

---

### **Phase 2: Admin Lead Management** 🛠️

#### **Test 3: Admin Login**
1. **Navigate**: http://localhost:3001/admin-login
2. **Login** with your admin credentials
3. **Expected**: Redirect to admin dashboard

#### **Test 4: Lead Management**
1. **Navigate**: http://localhost:3001/admin/leads
2. **Verify**: John Smith's lead appears in the table
3. **Test Actions**:
   - Click "View Details" → See full message
   - Change status dropdown → Update lead status
   - Click "Convert" → Open conversion modal

#### **Test 5: Convert Lead to Project**
1. **Click "Convert"** on John Smith's lead
2. **Fill conversion form**:
   ```
   Project Title: Test Corp E-commerce Website
   Description: Modern e-commerce platform with payment integration for Test Corp. Budget: $15k-50k, Timeline: 3 months.
   ```
3. **Click "Create Project"**
4. **Expected Results**:
   - Success message
   - Lead status changes to "converted"
   - New user created for john.smith@testclient.com
   - New project created

#### **Test 6: Verify Project Creation**
```bash
# Check project was created
curl http://localhost:3001/api/projects  # (if endpoint exists)

# Or check via admin dashboard
```
1. **Navigate**: http://localhost:3001/admin/projects
2. **Verify**: "Test Corp E-commerce Website" project appears
3. **Check**: Client is assigned correctly

---

### **Phase 3: Client Account Access** 👤

#### **Test 7: Client Password Setup**
**Option A: Admin sets password**
- Admin provides temporary password

**Option B: Password reset flow**
1. **Navigate**: http://localhost:3001/forgot-password
2. **Enter**: john.smith@testclient.com
3. **Check email** for reset link
4. **Set password**

#### **Test 8: Client Login**
1. **Navigate**: http://localhost:3001/login
2. **Login**:
   ```
   Email: john.smith@testclient.com
   Password: [password from step 7]
   ```
3. **Expected**: Redirect to http://localhost:3001/client/dashboard

#### **Test 9: Client Dashboard Verification**
**Check dashboard displays**:
- ✅ Welcome message: "Welcome back, John!"
- ✅ Active projects section
- ✅ Project card: "Test Corp E-commerce Website"
- ✅ Project status: "Idea Collection" (initial stage)
- ✅ Message center for communication
- ✅ Professional glassmorphism UI

---

### **Phase 4: Project Interaction** 💬

#### **Test 10: Client-Admin Messaging**
1. **In message center**: Send test message
   ```
   "Thank you for setting up the project! Looking forward to our collaboration. When can we schedule the kickoff meeting?"
   ```
2. **Verify**: Message appears in client dashboard
3. **Admin check**: Login as admin → view project → check messages

#### **Test 11: Project Progress Updates**
1. **As admin**: Update project stage from "idea_collection" to "design"
2. **As client**: Refresh dashboard
3. **Verify**: Project status updates in real-time
4. **Check**: Timeline shows progress

#### **Test 12: Project Detail View**
1. **Click project card** in client dashboard
2. **Expected**: Navigate to http://localhost:3001/client/project/[id]
3. **Verify**: Detailed project view with:
   - Project timeline
   - File sharing area
   - Extended messaging
   - Progress metrics

---

## **🧪 API Testing Commands**

### **Contact Form Test**
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "company": "API Corp",
    "projectType": "web-development",
    "phone": "+1-555-API-TEST",
    "message": "This is an API test submission to verify the contact form endpoint works correctly."
  }'
```

### **Database Verification**
```bash
# Check leads
curl http://localhost:3001/api/test-leads

# Check Supabase connection
curl http://localhost:3001/api/test-supabase
```

---

## **📊 Expected Results Summary**

### **✅ Successful Flow Indicators**

| Stage | Success Criteria | Status |
|-------|------------------|--------|
| **Contact Form** | Form submits, success message, lead in DB | ⏳ |
| **Lead Management** | Lead appears in admin dashboard | ⏳ |
| **Lead Conversion** | Project created, user account created | ⏳ |
| **Client Login** | Client can access dashboard | ⏳ |
| **Dashboard** | Projects display, messaging works | ⏳ |
| **Communication** | Messages sync between admin/client | ⏳ |

### **🎯 Key URLs to Test**

```
Landing & Contact:     http://localhost:3001
Contact Form:          http://localhost:3001/#contact
Admin Login:           http://localhost:3001/admin-login
Admin Dashboard:       http://localhost:3001/admin/dashboard-new
Admin Leads:           http://localhost:3001/admin/leads
Admin Projects:        http://localhost:3001/admin/projects
Client Login:          http://localhost:3001/login
Client Dashboard:      http://localhost:3001/client/dashboard
Client Project View:   http://localhost:3001/client/project/[id]
```

---

## **🐛 Troubleshooting**

### **Database Issues**
```bash
# Test database connection
curl http://localhost:3001/api/test-supabase

# Check leads API
curl http://localhost:3001/api/test-leads
```

### **Authentication Issues**
- Check user creation in Supabase Auth dashboard
- Verify email confirmation settings
- Test password reset flow

### **UI Issues**
- Check browser console for errors
- Verify responsive design on mobile
- Test all form validations

---

## **🎉 Success Criteria**

**Complete success when**:
1. ✅ Contact form creates leads in database
2. ✅ Admin can manage and convert leads
3. ✅ Client accounts are auto-created
4. ✅ Clients can login and access their dashboard
5. ✅ Projects display correctly for clients
6. ✅ Communication works between admin and clients
7. ✅ All UI components render properly

---

**Once database connection is fixed, this platform provides a complete end-to-end client management solution! 🚀**
