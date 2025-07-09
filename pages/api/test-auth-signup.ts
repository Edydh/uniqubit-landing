import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Testing Supabase Auth signup for:', email);

    // Try to sign up a user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'Xk9$mP2#vF8@qW5!nR7&jL3%',
      options: {
        data: {
          full_name: 'Test User for Email Confirmation'
        }
      }
    });

    if (error) {
      console.error('Supabase auth signup error:', error);
      return res.status(400).json({ 
        error: 'Signup failed', 
        details: error.message,
        code: error.message?.includes('email') ? 'EMAIL_ISSUE' : 'SIGNUP_ERROR'
      });
    }

    console.log('Signup result:', data);

    res.status(200).json({
      success: true,
      message: 'Signup successful - check email for confirmation',
      user: data.user,
      session: data.session ? 'Session created' : 'No session (confirmation required)'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
