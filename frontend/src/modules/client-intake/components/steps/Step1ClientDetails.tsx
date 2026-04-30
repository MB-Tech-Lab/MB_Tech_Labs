'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step1ClientDetails: React.FC = () => {
  const { formData, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Client Details</h2>
      <p className="text-[var(--text-secondary)]">Let's start with your contact information.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Full Name</label>
          <input 
            type="text" 
            required
            value={formData.clientName}
            onChange={e => updateData({ clientName: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
          <input 
            type="email" 
            required
            value={formData.clientEmail}
            onChange={e => updateData({ clientEmail: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Phone Number</label>
          <input 
            type="tel" 
            required
            value={formData.clientPhone}
            onChange={e => updateData({ clientPhone: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
    </div>
  );
};
