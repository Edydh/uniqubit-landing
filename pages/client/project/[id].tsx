'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ClientLayout from '../../../components/Client/ClientLayout';
import ProjectHeader from '../../../components/Project/ProjectHeader';
import ProjectFiles from '../../../components/Project/ProjectFiles';
import { getCurrentUser } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import type { User, Project, ProjectWithStages, MessageWithSender } from '../../../lib/types';

// Temporary stub components to fix TypeScript errors
const ProjectTimeline = ({ project, onStageUpdate, isAdmin }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
  >
    <h3 className="text-lg font-bold text-white mb-4">Project Timeline</h3>
    <p className="text-gray-400">Timeline view coming soon...</p>
  </motion.div>
);

const ProjectComments = ({ messages, currentUser, onSendMessage, projectId, isAdmin }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
  >
    <h3 className="text-lg font-bold text-white mb-4">Project Communication</h3>
    <div className="space-y-4">
      {messages?.map((message: any) => (
        <div key={message.id} className="p-3 bg-white/5 rounded-lg">
          <p className="text-gray-300 text-sm">{message.content}</p>
          <p className="text-gray-500 text-xs mt-1">
            {message.sender?.full_name} - {new Date(message.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      <div className="mt-4">
        <textarea
          placeholder="Type your message..."
          className="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-white resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const target = e.target as HTMLTextAreaElement;
              if (target.value.trim()) {
                onSendMessage(target.value);
                target.value = '';
              }
            }
          }}
        />
        <p className="text-gray-500 text-xs mt-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  </motion.div>
);

const ProjectMetrics = ({ project, isAdmin }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
  >
    <h3 className="text-lg font-bold text-white mb-4">Project Metrics</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-400">Status</span>
        <span className="text-neon capitalize">{project.current_stage.replace('_', ' ')}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Progress</span>
        <span className="text-white">In Progress</span>
      </div>
    </div>
  </motion.div>
);

export default function ClientProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectWithStages | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'client') {
          setUser(result.user);
          if (id) {
            await loadProjectData(id as string, result.user.id);
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

  const loadProjectData = async (projectId: string, userId: string) => {
    try {
      setIsLoading(true);
      
      // Load project and verify client ownership
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
        .eq('client_id', userId)
        .single();

      if (projectError) {
        throw projectError;
      }

      if (!projectData) {
        setError('Project not found or access denied');
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

      // Transform the data to match our types
      const projectWithStages: ProjectWithStages = {
        ...projectData,
        client: projectData.client,
        stages: stagesData || []
      };

      setProject(projectWithStages);
      setMessages(messagesData || []);

    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project data');
    } finally {
      setIsLoading(false);
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
      await loadProjectData(project.id, user.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <ClientLayout user={null}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your project...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error || !project || !user) {
    return (
      <ClientLayout user={null}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Project Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The requested project could not be found.'}</p>
            <Link 
              href="/client/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-neon to-purple-400 text-black font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout user={user}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/client/dashboard" className="hover:text-neon transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white">{project.title}</span>
          </nav>

          {/* Project Header */}
          <ProjectHeader 
            project={project} 
            onStageUpdate={() => {}} // Clients can't update stages
            isAdmin={false}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Timeline */}
              <ProjectTimeline 
                project={project}
                onStageUpdate={() => {}} // Clients can't update stages
                isAdmin={false}
              />

              {/* Project Comments/Messages */}
              <ProjectComments 
                messages={messages}
                currentUser={user}
                onSendMessage={handleSendMessage}
                projectId={project.id}
                isAdmin={false}
              />

              {/* Project Files */}
              <ProjectFiles 
                project={project}
                isAdmin={false}
              />
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-6">
              {/* Project Metrics */}
              <ProjectMetrics 
                project={project}
                isAdmin={false}
              />

              {/* Project Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Project Type</p>
                    <p className="text-white capitalize">
                      {project.current_stage.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Started</p>
                    <p className="text-white">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Last Updated</p>
                    <p className="text-white">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Help & Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    Have questions about your project? Our team is here to help!
                  </p>
                  <button
                    onClick={() => {
                      const helpMessage = "Hi! I have a question about my project and would love some assistance. Could you please help me understand the next steps?";
                      handleSendMessage(helpMessage);
                    }}
                    className="w-full px-4 py-2 bg-neon/10 border border-neon/20 text-neon rounded-lg hover:bg-neon/20 transition-colors text-sm"
                  >
                    Ask a Question
                  </button>
                  <button
                    className="w-full px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
                  >
                    Schedule Call
                  </button>
                </div>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">What's Next?</h3>
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    Based on your current project stage, here's what to expect:
                  </p>
                  <div className="p-3 bg-neon/5 border border-neon/20 rounded-lg">
                    <p className="text-neon text-sm font-medium">
                      {project.current_stage === 'development' 
                        ? 'We\'re actively building your project. Regular updates will be shared here.'
                        : project.current_stage === 'completion'
                        ? 'Your project is in final review. Final deliverables coming soon!'
                        : 'Our team is working on the next milestone for your project.'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
