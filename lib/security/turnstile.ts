// Cloudflare Turnstile (CAPTCHA) integration
import { NextApiRequest } from 'next';

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  challengeTimestamp?: string;
  hostname?: string;
}

export class TurnstileVerifier {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async verifyToken(token: string, remoteip?: string): Promise<TurnstileVerificationResult> {
    if (!token) {
      return {
        success: false,
        errorCodes: ['missing-input-response']
      };
    }

    try {
      const formData = new FormData();
      formData.append('secret', this.secretKey);
      formData.append('response', token);
      if (remoteip) {
        formData.append('remoteip', remoteip);
      }

      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.success || false,
        errorCodes: result['error-codes'] || [],
        challengeTimestamp: result['challenge-ts'],
        hostname: result.hostname,
      };
    } catch (error) {
      console.error('Turnstile verification error:', error);
      return {
        success: false,
        errorCodes: ['internal-error']
      };
    }
  }

  static getClientIP(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? String(forwarded).split(',')[0] : req.socket.remoteAddress || '';
  }
}

// Environment variables helper
export function getTurnstileConfig() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  return {
    siteKey,
    secretKey,
    isEnabled: !!(siteKey && secretKey)
  };
}
