'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectType, ProjectStageTemplate } from '../../lib/types';

interface ProjectTypeManagerProps {
  isAdmin: boolean;
  onProjectTypeSelect?: (projectType: ProjectType) => void;
}

const defaultProjectTypes: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Web Development',
    description: 'Full-stack web application development with modern technologies',
    default_stages: [
      {
        name: 'Discovery & Planning',
        description: 'Requirements gathering and technical planning',
        estimated_hours: 20,
        deliverables: ['Project brief', 'Technical specification', 'Wireframes']
      },
      {
        name: 'Design & Prototyping',
        description: 'UI/UX design and interactive prototypes',
        estimated_hours: 30,
        deliverables: ['Design mockups', 'Interactive prototype', 'Style guide']
      },
      {
        name: 'Development',
        description: 'Frontend and backend development',
        estimated_hours: 80,
        deliverables: ['Working application', 'Admin panel', 'API documentation']
      },
      {
        name: 'Testing & QA',
        description: 'Quality assurance and bug fixes',
        estimated_hours: 20,
        deliverables: ['Test reports', 'Bug fixes', 'Performance optimization']
      },
      {
        name: 'Deployment & Launch',
        description: 'Production deployment and go-live',
        estimated_hours: 10,
        deliverables: ['Live website', 'Deployment documentation', 'Training materials']
      }
    ],
    estimated_duration_weeks: 8,
    base_price_range: '$5,000 - $25,000',
    is_active: true
  },
  {
    name: 'Mobile App Development',
    description: 'Native or cross-platform mobile application development',
    default_stages: [
      {
        name: 'Concept & Strategy',
        description: 'App concept validation and strategy development',
        estimated_hours: 25,
        deliverables: ['App strategy', 'User personas', 'Feature specification']
      },
      {
        name: 'Design & User Experience',
        description: 'Mobile UI/UX design and user flow',
        estimated_hours: 35,
        deliverables: ['App designs', 'User flow diagrams', 'Interactive prototype']
      },
      {
        name: 'Development & Integration',
        description: 'App development and API integration',
        estimated_hours: 100,
        deliverables: ['Beta app', 'API integration', 'Core features']
      },
      {
        name: 'Testing & Optimization',
        description: 'App testing and performance optimization',
        estimated_hours: 25,
        deliverables: ['Test results', 'Performance report', 'Bug fixes']
      },
      {
        name: 'App Store Launch',
        description: 'App store submission and launch',
        estimated_hours: 15,
        deliverables: ['Published app', 'App store assets', 'Launch strategy']
      }
    ],
    estimated_duration_weeks: 10,
    base_price_range: '$10,000 - $50,000',
    is_active: true
  },
  {
    name: 'Brand Identity & Design',
    description: 'Complete brand identity and visual design package',
    default_stages: [
      {
        name: 'Brand Discovery',
        description: 'Brand research and strategy development',
        estimated_hours: 15,
        deliverables: ['Brand brief', 'Competitor analysis', 'Brand strategy']
      },
      {
        name: 'Logo & Visual Identity',
        description: 'Logo design and visual identity system',
        estimated_hours: 25,
        deliverables: ['Logo variations', 'Color palette', 'Typography system']
      },
      {
        name: 'Brand Guidelines',
        description: 'Comprehensive brand guidelines and assets',
        estimated_hours: 20,
        deliverables: ['Brand guidelines', 'Business cards', 'Letterhead design']
      },
      {
        name: 'Marketing Materials',
        description: 'Marketing collateral and digital assets',
        estimated_hours: 15,
        deliverables: ['Brochure design', 'Social media templates', 'Website banners']
      },
      {
        name: 'Brand Package Delivery',
        description: 'Final brand package and training',
        estimated_hours: 5,
        deliverables: ['Complete brand package', 'Asset library', 'Usage training']
      }
    ],
    estimated_duration_weeks: 4,
    base_price_range: '$3,000 - $15,000',
    is_active: true
  }
];

export default function ProjectTypeManager({ isAdmin, onProjectTypeSelect }: ProjectTypeManagerProps) {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjectTypes();
  }, []);

  const loadProjectTypes = async () => {
    setLoading(true);
    try {
      // For now, use default types since database might not be migrated yet
      // TODO: Replace with actual API call when database is ready
      // const types = await projectTypeService.getAll();
      const types = defaultProjectTypes.map((type, index) => ({
        ...type,
        id: `type-${index + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      setProjectTypes(types);
    } catch (error) {
      console.error('Error loading project types:', error);
      // Fallback to default types
      const types = defaultProjectTypes.map((type, index) => ({
        ...type,
        id: `type-${index + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      setProjectTypes(types);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type: ProjectType) => {
    setSelectedType(type);
    onProjectTypeSelect?.(type);
  };

  const formatDuration = (weeks: number) => {
    if (weeks === 1) return '1 week';
    if (weeks < 4) return `${weeks} weeks`;
    if (weeks === 4) return '1 month';
    return `${Math.round(weeks / 4)} months`;
  };

  const getTotalHours = (stages: ProjectStageTemplate[]) => {
    return stages.reduce((total, stage) => total + stage.estimated_hours, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-neon to-cyan-400 bg-clip-text text-transparent">
            Project Types
          </h3>
          <p className="text-gray-400 mt-1">
            Choose a project type to get started with pre-configured stages
          </p>
        </div>
        
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-neon to-cyan-400 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon/25 transition-all duration-300"
          >
            Create Type
          </motion.button>
        )}
      </div>

      {/* Project Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleTypeSelect(type)}
            className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/8 ${
              selectedType?.id === type.id
                ? 'border-neon bg-neon/5'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {/* Type Header */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">{type.name}</h4>
              <p className="text-gray-400 text-sm line-clamp-2">{type.description}</p>
            </div>

            {/* Type Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-medium">{formatDuration(type.estimated_duration_weeks)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total Hours:</span>
                <span className="text-white font-medium">{getTotalHours(type.default_stages)}h</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Stages:</span>
                <span className="text-white font-medium">{type.default_stages.length}</span>
              </div>
              
              {type.base_price_range && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-neon font-medium">{type.base_price_range}</span>
                </div>
              )}
            </div>

            {/* Stage Preview */}
            <div>
              <p className="text-gray-400 text-xs mb-2">Stages:</p>
              <div className="space-y-1">
                {type.default_stages.slice(0, 3).map((stage, stageIndex) => (
                  <div key={stageIndex} className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">{stage.name}</span>
                  </div>
                ))}
                {type.default_stages.length > 3 && (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-400">+{type.default_stages.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedType?.id === type.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-neon rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Type Details */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {selectedType.name} - Stage Details
            </h4>
            
            <div className="space-y-4">
              {selectedType.default_stages.map((stage, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-neon to-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">{stage.name}</h5>
                    <p className="text-gray-400 text-sm mb-2">{stage.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>⏱️ {stage.estimated_hours}h</span>
                      <span>📦 {stage.deliverables.length} deliverables</span>
                    </div>
                    
                    {stage.deliverables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-400 text-xs mb-1">Deliverables:</p>
                        <div className="flex flex-wrap gap-1">
                          {stage.deliverables.map((deliverable, delIndex) => (
                            <span
                              key={delIndex}
                              className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                            >
                              {deliverable}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
