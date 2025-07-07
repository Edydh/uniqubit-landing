#!/usr/bin/env node

const https = require('https');

const API_URL = 'http://localhost:3001/api/contact-ai';

// Test data
const testCases = [
  {
    name: 'Legitimate Contact',
    data: {
      name: 'John Smith',
      email: 'john@company.com',
      company: 'Tech Solutions Inc',
      projectType: 'web-development',
      message: 'Hi, I need a professional website for my business. We are a consulting company and need an online presence with contact forms and service pages.',
      phone: '+1-555-123-4567'
    },
    expectSpam: false
  },
  {
    name: 'Obvious Spam',
    data: {
      name: 'SEO Expert',
      email: 'seo@fake.com',
      company: 'Best SEO Company',
      projectType: 'web-development',
      message: 'CLICK HERE FOR GUARANTEED FIRST PAGE RANKINGS!!! Get rich quick with our amazing SEO services. Visit www.spamsite.com NOW!!!',
      phone: '123-456-7890'
    },
    expectSpam: true
  },
  {
    name: 'Suspicious Content',
    data: {
      name: 'Marketing Guy',
      email: 'marketing@temp-mail.org',
      company: 'Growth Hacking LLC',
      projectType: 'web-development',
      message: 'We can help you get more traffic and leads with our automated system. Make money online with our proven forex trading software.',
      phone: '555-GET-RICH'
    },
    expectSpam: true
  },
  {
    name: 'Short Message',
    data: {
      name: 'Bot User',
      email: 'bot@test.com',
      projectType: 'web-development',
      message: 'Hi there',
    },
    expectSpam: true
  },
  {
    name: 'With Honeypot',
    data: {
      name: 'Fake User',
      email: 'fake@test.com',
      projectType: 'web-development',
      message: 'This is a legitimate message about web development needs.',
      website: 'http://spam.com' // Honeypot field filled
    },
    expectSpam: true
  }
];

async function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/contact-ai',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Security-Test/1.0'
      }
    };

    const req = require('http').request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function runSecurityTests() {
  console.log('🛡️  Running Contact Form Security Tests\n');
  console.log('Make sure the development server is running on http://localhost:3001\n');

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const response = await makeRequest(testCase.data);
      
      console.log(`Status: ${response.status}`);
      
      if (testCase.expectSpam) {
        if (response.status === 400 && response.data.error) {
          console.log('✅ PASS - Spam correctly detected');
          console.log(`   Reason: ${response.data.error}`);
          passed++;
        } else {
          console.log('❌ FAIL - Spam not detected');
          console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
          failed++;
        }
      } else {
        if (response.status === 200) {
          console.log('✅ PASS - Legitimate request accepted');
          console.log(`   Message: ${response.data.message || 'Success'}`);
          passed++;
        } else {
          console.log('❌ FAIL - Legitimate request rejected');
          console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
          failed++;
        }
      }
      
    } catch (error) {
      console.log(`❌ FAIL - Request error: ${error.message}`);
      failed++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 SECURITY TEST RESULTS');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All security tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
  }
}

// Rate limiting test
async function testRateLimit() {
  console.log('\n🚦 Testing Rate Limiting\n');
  
  const testData = {
    name: 'Rate Test User',
    email: 'rate@test.com',
    projectType: 'web-development',
    message: 'This is a rate limiting test message.'
  };

  console.log('Sending 7 requests rapidly...\n');
  
  for (let i = 1; i <= 7; i++) {
    try {
      const response = await makeRequest(testData);
      console.log(`Request ${i}: Status ${response.status}`);
      
      if (response.status === 429) {
        console.log(`  ⏱️ Rate limited! Retry after: ${response.data.retryAfter} seconds`);
        break;
      } else if (response.status === 200) {
        console.log(`  ✅ Accepted`);
      } else {
        console.log(`  ⚠️ Other response: ${response.data.error || 'Unknown'}`);
      }
    } catch (error) {
      console.log(`Request ${i}: Error - ${error.message}`);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Run all tests
async function main() {
  try {
    await runSecurityTests();
    await testRateLimit();
  } catch (error) {
    console.error('Test runner error:', error);
    process.exit(1);
  }
}

main();
