import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { leadId } = req.query;
    
    console.log('Debug lead lookup for ID:', leadId);
    
    // Try multiple approaches to find the lead
    
    // 1. Try with maybeSingle
    const { data: lead1, error: error1 } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle();
    
    console.log('maybeSingle result:', { lead1, error1 });
    
    // 2. Try without single
    const { data: leads, error: error2 } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId);
    
    console.log('select all result:', { leads, error2 });
    
    // 3. Try to get all leads
    const { data: allLeads, error: error3 } = await supabase
      .from('leads')
      .select('id, name, email')
      .limit(5);
    
    console.log('all leads sample:', { allLeads, error3 });
    
    res.json({
      leadId,
      results: {
        maybeSingle: { data: lead1, error: error1 },
        selectAll: { data: leads, error: error2 },
        allLeads: { data: allLeads, error: error3 }
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Debug failed', details: error });
  }
}
