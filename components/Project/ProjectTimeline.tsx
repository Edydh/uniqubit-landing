'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ProjectWithStages, EnhancedProjectWithStages } from '../../lib/types';

interface ProjectTimelineProps {
  project: ProjectWithStages | EnhancedProjectWithStages;
  onStageUpdate?: (stage: string, status: string) => void;
  isAdmin: boolean;
  detailed?: boolean;
}

const stageConfig = {
  idea_collection: {
    name: 'Idea Collection',
    icon: '💡',
    color: 'from-blue-400 to-blue-600',
    description: 'Gathering and refining your project ideas',
    tasks: ['Initial consultation', 'Requirements gathering', 'Project scope definition', 'Timeline planning']
  },
  refinement: {
    name: 'Refinement',
    icon: '🔍',
    color: 'from-purple-400 to-purple-600',
    description: 'Analyzing requirements and technical specifications',
    tasks: ['Technical analysis', 'Architecture planning', 'Design wireframes', 'Resource allocation']
  },
  quote: {
    name: 'Quote',
    icon: '💰',
    color: 'from-yellow-400 to-yellow-600',
    description: 'Preparing detailed project proposal and pricing',
    tasks: ['Cost estimation', 'Timeline refinement', 'Proposal creation', 'Contract preparation']
  },
  agreement: {
    name: 'Agreement',
    icon: '🤝',
    color: 'from-green-400 to-green-600',
    description: 'Finalizing contracts and project agreements',
    tasks: ['Contract review', 'Terms finalization', 'Payment setup', 'Project kickoff']
  },
  development: {
    name: 'Development',
    icon: '⚡',
    color: 'from-neon to-cyan-400',
    description: 'Building your project with cutting-edge technology',
    tasks: ['Development setup', 'Core functionality', 'Testing & QA', 'Client reviews']
  },
  completion: {
    name: 'Completion',
    icon: '🎉',
    color: 'from-emerald-400 to-emerald-600',
    description: 'Final testing, deployment, and handover',
    tasks: ['Final testing', 'Deployment', 'Documentation', 'Training & handover']
  },
  payment: {
    name: 'Payment',
    icon: '✅',
    color: 'from-pink-400 to-pink-600',
    description: 'Project completion and payment processing',
    tasks: ['Final invoice', 'Payment processing', 'Project closure', 'Support transition']
  }
};

export default function ProjectTimeline({ project, onStageUpdate, isAdmin, detailed = false }: ProjectTimelineProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(project.current_stage);

  const stages = Object.entries(stageConfig);
  const currentStageIndex = stages.findIndex(([key]) => key === project.current_stage);

  const getStageStatus = (stageKey: string, index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 border-green-400 bg-green-400/10';
      case 'current':
        return 'text-neon border-neon bg-neon/10';
      default:
        return 'text-gray-400 border-gray-600 bg-gray-400/5';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index < currentStageIndex) return 'bg-green-400';
    if (index === currentStageIndex) return 'bg-gradient-to-b from-green-400 to-neon';
    return 'bg-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Project Timeline</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-neon rounded-full"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {stages.map(([stageKey, stageInfo], index) => {
          const status = getStageStatus(stageKey, index);
          const isExpanded = expandedStage === stageKey;
          
          return (
            <div key={stageKey} className="relative">
              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div 
                  className={`absolute left-6 top-12 w-0.5 h-16 ${getConnectorColor(index)}`}
                />
              )}

              {/* Stage Item */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative mb-4 last:mb-0"
              >
                <div 
                  className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:border-white/20 ${getStageColor(status)}`}
                  onClick={() => setExpandedStage(isExpanded ? null : stageKey)}
                >
                  {/* Stage Icon */}
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all duration-300 ${getStageColor(status)}`}>
                    {status === 'completed' ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : status === 'current' ? (
                      <div className="w-3 h-3 bg-neon rounded-full animate-pulse"></div>
                    ) : (
                      <span className="opacity-50">{stageInfo.icon}</span>
                    )}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{stageInfo.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{stageInfo.description}</p>
                      </div>
                      
                      {/* Stage Actions */}
                      <div className="flex items-center space-x-2">
                        {status === 'current' && isAdmin && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStageUpdate?.(stageKey, 'completed');
                            }}
                            className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-xs"
                          >
                            Mark Complete
                          </motion.button>
                        )}
                        
                        <motion.button
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isExpanded ? 'auto' : 0, 
                    opacity: isExpanded ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="ml-16 mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-medium mb-3">Stage Tasks:</h4>
                    <div className="space-y-2">
                      {stageInfo.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            status === 'completed' || (status === 'current' && taskIndex < 2)
                              ? 'border-green-400 bg-green-400/20'
                              : 'border-gray-600'
                          }`}>
                            {(status === 'completed' || (status === 'current' && taskIndex < 2)) && (
                              <svg className="w-2 h-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${
                            status === 'completed' || (status === 'current' && taskIndex < 2)
                              ? 'text-green-400'
                              : 'text-gray-400'
                          }`}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stage Notes (for future enhancement) */}
                    {status === 'current' && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-neon text-sm font-medium">
                          🚀 Currently in progress - Regular updates will be shared here
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Overall Progress</span>
          <span className="text-neon text-sm font-medium">
            {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-neon to-purple-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
