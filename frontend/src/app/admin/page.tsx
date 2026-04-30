import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ReportsWidget } from '../../modules/reports/ReportsWidget';
import { Card } from '../../components/common/Card';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Overview</h1>
        <p className="text-[var(--text-secondary)] mt-1">System-wide performance and metrics.</p>
      </div>

      <ReportsWidget />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Task Distribution</h3>
          <div className="flex-1 bg-[#1a2754] rounded flex items-center justify-center">
            <span className="text-[var(--text-secondary)]">Task Flow Analytics Placeholder</span>
          </div>
        </Card>
        <Card className="h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Department Productivity</h3>
          <div className="flex-1 bg-[#1a2754] rounded flex items-center justify-center">
            <span className="text-[var(--text-secondary)]">Time Logs Bar Chart Placeholder</span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

