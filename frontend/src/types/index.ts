// Role definitions aligned with MB Tech Labs organizational hierarchy
export type Role = 
  | 'admin' 
  | 'executive_officer' 
  | 'hr' 
  | 'manager' 
  | 'team_lead' 
  | 'senior_developer' 
  | 'junior_developer' 
  | 'intern' 
  | 'marketing';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
  joinedAt: Date;
}

// Task status lifecycle
export type TaskStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'submitted' 
  | 'approved' 
  | 'completed' 
  | 'rejected';

// Task type
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
  teamId?: string;
  estimatedHours: number;
  actualHours?: number;
  acceptanceCriteria?: string[];
}

// Project type
export interface Project {
  id: string;
  name: string;
  description: string;
  managerId: string;
  clientName: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'archived';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Team type
export interface Team {
  id: string;
  name: string;
  projectId: string;
  leadId: string;
  members: TeamMember[];
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Team member type
export interface TeamMember {
  userId: string;
  role: 'lead' | 'senior' | 'junior' | 'intern';
  joinedAt: Date;
}

// Time entry type
export interface TimeEntry {
  id: string;
  userId: string;
  taskId: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  duration: number; // in hours
  status: 'active' | 'completed' | 'manual';
  notes?: string;
  createdAt: Date;
}

// Performance metrics type
export interface PerformanceMetrics {
  userId: string;
  taskCompletionRate: number; // percentage
  onTimeDeliveryRate: number; // percentage
  qualityScore: number; // 0-100
  consistencyScore: number; // percentage
  rating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  evaluatedAt: Date;
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Dashboard config type
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'list' | 'card';
  visible: boolean;
  order: number;
}
