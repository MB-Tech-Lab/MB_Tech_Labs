'use client';
import React from 'react';
import { TaskStatus } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from './TaskCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';

export const TaskBoard: React.FC = () => {
  const { tasks, loading, error } = useTasks();

  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'To Do', status: 'Pending' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'In Review', status: 'Submitted' },
    { title: 'Done', status: 'Completed' },
  ];

  if (loading) {
    return <div className="h-64"><LoadingState /></div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="h-64">
        <EmptyState 
          title="No tasks found" 
          description="You don't have any tasks assigned at the moment."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter(t => t.status === column.status);
        return (
          <div key={column.title} className="flex flex-col h-full bg-[#0a1023] rounded-xl p-4 border border-[#1a2754]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">{column.title}</h3>
              <span className="bg-[#1a2754] text-xs py-0.5 px-2 rounded-full text-[var(--text-secondary)]">
                {columnTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {columnTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

