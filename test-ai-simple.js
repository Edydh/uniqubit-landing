// Simple AI test without Next.js dependencies
require('dotenv').config({ path: '.env.local' });

async function simpleAITest() {
  try {
    console.log('🧪 Testing OpenAI API Key...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }
    
    console.log('✅ OpenAI API Key found');
    console.log('🔑 Key format:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
    
    // Test basic import
    const { openai } = require('@ai-sdk/openai');
    const { generateText } = require('ai');
    
    console.log('✅ AI SDK imported successfully');
    
    // Test simple generation
    console.log('🤖 Testing AI generation...');
    
    const model = openai('gpt-4o');
    const result = await generateText({
      model,
      prompt: 'Say "Hello from uniQubit AI!" in exactly 5 words.',
      maxTokens: 50,
    });
    
    console.log('✅ AI Response:', result.text);
    console.log('🎉 AI Setup Test Successful!');
    
  } catch (error) {
    console.error('❌ AI Test Failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('💡 Check your OpenAI API key in .env.local');
    }
  }
}

simpleAITest();
