'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step9AdditionalReqs: React.FC = () => {
  const { formData, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Additional Requirements</h2>
      <p className="text-[var(--text-secondary)]">Is there anything else we should know?</p>
      
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Project Notes</label>
        <textarea 
          value={formData.additionalRequirements}
          onChange={e => updateData({ additionalRequirements: e.target.value })}
          rows={6}
          className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
          placeholder="Tell us about your timeline, specific goals, or any unique features..."
        />
      </div>
    </div>
  );
};
