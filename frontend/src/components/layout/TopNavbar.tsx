'use client';
import React, { useEffect, useState } from 'react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const TopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-[var(--surface)] border-b border-[#1a2754] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        {mounted && user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs text-[var(--text-secondary)] capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <Avatar name={user.name} />
          </div>
        )}
        <div className="h-6 w-px bg-[#1a2754] mx-2"></div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
          Logout
        </Button>
      </div>
    </header>
  );
};

