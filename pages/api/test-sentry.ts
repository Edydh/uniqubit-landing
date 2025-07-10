import { NextApiRequest, NextApiResponse } from 'next';
import { UniQubitSentry, withSentryApiRoute } from '../../lib/sentry';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { testType } = req.body;

  try {
    switch (testType) {
      case 'error':
        // Test error tracking
        throw new Error('Test error for Sentry monitoring');
        
      case 'business_error':
        // Test business error tracking
        UniQubitSentry.captureBusinessError(new Error('Test business error'), {
          action: 'test_business_action',
          userId: 'test-user-123',
          email: 'test@example.com'
        });
        break;
        
      case 'ai_error':
        // Test AI error tracking
        UniQubitSentry.captureAIError(new Error('Test AI service error'), {
          service: 'openai',
          prompt: 'Test prompt for monitoring'
        });
        break;
        
      case 'email_error':
        // Test email error tracking
        UniQubitSentry.captureEmailError(new Error('Test email delivery error'), {
          service: 'resend',
          emailType: 'welcome',
          recipient: 'test@example.com'
        });
        break;
        
      case 'database_error':
        // Test database error tracking
        UniQubitSentry.captureDatabaseError(new Error('Test database error'), {
          operation: 'create',
          table: 'test_table',
          userId: 'test-user-123'
        });
        break;
        
      case 'user_journey':
        // Test user journey tracking
        UniQubitSentry.captureUserJourney('test_user_action', {
          userId: 'test-user-123',
          userRole: 'admin',
          page: '/test',
          action: 'test_action'
        });
        break;
        
      case 'business_metric':
        // Test business metric tracking
        UniQubitSentry.trackBusinessMetric('test_conversion_rate', 85.5, {
          operation: 'lead_conversion',
          success: true,
          duration: 1200
        });
        break;
        
      default:
        return res.status(400).json({ 
          error: 'Invalid test type',
          availableTests: [
            'error', 
            'business_error', 
            'ai_error', 
            'email_error', 
            'database_error', 
            'user_journey', 
            'business_metric'
          ]
        });
    }

    res.status(200).json({ 
      success: true, 
      message: `Sentry ${testType} test completed`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Sentry test ${testType} failed:`, error);
    res.status(500).json({ 
      error: 'Sentry test failed',
      type: testType,
      message: (error as Error).message
    });
  }
}

export default withSentryApiRoute(handler, 'test-sentry');
