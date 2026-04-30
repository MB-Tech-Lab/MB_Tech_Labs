import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  role: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const getNavItems = () => {
    const base = [
      { label: 'Dashboard', href: `/${role}` },
    ];
    
    // Add role-specific items
    switch (role) {
      case 'admin':
        base.push({ label: 'Users', href: `/${role}/users` });
        base.push({ label: 'Reports', href: `/${role}/reports` });
        break;
      case 'manager':
        base.push({ label: 'Projects', href: `/${role}/projects` });
        base.push({ label: 'Team', href: `/${role}/team` });
        break;
      case 'team_lead':
        base.push({ label: 'Tasks', href: `/${role}/tasks` });
        base.push({ label: 'Review', href: `/${role}/review` });
        break;
      case 'senior_developer':
      case 'junior_developer':
        base.push({ label: 'My Tasks', href: `/developer/tasks` });
        break;
      case 'intern':
        base.push({ label: 'Daily Tasks', href: `/${role}/tasks` });
        base.push({ label: 'Time Logs', href: `/${role}/time-logs` });
        break;
    }
    
    return base;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen bg-[var(--surface)] border-r border-[#1a2754] flex flex-col fixed left-0 top-0 transition-all">
      <div className="h-16 flex items-center px-4 border-b border-[#1a2754]">
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/img/MBTechLabsLogo.png" 
            alt="MB Tech Labs Logo" 
            width={36}
            height={36}
            className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,207,255,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(0,207,255,0.8)] transition-all group-hover:scale-105 shrink-0"
          />
          <span className="text-xl font-bold text-[var(--primary)] tracking-tight truncate">MB Tech Labs</span>
        </Link>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link 
                href={item.href}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#1a2754] transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-[#1a2754]">
        <p className="text-xs text-[var(--text-secondary)] text-center">
          &copy; 2026 MB Tech Labs
        </p>
      </div>
    </aside>
  );
};
