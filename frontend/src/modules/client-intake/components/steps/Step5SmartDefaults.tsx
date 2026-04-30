'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step5SmartDefaults: React.FC = () => {
  const { formData, updateData } = useIntake();

  const handleTogglePage = (page: string) => {
    const pages = formData.selectedPages;
    if (pages.includes(page)) {
      updateData({ selectedPages: pages.filter(p => p !== page) });
    } else {
      updateData({ selectedPages: [...pages, page] });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Recommended Pages</h2>
      <p className="text-[var(--text-secondary)]">
        Based on your selection of <strong>{formData.websiteType}</strong>, we've pre-selected these standard pages. Feel free to add or remove them.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {formData.selectedPages.map(page => (
          <div key={page} className="flex items-center space-x-2 bg-[#132044] border border-[var(--primary)]/50 p-3 rounded-md">
            <input 
              type="checkbox" 
              checked 
              onChange={() => handleTogglePage(page)}
              className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
            />
            <span className="text-white text-sm">{page}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-[#2a3764]">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Need a custom page?</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            id="customPageInput"
            className="flex-1 bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--primary)]"
            placeholder="e.g., Careers, Case Studies"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val && !formData.selectedPages.includes(val)) {
                  handleTogglePage(val);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Press Enter to add.</p>
      </div>
    </div>
  );
};
