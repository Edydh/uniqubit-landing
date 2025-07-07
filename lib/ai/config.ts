import { openai } from '@ai-sdk/openai';

// AI Configuration
export const AI_CONFIG = {
  model: process.env.AI_MODEL_NAME || 'gpt-4o',
  provider: process.env.AI_MODEL_PROVIDER || 'openai',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
};

// OpenAI client
export const aiModel = openai(AI_CONFIG.model);

// Validate environment variables
export function validateAIConfig() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required but not set');
  }
  
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set - email features will be disabled');
  }
  
  return true;
}

// Rate limiting configuration
export const RATE_LIMITS = {
  contactForm: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  leadAnalysis: {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

// Error handling
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}
