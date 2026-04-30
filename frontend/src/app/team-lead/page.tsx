import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { TaskBoard } from '../../modules/tasks/TaskBoard';

export default function TeamLeadDashboard() {
  return (
    <DashboardLayout role="team_lead">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team Lead Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">Supervise tasks and review code submissions.</p>
      </div>

      <div className="mb-8">
        <TaskBoard />
      </div>
    </DashboardLayout>
  );
}
