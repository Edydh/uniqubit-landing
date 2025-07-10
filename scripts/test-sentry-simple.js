// Simple Sentry Test Script for uniQubit Platform
const { exec } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/test-sentry`;

console.log('Testing Sentry Integration...\n');

// Test different error types
const testTypes = [
  'error',
  'business_error', 
  'ai_error',
  'email_error',
  'database_error'
];

async function runTest(testType) {
  return new Promise((resolve) => {
    const command = `curl -X POST ${API_ENDPOINT} -H "Content-Type: application/json" -d '{"testType": "${testType}"}' -s`;
    
    exec(command, (error, stdout) => {
      if (error) {
        resolve({ type: testType, success: false, error: error.message });
      } else {
        try {
          JSON.parse(stdout);
          resolve({ type: testType, success: true });
        } catch (e) {
          resolve({ type: testType, success: false, error: 'Invalid response' });
        }
      }
    });
  });
}

async function runAllTests() {
  console.log('Running Sentry tests...\n');
  
  for (const testType of testTypes) {
    process.stdout.write(`Testing ${testType}... `);
    const result = await runTest(testType);
    console.log(result.success ? 'PASS' : 'FAIL');
    
    if (!result.success) {
      console.log(`  Error: ${result.error}`);
    }
  }
  
  console.log('\nDone! Check your Sentry dashboard for events.');
}

runAllTests().catch(console.error);
