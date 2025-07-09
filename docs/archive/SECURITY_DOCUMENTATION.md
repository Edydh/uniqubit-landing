# 🛡️ Contact Form Security Implementation

## Overview

This document outlines the comprehensive security measures implemented for the uniQubit contact form to prevent spam, abuse, and malicious submissions.

## Security Layers

### 1. Rate Limiting
- **Implementation**: `/lib/security/rateLimiter.ts`
- **Configuration**: 5 requests per 15 minutes per client
- **Identification**: Based on IP address + User Agent hash
- **Response**: HTTP 429 with retry-after header

### 2. Content Validation & Spam Detection
- **Implementation**: `/lib/security/spamDetection.ts`
- **Features**:
  - Enhanced Zod schema validation
  - Pattern-based spam detection (URLs, suspicious keywords)
  - Content analysis (length, repetition, formatting)
  - Disposable email domain blocking
  - Phone number format validation

### 3. CAPTCHA Integration (Cloudflare Turnstile)
- **Implementation**: `/lib/security/turnstile.ts`
- **Features**:
  - Privacy-focused alternative to reCAPTCHA
  - Server-side verification
  - Optional configuration (graceful degradation)
  - Client IP validation

### 4. Honeypot Field
- **Implementation**: Hidden `website` field in contact form
- **Purpose**: Catch automated bots that fill all form fields
- **Styling**: `display: none` with `tabIndex: -1`

### 5. Enhanced Input Sanitization
- **Character restrictions** for name fields
- **Length limits** on all inputs
- **Email format validation** with domain restrictions
- **Message content analysis** for spam patterns

## Configuration

### Environment Variables

```bash
# Required for CAPTCHA (optional but recommended)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Rate limiting configuration
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=5        # 5 requests per window

# Spam detection
SPAM_DETECTION_ENABLED=true
SPAM_CONFIDENCE_THRESHOLD=80     # 0-100 scale
```

### Cloudflare Turnstile Setup

1. **Create Cloudflare Account**: Visit [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
2. **Add Site**: Register your domain
3. **Get Keys**: Copy Site Key and Secret Key
4. **Update Environment**: Add keys to `.env.local`

## Spam Detection Patterns

### High-Risk Patterns
- Multiple URLs or links
- Promotional language (SEO, marketing, buy now, etc.)
- Excessive punctuation or capitals
- Phone numbers in message content
- Cryptocurrency/investment keywords

### Content Analysis
- **Too Short**: Messages under 20 characters
- **Too Long**: Messages over 2000 characters
- **Repetition**: Repeated characters or words
- **Suspicious Keywords**: Marketing, SEO, financial terms

## Database Logging

All security events are logged to the database:

```sql
-- Security metadata in ai_analysis column
{
  "security_check": {
    "rate_limit_remaining": 4,
    "spam_score": 15,
    "captcha_verified": true
  },
  "spam_detection": {
    "confidence": 85,
    "reasons": ["Contains URLs", "Suspicious keywords"]
  }
}
```

## API Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Form submitted successfully |
| 400 | Bad Request | Validation error or spam detected |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error (check logs) |

## Monitoring & Alerts

### Metrics to Track
- **Spam Attempts**: Count of blocked submissions
- **Rate Limit Hits**: Frequency of rate limiting
- **CAPTCHA Failures**: Failed verification attempts
- **False Positives**: Legitimate submissions blocked

### Database Queries

```sql
-- Spam attempts in last 24 hours
SELECT COUNT(*) FROM leads 
WHERE status = 'spam' 
AND created_at > NOW() - INTERVAL '24 hours';

-- Rate limiting effectiveness
SELECT ai_analysis->'security_check'->>'rate_limit_remaining' as remaining,
       COUNT(*) as submissions
FROM leads 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY remaining;

-- Top spam reasons
SELECT reason, COUNT(*) as count
FROM (
  SELECT jsonb_array_elements_text(
    ai_analysis->'spam_detection'->'reasons'
  ) as reason
  FROM leads 
  WHERE status = 'spam'
) reasons
GROUP BY reason
ORDER BY count DESC;
```

## Performance Impact

### Client-Side
- **CAPTCHA Load**: ~50KB additional JavaScript
- **Form Validation**: Minimal overhead with Zod
- **User Experience**: 1-2 second delay for CAPTCHA

### Server-Side
- **Rate Limiting**: <1ms per request
- **Spam Detection**: 2-5ms per submission
- **CAPTCHA Verification**: 100-300ms API call

## Customization

### Adjusting Spam Sensitivity

1. **Lower Threshold**: Reduce false positives
   ```typescript
   const isSpam = spamScore >= 5; // More lenient
   ```

2. **Add Custom Patterns**:
   ```typescript
   const CUSTOM_PATTERNS = [
     /your-specific-pattern/gi,
   ];
   ```

3. **Whitelist Domains**:
   ```typescript
   const allowedDomains = ['gmail.com', 'company.com'];
   ```

### Rate Limiting Adjustments

```typescript
export const contactFormRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 3,            // 3 requests
});
```

## Testing

### Test Spam Detection
```bash
# Test with obvious spam content
curl -X POST http://localhost:3001/api/contact-ai \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SEO Expert",
    "email": "test@test.com",
    "message": "BUY NOW!!! CLICK HERE FOR FREE MONEY https://spam.com",
    "projectType": "web-development"
  }'
```

### Test Rate Limiting
```bash
# Send 6 requests quickly
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/contact-ai \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test message","projectType":"web-development"}'
done
```

## Security Best Practices

1. **Regular Updates**: Keep spam patterns updated
2. **Monitor Logs**: Review blocked submissions weekly
3. **User Feedback**: Provide clear error messages
4. **Graceful Degradation**: Function without CAPTCHA if needed
5. **Privacy**: Don't log sensitive user data
6. **Rate Limit Tuning**: Adjust based on legitimate usage patterns

## Troubleshooting

### Common Issues

1. **CAPTCHA Not Loading**:
   - Check environment variables
   - Verify domain registration
   - Check browser console for errors

2. **False Positives**:
   - Review spam detection patterns
   - Lower confidence threshold
   - Add domain/keyword whitelists

3. **Rate Limiting Too Aggressive**:
   - Increase window size or request limit
   - Consider user authentication
   - Implement progressive delays

### Debug Mode

Enable detailed logging:
```typescript
const DEBUG_SECURITY = process.env.NODE_ENV === 'development';

if (DEBUG_SECURITY) {
  console.log('Security Check:', {
    spamScore,
    rateLimitRemaining,
    captchaVerified
  });
}
```

## Future Enhancements

1. **Machine Learning**: Train custom spam detection models
2. **Behavioral Analysis**: Track user interaction patterns
3. **IP Reputation**: Integrate with threat intelligence feeds
4. **Geographic Filtering**: Block high-risk countries/regions
5. **Time-based Analysis**: Detect unusual submission patterns
6. **Integration**: Connect with external anti-fraud services

---

**Note**: Security is an ongoing process. Regularly review and update these measures based on new threats and user feedback.
