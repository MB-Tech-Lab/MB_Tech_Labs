'use client';
import React from 'react';
import { Card } from '../../components/common/Card';
import { useTasks } from '../../hooks/useTasks';
import { useTimer } from '../../hooks/useTimer';
import { useAuth } from '../../hooks/useAuth';

export const ReportsWidget: React.FC = () => {
  const { allTasks } = useTasks();
  const { logs } = useTimer();
  const { user } = useAuth();

  // Compute insights
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Compute hours tracked
  // Admin sees all logs, others see only their logs (mock logic, ideally done on backend)
  const visibleLogs = user?.role === 'admin' || user?.role === 'manager' 
    ? logs 
    : logs.filter(l => l.userId === user?.id);

  const totalSeconds = visibleLogs.reduce((acc, log) => acc + log.duration, 0);
  const hoursLogged = (totalSeconds / 3600).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase">Completion Rate</h3>
        <p className="text-3xl font-bold text-[var(--primary)] mt-2">{completionRate}%</p>
        <div className="w-full bg-[#1a2754] h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-[var(--primary)] h-full" style={{ width: `${completionRate}%` }}></div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase">Active Tasks</h3>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
          {allTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length}
        </p>
        <span className="text-xs text-yellow-400 mt-2 block">Requires attention</span>
      </Card>

      <Card>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase">Hours Tracked</h3>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{hoursLogged}h</p>
        <span className="text-xs text-[var(--text-secondary)] mt-2 block">Total visible logged time</span>
      </Card>
    </div>
  );
};
