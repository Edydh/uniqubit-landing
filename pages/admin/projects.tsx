'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/Admin/AdminLayout';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User, Project, ProjectStage } from '../../lib/types';

interface ProjectFilters {
  status: string;
  stage: string;
  search: string;
}

export default function AdminProjects() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    status: 'all',
    stage: 'all',
    search: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'admin') {
          setUser(result.user);
          await loadProjects();
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

  useEffect(() => {
    filterProjects();
  }, [projects, filters]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!projects_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by stage
    if (filters.stage !== 'all') {
      filtered = filtered.filter(project => project.current_stage === filters.stage);
    }

    // Filter by status (active/completed)
    if (filters.status === 'active') {
      filtered = filtered.filter(project => 
        project.current_stage !== 'completion' && project.current_stage !== 'payment'
      );
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(project => 
        project.current_stage === 'completion' || project.current_stage === 'payment'
      );
    }

    setFilteredProjects(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea_collection': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'refinement': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'quote': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'agreement': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'development': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completion': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'payment': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStageLabel = (stage: string) => {
    return stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const updateProjectStage = async (projectId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: newStage })
        .eq('id', projectId);

      if (error) throw error;
      await loadProjects();
    } catch (error) {
      console.error('Error updating project stage:', error);
    }
  };

  const stages = [
    'idea_collection',
    'refinement',
    'quote',
    'agreement',
    'development',
    'completion',
    'payment'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
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
      title="Project Management"
      subtitle="Track and manage all client projects"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-64 bg-glass backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-neon/50"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-glass backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filters.stage}
              onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
              className="bg-glass backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon/50"
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{getStageLabel(stage)}</option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-neon to-purple-400 text-black font-medium rounded-lg shadow-lg hover:shadow-neon/25 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">+</span>
            Create Project
          </motion.button>
        </div>

        {/* Projects Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.current_stage !== 'completion' && p.current_stage !== 'payment').length}
                </p>
              </div>
              <span className="text-2xl">🚀</span>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Development</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.current_stage === 'development').length}
                </p>
              </div>
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.current_stage === 'completion' || p.current_stage === 'payment').length}
                </p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">
              Projects ({filteredProjects.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Project</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Client</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Stage</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Budget</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{project.title}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">{project.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{project.users?.full_name || 'Unknown'}</p>
                        <p className="text-gray-400 text-sm">{project.users?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={project.current_stage}
                        onChange={(e) => updateProjectStage(project.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm border font-medium ${getStageColor(project.current_stage)} bg-transparent`}
                      >
                        {stages.map(stage => (
                          <option key={stage} value={stage} className="bg-dark-800 text-white">
                            {getStageLabel(stage)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-mono">
                        ${project.budget?.toLocaleString() || 'TBD'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400 text-sm">{formatDate(project.created_at)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => setSelectedProject(project)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => router.push(`/admin/projects/${project.id}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No projects found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters or create a new project</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300">{selectedProject.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Current Stage</h4>
                  <span className={`px-3 py-1 rounded-full text-sm border font-medium ${getStageColor(selectedProject.current_stage)}`}>
                    {getStageLabel(selectedProject.current_stage)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Budget</h4>
                  <p className="text-white font-mono">${selectedProject.budget?.toLocaleString() || 'TBD'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Created</h4>
                  <p className="text-white">{formatDate(selectedProject.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h4>
                  <p className="text-white">{formatDate(selectedProject.updated_at)}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => router.push(`/admin/projects/${selectedProject.id}`)}
                  className="px-6 py-2 bg-gradient-to-r from-neon to-purple-400 text-black font-medium rounded-lg shadow-lg hover:shadow-neon/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Manage Project
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
