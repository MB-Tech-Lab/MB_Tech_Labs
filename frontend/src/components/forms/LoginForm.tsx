'use client';

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/user';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(selectedRole);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Select Role (Mock Login)
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
          className="w-full bg-[#1a2754] border border-[#2a3764] text-[var(--text-primary)] rounded-md h-10 px-3 focus:outline-none focus:border-[var(--primary)]"
        >
          <option value="admin">Admin (Founder)</option>
          <option value="manager">Project Manager</option>
          <option value="team_lead">Team Lead</option>
          <option value="senior_developer">Senior Developer</option>
          <option value="intern">Intern</option>
        </select>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Authenticating...' : 'Sign In'}
      </Button>
    </form>
  );
};
