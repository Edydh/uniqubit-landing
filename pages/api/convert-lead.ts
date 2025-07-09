import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Server configuration error - missing service role key' });
  }

  try {
    const { leadId, projectTitle, projectDescription } = req.body;

    console.log('Converting lead to project:', { leadId, projectTitle, projectDescription });
    console.log('Lead ID type:', typeof leadId, 'value:', leadId);

    if (!leadId || !projectTitle || !projectDescription) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { leadId, projectTitle, projectDescription }
      });
    }

    // Get the lead first
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle();

    if (leadError) {
      console.error('Error fetching lead:', leadError);
      return res.status(400).json({ error: 'Database error while fetching lead', details: leadError });
    }

    if (!lead) {
      console.error('Lead not found with id:', leadId);
      return res.status(404).json({ error: 'Lead not found' });
    }

    console.log('Found lead:', lead);

    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('email', lead.email)
      .maybeSingle();

    console.log('User check result:', { existingUser, userCheckError });

    let clientId = existingUser?.id;

    if (!existingUser) {
      console.log('No existing user found for:', lead.email);
      console.log('Creating project without user assignment - user can register later');
      clientId = null; // We'll create the project without a client assignment for now
    } else {
      console.log('Using existing user:', existingUser.id);
    }

    // Create the project
    console.log('Creating project with client_id:', clientId);
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        title: projectTitle,
        description: projectDescription,
        client_id: clientId,
        current_stage: 'idea_collection'
      })
      .select('*')
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      return res.status(500).json({ error: 'Failed to create project', details: projectError });
    }

    console.log('Created project:', project);

    // Update lead status to converted
    const { error: leadUpdateError } = await supabaseAdmin
      .from('leads')
      .update({ 
        status: 'converted',
        updated_at: new Date().toISOString(),
        converted_to_project_id: project.id
      })
      .eq('id', leadId);

    if (leadUpdateError) {
      console.error('Error updating lead:', leadUpdateError);
      return res.status(500).json({ error: 'Failed to update lead', details: leadUpdateError });
    }

    console.log('Successfully converted lead to project');

    res.status(200).json({ 
      success: true, 
      project,
      client_id: clientId,
      message: 'Lead successfully converted to project'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
