import React from 'react';
import { Task } from '../../types/task';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card padding="sm" className="mb-3 hover:border-[var(--primary)] transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
        <span className="text-xs text-[var(--text-secondary)]">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
      <h4 className="text-[var(--text-primary)] font-medium mb-1 group-hover:text-[var(--primary)] transition-colors">
        {task.title}
      </h4>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
        {task.description}
      </p>
    </Card>
  );
};
