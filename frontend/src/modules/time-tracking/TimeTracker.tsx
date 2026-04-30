'use client';
import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useTimer } from '../../hooks/useTimer';
import { useAuth } from '../../hooks/useAuth';

export const TimeTracker: React.FC = () => {
  const { isRunning, toggleTimer, formattedTime } = useTimer();
  const { user } = useAuth();

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Current Task Timer</h3>
        <p className="text-sm text-[var(--text-secondary)]">Track your daily hours globally</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-3xl font-mono text-[var(--primary)] font-bold">
          {formattedTime}
        </div>
        <Button 
          variant={isRunning ? 'outline' : 'primary'} 
          onClick={() => toggleTimer()}
          disabled={!user}
          className={isRunning ? 'text-red-400 border-red-500 hover:bg-red-500 hover:text-white' : ''}
        >
          {isRunning ? 'Stop Timer' : 'Start Timer'}
        </Button>
      </div>
    </Card>
  );
};

