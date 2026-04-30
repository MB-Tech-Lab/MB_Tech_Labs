import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { TaskBoard } from '../../modules/tasks/TaskBoard';

export default function DeveloperDashboard() {
  return (
    <DashboardLayout role="senior_developer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Developer Workspace</h1>
        <p className="text-[var(--text-secondary)] mt-1">Track your assigned tasks and progress.</p>
      </div>

      <TaskBoard />
    </DashboardLayout>
  );
}
