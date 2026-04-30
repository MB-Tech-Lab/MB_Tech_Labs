'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step3DomainDetails: React.FC = () => {
  const { formData, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Domain Details</h2>
      <p className="text-[var(--text-secondary)]">What web address do you want to use?</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Preferred Domain Name</label>
          <div className="flex">
            <input 
              type="text" 
              value={formData.preferredDomain}
              onChange={e => updateData({ preferredDomain: e.target.value })}
              className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-l-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
              placeholder="myawesomebusiness"
            />
            <select 
              value={formData.domainExtension}
              onChange={e => updateData({ domainExtension: e.target.value })}
              className="bg-[#1a2754] border border-[#2a3764] border-l-0 text-white rounded-r-lg px-4 py-3 focus:outline-none"
            >
              <option>.com</option>
              <option>.net</option>
              <option>.io</option>
              <option>.co</option>
              <option>.org</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
