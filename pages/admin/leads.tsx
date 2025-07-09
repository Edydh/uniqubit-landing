'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/Admin/AdminLayout';
import LeadsTable from '../../components/Admin/LeadsTable';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User, Lead } from '../../lib/types';

export default function LeadsManagement() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'admin') {
          setUser(result.user);
          await loadLeads();
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

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const handleUpdateStatus = async (leadId: string, status: Lead['status']) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      // Update local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status } : lead
        )
      );
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleConvertToProject = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setSelectedLead(lead);
    setShowConvertModal(true);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const convertLeadToProject = async (projectTitle: string, projectDescription: string) => {
    if (!selectedLead) return;

    try {
      console.log('Converting lead to project:', selectedLead.id);

      const response = await fetch('/api/convert-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: selectedLead.id,
          projectTitle,
          projectDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert lead');
      }

      const result = await response.json();
      console.log('Lead converted successfully:', result);

      // Update lead status in local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === selectedLead.id 
            ? { ...lead, status: 'converted' as const }
            : lead
        )
      );

      setShowConvertModal(false);
      setSelectedLead(null);

      // Show success message or redirect
      alert(`Project "${projectTitle}" created successfully!`);

    } catch (error) {
      console.error('Error converting lead to project:', error);
      alert('Failed to convert lead to project. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leads...</p>
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
      title="Leads Management"
      subtitle="Review and manage incoming leads from your website"
    >
      <div className="space-y-6">
        <LeadsTable
          leads={leads}
          onUpdateStatus={handleUpdateStatus}
          onConvertToProject={handleConvertToProject}
          onViewDetails={handleViewDetails}
        />

        {/* Lead Details Modal */}
        {showDetailsModal && selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Lead Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Name</label>
                  <p className="text-white text-lg">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
                {selectedLead.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Company</label>
                    <p className="text-white">{selectedLead.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-300">Message</label>
                  <div className="bg-white/5 rounded-lg p-4 mt-2">
                    <p className="text-white whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <p className="text-white capitalize">{selectedLead.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Submitted</label>
                  <p className="text-white">
                    {new Date(selectedLead.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Convert to Project Modal */}
        {showConvertModal && selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass max-w-lg w-full"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Convert Lead to Project</h3>
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const description = formData.get('description') as string;
                convertLeadToProject(title, description);
              }}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Client</label>
                    <p className="text-white">{selectedLead.name} ({selectedLead.email})</p>
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      defaultValue={selectedLead.company ? `${selectedLead.company} Project` : 'New Project'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon/50 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      defaultValue={selectedLead.message}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon/50 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowConvertModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-neon to-purple-400 text-black font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Project
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
