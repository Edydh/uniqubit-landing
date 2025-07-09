const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testLeadConversion() {
  try {
    console.log('🔍 Testing lead conversion process...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get existing lead
    console.log('📋 Finding lead...');
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('email', 'edydhm@gmail.com')
      .single();
    
    if (leadError) {
      console.error('❌ Error finding lead:', leadError);
      return;
    }
    
    console.log('✅ Found lead:', lead.id, lead.email);
    
    // Check if user exists
    console.log('👤 Checking for existing user...');
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', lead.email)
      .single();
    
    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('❌ Error checking user:', userCheckError);
      return;
    }
    
    let clientId = existingUser?.id;
    
    if (!existingUser) {
      console.log('👤 Creating new user...');
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: lead.email,
          full_name: lead.name,
          role: 'client'
        })
        .select('*')
        .single();
      
      if (userError) {
        console.error('❌ Error creating user:', userError);
        return;
      }
      
      console.log('✅ Created user:', newUser.id);
      clientId = newUser.id;
    } else {
      console.log('✅ Found existing user:', existingUser.id);
    }
    
    // Create project
    console.log('📁 Creating project...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: 'Test Company Digital Transformation',
        description: lead.message,
        client_id: clientId,
        current_stage: 'idea_collection'
      })
      .select('*')
      .single();
    
    if (projectError) {
      console.error('❌ Error creating project:', projectError);
      return;
    }
    
    console.log('✅ Created project:', project.id);
    
    // Update lead
    console.log('📝 Updating lead status...');
    const { error: leadUpdateError } = await supabase
      .from('leads')
      .update({
        status: 'converted',
        updated_at: new Date().toISOString(),
        converted_to_project_id: project.id
      })
      .eq('id', lead.id);
    
    if (leadUpdateError) {
      console.error('❌ Error updating lead:', leadUpdateError);
      return;
    }
    
    console.log('✅ Lead conversion completed successfully!');
    console.log('📊 Summary:');
    console.log('   Lead ID:', lead.id);
    console.log('   User ID:', clientId);
    console.log('   Project ID:', project.id);
    console.log('   Project Title:', project.title);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testLeadConversion();
