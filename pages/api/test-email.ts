import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../lib/ai/services/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Test email content
    const emailContent = `
      <h2>Test Email from uniQubit</h2>
      <p>This is a test email to verify that our email service is working correctly.</p>
      <p>If you received this email, it means:</p>
      <ul>
        <li>✅ Resend API is properly configured</li>
        <li>✅ Email service is functional</li>
        <li>✅ Emails can be delivered successfully</li>
      </ul>
      <p>Test sent at: ${new Date().toISOString()}</p>
      <hr>
      <p><small>This is a test email from the uniQubit platform.</small></p>
    `;

    console.log('Attempting to send test email to:', to);

    const result = await sendEmail({
      to,
      subject: 'Test Email - uniQubit Email Service Verification',
      html: emailContent
    });

    console.log('Email sent successfully:', result);

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Test email sent successfully',
        result: result.data,
        to
      });
    } else {
      throw new Error(result.error ? String(result.error) : 'Email sending failed');
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      error: 'Failed to send test email', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
