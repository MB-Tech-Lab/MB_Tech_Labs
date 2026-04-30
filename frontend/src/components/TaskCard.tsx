import React from 'react';
import { Task } from '@/types';
import { Card, CardTitle, CardDescription } from './Card';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  submitted: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const priorityColors = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  completed: 'Completed',
  rejected: 'Rejected',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue < 3 && daysUntilDue >= 0;

  return (
    <Card
      hoverable
      onClick={onClick}
      className={`${isOverdue ? 'border-l-4 border-l-red-600' : ''} ${
        isDueSoon ? 'border-l-4 border-l-yellow-600' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </div>
        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between mt-4">
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
          {task.estimatedHours && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              ⏱️ {task.actualHours ?? 0}/{task.estimatedHours}h
            </span>
          )}
        </div>

        <span
          className={`text-xs font-medium ${
            isOverdue
              ? 'text-red-600'
              : isDueSoon
              ? 'text-yellow-600'
              : 'text-gray-500'
          }`}
        >
          {isOverdue ? `🔴 Overdue ${Math.abs(daysUntilDue)}d` : `📅 ${daysUntilDue}d`}
        </span>
      </div>
    </Card>
  );
};

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick,
  emptyMessage = 'No tasks found',
}) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick?.(task)}
        />
      ))}
    </div>
  );
};
