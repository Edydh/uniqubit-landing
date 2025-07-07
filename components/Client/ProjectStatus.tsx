'use client';

import { motion } from 'framer-motion';
import type { Project, ProjectStage } from '../../lib/types';

interface ProjectStatusProps {
  project: Project;
  className?: string;
}

const stageConfig = {
  idea_collection: {
    name: 'Idea Collection',
    icon: '💡',
    color: 'from-blue-400 to-blue-600',
    description: 'Gathering and refining your project ideas'
  },
  refinement: {
    name: 'Refinement',
    icon: '🔍',
    color: 'from-purple-400 to-purple-600',
    description: 'Analyzing requirements and technical specifications'
  },
  quote: {
    name: 'Quote',
    icon: '💰',
    color: 'from-yellow-400 to-yellow-600',
    description: 'Preparing detailed project proposal and pricing'
  },
  agreement: {
    name: 'Agreement',
    icon: '🤝',
    color: 'from-green-400 to-green-600',
    description: 'Finalizing contracts and project agreements'
  },
  development: {
    name: 'Development',
    icon: '⚡',
    color: 'from-neon to-cyan-400',
    description: 'Building your project with cutting-edge technology'
  },
  completion: {
    name: 'Completion',
    icon: '🎉',
    color: 'from-emerald-400 to-emerald-600',
    description: 'Final testing, deployment, and handover'
  },
  payment: {
    name: 'Payment',
    icon: '✅',
    color: 'from-indigo-400 to-indigo-600',
    description: 'Project completed and payment processing'
  }
};

const stageOrder: ProjectStage[] = [
  'idea_collection',
  'refinement',
  'quote',
  'agreement',
  'development',
  'completion',
  'payment'
];

export default function ProjectStatus({ project, className = '' }: ProjectStatusProps) {
  const currentStageIndex = stageOrder.indexOf(project.current_stage);
  const currentStageConfig = stageConfig[project.current_stage];

  return (
    <div className={`bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentStageConfig.icon}</span>
          <div className="text-right">
            <p className="text-white font-medium">{currentStageConfig.name}</p>
            <p className="text-gray-400 text-sm">Current Stage</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-neon font-medium">
            {Math.round(((currentStageIndex + 1) / stageOrder.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-neon to-purple-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStageIndex + 1) / stageOrder.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Current Stage Info */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentStageConfig.color} flex items-center justify-center`}>
            <span className="text-white text-sm font-bold">{currentStageIndex + 1}</span>
          </div>
          <h4 className="text-white font-semibold">{currentStageConfig.name}</h4>
        </div>
        <p className="text-gray-400 text-sm">{currentStageConfig.description}</p>
      </div>

      {/* Stage Timeline */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-sm mb-3">Project Timeline</h4>
        {stageOrder.map((stage, index) => {
          const config = stageConfig[stage];
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isUpcoming = index > currentStageIndex;

          return (
            <motion.div
              key={stage}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? 'bg-neon/10 border border-neon/20'
                  : isCompleted
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCurrent
                  ? 'bg-gradient-to-r from-neon to-purple-400'
                  : isCompleted
                  ? 'bg-green-500'
                  : 'bg-white/20'
              }`}>
                {isCompleted ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className={`font-medium ${
                    isCurrent ? 'text-neon' : isCompleted ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {config.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{config.description}</p>
              </div>
              {isCurrent && (
                <motion.div
                  className="w-2 h-2 bg-neon rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
