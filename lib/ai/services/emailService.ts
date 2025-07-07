import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, from }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: from || process.env.FROM_EMAIL || 'noreply@uniqubit.ca',
      to,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

/**
 * Format client response email HTML
 */
export function formatClientResponseEmail(
  response: string,
  clientName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for your inquiry</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: white;
          padding: 30px 20px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>uniQubit</h1>
        <p>Thank you for your inquiry!</p>
      </div>
      <div class="content">
        <p>Hi ${clientName},</p>
        ${response.split('\n').map(line => `<p>${line}</p>`).join('')}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://uniqubit.ca" class="cta-button">Visit Our Website</a>
        </div>
      </div>
      <div class="footer">
        <p>© 2025 uniQubit. Professional digital solutions.</p>
        <p>Email: info@uniqubit.ca | Website: uniqubit.ca</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Format admin notification email HTML
 */
export function formatAdminNotificationEmail(
  notification: string,
  formData: any,
  analysis: any
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .priority-high { border-left: 4px solid #dc3545; }
        .priority-medium { border-left: 4px solid #ffc107; }
        .priority-low { border-left: 4px solid #28a745; }
        .lead-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .score { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <h2>🚨 New Lead Alert</h2>
      
      <div class="lead-details priority-${analysis.priority}">
        <h3>${formData.name} - ${analysis.priority.toUpperCase()} Priority</h3>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${analysis.projectType}</p>
        <p><strong>Budget:</strong> ${analysis.estimatedBudget}</p>
        <p><strong>Urgency:</strong> ${analysis.urgency}</p>
        
        <div style="margin: 20px 0;">
          <h4>AI Analysis:</h4>
          <p>${notification}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h4>Key Requirements:</h4>
          <ul>
            ${analysis.keyRequirements.map((req: string) => `<li>${req}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin: 20px 0;">
          <h4>Original Message:</h4>
          <p style="font-style: italic; background: white; padding: 15px; border-radius: 4px;">
            ${formData.message}
          </p>
        </div>
      </div>
      
      <p><a href="https://uniqubit.ca/admin/leads" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Admin Dashboard</a></p>
    </body>
    </html>
  `;
}
