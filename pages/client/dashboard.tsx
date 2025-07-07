'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../../lib/auth';
import ClientLayout from '../../components/Client/ClientLayout';
import ProjectStatus from '../../components/Client/ProjectStatus';
import MessageCenter from '../../components/Client/MessageCenter';
import type { User, Project, MessageWithSender } from '../../lib/types';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user) {
          setUser(result.user);
          // TODO: Load user's projects and messages
          loadUserData(result.user.id);
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
  }, [router]);

  const loadUserData = async (userId: string) => {
    // TODO: Implement API calls to load projects and messages
    // For now, using mock data
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce solution with AI-powered recommendations',
        client_id: userId,
        current_stage: 'development',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
      },
      {
        id: '2',
        title: 'Mobile App Development',
        description: 'Cross-platform mobile application for iOS and Android',
        client_id: userId,
        current_stage: 'refinement',
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-18T14:20:00Z',
      },
    ];

    const mockMessages: MessageWithSender[] = [
      {
        id: '1',
        project_id: '1',
        sender_id: 'admin-1',
        content: 'Welcome to your project! We\'re excited to work with you on this e-commerce platform. Our team has reviewed your requirements and we\'re ready to begin the development phase.',
        attachments: [],
        created_at: '2024-01-20T10:00:00Z',
        sender: {
          id: 'admin-1',
          email: 'admin@uniqubit.ca',
          full_name: 'uniQubit Team',
          role: 'admin',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
      {
        id: '2',
        project_id: '1',
        sender_id: userId,
        content: 'Thank you for the update! I\'m excited to see the progress. When can we expect the first milestone to be completed?',
        attachments: [],
        created_at: '2024-01-20T11:30:00Z',
        sender: user || {
          id: userId,
          email: 'client@example.com',
          full_name: 'Client User',
          role: 'client',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
    ];

    setProjects(mockProjects);
    setMessages(mockMessages);
  };

  const handleSendMessage = async (content: string) => {
    // TODO: Implement API call to send message
    console.log('Sending message:', content);
    
    // Mock adding the message to the list
    if (user) {
      const newMessage: MessageWithSender = {
        id: Date.now().toString(),
        project_id: projects[0]?.id || '1',
        sender_id: user.id,
        content,
        attachments: [],
        created_at: new Date().toISOString(),
        sender: user,
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ClientLayout user={user}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.full_name?.split(' ')[0] || 'Client'}! 👋
          </h1>
          <p className="text-gray-400">
            Here's an overview of your projects and recent activity with uniQubit.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="p-3 bg-neon/10 rounded-lg">
                <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Messages</p>
                <p className="text-2xl font-bold text-white">{messages.length}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.current_stage === 'development').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.current_stage === 'payment').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Status - Takes up 2 columns */}
          <div className="lg:col-span-2">
            {projects.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ProjectStatus project={projects[0]} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-8 text-center"
              >
                <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Active Projects</h3>
                <p className="text-gray-400 mb-4">
                  You don't have any active projects yet. Get started by contacting us about your next project!
                </p>
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-neon to-purple-400 text-black font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/#contact')}
                >
                  Start New Project
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Message Center - Takes up 1 column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <MessageCenter
                messages={messages}
                currentUser={user}
                onSendMessage={handleSendMessage}
              />
            </motion.div>
          </div>
        </div>

        {/* Additional Projects */}
        {projects.length > 1 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Other Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.slice(1).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <ProjectStatus project={project} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
