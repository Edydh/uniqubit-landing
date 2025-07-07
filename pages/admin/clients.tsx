'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/Admin/AdminLayout';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User, Project } from '../../lib/types';

interface ClientWithProjects extends User {
  projects: Project[];
  projectCount: number;
  activeProjects: number;
  totalValue: number;
}

export default function AdminClients() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<ClientWithProjects[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientWithProjects[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientWithProjects | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'admin') {
          setUser(result.user);
          await loadClients();
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
    filterClients();
  }, [clients, searchTerm]);

  const loadClients = async () => {
    try {
      // Get all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Get all projects for these clients
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .in('user_id', clientsData?.map(c => c.id) || []);

      if (projectsError) throw projectsError;

      // Combine client data with project info
      const clientsWithProjects = clientsData?.map(client => {
        const clientProjects = projectsData?.filter(p => p.user_id === client.id) || [];
        const activeProjects = clientProjects.filter(p => 
          p.current_stage !== 'completion' && p.current_stage !== 'payment'
        ).length;
        const totalValue = clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

        return {
          ...client,
          projects: clientProjects,
          projectCount: clientProjects.length,
          activeProjects,
          totalValue
        };
      }) || [];

      setClients(clientsWithProjects);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const filterClients = () => {
    if (!searchTerm) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredClients(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getClientStatus = (client: ClientWithProjects) => {
    if (client.activeProjects > 0) return 'Active';
    if (client.projectCount > 0) return 'Previous';
    return 'New';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Previous': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'New': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const sendMessage = async (clientId: string) => {
    // This would open a messaging modal or redirect to messaging
    console.log('Send message to client:', clientId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-400">Loading clients...</p>
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
      title="Client Management"
      subtitle="Manage your client relationships and projects"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-glass backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-neon/50"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <motion.button
            onClick={() => router.push('/admin/leads')}
            className="px-6 py-3 bg-gradient-to-r from-neon to-purple-400 text-black font-medium rounded-lg shadow-lg hover:shadow-neon/25 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">🎯</span>
            Convert Leads
          </motion.button>
        </div>

        {/* Client Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-white">{clients.length}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Clients</p>
                <p className="text-2xl font-bold text-white">
                  {clients.filter(c => c.activeProjects > 0).length}
                </p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">
                  {clients.reduce((sum, c) => sum + c.projectCount, 0)}
                </p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  ${clients.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
                </p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass overflow-hidden hover:border-neon/30 transition-all duration-300"
              whileHover={{ y: -5 }}
              layout
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-lg">
                        {client.full_name?.[0] || client.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{client.full_name || 'Unknown'}</h3>
                      <p className="text-gray-400 text-sm">{client.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border font-medium ${getStatusColor(getClientStatus(client))}`}>
                    {getClientStatus(client)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Projects</span>
                    <span className="text-white font-medium">{client.projectCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Active</span>
                    <span className="text-green-400 font-medium">{client.activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total Value</span>
                    <span className="text-white font-mono">${client.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Member Since</span>
                    <span className="text-white text-sm">{formatDate(client.created_at)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setSelectedClient(client)}
                    className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    onClick={() => sendMessage(client.id)}
                    className="px-3 py-2 bg-neon/10 hover:bg-neon/20 text-neon rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No clients found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-neon to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xl">
                      {selectedClient.full_name?.[0] || selectedClient.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedClient.full_name || 'Unknown'}</h3>
                    <p className="text-gray-400">{selectedClient.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{selectedClient.projectCount}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-green-400">{selectedClient.activeProjects}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-white">${selectedClient.totalValue.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-xl font-bold text-white">{formatDate(selectedClient.created_at)}</p>
                </div>
              </div>

              {/* Projects List */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Projects</h4>
                {selectedClient.projects.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No projects yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedClient.projects.map((project) => (
                      <div key={project.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="text-white font-medium">{project.title}</h5>
                            <p className="text-gray-400 text-sm">{project.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-gray-500 text-xs">{formatDate(project.created_at)}</span>
                              <span className="text-gray-500 text-xs">
                                Budget: ${project.budget?.toLocaleString() || 'TBD'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs border font-medium ${
                              project.current_stage === 'completion' || project.current_stage === 'payment'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {project.current_stage.replace('_', ' ')}
                            </span>
                            <motion.button
                              onClick={() => router.push(`/admin/projects/${project.id}`)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => sendMessage(selectedClient.id)}
                  className="px-6 py-2 bg-gradient-to-r from-neon to-purple-400 text-black font-medium rounded-lg shadow-lg hover:shadow-neon/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Send Message
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
