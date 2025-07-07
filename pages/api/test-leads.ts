import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔍 Querying leads table...');
    
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase admin client not configured' });
    }

    // Query all leads
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('🔍 Leads query result:', { data, error });

    if (error) {
      console.error('❌ Error querying leads:', error);
      return res.status(500).json({ 
        error: 'Failed to query leads',
        details: error.message
      });
    }

    console.log('✅ Found', data?.length || 0, 'leads');

    return res.status(200).json({ 
      success: true,
      count: data?.length || 0,
      leads: data || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in leads query:', error);
    return res.status(500).json({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
