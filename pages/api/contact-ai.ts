import { NextApiRequest, NextApiResponse } from 'next';
import { 
  analyzeLeadInquiry, 
  generatePersonalizedResponse, 
  generateAdminNotification,
  calculateLeadScore 
} from '@/lib/ai/services/contactAI';
import { 
  sendEmail, 
  formatClientResponseEmail, 
  formatAdminNotificationEmail 
} from '@/lib/ai/services/emailService';
import { validateAIConfig } from '@/lib/ai/config';
import { ContactFormSchema } from '@/lib/ai/types/leadAnalysis';
import { supabase } from '@/lib/supabase';
import { contactFormRateLimiter } from '@/lib/security/rateLimiter';
import { SpamDetector, enhancedContactSchema } from '@/lib/security/spamDetection';
import { TurnstileVerifier, getTurnstileConfig } from '@/lib/security/turnstile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Rate limiting check
    const rateLimitResult = contactFormRateLimiter.checkRateLimit(req);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter 
      });
    }

    // 2. CAPTCHA verification (if enabled)
    const turnstileConfig = getTurnstileConfig();
    if (turnstileConfig.isEnabled) {
      const turnstileToken = req.body.turnstileToken;
      if (!turnstileToken) {
        return res.status(400).json({ error: 'CAPTCHA verification required' });
      }

      const verifier = new TurnstileVerifier(turnstileConfig.secretKey!);
      const clientIP = TurnstileVerifier.getClientIP(req);
      const verification = await verifier.verifyToken(turnstileToken, clientIP);
      
      if (!verification.success) {
        console.warn('CAPTCHA verification failed:', verification.errorCodes);
        return res.status(400).json({ error: 'CAPTCHA verification failed' });
      }
    }

    // Validate AI configuration
    validateAIConfig();

    // 3. Enhanced form validation with spam detection
    const formData = enhancedContactSchema.parse(req.body);

    // 4. Additional spam content analysis
    const messageSpamCheck = SpamDetector.analyzeContent(formData.message);
    if (messageSpamCheck.isSpam) {
      console.warn('Spam detected in message:', {
        email: formData.email,
        confidence: messageSpamCheck.confidence,
        reasons: messageSpamCheck.reasons
      });
      
      // Log spam attempt to database
      await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'spam',
          source: 'contact_form',
          ai_analysis: {
            spam_detection: messageSpamCheck,
            blocked_reason: 'Automatic spam detection'
          }
        });

      return res.status(400).json({ 
        error: 'Your message appears to be spam. Please contact us directly if this is a legitimate inquiry.'
      });
    }

    console.log('Processing contact inquiry with AI...', { 
      name: formData.name, 
      email: formData.email 
    });

    // 1. Create lead in database with security metadata
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        project_type: formData.projectType,
        message: formData.message,
        phone: formData.phone,
        status: 'new',
        source: 'contact_form',
        ai_analysis: {
          security_check: {
            rate_limit_remaining: rateLimitResult.remaining,
            spam_score: messageSpamCheck.confidence,
            captcha_verified: turnstileConfig.isEnabled
          }
        }
      })
      .select()
      .single();

    if (leadError) {
      console.error('Database error:', leadError);
      return res.status(500).json({ error: 'Failed to save lead' });
    }

    // 2. AI Analysis
    console.log('Running AI analysis...');
    const analysis = await analyzeLeadInquiry(formData);
    const leadScore = calculateLeadScore(analysis);

    console.log('AI Analysis complete:', { 
      priority: analysis.priority, 
      score: leadScore.totalScore 
    });

    // 3. Generate personalized response
    console.log('Generating personalized response...');
    const aiResponse = await generatePersonalizedResponse(formData, analysis);

    // 4. Generate admin notification
    console.log('Generating admin notification...');
    const adminNotification = await generateAdminNotification(formData, analysis);

    // 5. Update lead with AI insights
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        ai_score: leadScore.totalScore,
        ai_priority: analysis.priority,
        ai_project_type: analysis.projectType,
        ai_budget_estimate: analysis.estimatedBudget,
        ai_urgency: analysis.urgency,
        ai_complexity: analysis.complexity,
        ai_analysis: analysis,
        ai_response_content: aiResponse,
        ai_response_sent: false, // Will be set to true after email is sent
      })
      .eq('id', lead.id);

    if (updateError) {
      console.error('Failed to update lead with AI data:', updateError);
    }

    // 6. Send AI response to client
    console.log('Sending client response email...');
    const clientEmailResult = await sendEmail({
      to: formData.email,
      subject: `Thank you for your inquiry, ${formData.name}!`,
      html: formatClientResponseEmail(aiResponse, formData.name),
    });

    // 7. Send admin notification
    console.log('Sending admin notification...');
    const adminEmailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@uniqubit.ca',
      subject: `New ${analysis.priority.toUpperCase()} Priority Lead: ${formData.name}`,
      html: formatAdminNotificationEmail(adminNotification, formData, analysis),
    });

    // 8. Update lead to mark AI response as sent (if successful)
    if (clientEmailResult.success) {
      await supabase
        .from('leads')
        .update({ ai_response_sent: true })
        .eq('id', lead.id);
    }

    // 9. Log AI communication
    await supabase
      .from('ai_communications')
      .insert({
        lead_id: lead.id,
        communication_type: 'contact_response',
        ai_response: aiResponse,
        sent_at: clientEmailResult.success ? new Date().toISOString() : null,
      });

    console.log('Contact processing complete:', {
      leadId: lead.id,
      priority: analysis.priority,
      score: leadScore.totalScore,
      clientEmailSent: clientEmailResult.success,
      adminEmailSent: adminEmailResult.success,
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your inquiry! We\'ll be in touch soon.',
      leadId: lead.id,
      analysis: {
        priority: analysis.priority,
        score: leadScore.totalScore,
        projectType: analysis.projectType,
      },
      emailSent: clientEmailResult.success,
    });

  } catch (error) {
    console.error('Contact AI processing error:', error);
    
    // Fallback: Save basic lead without AI features
    try {
      const formData = req.body;
      await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          project_type: formData.projectType,
          message: formData.message,
          phone: formData.phone,
          status: 'new',
          source: 'contact_form'
        });

      res.status(200).json({
        success: true,
        message: 'Thank you for your inquiry! We\'ll be in touch soon.',
        aiProcessed: false,
      });
    } catch (fallbackError) {
      console.error('Fallback save failed:', fallbackError);
      res.status(500).json({ 
        error: 'Failed to process contact inquiry. Please try again.' 
      });
    }
  }
}
