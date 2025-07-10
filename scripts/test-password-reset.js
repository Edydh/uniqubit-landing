const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('Testing Supabase Password Reset...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set (will use fallback)');
console.log('');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing required Supabase environment variables!');
  console.log('Please check your .env.local file and ensure it contains:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testPasswordReset() {
  const testEmail = 'test@example.com'; // Change this to your email for testing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  console.log(`Testing password reset for: ${testEmail}`);
  console.log(`Redirect URL will be: ${siteUrl}/reset-password`);
  console.log('');
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${siteUrl}/reset-password`,
    });
    
    if (error) {
      console.error('❌ Supabase Error:', error);
      console.log('Error details:');
      console.log('- Message:', error.message);
      console.log('- Status:', error.status);
      console.log('- Code:', error.code);
      
      // Check for common issues
      if (error.message.includes('rate')) {
        console.log('\n💡 This appears to be a rate limiting issue.');
        console.log('   Supabase has email rate limits (default: 2 emails/hour).');
        console.log('   You may need to wait or increase the limit in your Supabase dashboard.');
      } else if (error.message.includes('Invalid')) {
        console.log('\n💡 This appears to be a configuration issue.');
        console.log('   Check your Supabase project settings and email configuration.');
      }
    } else {
      console.log('✅ Password reset email request successful!');
      console.log('Data:', data);
      console.log('\nIf you used a real email, check your inbox for the reset email.');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Test connection first
async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
}

async function main() {
  console.log('1. Testing Supabase connection...');
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n❌ Cannot proceed with password reset test due to connection issues.');
    return;
  }
  
  console.log('\n2. Testing password reset...');
  await testPasswordReset();
}

main().catch(console.error);
