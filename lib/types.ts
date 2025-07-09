// TypeScript types for the uniQubit platform database schema

export type UserRole = 'admin' | 'client';
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'rejected';
export type ProjectStage = 'idea_collection' | 'refinement' | 'quote' | 'agreement' | 'development' | 'completion' | 'payment';
export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

// Database Tables
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  converted_to_project_id?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  current_stage: ProjectStage;
  budget?: number;
  created_at: string;
  updated_at: string;
  users?: User; // For joined user data
}

export interface ProjectStageRecord {
  id: string;
  project_id: string;
  stage_name: ProjectStage;
  status: StageStatus;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  attachments: any[];
  created_at: string;
}

// Extended types with relations
export interface ProjectWithClient extends Project {
  client: User;
}

export interface ProjectWithStages extends Project {
  stages: ProjectStageRecord[];
  client: User;
}

export interface LeadWithProject extends Lead {
  project?: Project;
}

export interface MessageWithSender extends Message {
  sender: User;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface CreateProjectFormData {
  title: string;
  description?: string;
  client_id: string;
}

export interface UpdateProjectStageData {
  status: StageStatus;
  notes?: string;
  attachments?: any[];
}

export interface SendMessageData {
  project_id: string;
  content: string;
  attachments?: any[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface AuthResponse {
  user?: User;
  session?: any;
  error?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalLeads: number;
  activeProjects: number;
  completedProjects: number;
  newLeadsThisMonth: number;
  projectsInDevelopment: number;
  clientsCount: number;
}

// Project stage configuration
export const PROJECT_STAGES: { [key in ProjectStage]: string } = {
  idea_collection: 'Idea Collection',
  refinement: 'Refinement',
  quote: 'Quote',
  agreement: 'Agreement',
  development: 'Development',
  completion: 'Completion',
  payment: 'Payment',
};

export const STAGE_COLORS: { [key in ProjectStage]: string } = {
  idea_collection: 'bg-blue-500',
  refinement: 'bg-purple-500',
  quote: 'bg-yellow-500',
  agreement: 'bg-green-500',
  development: 'bg-orange-500',
  completion: 'bg-teal-500',
  payment: 'bg-pink-500',
};

export const LEAD_STATUS_COLORS: { [key in LeadStatus]: string } = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  converted: 'bg-green-500',
  rejected: 'bg-red-500',
};

// Utility types
export type DatabaseError = {
  message: string;
  code?: string;
  details?: string;
};

export type SortOrder = 'asc' | 'desc';

export interface TableFilters {
  search?: string;
  status?: string;
  stage?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

// Authentication context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error?: string }>;
}

// AI-Enhanced Lead Management
export interface EnhancedLead extends Lead {
  ai_score?: number;
  ai_priority?: 'high' | 'medium' | 'low';
  ai_project_type?: string;
  ai_budget_estimate?: string;
  ai_urgency?: string;
  ai_complexity?: string;
  ai_analysis?: any;
  ai_response_sent?: boolean;
  ai_response_content?: string;
  phone?: string;
  project_type?: string;
  source?: string;
}

// AI Communications Log
export interface AICommunication {
  id: string;
  lead_id?: string;
  project_id?: string;
  communication_type: string;
  prompt_used?: string;
  ai_response: string;
  human_approved?: boolean;
  sent_at?: string;
  created_at: string;
}

// AI Project Insights
export interface AIProjectInsight {
  id: string;
  project_id: string;
  insight_type: string;
  content: string;
  confidence_score?: number;
  data_sources?: any;
  created_at: string;
  updated_at: string;
}

// Enhanced Database Schema Types (Phase 2.1)

export interface ProjectType {
  id: string;
  name: string;
  description?: string;
  default_stages: ProjectStageTemplate[];
  estimated_duration_weeks: number;
  base_price_range?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectStageTemplate {
  name: string;
  description: string;
  estimated_hours: number;
  deliverables: string[];
}

export interface ProjectStageRecord {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  order_index: number;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  requires_approval: boolean;
  approved_at?: string;
  approved_by?: string;
  started_at?: string;
  completed_at?: string;
  estimated_hours?: number;
  actual_hours?: number;
  deliverables: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  stage_id?: string;
  uploaded_by: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  mime_type?: string;
  description?: string;
  version: number;
  is_deliverable: boolean;
  is_public: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  stage_id?: string;
  sender_id: string;
  content: string;
  message_type: 'comment' | 'update' | 'alert' | 'approval_request';
  attachments: any[];
  seen_by: string[];
  reply_to?: string;
  created_at: string;
  updated_at: string;
  sender?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  project_id: string;
  type: 'stage_update' | 'message' | 'file_upload' | 'approval_request' | 'payment_due' | 'project_complete';
  title: string;
  message: string;
  action_url?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read_at?: string;
  created_at: string;
}

// Enhanced Project interface
export interface EnhancedProject extends Project {
  project_type_id?: string;
  estimated_completion?: string;
  actual_completion?: string;
  total_budget?: number;
  currency: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: Record<string, any>;
  project_type?: ProjectType;
}

// Enhanced ProjectWithStages interface
export interface EnhancedProjectWithStages extends EnhancedProject {
  stages: ProjectStageRecord[];
  files?: ProjectFile[];
  messages?: ProjectMessage[];
  client?: User;
}
