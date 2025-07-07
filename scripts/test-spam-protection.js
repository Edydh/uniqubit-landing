#!/usr/bin/env node

const BASE_URL = 'http://localhost:3001';

console.log('🛡️  Testing uniQubit Contact Form Security Features\n');

// Test 1: Valid Form Submission
async function testValidSubmission() {
  console.log('1️⃣  Testing Valid Form Submission...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/contact-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        message: 'I need help building a modern web application for my business.',
        projectType: 'web-development',
        phone: '+1-555-0123'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Valid submission accepted');
      console.log(`   AI Score: ${result.lead?.ai_score || 'N/A'}`);
      console.log(`   Priority: ${result.lead?.ai_priority || 'N/A'}`);
    } else {
      console.log('❌ Valid submission rejected:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('');
}

// Test 2: Spam Content Detection
async function testSpamDetection() {
  console.log('2️⃣  Testing Spam Content Detection...');
  
  const spamMessages = [
    'Buy cheap viagra online now! Click here: http://suspicious-link.com',
    'Make money fast! Work from home! Guaranteed income!',
    'FREE MONEY! WIN BIG! CLICK NOW! http://scam-site.com',
    'bitcoin investment opportunity guaranteed returns click link'
  ];
  
  for (let i = 0; i < spamMessages.length; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/contact-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Spammer ${i + 1}`,
          email: `spam${i + 1}@example.com`,
          company: 'Spam Corp',
          message: spamMessages[i],
          projectType: 'other',
          phone: '+1-555-0000'
        })
      });
      
      const result = await response.json();
      
      if (response.status === 400 && result.error.includes('spam')) {
        console.log(`✅ Spam message ${i + 1} correctly blocked`);
      } else {
        console.log(`⚠️  Spam message ${i + 1} not detected (might be a false negative)`);
      }
    } catch (error) {
      console.log(`❌ Error testing spam ${i + 1}:`, error.message);
    }
  }
  
  console.log('');
}

// Test 3: Invalid Email Format
async function testInvalidEmail() {
  console.log('3️⃣  Testing Invalid Email Validation...');
  
  const invalidEmails = [
    'not-an-email',
    'missing@.com',
    '@missing-local.com',
    'spaces in@email.com'
  ];
  
  for (const email of invalidEmails) {
    try {
      const response = await fetch(`${BASE_URL}/api/contact-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: email,
          company: 'Test Corp',
          message: 'This should fail validation',
          projectType: 'web-development',
          phone: '+1-555-0123'
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.log(`✅ Invalid email "${email}" correctly rejected`);
      } else {
        console.log(`❌ Invalid email "${email}" was accepted (validation error)`);
      }
    } catch (error) {
      console.log(`❌ Error testing email "${email}":`, error.message);
    }
  }
  
  console.log('');
}

// Test 4: Rate Limiting
async function testRateLimiting() {
  console.log('4️⃣  Testing Rate Limiting (sending 3 quick requests)...');
  
  const promises = [];
  
  for (let i = 1; i <= 3; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/contact-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Rate Test ${i}`,
          email: `ratetest${i}@example.com`,
          company: 'Rate Test Corp',
          message: `Rate limiting test message ${i}`,
          projectType: 'web-development',
          phone: '+1-555-0123'
        })
      })
    );
  }
  
  try {
    const responses = await Promise.all(promises);
    
    const results = await Promise.all(
      responses.map(async (response, index) => {
        const data = await response.json();
        return { index: index + 1, status: response.status, data };
      })
    );
    
    results.forEach(({ index, status, data }) => {
      if (status === 200) {
        console.log(`✅ Request ${index}: Accepted`);
      } else if (status === 429) {
        console.log(`⏱️  Request ${index}: Rate limited (${data.error})`);
      } else {
        console.log(`⚠️  Request ${index}: Other error (${status})`);
      }
    });
    
  } catch (error) {
    console.log('❌ Error testing rate limiting:', error.message);
  }
  
  console.log('');
}

// Test 5: Honeypot Field
async function testHoneypot() {
  console.log('5️⃣  Testing Honeypot Field (bot detection)...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/contact-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bot User',
        email: 'bot@example.com',
        company: 'Bot Corp',
        message: 'This is a bot message',
        projectType: 'web-development',
        phone: '+1-555-0123',
        website: 'http://bot-filled-honeypot.com' // This should trigger bot detection
      })
    });
    
    const result = await response.json();
    
    if (response.status === 400) {
      console.log('✅ Honeypot correctly detected bot');
    } else {
      console.log('⚠️  Honeypot did not detect bot (check implementation)');
    }
  } catch (error) {
    console.log('❌ Error testing honeypot:', error.message);
  }
  
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('Starting security tests...\n');
  
  await testValidSubmission();
  await testSpamDetection();
  await testInvalidEmail();
  await testRateLimiting();
  await testHoneypot();
  
  console.log('🎯 Security testing complete!');
  console.log('\n📝 What to check:');
  console.log('   • Browser console for detailed logs');
  console.log('   • Supabase database for logged attempts');
  console.log('   • Rate limiting behavior with multiple requests');
  console.log('   • Form validation on the frontend');
}

runAllTests().catch(console.error);
