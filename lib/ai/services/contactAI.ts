import { generateText, generateObject } from 'ai';
import { aiModel, AI_CONFIG, AIServiceError } from '../config';
import { 
  LeadAnalysisSchema, 
  ContactFormData, 
  LeadAnalysis,
  LeadScoring 
} from '../types/leadAnalysis';

/**
 * Analyze a lead inquiry using AI to extract insights and qualification data
 */
export async function analyzeLeadInquiry(formData: ContactFormData): Promise<LeadAnalysis> {
  try {
    const { object } = await generateObject({
      model: aiModel,
      schema: LeadAnalysisSchema,
      prompt: `Analyze this potential client inquiry and provide detailed qualification data:

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}
Project Type: ${formData.projectType}
Message: ${formData.message}
Phone: ${formData.phone || 'Not provided'}

Consider these factors:
- Technical complexity indicators in the message
- Budget signals in language (premium, budget, enterprise, etc.)
- Timeline urgency cues (ASAP, urgent, planning, exploring)
- Project scope indicators (small, large, ongoing, one-time)
- Potential red flags or challenges
- Business value potential and growth opportunities

Provide actionable insights for prioritizing this lead. Be conservative with high priority ratings - only assign if there are clear indicators of high value, urgency, and budget capacity.

For keyRequirements, extract specific technical or business requirements mentioned.
For recommendedNextSteps, provide 2-3 specific actions to move this lead forward.
For riskFactors, identify any potential challenges or red flags.
Set confidenceScore based on how much information was provided (0.1-1.0).`,
    });

    return object;
  } catch (error) {
    console.error('Error analyzing lead inquiry:', error);
    throw new AIServiceError(
      'Failed to analyze lead inquiry',
      'LEAD_ANALYSIS_FAILED',
      500
    );
  }
}

/**
 * Generate a personalized response to a contact form inquiry
 */
export async function generatePersonalizedResponse(
  formData: ContactFormData,
  analysis: LeadAnalysis
): Promise<string> {
  try {
    const { text } = await generateText({
      model: aiModel,
      maxTokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      prompt: `Generate a professional, personalized response to this potential client inquiry:

Client Details:
- Name: ${formData.name}
- Company: ${formData.company || 'Individual/Startup'}
- Project Type: ${formData.projectType}
- Message: ${formData.message}

AI Analysis Results:
- Priority: ${analysis.priority}
- Estimated Budget: ${analysis.estimatedBudget}
- Urgency: ${analysis.urgency}
- Complexity: ${analysis.complexity}
- Key Requirements: ${analysis.keyRequirements.join(', ')}
- Recommended Next Steps: ${analysis.recommendedNextSteps.join(', ')}

Requirements for the response:
1. Professional, warm, and enthusiastic tone
2. Address their specific project type and requirements mentioned
3. Reference their company name if provided
4. Suggest appropriate next steps based on urgency level
5. Include estimated timeline range based on complexity:
   - Simple: 2-4 weeks
   - Medium: 4-8 weeks  
   - Complex: 8-16 weeks
6. Mention relevant expertise areas (web development, mobile apps, consultation)
7. Provide clear call-to-action for consultation
8. Keep under 200 words for email readability
9. Include signature: "Best regards,\\nThe uniQubit Team"
10. Use their name in the greeting

Make it feel personal and tailored to their specific needs while maintaining professionalism.`,
    });

    return text;
  } catch (error) {
    console.error('Error generating personalized response:', error);
    throw new AIServiceError(
      'Failed to generate personalized response',
      'RESPONSE_GENERATION_FAILED',
      500
    );
  }
}

/**
 * Generate an admin notification for a new lead
 */
export async function generateAdminNotification(
  formData: ContactFormData,
  analysis: LeadAnalysis
): Promise<string> {
  try {
    const { text } = await generateText({
      model: aiModel,
      maxTokens: 300,
      temperature: 0.3,
      prompt: `Generate a concise admin notification for this new lead:

Lead: ${formData.name} (${formData.email})
Company: ${formData.company || 'Not provided'}
Priority: ${analysis.priority}
Project: ${analysis.projectType}
Budget: ${analysis.estimatedBudget}
Urgency: ${analysis.urgency}
Complexity: ${analysis.complexity}

Key Requirements: ${analysis.keyRequirements.join(', ')}
Risk Factors: ${analysis.riskFactors?.join(', ') || 'None identified'}

Create a 2-3 sentence summary highlighting:
1. Why this lead is ${analysis.priority} priority
2. What immediate actions should be taken
3. Any notable opportunities or concerns

Keep it concise and actionable for quick admin review.`,
    });

    return text;
  } catch (error) {
    console.error('Error generating admin notification:', error);
    throw new AIServiceError(
      'Failed to generate admin notification',
      'ADMIN_NOTIFICATION_FAILED',
      500
    );
  }
}

/**
 * Calculate lead score based on AI analysis
 */
export function calculateLeadScore(analysis: LeadAnalysis): LeadScoring {
  let budgetScore = 0;
  let urgencyScore = 0;
  let complexityScore = 0;
  let priorityScore = 0;
  const qualityScore = Math.round(analysis.confidenceScore * 10);

  // Budget scoring (0-25 points)
  switch (analysis.estimatedBudget) {
    case '50k-plus':
      budgetScore = 25;
      break;
    case '15k-50k':
      budgetScore = 20;
      break;
    case '5k-15k':
      budgetScore = 15;
      break;
    case 'under-5k':
      budgetScore = 10;
      break;
  }

  // Urgency scoring (0-20 points)
  switch (analysis.urgency) {
    case 'immediate':
      urgencyScore = 20;
      break;
    case 'within-month':
      urgencyScore = 15;
      break;
    case 'planning':
      urgencyScore = 10;
      break;
    case 'exploring':
      urgencyScore = 5;
      break;
  }

  // Complexity scoring (0-15 points) - higher complexity can mean higher value
  switch (analysis.complexity) {
    case 'complex':
      complexityScore = 15;
      break;
    case 'medium':
      complexityScore = 10;
      break;
    case 'simple':
      complexityScore = 8;
      break;
  }

  // Priority scoring (0-30 points)
  switch (analysis.priority) {
    case 'high':
      priorityScore = 30;
      break;
    case 'medium':
      priorityScore = 20;
      break;
    case 'low':
      priorityScore = 10;
      break;
  }

  const totalScore = Math.min(
    budgetScore + urgencyScore + complexityScore + priorityScore + qualityScore,
    100
  );

  return {
    totalScore,
    budgetScore,
    urgencyScore,
    complexityScore,
    priorityScore,
    qualityScore,
  };
}
