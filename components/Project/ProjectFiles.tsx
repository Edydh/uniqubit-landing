'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ProjectWithStages, EnhancedProjectWithStages } from '../../lib/types';

interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'design' | 'code' | 'other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  stage?: string;
}

interface ProjectFilesProps {
  project?: ProjectWithStages | EnhancedProjectWithStages;
  projectId?: string;
  isAdmin: boolean;
  onFileUpload?: (file: File, stage?: string) => void;
  onFileDelete?: (fileId: string) => void;
}

const fileTypeIcons = {
  document: '📄',
  image: '🖼️',
  design: '🎨',
  code: '💻',
  other: '📎'
};

const fileTypeColors = {
  document: 'from-blue-400 to-blue-600',
  image: 'from-green-400 to-green-600',
  design: 'from-purple-400 to-purple-600',
  code: 'from-orange-400 to-orange-600',
  other: 'from-gray-400 to-gray-600'
};

export default function ProjectFiles({ project, isAdmin, onFileUpload, onFileDelete }: ProjectFilesProps) {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [dragActive, setDragActive] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  // Mock data - replace with real project files
  const mockFiles: ProjectFile[] = [
    {
      id: '1',
      name: 'Project_Requirements.pdf',
      type: 'document',
      size: '2.5 MB',
      uploadedAt: '2024-01-15T10:30:00Z',
      uploadedBy: 'John Doe',
      url: '#',
      stage: 'idea_collection'
    },
    {
      id: '2',
      name: 'Design_Mockup_v2.fig',
      type: 'design',
      size: '8.2 MB',
      uploadedAt: '2024-01-18T14:15:00Z',
      uploadedBy: 'Jane Smith',
      url: '#',
      stage: 'refinement'
    },
    {
      id: '3',
      name: 'Logo_Assets.zip',
      type: 'image',
      size: '12.8 MB',
      uploadedAt: '2024-01-20T09:45:00Z',
      uploadedBy: 'Mike Johnson',
      url: '#',
      stage: 'development'
    }
  ];

  const filteredFiles = selectedStage === 'all' 
    ? mockFiles 
    : mockFiles.filter(file => file.stage === selectedStage);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (onFileUpload) {
        onFileUpload(file, selectedStage !== 'all' ? selectedStage : undefined);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (onFileUpload) {
        onFileUpload(file, selectedStage !== 'all' ? selectedStage : undefined);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stageOptions = [
    { value: 'all', label: 'All Files' },
    { value: 'idea_collection', label: 'Idea Collection' },
    { value: 'refinement', label: 'Refinement' },
    { value: 'quote', label: 'Quote' },
    { value: 'agreement', label: 'Agreement' },
    { value: 'development', label: 'Development' },
    { value: 'completion', label: 'Completion' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-neon to-cyan-400 bg-clip-text text-transparent">
            Project Files
          </h3>
          <p className="text-gray-400 mt-1">
            Manage and organize all project-related files
          </p>
        </div>

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUploadModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-neon to-cyan-400 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon/25 transition-all duration-300"
          >
            Upload Files
          </motion.button>
        )}
      </div>

      {/* Stage Filter */}
      <div className="flex flex-wrap gap-2">
        {stageOptions.map((stage) => (
          <motion.button
            key={stage.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStage(stage.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedStage === stage.value
                ? 'bg-gradient-to-r from-neon to-cyan-400 text-black'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {stage.label}
          </motion.button>
        ))}
      </div>

      {/* File Upload Area (Admin only) */}
      {isAdmin && (
        <motion.div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-neon bg-neon/5'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <div className="space-y-3">
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-300">
                Drag and drop files here
              </p>
              <p className="text-sm text-gray-400">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </motion.div>
      )}

      {/* Files List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${fileTypeColors[file.type]} flex items-center justify-center text-xl`}>
                    {fileTypeIcons[file.type]}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white">{file.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>Uploaded by {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                      {file.stage && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-1 bg-white/10 rounded-md text-xs">
                            {stageOptions.find(s => s.value === file.stage)?.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                    title="Download"
                  >
                    ⬇️
                  </motion.button>
                  
                  {isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onFileDelete?.(file.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No files found
            </h3>
            <p className="text-gray-400">
              {selectedStage === 'all' 
                ? 'No files have been uploaded to this project yet.'
                : `No files found for the ${stageOptions.find(s => s.value === selectedStage)?.label} stage.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Upload Files</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Stage (Optional)
                  </label>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-neon focus:border-transparent"
                  >
                    {stageOptions.map((stage) => (
                      <option key={stage.value} value={stage.value} className="bg-gray-800">
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon file:text-black hover:file:bg-cyan-400"
                  />
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUploadModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUploadModal(false)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-neon to-cyan-400 text-black font-semibold rounded-lg"
                  >
                    Upload
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
