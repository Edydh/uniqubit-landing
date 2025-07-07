'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/Admin/AdminLayout';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User, Lead, Project } from '../../lib/types';

interface AdminStats {
  totalLeads: number;
  newLeads: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  pendingTasks: number;
}

export default function AdminDashboardNew() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalLeads: 0,
    newLeads: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalClients: 0,
    pendingTasks: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'admin') {
          setUser(result.user);
          await loadDashboardData();
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

  const loadDashboardData = async () => {
    try {
      // Load leads data
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Load projects data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Load users data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client');

      if (usersError) throw usersError;

      // Calculate stats
      const totalLeads = leadsData?.length || 0;
      const newLeads = leadsData?.filter(lead => lead.status === 'new').length || 0;
      const activeProjects = projectsData?.filter(project => 
        project.current_stage !== 'payment' && project.current_stage !== 'completion'
      ).length || 0;
      const completedProjects = projectsData?.filter(project => 
        project.current_stage === 'completion'
      ).length || 0;
      const totalClients = usersData?.length || 0;

      setStats({
        totalLeads,
        newLeads,
        activeProjects,
        completedProjects,
        totalClients,
        pendingTasks: newLeads + activeProjects, // Simple calculation
      });

      setRecentLeads(leadsData?.slice(0, 5) || []);
      setRecentProjects(projectsData?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-400';
      case 'contacted': return 'text-yellow-400';
      case 'converted': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getProjectStageColor = (stage: string) => {
    switch (stage) {
      case 'idea_collection': return 'text-blue-400';
      case 'refinement': return 'text-purple-400';
      case 'quote': return 'text-yellow-400';
      case 'agreement': return 'text-orange-400';
      case 'development': return 'text-green-400';
      case 'completion': return 'text-emerald-400';
      case 'payment': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout
      currentUser={user}
      title="Admin Dashboard"
      subtitle="Manage your leads, projects, and clients"
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-white">{stats.totalLeads}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Leads</p>
                <p className="text-2xl font-bold text-white">{stats.newLeads}</p>
              </div>
              <div className="p-3 bg-neon/10 rounded-lg">
                <span className="text-2xl">✨</span>
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
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <span className="text-2xl">🚀</span>
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
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <span className="text-2xl">✅</span>
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
                <p className="text-gray-400 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
              </div>
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.pendingTasks}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            onClick={() => router.push('/admin/leads')}
            className="p-4 bg-glass backdrop-blur-xl rounded-lg border border-white/10 shadow-glass hover:border-neon/50 transition-all duration-300 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-white font-medium">Manage Leads</p>
                <p className="text-gray-400 text-sm">Review and convert leads</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/admin/projects')}
            className="p-4 bg-glass backdrop-blur-xl rounded-lg border border-white/10 shadow-glass hover:border-neon/50 transition-all duration-300 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-white font-medium">View Projects</p>
                <p className="text-gray-400 text-sm">Track project progress</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/admin/clients')}
            className="p-4 bg-glass backdrop-blur-xl rounded-lg border border-white/10 shadow-glass hover:border-neon/50 transition-all duration-300 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-white font-medium">Manage Clients</p>
                <p className="text-gray-400 text-sm">View client information</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/admin/analytics')}
            className="p-4 bg-glass backdrop-blur-xl rounded-lg border border-white/10 shadow-glass hover:border-neon/50 transition-all duration-300 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="text-white font-medium">Analytics</p>
                <p className="text-gray-400 text-sm">View performance metrics</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Recent Leads</h3>
                <button
                  onClick={() => router.push('/admin/leads')}
                  className="text-neon hover:text-neon/80 text-sm"
                >
                  View all
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentLeads.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No recent leads</p>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead, index) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-gray-400 text-sm">{lead.email}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(lead.created_at)}</p>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Recent Projects</h3>
                <button
                  onClick={() => router.push('/admin/projects')}
                  className="text-neon hover:text-neon/80 text-sm"
                >
                  View all
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentProjects.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No recent projects</p>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{project.title}</p>
                        <p className="text-gray-400 text-sm truncate">{project.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(project.created_at)}</p>
                      </div>
                      <span className={`text-sm font-medium ${getProjectStageColor(project.current_stage)}`}>
                        {project.current_stage.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
