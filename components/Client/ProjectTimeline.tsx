'use client';

import { motion } from 'framer-motion';
import type { Project, ProjectStageRecord } from '../../lib/types';

interface ProjectTimelineProps {
  project: Project;
  stages: ProjectStageRecord[];
  className?: string;
}

const stageConfig = {
  idea_collection: {
    name: 'Idea Collection',
    icon: '💡',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  refinement: {
    name: 'Refinement',
    icon: '🔍',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  quote: {
    name: 'Quote',
    icon: '💰',
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  agreement: {
    name: 'Agreement',
    icon: '🤝',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  development: {
    name: 'Development',
    icon: '⚡',
    color: 'from-neon to-cyan-400',
    bgColor: 'bg-neon/10',
    borderColor: 'border-neon/20'
  },
  completion: {
    name: 'Completion',
    icon: '🎉',
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  payment: {
    name: 'Payment',
    icon: '✅',
    color: 'from-indigo-400 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20'
  }
};

export default function ProjectTimeline({ project, stages, className = '' }: ProjectTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Project Timeline</h3>
          <p className="text-gray-400 text-sm">Track the progress of your project stages</p>
        </div>
        <div className="text-right">
          <p className="text-white font-medium">{project.title}</p>
          <p className="text-gray-400 text-sm">
            Started {formatDate(project.created_at)}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const config = stageConfig[stage.stage_name];
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in_progress';
          const isPending = stage.status === 'pending';

          return (
            <motion.div
              key={stage.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline Line */}
              {index < stages.length - 1 && (
                <div className="absolute left-4 top-12 w-0.5 h-16 bg-white/10" />
              )}

              {/* Stage Card */}
              <div className={`relative flex items-start space-x-4 p-4 rounded-xl border ${
                isCompleted 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : isInProgress 
                  ? `${config.bgColor} ${config.borderColor}` 
                  : 'bg-white/5 border-white/10'
              }`}>
                {/* Stage Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isInProgress
                    ? `bg-gradient-to-r ${config.color}`
                    : 'bg-white/20'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg">{config.icon}</span>
                  )}
                </div>

                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${
                      isCompleted ? 'text-green-400' : isInProgress ? 'text-neon' : 'text-white'
                    }`}>
                      {config.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400'
                          : isInProgress
                          ? 'bg-neon/20 text-neon'
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        {stage.status.replace('_', ' ')}
                      </span>
                      {isInProgress && (
                        <motion.div
                          className="w-2 h-2 bg-neon rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Stage Dates */}
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    {stage.started_at && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Started: {formatDate(stage.started_at)} at {formatTime(stage.started_at)}</span>
                      </div>
                    )}
                    {stage.completed_at && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Completed: {formatDate(stage.completed_at)} at {formatTime(stage.completed_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Stage Notes */}
                  {stage.notes && (
                    <div className="bg-white/5 rounded-lg p-3 mt-3">
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{stage.notes}</p>
                    </div>
                  )}

                  {/* Stage Attachments */}
                  {stage.attachments && stage.attachments.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-white font-medium text-sm mb-2">Attachments</h5>
                      <div className="space-y-2">
                        {stage.attachments.map((attachment: any, attachIndex: number) => (
                          <div key={attachIndex} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-gray-300 text-sm">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Project Summary</p>
            <p className="text-gray-400 text-sm">
              {stages.filter(s => s.status === 'completed').length} of {stages.length} stages completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-neon font-bold text-lg">
              {Math.round((stages.filter(s => s.status === 'completed').length / stages.length) * 100)}%
            </p>
            <p className="text-gray-400 text-sm">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
