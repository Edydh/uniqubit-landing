// Content validation and spam detection utilities
import { z } from 'zod';
import { PhoneValidator } from '../validation/phoneValidation';

export interface SpamCheckResult {
  isSpam: boolean;
  confidence: number;
  reasons: string[];
}

export class SpamDetector {
  // Common spam patterns
  private static readonly SPAM_PATTERNS = [
    // URLs and links
    /https?:\/\//gi,
    /www\./gi,
    /\b[a-z0-9.-]+\.[a-z]{2,}\b/gi,
    
    // Suspicious phrases
    /\b(click here|visit now|buy now|limited time|act now|free money|make money|earn \$|get rich|weight loss|viagra|casino|poker|loan|debt|credit|investment|forex)\b/gi,
    
    // Excessive punctuation or caps
    /[!?]{3,}/g,
    /[A-Z]{5,}/g,
    
    // Phone number patterns (multiple formats)
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\(\d{3}\)\s?\d{3}[-.]?\d{4}/g,
  ];

  // Suspicious keywords that increase spam score
  private static readonly SUSPICIOUS_KEYWORDS = [
    'seo', 'marketing', 'promotion', 'advertisement', 'backlinks',
    'ranking', 'traffic', 'followers', 'subscribers', 'leads',
    'guarantee', 'instant', 'automated', 'system', 'software',
    'bitcoin', 'crypto', 'investment', 'profit', 'income'
  ];

  public static analyzeContent(content: string): SpamCheckResult {
    const reasons: string[] = [];
    let spamScore = 0;

    // Check for spam patterns
    this.SPAM_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        spamScore += matches.length * 2;
        if (index < 3) reasons.push('Contains URLs or links');
        if (index === 3) reasons.push('Contains suspicious promotional language');
        if (index === 4) reasons.push('Excessive punctuation');
        if (index === 5) reasons.push('Excessive capital letters');
        if (index > 5) reasons.push('Contains phone numbers');
      }
    });

    // Check for suspicious keywords
    const lowercaseContent = content.toLowerCase();
    const suspiciousCount = this.SUSPICIOUS_KEYWORDS.filter(keyword => 
      lowercaseContent.includes(keyword)
    ).length;
    
    if (suspiciousCount > 0) {
      spamScore += suspiciousCount * 3;
      reasons.push(`Contains ${suspiciousCount} suspicious keyword(s)`);
    }

    // Check message length (too short or too long can be suspicious)
    if (content.length < 20) {
      spamScore += 5;
      reasons.push('Message too short');
    } else if (content.length > 2000) {
      spamScore += 10;
      reasons.push('Message unusually long');
    }

    // Check for repeated characters or words
    const repeatedChars = content.match(/(.)\1{4,}/g);
    if (repeatedChars) {
      spamScore += repeatedChars.length * 3;
      reasons.push('Contains repeated characters');
    }

    // Calculate confidence (0-100)
    const confidence = Math.min(spamScore * 10, 100);
    const isSpam = spamScore >= 8; // Threshold for spam

    return {
      isSpam,
      confidence,
      reasons: [...new Set(reasons)] // Remove duplicates
    };
  }
}

// Enhanced validation schema with spam detection
export const enhancedContactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email too long')
    .refine(email => {
      // Block common disposable email domains
      const disposableDomains = [
        '10minutemail.com', 'temp-mail.org', 'guerrillamail.com',
        'mailinator.com', 'throwaway.email', 'tempmail.email'
      ];
      const domain = email.split('@')[1]?.toLowerCase();
      return !disposableDomains.includes(domain);
    }, 'Disposable email addresses are not allowed'),
  
  company: z.string()
    .max(200, 'Company name too long')
    .optional()
    .refine(company => {
      if (!company) return true;
      const spamCheck = SpamDetector.analyzeContent(company);
      return !spamCheck.isSpam;
    }, 'Company name appears to be spam'),
  
  projectType: z.string()
    .min(1, 'Please select a project type')
    .max(50, 'Project type too long'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long')
    .refine(message => {
      const spamCheck = SpamDetector.analyzeContent(message);
      return !spamCheck.isSpam;
    }, 'Message appears to be spam'),
  
  phone: z.string()
    .max(25, 'Phone number too long')
    .optional()
    .refine(phone => {
      if (!phone || phone.trim() === '') return true;
      // Use our enhanced phone validator
      const validation = PhoneValidator.validate(phone);
      return validation.isValid;
    }, 'Please enter a valid phone number (e.g., +1 234 567-8900 or (234) 567-8900)'),
  
  // Honeypot field (should be empty)
  website: z.string().max(0, 'Invalid submission').optional(),
});

export type EnhancedContactFormData = z.infer<typeof enhancedContactSchema>;
