import { z } from 'zod';

// Lead Analysis Schema
export const LeadAnalysisSchema = z.object({
  priority: z.enum(['high', 'medium', 'low']),
  projectType: z.enum([
    'web-development',
    'mobile-app',
    'consultation',
    'maintenance',
    'e-commerce',
    'custom-software',
    'other'
  ]),
  estimatedBudget: z.enum(['under-5k', '5k-15k', '15k-50k', '50k-plus']),
  urgency: z.enum(['immediate', 'within-month', 'planning', 'exploring']),
  complexity: z.enum(['simple', 'medium', 'complex']),
  keyRequirements: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()),
  riskFactors: z.array(z.string()).optional(),
  confidenceScore: z.number().min(0).max(1),
});

export type LeadAnalysis = z.infer<typeof LeadAnalysisSchema>;

// Contact Form Data Schema
export const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  projectType: z.string(),
  message: z.string().min(10),
  phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// AI Response Schema
export const AIResponseSchema = z.object({
  content: z.string(),
  tone: z.enum(['professional', 'friendly', 'enthusiastic', 'formal']),
  includedElements: z.array(z.string()),
  estimatedReadTime: z.number(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

// Lead Scoring Schema
export const LeadScoringSchema = z.object({
  totalScore: z.number().min(0).max(100),
  budgetScore: z.number().min(0).max(25),
  urgencyScore: z.number().min(0).max(20),
  complexityScore: z.number().min(0).max(15),
  priorityScore: z.number().min(0).max(30),
  qualityScore: z.number().min(0).max(10),
});

export type LeadScoring = z.infer<typeof LeadScoringSchema>;
