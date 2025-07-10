#!/bin/bash

# Sentry Setup Script for uniQubit Platform
# This script helps you configure Sentry monitoring for error tracking and performance monitoring

echo "🔧 Setting up Sentry for uniQubit Platform..."
echo ""

# Check if Sentry CLI is installed
if ! command -v sentry-cli &> /dev/null; then
    echo "📦 Installing Sentry CLI..."
    npm install -g @sentry/cli
else
    echo "✅ Sentry CLI is already installed"
fi

echo ""
echo "🎯 To complete Sentry setup, you need to:"
echo ""
echo "1. Create a Sentry account at https://sentry.io/"
echo "2. Create a new project for 'uniQubit Platform'"
echo "3. Select 'Next.js' as your platform"
echo "4. Get your configuration values:"
echo ""
echo "   📋 Required Environment Variables:"
echo "   ================================"
echo "   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id"
echo "   SENTRY_ORG=your-organization-slug"
echo "   SENTRY_PROJECT=uniqubit-platform"
echo "   SENTRY_AUTH_TOKEN=your-auth-token"
echo ""
echo "5. Update your .env.local file with these values"
echo ""

# Check if .env.local exists and has Sentry variables
if [ -f ".env.local" ]; then
    echo "📁 Found .env.local file"
    
    # Check if Sentry DSN is configured
    if grep -q "NEXT_PUBLIC_SENTRY_DSN=" .env.local && ! grep -q "NEXT_PUBLIC_SENTRY_DSN=$" .env.local; then
        echo "✅ Sentry DSN is configured"
        
        # Test Sentry configuration
        echo "🧪 Testing Sentry configuration..."
        npm run build 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "✅ Build successful with Sentry integration"
        else
            echo "⚠️  Build failed - check Sentry configuration"
        fi
    else
        echo "⚠️  Sentry DSN not configured in .env.local"
        echo "   Add: NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn"
    fi
else
    echo "❌ .env.local file not found"
    echo "   Please create .env.local and add Sentry configuration"
fi

echo ""
echo "📖 Quick Setup Instructions:"
echo "=========================="
echo ""
echo "1. Visit: https://sentry.io/signup/"
echo "2. Create account and organization"
echo "3. Create new project: 'uniQubit Platform'"
echo "4. Select platform: 'Next.js'"
echo "5. Copy the DSN from the setup page"
echo "6. Go to Settings > Auth Tokens > Create New Token"
echo "7. Copy all values to your .env.local file"
echo ""
echo "💡 Test your setup with:"
echo "   npm run dev"
echo "   curl -X POST http://localhost:3000/api/test-sentry \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"testType\": \"error\"}'"
echo ""
echo "🎉 Once configured, you'll have:"
echo "   • Real-time error tracking"
echo "   • Performance monitoring"
echo "   • Business metrics tracking"
echo "   • User journey tracking"
echo "   • Email delivery monitoring"
echo "   • AI service error tracking"
echo ""

# Check if Sentry packages are installed
echo "📦 Checking Sentry packages..."
if npm list @sentry/nextjs &> /dev/null; then
    echo "✅ @sentry/nextjs is installed"
else
    echo "❌ @sentry/nextjs not found"
    echo "   Run: npm install @sentry/nextjs @sentry/tracing"
fi

echo ""
echo "🔗 Useful Sentry Links:"
echo "====================="
echo "• Sentry Dashboard: https://sentry.io/"
echo "• Next.js Integration: https://docs.sentry.io/platforms/javascript/guides/nextjs/"
echo "• Performance Monitoring: https://docs.sentry.io/product/performance/"
echo "• Error Tracking: https://docs.sentry.io/product/issues/"
echo ""
echo "✨ Setup complete! Update your .env.local file with the Sentry values."
