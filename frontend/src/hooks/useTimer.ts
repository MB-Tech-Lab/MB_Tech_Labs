import { useEffect } from 'react';
import { useTimeStore } from '../stores/useTimeStore';
import { useAuthStore } from '../stores/useAuthStore';

export const useTimer = () => {
  const { isRunning, elapsedSeconds, activeTaskId, startTimer, stopTimer, tick, syncFromStorage, logs } = useTimeStore();
  const { user } = useAuthStore();

  // Tick the timer every second if it's running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Initial sync
    syncFromStorage();

    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick, syncFromStorage]);

  const toggleTimer = (taskId?: string) => {
    if (isRunning) {
      if (user) stopTimer(user.id);
    } else {
      startTimer(taskId);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRunning,
    elapsedSeconds,
    activeTaskId,
    formattedTime: formatTime(elapsedSeconds),
    toggleTimer,
    logs
  };
};
