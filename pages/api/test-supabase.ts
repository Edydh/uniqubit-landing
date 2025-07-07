import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test if admin client exists
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client is null/undefined');
      return res.status(500).json({ 
        error: 'Supabase admin client not configured',
        hasClient: false
      });
    }

    console.log('✅ Supabase admin client exists');

    // Test connection by checking if we can query the leads table
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('count')
      .limit(1);

    console.log('🔍 Database query result:', { data, error });

    if (error) {
      console.error('❌ Database connection error:', error);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message,
        hasClient: true,
        canConnect: false
      });
    }

    console.log('✅ Database connection successful');

    // Test environment variables
    const envCheck = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    console.log('🔍 Environment variables check:', envCheck);

    return res.status(200).json({ 
      message: 'Supabase connection test successful',
      hasClient: true,
      canConnect: true,
      envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Supabase test error:', error);
    return res.status(500).json({ 
      error: 'Unexpected error during connection test',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
