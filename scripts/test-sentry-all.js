// Comprehensive Sentry Test Script for uniQubit Platform
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/test-sentry`;

console.log('Testing Sentry Integration for uniQubit Platform\n');

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    exec(`curl -s ${BASE_URL} > /dev/null`, (error) => {
      resolve(!error);
    });
  });
}

// Test a specific Sentry error type
function testSentryEndpoint(testType) {
  return new Promise((resolve, reject) => {
    const command = `curl -X POST ${API_ENDPOINT} -H "Content-Type: application/json" -d '{"testType": "${testType}"}' -s`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ type: testType, error: error.message });
      } else {
        try {
          const response = JSON.parse(stdout);
          resolve({ type: testType, success: true, response });
        } catch (parseError) {
          reject({ type: testType, error: 'Invalid JSON response' });
        }
      }
    });
  });
}

// Check environment variables
function checkEnvVars() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    return { configured: false, message: '.env.local file not found' };
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasDSN = envContent.includes('NEXT_PUBLIC_SENTRY_DSN=') && 
                 !envContent.includes('NEXT_PUBLIC_SENTRY_DSN=\n') &&
                 !envContent.includes('NEXT_PUBLIC_SENTRY_DSN=');
  
  const hasOrg = envContent.includes('SENTRY_ORG=') && 
                 !envContent.includes('SENTRY_ORG=\n');
  
  const hasProject = envContent.includes('SENTRY_PROJECT=') && 
                     !envContent.includes('SENTRY_PROJECT=\n');
  
  const hasToken = envContent.includes('SENTRY_AUTH_TOKEN=') && 
                   !envContent.includes('SENTRY_AUTH_TOKEN=\n');
  
  return {
    configured: hasDSN,
    dsn: hasDSN,
    org: hasOrg,
    project: hasProject,
    token: hasToken
  };
}

// Main test function
async function runTests() {
  console.log('📋 Pre-flight Checks\n');
  
  // Check environment variables
  const envCheck = checkEnvVars();
  console.log('🔧 Environment Variables:');
  console.log(`   SENTRY_DSN: ${envCheck.dsn ? '✅' : '❌'}`);
  console.log(`   SENTRY_ORG: ${envCheck.org ? '✅' : '❌'}`);
  console.log(`   SENTRY_PROJECT: ${envCheck.project ? '✅' : '❌'}`);
  console.log(`   SENTRY_AUTH_TOKEN: ${envCheck.token ? '✅' : '❌'}\n`);
  
  if (!envCheck.configured) {
    console.log('❌ Sentry DSN not configured!');
    console.log('📖 Please follow the setup guide: docs/SENTRY_SETUP_GUIDE.md\n');
    console.log('🚀 Quick setup: npm run sentry:setup\n');
    return;
  }
  
  // Check if server is running
  console.log('🔍 Checking if development server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Development server not running!');
    console.log('🚀 Start the server: npm run dev\n');
    return;
  }
  
  console.log('✅ Development server is running\n');
  
  // Test different error types
  const testTypes = [
    { type: 'error', description: 'Basic error tracking' },
    { type: 'business_error', description: 'Business error tracking' },
    { type: 'ai_error', description: 'AI service error tracking' },
    { type: 'email_error', description: 'Email delivery error tracking' },
    { type: 'database_error', description: 'Database error tracking' },
    { type: 'user_journey', description: 'User journey tracking' },
    { type: 'business_metric', description: 'Business metric tracking' }
  ];
  
  console.log('🧪 Running Sentry Tests\n');
  
  const results = [];
  
  for (const test of testTypes) {
    process.stdout.write(`   Testing ${test.description}... `);
    
    try {
      const result = await testSentryEndpoint(test.type);
      console.log('✅');
      results.push({ ...result, status: 'success' });
    } catch (error) {
      console.log('❌');
      results.push({ ...error, status: 'failed' });
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Test Results Summary\n');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}\n`);
  
  if (failed.length > 0) {
    console.log('❌ Failed Tests:');
    failed.forEach(test => {
      console.log(`   • ${test.type}: ${test.error}`);
    });
    console.log('');
  }
  
  if (successful.length === results.length) {
    console.log('🎉 All Sentry tests passed!');
    console.log('🔗 Check your Sentry dashboard for the test events:');
    console.log('   https://sentry.io/organizations/your-org/projects/uniqubit-platform/\n');
    
    console.log('📈 What to expect in Sentry:');
    console.log('   • Error events in the Issues tab');
    console.log('   • Performance data in the Performance tab');
    console.log('   • Custom events with business context');
    console.log('   • User journey breadcrumbs\n');
  } else {
    console.log('⚠️  Some tests failed. Check the error messages above.');
    console.log('📖 Troubleshooting guide: docs/SENTRY_SETUP_GUIDE.md\n');
  }
  
  console.log('💡 Next Steps:');
  console.log('   1. Check your Sentry dashboard for events');
  console.log('   2. Set up alerts for critical errors');
  console.log('   3. Configure performance monitoring');
  console.log('   4. Customize error tracking for your needs\n');
}

// Run the tests
runTests().catch(error => {
  console.error('🚨 Test runner error:', error);
  process.exit(1);
});
