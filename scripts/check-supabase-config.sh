#!/bin/bash

echo "🔍 uniQubit Supabase Configuration Checker"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
    
    # Check for required environment variables (without showing sensitive values)
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
        echo "   URL: ${SUPABASE_URL:0:30}..."
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL is missing"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
    fi
    
    if grep -q "NEXT_PUBLIC_SITE_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_SITE_URL is set"
        SITE_URL=$(grep "NEXT_PUBLIC_SITE_URL" .env.local | cut -d'=' -f2)
        echo "   Site URL: $SITE_URL"
    else
        echo "⚠️  NEXT_PUBLIC_SITE_URL not set (will use default)"
    fi
else
    echo "❌ .env.local file not found!"
    echo "   Please create .env.local with your Supabase credentials"
fi

echo ""
echo "🔧 Next Steps to Debug:"
echo "1. Try password reset again with browser dev tools open"
echo "2. Check Console tab for detailed error logs"
echo "3. Look for 'Supabase reset password error:' message"
echo "4. Check Supabase Dashboard → Logs → Auth logs"
echo ""

echo "📋 Common Supabase Issues to Check:"
echo "• Rate limits: Dashboard → Project Settings → Rate limits"
echo "• Redirect URLs: Dashboard → Authentication → URL Configuration"
echo "• Email templates: Dashboard → Authentication → Email Templates"
echo "• Project status: Dashboard → Project Settings → General"
echo ""

echo "🧪 Test Command:"
echo "npm run dev  # Then go to /forgot-password and check console"
