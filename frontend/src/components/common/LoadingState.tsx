import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 h-full w-full">
      <div className="w-8 h-8 border-4 border-[#1a2754] border-t-[var(--primary)] rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-[var(--text-secondary)] animate-pulse">Loading data...</p>
    </div>
  );
};
