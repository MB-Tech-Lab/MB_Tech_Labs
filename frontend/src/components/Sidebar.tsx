'use client';

import React from 'react';
import Link from 'next/link';
import { Role } from '@/types';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  role: Role;
}

const navItemsByRole: Record<Role, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Teams', href: '/admin/teams', icon: '👨‍💼' },
    { label: 'Projects', href: '/admin/projects', icon: '📋' },
    { label: 'Reports', href: '/admin/reports', icon: '📈' },
    { label: 'Audit Logs', href: '/admin/audit', icon: '📝' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ],
  executive_officer: [
    { label: 'Dashboard', href: '/executive', icon: '📊' },
    { label: 'Projects', href: '/executive/projects', icon: '📋' },
    { label: 'Teams', href: '/executive/teams', icon: '👨‍💼' },
    { label: 'Performance', href: '/executive/performance', icon: '📈' },
    { label: 'Reports', href: '/executive/reports', icon: '📊' },
  ],
  manager: [
    { label: 'Dashboard', href: '/manager', icon: '📊' },
    { label: 'Projects', href: '/manager/projects', icon: '📋' },
    { label: 'Teams', href: '/manager/teams', icon: '👨‍💼' },
    { label: 'Tasks', href: '/manager/tasks', icon: '✓' },
    { label: 'Performance', href: '/manager/performance', icon: '⭐' },
  ],
  team_lead: [
    { label: 'Dashboard', href: '/team-lead', icon: '📊' },
    { label: 'Team', href: '/team-lead/team', icon: '👥' },
    { label: 'Tasks', href: '/team-lead/tasks', icon: '✓' },
    { label: 'Performance', href: '/team-lead/performance', icon: '⭐' },
  ],
  senior_developer: [
    { label: 'Dashboard', href: '/developer', icon: '📊' },
    { label: 'My Tasks', href: '/developer/tasks', icon: '✓' },
    { label: 'Time Tracking', href: '/developer/time', icon: '⏱️' },
    { label: 'Performance', href: '/developer/performance', icon: '⭐' },
  ],
  junior_developer: [
    { label: 'Dashboard', href: '/developer', icon: '📊' },
    { label: 'My Tasks', href: '/developer/tasks', icon: '✓' },
    { label: 'Time Tracking', href: '/developer/time', icon: '⏱️' },
    { label: 'Learning', href: '/developer/learning', icon: '📚' },
  ],
  intern: [
    { label: 'Dashboard', href: '/intern', icon: '📊' },
    { label: 'My Tasks', href: '/intern/tasks', icon: '✓' },
    { label: 'Timer', href: '/intern/timer', icon: '⏱️' },
    { label: 'Feedback', href: '/intern/feedback', icon: '💬' },
  ],
  hr: [
    { label: 'Dashboard', href: '/hr', icon: '📊' },
    { label: 'Employees', href: '/hr/employees', icon: '👥' },
    { label: 'Performance', href: '/hr/performance', icon: '⭐' },
    { label: 'Compliance', href: '/hr/compliance', icon: '✓' },
  ],
  marketing: [
    { label: 'Dashboard', href: '/marketing', icon: '📊' },
    { label: 'Leads', href: '/marketing/leads', icon: '🎯' },
    { label: 'Projects', href: '/marketing/projects', icon: '📋' },
    { label: 'Analytics', href: '/marketing/analytics', icon: '📈' },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const navItems = navItemsByRole[role] || [];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto py-6">
      <nav className="space-y-2 px-4">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Additional sidebar info */}
      <div className="mt-12 px-4 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
          Quick Stats
        </p>
        <div className="space-y-2 text-xs text-gray-400">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Status: Online</p>
        </div>
      </div>
    </aside>
  );
};
