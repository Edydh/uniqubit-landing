'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ProjectHeader from '../../../components/Project/ProjectHeader';
import { getCurrentUser } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { enhancedProjectService, projectMessageService } from '../../../lib/services/enhancedProjectService';
import type { User, EnhancedProjectWithStages, ProjectMessage } from '../../../lib/types';

// Temporary stub components to resolve TypeScript import errors
const ProjectTimeline = ({ project, onStageUpdate, isAdmin }: any) => (
  <div className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6">
    <h3 className="text-lg font-bold text-white mb-4">Project Timeline</h3>
    <p className="text-gray-400">Timeline component will be implemented here.</p>
    <div className="mt-4 space-y-2">
      <div className="text-sm text-gray-300">Current Stage: {project?.current_stage || 'Not set'}</div>
      <div className="text-sm text-gray-300">Status: {project?.status || 'Not set'}</div>
    </div>
  </div>
);

const ProjectComments = ({ messages, currentUser, onSendMessage, projectId, isAdmin }: any) => (
  <div className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6">
    <h3 className="text-lg font-bold text-white mb-4">Project Comments</h3>
    <p className="text-gray-400 mb-4">Comments component will be implemented here.</p>
    <div className="space-y-3">
      {messages?.length > 0 ? (
        messages.map((msg: any, idx: number) => (
          <div key={idx} className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-300">
              {msg.sender?.full_name || 'Unknown'}: {msg.content}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No messages yet.</p>
      )}
    </div>
  </div>
);

const ProjectMetrics = ({ project, isAdmin }: any) => (
  <div className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6">
    <h3 className="text-lg font-bold text-white mb-4">Project Metrics</h3>
    <p className="text-gray-400 mb-4">Metrics component will be implemented here.</p>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-400">Budget:</span>
        <span className="text-white">${project?.budget || 0}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Progress:</span>
        <span className="text-neon">{project?.current_stage || 'N/A'}</span>
      </div>
    </div>
  </div>
);

const ProjectFiles = ({ project, isAdmin, onFileUpload, onFileDelete }: any) => (
  <div className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6">
    <h3 className="text-lg font-bold text-white mb-4">Project Files</h3>
    <p className="text-gray-400">Files component will be implemented here.</p>
    <div className="mt-4">
      <p className="text-sm text-gray-300">File management functionality coming soon.</p>
    </div>
  </div>
);

export default function AdminProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<EnhancedProjectWithStages | null>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'admin') {
          setUser(result.user);
          if (id) {
            await loadProjectData(id as string);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, id]);

  const loadProjectData = async (projectId: string) => {
    try {
      setIsLoading(true);
      
      // Load project with client information
      const { data: projectData, error: projectError } = await supabase
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
          )
        `)
        .eq('id', projectId)
        .single();

      if (projectError) {
        throw projectError;
      }

      if (!projectData) {
        setError('Project not found');
        return;
      }

      // Load project stages (for future use)
      const { data: stagesData, error: stagesError } = await supabase
        .from('project_stages')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index');

      // Load messages with sender information
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            email,
            full_name,
            role,
            created_at,
            updated_at
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      // Transform the data to match our enhanced types
      const enhancedProject: EnhancedProjectWithStages = {
        ...projectData,
        project_type_id: undefined,
        estimated_completion: undefined,
        actual_completion: undefined,
        total_budget: projectData.budget,
        currency: 'USD',
        priority: 'normal',
        metadata: {},
        client: projectData.client,
        stages: stagesData || [],
        files: [],
        messages: []
      };

      setProject(enhancedProject);
      setMessages((messagesData || []).map((msg: any) => ({
        ...msg,
        message_type: 'comment',
        attachments: msg.attachments || [],
        seen_by: [],
        reply_to: undefined,
        updated_at: msg.created_at,
        sender: msg.sender
      })));

    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageUpdate = async (stage: string, status: string) => {
    if (!project) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          current_stage: stage,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      // Reload project data
      await loadProjectData(project.id);
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!project || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          project_id: project.id,
          sender_id: user.id,
          content,
          attachments: []
        });

      if (error) throw error;

      // Reload messages
      await loadProjectData(project.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentUser={null}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !project || !user) {
    return (
      <AdminLayout currentUser={null}>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The requested project could not be found.'}</p>
          <Link 
            href="/admin/projects"
            className="px-6 py-3 bg-gradient-to-r from-neon to-purple-400 text-black font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
          >
            Back to Projects
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentUser={user}>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400">
          <Link href="/admin/dashboard" className="hover:text-neon transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/admin/projects" className="hover:text-neon transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-white">{project.title}</span>
        </nav>

        {/* Project Header */}
        <ProjectHeader 
          project={project} 
          onStageUpdate={handleStageUpdate}
          isAdmin={true}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Timeline */}
            <ProjectTimeline 
              project={project}
              onStageUpdate={handleStageUpdate}
              isAdmin={true}
            />

            {/* Project Comments/Messages */}
            <ProjectComments 
              messages={messages}
              currentUser={user}
              onSendMessage={handleSendMessage}
              projectId={project.id}
              isAdmin={true}
            />

            {/* Project Files */}
            <ProjectFiles 
              project={project}
              isAdmin={true}
              onFileUpload={(file: File, stage: string) => {
                // TODO: Implement file upload functionality
                console.log('File upload:', file.name, stage);
              }}
              onFileDelete={(fileId: string) => {
                // TODO: Implement file deletion functionality
                console.log('File delete:', fileId);
              }}
            />
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Project Metrics */}
            <ProjectMetrics 
              project={project}
              isAdmin={true}
            />

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStageUpdate(project.current_stage, 'completed')}
                  className="w-full px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm"
                >
                  Mark Stage Complete
                </button>
                <button
                  className="w-full px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
                >
                  Generate Report
                </button>
                <button
                  className="w-full px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                >
                  Send Update
                </button>
              </div>
            </motion.div>

            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Client Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{project.client?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{project.client?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Client Since</p>
                  <p className="text-white">
                    {project.client?.created_at ? new Date(project.client.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
