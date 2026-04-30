import { useEffect } from 'react';
import { useTaskStore } from '../stores/useTaskStore';
import { useAuthStore } from '../stores/useAuthStore';

export const useTasks = () => {
  const { tasks, loading, error, fetchTasks, updateStatus } = useTaskStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Initial fetch if tasks are empty
    if (tasks.length === 0 && !loading && !error) {
      fetchTasks();
    }
  }, [tasks.length, loading, error, fetchTasks]);

  // Derived state based on user role
  const getFilteredTasks = () => {
    if (!user) return [];
    
    // Admin sees all
    if (user.role === 'admin' || user.role === 'manager') return tasks;
    
    // Team lead sees all tasks for their team/project (Mocking logic here to show all for demo, or filter by a specific project)
    if (user.role === 'team_lead') return tasks; 

    // Devs & interns only see assigned tasks
    return tasks.filter(task => task.assigneeId === user.id);
  };

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    loading,
    error,
    fetchTasks,
    updateStatus,
  };
};
