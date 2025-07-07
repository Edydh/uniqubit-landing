// Test script to verify AI setup
import { validateAIConfig } from '../lib/ai/config';
import { analyzeLeadInquiry } from '../lib/ai/services/contactAI';

async function testAISetup() {
  try {
    console.log('🧪 Testing AI Configuration...');
    
    // Test config validation
    validateAIConfig();
    console.log('✅ AI Configuration valid');
    
    // Test AI analysis with sample data
    const sampleData = {
      name: "John Doe",
      email: "john@example.com", 
      company: "Test Company",
      projectType: "web-development",
      message: "I need a custom e-commerce website for my growing business. Budget is around $25,000 and I need it completed within 2 months. It needs to handle inventory management and payment processing."
    };
    
    console.log('🤖 Testing AI Lead Analysis...');
    const analysis = await analyzeLeadInquiry(sampleData);
    
    console.log('✅ AI Analysis Results:', {
      priority: analysis.priority,
      projectType: analysis.projectType,
      estimatedBudget: analysis.estimatedBudget,
      urgency: analysis.urgency,
      complexity: analysis.complexity,
      confidenceScore: analysis.confidenceScore,
    });
    
    console.log('🎉 AI Setup Test Successful!');
    
  } catch (error) {
    console.error('❌ AI Setup Test Failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        console.log('💡 Please add your OpenAI API key to .env.local');
      }
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAISetup();
}

export { testAISetup };
