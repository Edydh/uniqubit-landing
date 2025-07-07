import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';
import type { ContactFormData } from '../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔍 Contact API called with method:', req.method);
  console.log('🔍 Request body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if admin client is available
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not configured');
    return res.status(500).json({ 
      message: 'Server configuration error. Please contact support.' 
    });
  }

  console.log('✅ Supabase admin client is available');

  try {
    const { name, email, company, message }: ContactFormData = req.body;
    console.log('🔍 Extracted data:', { name, email, company, message });

    // Basic validation
    if (!name || !email || !message) {
      console.log('❌ Missing required fields:', { name: !!name, email: !!email, message: !!message });
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    console.log('✅ Validation passed, attempting to insert into database...');

    // Save lead to database using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name,
          email,
          company: company || null,
          message,
          status: 'new',
        },
      ])
      .select()
      .single();

    console.log('🔍 Database operation result:', { data, error });

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ 
        message: 'Failed to save your message. Please try again later.' 
      });
    }

    console.log('✅ Lead saved successfully:', data);

    // TODO: Send notification email to admin
    // This can be implemented later with email service

    return res.status(200).json({ 
      message: 'Thank you for your message! We\'ll get back to you soon.',
      success: true,
      leadId: data.id,
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return res.status(500).json({ 
      message: 'An unexpected error occurred. Please try again later.' 
    });
  }
}
