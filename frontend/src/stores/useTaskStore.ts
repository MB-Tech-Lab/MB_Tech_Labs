import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';
import { DataService } from '../services/data.service';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  updateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await DataService.getTasks();
      if (response.error) throw new Error(response.error);
      set({ tasks: response.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch tasks', loading: false });
    }
  },

  updateStatus: async (taskId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await DataService.updateTaskStatus(taskId, status);
      if (response.error) throw new Error(response.error);
      
      const updatedTask = response.data;
      if (updatedTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          loading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update task', loading: false });
    }
  },
}));
