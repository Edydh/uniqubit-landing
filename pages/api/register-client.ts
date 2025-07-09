import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { sendEmail } from '../../lib/ai/services/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, full_name, leadId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Creating user account for:', email);

    // Create user directly in the users table (bypassing auth confirmation)
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create the user record
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        full_name: full_name || email.split('@')[0],
        role: 'client'
      })
      .select('*')
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({ error: 'Failed to create user account', details: userError });
    }

    console.log('User created successfully:', newUser);

    // If there's a leadId, link it to this user
    if (leadId) {
      const { error: leadUpdateError } = await supabase
        .from('leads')
        .update({ converted_to_user_id: newUser.id })
        .eq('id', leadId);

      if (leadUpdateError) {
        console.warn('Could not link lead to user:', leadUpdateError);
      }
    }

    // Send welcome email using our custom email service
    try {
      const welcomeEmailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to uniQubit</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #00D4FF;">Welcome to uniQubit!</h1>
            <p>Hi ${full_name || 'there'},</p>
            <p>Your account has been successfully created. You can now log in to access your client dashboard.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Account Details:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Role:</strong> Client</p>
            </div>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login" 
               style="background: #00D4FF; color: black; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
               Log In to Your Dashboard
            </a></p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <hr style="margin: 30px 0;">
            <p><small>This email was sent from the uniQubit platform.</small></p>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: email,
        subject: 'Welcome to uniQubit - Your Account is Ready!',
        html: welcomeEmailContent
      });

      console.log('Welcome email sent to:', email);
    } catch (emailError) {
      console.warn('Could not send welcome email:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to create account',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
