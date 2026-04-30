import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { TimeTracker } from '../../modules/time-tracking/TimeTracker';
import { TaskBoard } from '../../modules/tasks/TaskBoard';

export default function InternDashboard() {
  return (
    <DashboardLayout role="intern">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Intern Workspace</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your daily tasks and log your hours.</p>
      </div>

      <div className="mb-8">
        <TimeTracker />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">My Tasks</h2>
        <TaskBoard />
      </div>
    </DashboardLayout>
  );
}
