'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ProjectWithStages, EnhancedProjectWithStages } from '../../lib/types';

interface ProjectHeaderProps {
  project: ProjectWithStages | EnhancedProjectWithStages;
  onStageUpdate?: (stage: string, status: string) => void;
  isAdmin: boolean;
  onEdit?: () => void;
}

const stageConfig = {
  idea_collection: {
    name: 'Idea Collection',
    icon: '💡',
    color: 'from-blue-400 to-blue-600',
    description: 'Gathering and refining project ideas'
  },
  refinement: {
    name: 'Refinement',
    icon: '🔍',
    color: 'from-purple-400 to-purple-600',
    description: 'Analyzing requirements and specifications'
  },
  quote: {
    name: 'Quote',
    icon: '💰',
    color: 'from-yellow-400 to-yellow-600',
    description: 'Preparing detailed proposal and pricing'
  },
  agreement: {
    name: 'Agreement',
    icon: '🤝',
    color: 'from-green-400 to-green-600',
    description: 'Finalizing contracts and agreements'
  },
  development: {
    name: 'Development',
    icon: '⚡',
    color: 'from-neon to-cyan-400',
    description: 'Building your project'
  },
  completion: {
    name: 'Completion',
    icon: '🎉',
    color: 'from-emerald-400 to-emerald-600',
    description: 'Final testing and deployment'
  },
  payment: {
    name: 'Payment',
    icon: '✅',
    color: 'from-pink-400 to-pink-600',
    description: 'Project completion and payment'
  }
};

export default function ProjectHeader({ project, onStageUpdate, isAdmin }: ProjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);

  const currentStageInfo = stageConfig[project.current_stage as keyof typeof stageConfig];

  const handleTitleSave = () => {
    // TODO: Implement title update
    setIsEditing(false);
  };

  const getStatusColor = (stage: string) => {
    // This would be enhanced with actual stage status logic
    if (stage === project.current_stage) return 'text-neon';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass overflow-hidden"
    >
      {/* Header Background */}
      <div className={`bg-gradient-to-r ${currentStageInfo.color} p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Project Title */}
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{currentStageInfo.icon}</span>
                {isEditing && isAdmin ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xl font-bold flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
                      autoFocus
                    />
                    <button
                      onClick={handleTitleSave}
                      className="px-3 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 flex-1">
                    <h1 className="text-2xl font-bold text-white">{project.title}</h1>
                    {isAdmin && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Current Stage Info */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                  {currentStageInfo.name}
                </span>
                <span className="text-white/80 text-sm">
                  {currentStageInfo.description}
                </span>
              </div>

              {/* Project Meta */}
              <div className="flex items-center space-x-6 text-white/80 text-sm">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Started {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
                {!isAdmin && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Client: {project.client?.full_name || project.client?.email || 'Unknown'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  Edit Project
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  Export Report
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <div className="p-6 border-t border-white/10">
          <p className="text-gray-300 leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon">7</div>
            <div className="text-gray-400 text-sm">Total Stages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Object.keys(stageConfig).indexOf(project.current_stage) + 1}
            </div>
            <div className="text-gray-400 text-sm">Current Stage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(((Object.keys(stageConfig).indexOf(project.current_stage) + 1) / 7) * 100)}%
            </div>
            <div className="text-gray-400 text-sm">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {/* This will be enhanced with actual message count */}
              {project.stages?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Updates</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
