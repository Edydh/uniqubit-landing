// Rate limiting implementation for contact form
import { NextApiRequest } from 'next';

// In-memory store for rate limiting (consider Redis for production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  skipSuccessfulRequests?: boolean;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  // Get client identifier (IP + User Agent for better uniqueness)
  private getClientId(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? String(forwarded).split(',')[0] : req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 20)}`;
  }

  // Check if request should be rate limited
  public checkRateLimit(req: NextApiRequest): { 
    allowed: boolean; 
    remaining: number; 
    resetTime: number;
    retryAfter?: number;
  } {
    const clientId = this.getClientId(req);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup();
    
    const clientData = requestCounts.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      // First request or window expired
      const resetTime = now + this.config.windowMs;
      requestCounts.set(clientId, { count: 1, resetTime });
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      };
    }
    
    if (clientData.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: clientData.resetTime,
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
      };
    }
    
    // Increment count
    clientData.count++;
    requestCounts.set(clientId, clientData);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - clientData.count,
      resetTime: clientData.resetTime,
    };
  }

  // Clean up expired entries to prevent memory leaks
  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
      if (now > data.resetTime) {
        requestCounts.delete(key);
      }
    }
  }
}

// Default rate limiter for contact form (5 requests per 15 minutes)
export const contactFormRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});
