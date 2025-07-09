const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkAllTables() {
  try {
    console.log('🔍 Comprehensive database check...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check what tables exist
    console.log('📊 Checking available tables...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      // If RPC doesn't exist, try direct SQL
      console.log('🔍 Trying alternative table check...');
      
      // Check leads table
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .limit(1);
      
      if (!leadsError) {
        console.log('✅ leads table exists');
        console.log('📊 Sample lead:', leadsData?.[0] || 'No data');
      } else {
        console.log('❌ leads table error:', leadsError.message);
      }
      
      // Check users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (!usersError) {
        console.log('✅ users table exists');
        console.log('📊 Sample user:', usersData?.[0] || 'No data');
      } else {
        console.log('❌ users table error:', usersError.message);
      }
      
      // Check projects table
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .limit(1);
      
      if (!projectsError) {
        console.log('✅ projects table exists');
        console.log('📊 Sample project:', projectsData?.[0] || 'No data');
      } else {
        console.log('❌ projects table error:', projectsError.message);
      }
      
    } else {
      console.log('📋 Available tables:', tables);
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkAllTables();
