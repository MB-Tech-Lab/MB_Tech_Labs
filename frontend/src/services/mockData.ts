import { User, Task, Project, Team, TaskStatus } from '@/types';

// Mock users for different roles
export const MOCK_USERS: Record<string, User> = {
  admin: {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@mbtechlabs.com',
    role: 'admin',
    department: 'Executive',
    avatar: '👨‍💼',
    joinedAt: new Date('2023-01-01'),
  },
  executive_officer: {
    id: 'user-002',
    name: 'Executive Officer',
    email: 'exec@mbtechlabs.com',
    role: 'executive_officer',
    department: 'Operations',
    avatar: '👩‍💼',
    joinedAt: new Date('2023-01-01'),
  },
  manager: {
    id: 'user-003',
    name: 'Project Manager',
    email: 'manager@mbtechlabs.com',
    role: 'manager',
    department: 'Projects',
    avatar: '👨‍💻',
    joinedAt: new Date('2023-03-15'),
  },
  team_lead: {
    id: 'user-004',
    name: 'Team Lead',
    email: 'lead@mbtechlabs.com',
    role: 'team_lead',
    department: 'Engineering',
    avatar: '👩‍💻',
    joinedAt: new Date('2023-06-01'),
  },
  senior_developer: {
    id: 'user-005',
    name: 'Senior Developer',
    email: 'senior@mbtechlabs.com',
    role: 'senior_developer',
    department: 'Engineering',
    avatar: '👨‍🔧',
    joinedAt: new Date('2023-06-15'),
  },
  junior_developer: {
    id: 'user-006',
    name: 'Junior Developer',
    email: 'junior@mbtechlabs.com',
    role: 'junior_developer',
    department: 'Engineering',
    avatar: '👩‍🎓',
    joinedAt: new Date('2024-01-01'),
  },
  intern: {
    id: 'user-007',
    name: 'Intern',
    email: 'intern@mbtechlabs.com',
    role: 'intern',
    department: 'Engineering',
    avatar: '👨‍🎓',
    joinedAt: new Date('2024-02-01'),
  },
  hr: {
    id: 'user-008',
    name: 'HR Manager',
    email: 'hr@mbtechlabs.com',
    role: 'hr',
    department: 'HR',
    avatar: '👩‍💼',
    joinedAt: new Date('2023-02-01'),
  },
  marketing: {
    id: 'user-009',
    name: 'Marketing Manager',
    email: 'marketing@mbtechlabs.com',
    role: 'marketing',
    department: 'Marketing',
    avatar: '👨‍💼',
    joinedAt: new Date('2023-04-01'),
  },
};

// Mock tasks
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-001',
    title: 'Implement authentication system',
    description: 'Create JWT-based authentication with role-based access control',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'user-005',
    assignedBy: 'user-004',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: 'proj-001',
    teamId: 'team-001',
    estimatedHours: 16,
    actualHours: 8,
    acceptanceCriteria: [
      'Login page functional',
      'Role-based redirect working',
      'JWT tokens stored securely',
    ],
  },
  {
    id: 'task-002',
    title: 'Design dashboard UI',
    description: 'Create mockups for all role-based dashboards using Tailwind CSS',
    status: 'completed',
    priority: 'high',
    assignedTo: 'user-006',
    assignedBy: 'user-004',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: 'proj-001',
    teamId: 'team-001',
    estimatedHours: 12,
    actualHours: 11,
  },
  {
    id: 'task-003',
    title: 'Create time tracking component',
    description: 'Implement timer with start/stop and local storage',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'user-007',
    assignedBy: 'user-004',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: 'proj-001',
    teamId: 'team-001',
    estimatedHours: 8,
  },
  {
    id: 'task-004',
    title: 'Setup database schema',
    description: 'Design and implement database schema for users, tasks, projects',
    status: 'pending',
    priority: 'high',
    assignedTo: 'user-005',
    assignedBy: 'user-004',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: 'proj-001',
    teamId: 'team-001',
    estimatedHours: 20,
  },
  {
    id: 'task-005',
    title: 'Code review for auth module',
    description: 'Review authentication implementation and provide feedback',
    status: 'submitted',
    priority: 'medium',
    assignedTo: 'user-004',
    assignedBy: 'user-003',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: 'proj-001',
    teamId: 'team-001',
    estimatedHours: 4,
  },
];

// Mock projects
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Internal Work Management Platform',
    description: 'Build an internal platform for task management, time tracking, and performance evaluation',
    managerId: 'user-003',
    clientName: 'MB Tech Labs',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    budget: 50000,
    spent: 15000,
    teamIds: ['team-001'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'proj-002',
    name: 'Client Portal Development',
    description: 'Develop a client-facing portal for project tracking and communication',
    managerId: 'user-003',
    clientName: 'Acme Corporation',
    status: 'active',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-31'),
    budget: 75000,
    spent: 30000,
    teamIds: ['team-002'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
];

// Mock teams
export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-001',
    name: 'Platform Engineering Team',
    projectId: 'proj-001',
    leadId: 'user-004',
    members: [
      { userId: 'user-004', role: 'lead', joinedAt: new Date() },
      { userId: 'user-005', role: 'senior', joinedAt: new Date() },
      { userId: 'user-006', role: 'junior', joinedAt: new Date() },
      { userId: 'user-007', role: 'intern', joinedAt: new Date() },
    ],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'team-002',
    name: 'Client Portal Team',
    projectId: 'proj-002',
    leadId: 'user-004',
    members: [
      { userId: 'user-004', role: 'lead', joinedAt: new Date() },
      { userId: 'user-005', role: 'senior', joinedAt: new Date() },
    ],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Get tasks for a user
export const getTasksForUser = (userId: string): Task[] => {
  return MOCK_TASKS.filter(task => task.assignedTo === userId);
};

// Get tasks managed by a team lead
export const getTeamTasks = (leadId: string): Task[] => {
  const team = MOCK_TEAMS.find(t => t.leadId === leadId);
  if (!team) return [];
  const teamMemberIds = team.members.map((m: any) => m.userId);
  return MOCK_TASKS.filter(task => teamMemberIds.includes(task.assignedTo));
};

// Get all projects managed by a manager
export const getManagerProjects = (managerId: string): Project[] => {
  return MOCK_PROJECTS.filter(p => p.managerId === managerId);
};
