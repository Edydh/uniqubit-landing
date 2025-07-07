const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function simpleDbCheck() {
  try {
    console.log('🔍 Simple database connection test...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try to query the leads table directly
    console.log('📊 Testing leads table...');
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('ℹ️ Leads table does not exist - we need to create it');
        console.log('📋 You need to create the basic schema first');
        console.log('🔗 Go to your Supabase dashboard > SQL Editor and run:');
        console.log(`
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
        `);
      } else {
        console.error('Error querying leads:', error);
      }
    } else {
      console.log('✅ Leads table exists and is accessible');
      console.log('📊 Found', data?.length || 0, 'leads');
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

simpleDbCheck();
