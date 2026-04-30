'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step2CompanyDetails: React.FC = () => {
  const { formData, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Company Details</h2>
      <p className="text-[var(--text-secondary)]">Tell us about your business.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Company Name</label>
          <input 
            type="text" 
            required
            value={formData.companyName}
            onChange={e => updateData({ companyName: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Industry</label>
          <input 
            type="text" 
            value={formData.industry}
            onChange={e => updateData({ industry: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="e.g. Healthcare, Retail, Tech"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Company Type</label>
          <select 
            value={formData.companyType}
            onChange={e => updateData({ companyType: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="">Select a type...</option>
            <option value="Startup">Startup</option>
            <option value="Small Business">Small Business</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Non-Profit">Non-Profit</option>
            <option value="Individual">Individual/Freelancer</option>
          </select>
        </div>
      </div>
    </div>
  );
};
