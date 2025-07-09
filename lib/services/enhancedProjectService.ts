// Enhanced Project Services for Phase 2.1
// Database operations for project types, stages, files, and notifications

import { supabase } from '../supabase';
import type { 
  ProjectType, 
  ProjectStageRecord, 
  ProjectFile, 
  ProjectMessage, 
  Notification,
  EnhancedProject,
  EnhancedProjectWithStages 
} from '../types';

// Project Types Service
export const projectTypeService = {
  // Get all active project types
  async getAll(): Promise<ProjectType[]> {
    const { data, error } = await supabase
      .from('project_types')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Get project type by ID
  async getById(id: string): Promise<ProjectType | null> {
    const { data, error } = await supabase
      .from('project_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new project type (admin only)
  async create(projectType: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectType> {
    const { data, error } = await supabase
      .from('project_types')
      .insert(projectType)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update project type (admin only)
  async update(id: string, updates: Partial<ProjectType>): Promise<ProjectType> {
    const { data, error } = await supabase
      .from('project_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Project Stages Service
export const projectStageService = {
  // Get all stages for a project
  async getByProjectId(projectId: string): Promise<ProjectStageRecord[]> {
    const { data, error } = await supabase
      .from('project_stages')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');
    
    if (error) throw error;
    return data || [];
  },

  // Create stages from project type template
  async createFromTemplate(projectId: string, projectTypeId: string): Promise<ProjectStageRecord[]> {
    // Get the project type template
    const projectType = await projectTypeService.getById(projectTypeId);
    if (!projectType) throw new Error('Project type not found');

    // Create stages based on template
    const stagesToCreate = projectType.default_stages.map((template, index) => ({
      project_id: projectId,
      name: template.name,
      description: template.description,
      order_index: index,
      status: index === 0 ? 'in_progress' : 'pending' as const,
      estimated_hours: template.estimated_hours,
      deliverables: template.deliverables
    }));

    const { data, error } = await supabase
      .from('project_stages')
      .insert(stagesToCreate)
      .select();
    
    if (error) throw error;
    return data || [];
  },

  // Update stage status
  async updateStatus(
    stageId: string, 
    status: ProjectStageRecord['status'],
    userId?: string
  ): Promise<ProjectStageRecord> {
    const updates: Partial<ProjectStageRecord> = { status };
    
    if (status === 'in_progress' && !updates.started_at) {
      updates.started_at = new Date().toISOString();
    }
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      if (userId) {
        updates.approved_by = userId;
        updates.approved_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('project_stages')
      .update(updates)
      .eq('id', stageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Add actual hours to a stage
  async updateHours(stageId: string, actualHours: number): Promise<ProjectStageRecord> {
    const { data, error } = await supabase
      .from('project_stages')
      .update({ actual_hours: actualHours })
      .eq('id', stageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Project Files Service
export const projectFileService = {
  // Get files for a project
  async getByProjectId(projectId: string): Promise<ProjectFile[]> {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get files for a specific stage
  async getByStageId(stageId: string): Promise<ProjectFile[]> {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('stage_id', stageId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Upload a new file (metadata only - actual file upload handled separately)
  async create(file: Omit<ProjectFile, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectFile> {
    const { data, error } = await supabase
      .from('project_files')
      .insert(file)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update file metadata
  async update(fileId: string, updates: Partial<ProjectFile>): Promise<ProjectFile> {
    const { data, error } = await supabase
      .from('project_files')
      .update(updates)
      .eq('id', fileId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a file
  async delete(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId);
    
    if (error) throw error;
  }
};

// Project Messages Service
export const projectMessageService = {
  // Get messages for a project
  async getByProjectId(projectId: string): Promise<ProjectMessage[]> {
    const { data, error } = await supabase
      .from('project_messages')
      .select(`
        *,
        sender:sender_id (
          id,
          email,
          full_name,
          role
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get messages for a specific stage
  async getByStageId(stageId: string): Promise<ProjectMessage[]> {
    const { data, error } = await supabase
      .from('project_messages')
      .select(`
        *,
        sender:sender_id (
          id,
          email,
          full_name,
          role
        )
      `)
      .eq('stage_id', stageId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Send a new message
  async create(message: Omit<ProjectMessage, 'id' | 'created_at' | 'updated_at' | 'sender'>): Promise<ProjectMessage> {
    const { data, error } = await supabase
      .from('project_messages')
      .insert(message)
      .select(`
        *,
        sender:sender_id (
          id,
          email,
          full_name,
          role
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark messages as seen
  async markAsSeen(messageIds: string[], userId: string): Promise<void> {
    for (const messageId of messageIds) {
      // Get current seen_by array
      const { data: message, error: fetchError } = await supabase
        .from('project_messages')
        .select('seen_by')
        .eq('id', messageId)
        .single();
      
      if (fetchError) continue;
      
      const seenBy = message.seen_by || [];
      if (!seenBy.includes(userId)) {
        seenBy.push(userId);
        
        await supabase
          .from('project_messages')
          .update({ seen_by: seenBy })
          .eq('id', messageId);
      }
    }
  }
};

// Notifications Service
export const notificationService = {
  // Get notifications for a user
  async getByUserId(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get unread notifications count
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null);
    
    if (error) throw error;
    return count || 0;
  },

  // Create a new notification
  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);
    
    if (error) throw error;
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);
    
    if (error) throw error;
  }
};

// Enhanced Projects Service
export const enhancedProjectService = {
  // Get enhanced project with all related data
  async getById(projectId: string): Promise<EnhancedProjectWithStages | null> {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        client:client_id (
          id,
          email,
          full_name,
          role,
          created_at,
          updated_at
        ),
        project_type:project_type_id (
          id,
          name,
          description,
          default_stages,
          estimated_duration_weeks,
          base_price_range
        )
      `)
      .eq('id', projectId)
      .single();
    
    if (projectError) throw projectError;
    if (!project) return null;

    // Get stages
    const stages = await projectStageService.getByProjectId(projectId);
    
    // Get files
    const files = await projectFileService.getByProjectId(projectId);
    
    // Get messages
    const messages = await projectMessageService.getByProjectId(projectId);

    return {
      ...project,
      stages,
      files,
      messages
    };
  },

  // Create a new enhanced project
  async create(
    projectData: Omit<EnhancedProject, 'id' | 'created_at' | 'updated_at'>,
    createStages = true
  ): Promise<EnhancedProjectWithStages> {
    // Create the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    if (projectError) throw projectError;

    // Create stages if requested and project type is specified
    let stages: ProjectStageRecord[] = [];
    if (createStages && projectData.project_type_id) {
      stages = await projectStageService.createFromTemplate(project.id, projectData.project_type_id);
    }

    return {
      ...project,
      stages,
      files: [],
      messages: []
    };
  },

  // Update project with enhanced data
  async update(projectId: string, updates: Partial<EnhancedProject>): Promise<EnhancedProject> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select(`
        *,
        client:client_id (
          id,
          email,
          full_name,
          role,
          created_at,
          updated_at
        ),
        project_type:project_type_id (
          id,
          name,
          description,
          default_stages,
          estimated_duration_weeks,
          base_price_range
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  }
};
