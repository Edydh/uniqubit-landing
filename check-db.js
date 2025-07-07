const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkDatabase() {
  try {
    console.log('🔍 Checking current database schema...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if leads table exists
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error checking tables:', error);
      return;
    }
    
    console.log('📊 Existing tables:', tables.map(t => t.table_name));
    
    // Check leads table structure
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (leadsError) {
      console.log('ℹ️ Leads table does not exist yet');
    } else {
      console.log('✅ Leads table exists');
      if (leadsData && leadsData.length > 0) {
        console.log('📝 Sample lead structure:', Object.keys(leadsData[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();
