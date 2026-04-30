import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { TaskBoard } from '../../modules/tasks/TaskBoard';
import { ReportsWidget } from '../../modules/reports/ReportsWidget';

export default function ManagerDashboard() {
  return (
    <DashboardLayout role="manager">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Project Manager Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage client projects and task distribution.</p>
        </div>
      </div>

      <ReportsWidget />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <TaskBoard />
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Project Milestones</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-primary)]">Frontend Setup</span>
                <span className="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">100%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-primary)]">API Integration</span>
                <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">40%</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

