# Client Journey Test Plan - UniQubit Platform

## 🎯 **Complete End-to-End Test**

This document outlines a comprehensive test of the client journey from initial contact form submission to accessing the client dashboard.

---

## **📋 Test Scenario**

**Goal**: Verify a potential client can submit a contact form, get converted to a project by admin, and access their client dashboard.

**Test Client**: John Smith from ABC Corp

---

## **🔄 Step-by-Step Test Flow**

### **Phase 1: Lead Generation** 🎯

#### **Step 1: Submit Contact Form**
1. **Navigate to**: `http://localhost:3000/#contact`
2. **Fill out form**:
   - **Name**: John Smith
   - **Email**: john.smith@abccorp.com
   - **Company**: ABC Corp
   - **Project Type**: Web Development
   - **Phone**: +1-555-123-4567
   - **Message**: "We need a new e-commerce website for our growing business. Looking for a modern, mobile-responsive design with payment integration. Budget is flexible for the right solution. Timeline: 2-3 months."
3. **Submit form** and verify success message
4. **Expected Result**: Lead saved to database with `status: 'new'`

#### **Step 2: Verify Lead in Database**
```sql
SELECT * FROM leads WHERE email = 'john.smith@abccorp.com';
```

---

### **Phase 2: Admin Lead Management** 🛠️

#### **Step 3: Admin Login & Lead Review**
1. **Navigate to**: `http://localhost:3000/admin-login`
2. **Login with admin credentials**
3. **Go to**: `http://localhost:3000/admin/leads`
4. **Verify**: John Smith's lead appears in table
5. **Action**: Click "View Details" to see full message

#### **Step 4: Convert Lead to Project**
1. **In Leads Table**: Click "Convert" button for John Smith
2. **Fill Convert Modal**:
   - **Project Title**: ABC Corp E-commerce Website
   - **Project Description**: Modern e-commerce platform with payment integration and mobile-responsive design for ABC Corp's growing business.
3. **Click**: "Create Project"
4. **Expected Results**:
   - New user created for john.smith@abccorp.com
   - New project created with John as client
   - Lead status updated to 'converted'

#### **Step 5: Verify Project Creation**
```sql
-- Check user was created
SELECT * FROM users WHERE email = 'john.smith@abccorp.com';

-- Check project was created
SELECT * FROM projects WHERE client_id = (
    SELECT id FROM users WHERE email = 'john.smith@abccorp.com'
);

-- Verify lead status updated
SELECT status FROM leads WHERE email = 'john.smith@abccorp.com';
```

---

### **Phase 3: Client Account Access** 👤

#### **Step 6: Client Login Setup**
**Option A: Admin provides temporary password**
1. Admin sets temporary password in user management
2. Client receives login credentials

**Option B: Client password reset**
1. **Navigate to**: `http://localhost:3000/forgot-password`
2. **Enter email**: john.smith@abccorp.com
3. **Follow reset link** to set password

#### **Step 7: Client Dashboard Access**
1. **Navigate to**: `http://localhost:3000/login`
2. **Login as**: john.smith@abccorp.com
3. **Expected redirect**: `http://localhost:3000/client/dashboard`
4. **Verify dashboard shows**:
   - Welcome message with client name
   - Active project: "ABC Corp E-commerce Website"
   - Project status and timeline
   - Message center for communication

---

### **Phase 4: Project Interaction** 💬

#### **Step 8: Client-Admin Communication**
1. **In Message Center**: Send test message to admin
2. **Content**: "Thank you for setting up the project! When can we schedule our kickoff meeting?"
3. **Verify**: Message appears in client dashboard
4. **Admin side**: Check message appears in admin project view

#### **Step 9: Project Progress Tracking**
1. **Admin**: Update project stage from `idea_collection` to `design`
2. **Client**: Refresh dashboard and verify stage update
3. **Verify**: Timeline shows progress

---

## **🧪 Automated Test Commands**

### **Database Verification Queries**

```sql
-- Check lead creation
SELECT id, name, email, company, status, created_at 
FROM leads 
WHERE email = 'john.smith@abccorp.com';

-- Check user creation after conversion
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE email = 'john.smith@abccorp.com';

-- Check project creation
SELECT p.id, p.title, p.description, p.current_stage, p.created_at,
       u.full_name as client_name, u.email as client_email
FROM projects p
JOIN users u ON p.client_id = u.id
WHERE u.email = 'john.smith@abccorp.com';

-- Check messages
SELECT m.id, m.content, m.created_at,
       sender.full_name as sender_name,
       sender.role as sender_role
FROM messages m
JOIN users sender ON m.sender_id = sender.id
JOIN projects p ON m.project_id = p.id
JOIN users client ON p.client_id = client.id
WHERE client.email = 'john.smith@abccorp.com'
ORDER BY m.created_at DESC;
```

### **API Test Commands**

```bash
# Test contact form submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@abccorp.com",
    "company": "ABC Corp",
    "projectType": "web-development",
    "phone": "+1-555-123-4567",
    "message": "We need a new e-commerce website for our growing business. Looking for a modern, mobile-responsive design with payment integration. Budget is flexible for the right solution. Timeline: 2-3 months."
  }'

# Expected Response:
# {
#   "message": "Thank you for your message! We'll get back to you soon.",
#   "success": true,
#   "leadId": "uuid-here"
# }
```

---

## **🎯 Success Criteria**

### **✅ Contact Form**
- [ ] Form submission creates lead in database
- [ ] Success message displayed to user
- [ ] Lead appears in admin dashboard

### **✅ Lead Management**
- [ ] Admin can view lead details
- [ ] Admin can convert lead to project
- [ ] User account auto-created for client
- [ ] Project entry created with correct details
- [ ] Lead status updated to 'converted'

### **✅ Client Access**
- [ ] Client can login with created account
- [ ] Client dashboard loads correctly
- [ ] Project information displays properly
- [ ] Message center is functional

### **✅ Communication**
- [ ] Client can send messages to admin
- [ ] Admin can view client messages
- [ ] Real-time updates work (if implemented)

---

## **🐛 Common Issues to Check**

### **Database Issues**
- Ensure Supabase RLS policies allow admin operations
- Check foreign key constraints between leads/users/projects
- Verify user creation permissions

### **Authentication Issues**
- Password reset functionality
- Role-based access control
- Session management

### **UI/UX Issues**
- Form validation and error handling
- Responsive design on mobile
- Loading states and user feedback

---

## **📊 Test Results Log**

| Step | Status | Notes | Timestamp |
|------|--------|-------|-----------|
| Contact Form Submission | ⏳ | | |
| Lead Creation in DB | ⏳ | | |
| Admin Lead View | ⏳ | | |
| Lead to Project Conversion | ⏳ | | |
| Client Account Creation | ⏳ | | |
| Client Dashboard Access | ⏳ | | |
| Message Center Test | ⏳ | | |

**Legend**: ✅ Pass | ❌ Fail | ⏳ Pending | ⚠️ Issues

---

**Test Environment**: Local Development (http://localhost:3000)
**Database**: Supabase
**Last Updated**: January 2025
