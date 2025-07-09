'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { ProjectWithStages, EnhancedProjectWithStages } from '../../lib/types';

interface ProjectMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  type: 'progress' | 'performance' | 'quality' | 'timeline';
  trend: 'up' | 'down' | 'stable';
  description: string;
  lastUpdated: string;
}

interface ProjectMetricsProps {
  project: ProjectWithStages | EnhancedProjectWithStages;
  isAdmin: boolean;
}

const metricIcons = {
  progress: '📊',
  performance: '⚡',
  quality: '🎯',
  timeline: '⏰'
};

const metricColors = {
  progress: 'from-blue-400 to-blue-600',
  performance: 'from-green-400 to-green-600',
  quality: 'from-purple-400 to-purple-600',
  timeline: 'from-orange-400 to-orange-600'
};

const trendIcons = {
  up: '📈',
  down: '📉',
  stable: '➡️'
};

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  stable: 'text-gray-400'
};

export default function ProjectMetrics({ project, isAdmin }: ProjectMetricsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  // Mock metrics data - replace with real project metrics
  const mockMetrics: ProjectMetric[] = [
    {
      id: '1',
      name: 'Project Progress',
      value: 68,
      target: 100,
      unit: '%',
      type: 'progress',
      trend: 'up',
      description: 'Overall project completion percentage',
      lastUpdated: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Development Velocity',
      value: 85,
      target: 80,
      unit: 'pts/week',
      type: 'performance',
      trend: 'up',
      description: 'Story points completed per week',
      lastUpdated: '2024-01-20T08:15:00Z'
    },
    {
      id: '3',
      name: 'Code Quality Score',
      value: 92,
      target: 90,
      unit: '/100',
      type: 'quality',
      trend: 'stable',
      description: 'Automated code quality assessment',
      lastUpdated: '2024-01-19T16:45:00Z'
    },
    {
      id: '4',
      name: 'Timeline Adherence',
      value: 75,
      target: 85,
      unit: '%',
      type: 'timeline',
      trend: 'down',
      description: 'On-time milestone completion rate',
      lastUpdated: '2024-01-20T09:20:00Z'
    },
    {
      id: '5',
      name: 'Client Satisfaction',
      value: 4.8,
      target: 4.5,
      unit: '/5.0',
      type: 'quality',
      trend: 'up',
      description: 'Average client feedback rating',
      lastUpdated: '2024-01-18T14:30:00Z'
    },
    {
      id: '6',
      name: 'Bug Resolution Time',
      value: 2.3,
      target: 3.0,
      unit: 'days',
      type: 'performance',
      trend: 'up',
      description: 'Average time to resolve reported bugs',
      lastUpdated: '2024-01-19T11:10:00Z'
    }
  ];

  // Animate metric values on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated = mockMetrics.reduce((acc, metric) => {
        acc[metric.id] = metric.value;
        return acc;
      }, {} as { [key: string]: number });
      setAnimatedValues(animated);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const calculatePercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const getPerformanceColor = (value: number, target: number, trend: string) => {
    const ratio = value / target;
    if (ratio >= 1) return 'text-green-400';
    if (ratio >= 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timeframeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  // Calculate overall project health score
  const overallHealth = Math.round(
    mockMetrics.reduce((acc, metric) => {
      return acc + calculatePercentage(metric.value, metric.target);
    }, 0) / mockMetrics.length
  );

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-neon to-cyan-400 bg-clip-text text-transparent">
            Project Metrics
          </h3>
          <p className="text-gray-400 mt-1">
            Track performance, quality, and progress indicators
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {timeframeOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimeframe(option.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedTimeframe === option.value
                  ? 'bg-gradient-to-r from-neon to-cyan-400 text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overall Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Overall Project Health</h4>
          <div className={`text-2xl font-bold bg-gradient-to-r ${getHealthColor(overallHealth)} bg-clip-text text-transparent`}>
            {overallHealth}%
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallHealth}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full bg-gradient-to-r ${getHealthColor(overallHealth)}`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Needs Attention</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metricColors[metric.type]} flex items-center justify-center text-lg`}>
                  {metricIcons[metric.type]}
                </div>
                <div>
                  <h5 className="font-semibold text-white">{metric.name}</h5>
                  <p className="text-xs text-gray-400">{metric.description}</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 ${trendColors[metric.trend]}`}>
                <span className="text-sm">{trendIcons[metric.trend]}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`text-2xl font-bold ${getPerformanceColor(metric.value, metric.target, metric.trend)}`}
                >
                  {animatedValues[metric.id] || 0}{metric.unit}
                </motion.div>
                <div className="text-sm text-gray-400">
                  Target: {metric.target}{metric.unit}
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculatePercentage(animatedValues[metric.id] || 0, metric.target)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                    className={`h-2 rounded-full bg-gradient-to-r ${metricColors[metric.type]}`}
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>Last updated: {formatDate(metric.lastUpdated)}</span>
                <span>{calculatePercentage(metric.value, metric.target).toFixed(0)}% of target</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights (Admin only) */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-lg">
              🤖
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-2">AI Insights</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Development velocity is 6% above target - team is performing well</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400">⚠</span>
                  <span>Timeline adherence dropping - consider reallocating resources to critical path items</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">💡</span>
                  <span>Code quality score is excellent - current practices should be maintained</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Export Options (Admin only) */}
      {isAdmin && (
        <div className="flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 transition-all duration-300"
          >
            📊 Export Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-neon to-cyan-400 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon/25 transition-all duration-300"
          >
            📈 Advanced Analytics
          </motion.button>
        </div>
      )}
    </div>
  );
}
