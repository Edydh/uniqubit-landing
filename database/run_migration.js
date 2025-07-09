const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Starting Enhanced Database Schema Migration...');
  
  try {
    // Read the enhanced schema SQL file
    const schemaPath = path.join(__dirname, 'enhanced_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Running enhanced schema migration...');
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: schemaSql
    });
    
    if (schemaError) {
      // If RPC doesn't work, try direct query execution
      console.log('📋 Attempting direct schema execution...');
      const statements = schemaSql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.from('_').select('*').limit(0);
          // This is a workaround - in a real scenario, you'd use a proper migration tool
          console.log('⚠️  Note: Direct SQL execution not available in browser client');
          console.log('Please run the SQL files manually in your Supabase dashboard:');
          console.log('1. database/enhanced_schema.sql');
          console.log('2. database/seed_data.sql');
          return;
        }
      }
    }
    
    console.log('✅ Enhanced schema migration completed');
    
    // Read and run the seed data
    const seedPath = path.join(__dirname, 'seed_data.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    
    console.log('🌱 Running seed data...');
    const { error: seedError } = await supabase.rpc('exec_sql', {
      sql: seedSql
    });
    
    if (seedError) {
      console.log('⚠️  Seed data needs to be run manually');
    } else {
      console.log('✅ Seed data completed');
    }
    
    // Verify the migration
    console.log('🔍 Verifying migration...');
    
    // Check if project_types table exists and has data
    const { data: projectTypes, error: typesError } = await supabase
      .from('project_types')
      .select('name')
      .limit(5);
      
    if (!typesError && projectTypes) {
      console.log(`✅ Found ${projectTypes.length} project types:`);
      projectTypes.forEach(type => console.log(`   - ${type.name}`));
    }
    
    // Check if new columns were added to projects table
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, project_type_id, priority')
      .limit(1);
      
    if (!projectsError) {
      console.log('✅ Projects table enhanced successfully');
    }
    
    console.log('🎉 Enhanced Database Schema Migration Complete!');
    console.log('📊 New features available:');
    console.log('   - Project types and templates');
    console.log('   - Enhanced project stages');
    console.log('   - File management system');
    console.log('   - Advanced messaging');
    console.log('   - Notifications system');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Manual migration instructions
function showManualInstructions() {
  console.log('\n📋 MANUAL MIGRATION INSTRUCTIONS:');
  console.log('1. Open your Supabase dashboard');
  console.log('2. Go to SQL Editor');
  console.log('3. Run the following files in order:');
  console.log('   a) database/enhanced_schema.sql');
  console.log('   b) database/seed_data.sql');
  console.log('4. Verify tables are created successfully');
  console.log('\n✨ Once complete, your database will support:');
  console.log('   - Project types with stage templates');
  console.log('   - Enhanced project stages tracking');
  console.log('   - File management with metadata');
  console.log('   - Threaded project messaging');
  console.log('   - Real-time notifications');
}

if (require.main === module) {
  runMigration().then(() => {
    showManualInstructions();
    process.exit(0);
  });
}

module.exports = { runMigration };
