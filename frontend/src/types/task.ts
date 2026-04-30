export type TaskStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  projectId: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
}
