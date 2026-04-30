import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimeLog {
  id: string;
  userId: string;
  taskId?: string; // Optional if general time tracking
  startTime: number; // Unix timestamp in seconds
  duration: number; // Duration in seconds
  date: string; // ISO date string for grouping
}

interface TimeState {
  isRunning: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  activeTaskId: string | null;
  logs: TimeLog[];
  
  startTimer: (taskId?: string) => void;
  stopTimer: (userId: string) => void;
  tick: () => void;
  syncFromStorage: () => void;
}

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      activeTaskId: null,
      logs: [],

      startTimer: (taskId) => {
        const now = Math.floor(Date.now() / 1000);
        set({
          isRunning: true,
          startTime: now,
          activeTaskId: taskId || null,
        });
      },

      stopTimer: (userId) => {
        const { isRunning, elapsedSeconds, activeTaskId } = get();
        if (!isRunning) return;

        const newLog: TimeLog = {
          id: Math.random().toString(36).substring(7),
          userId,
          taskId: activeTaskId || undefined,
          startTime: Math.floor(Date.now() / 1000) - elapsedSeconds,
          duration: elapsedSeconds,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        };

        set((state) => ({
          isRunning: false,
          startTime: null,
          elapsedSeconds: 0,
          activeTaskId: null,
          logs: [...state.logs, newLog],
        }));
      },

      tick: () => {
        const { isRunning, startTime } = get();
        if (isRunning && startTime) {
          const now = Math.floor(Date.now() / 1000);
          set({ elapsedSeconds: now - startTime });
        }
      },

      syncFromStorage: () => {
        const { isRunning, startTime } = get();
        if (isRunning && startTime) {
          const now = Math.floor(Date.now() / 1000);
          set({ elapsedSeconds: now - startTime });
        }
      }
    }),
    {
      name: 'mbtl-time-store',
    }
  )
);
