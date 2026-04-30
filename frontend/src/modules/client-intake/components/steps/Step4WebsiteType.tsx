'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step4WebsiteType: React.FC = () => {
  const { formData, handleWebsiteTypeSelection } = useIntake();

  const types = ['Business', 'E-commerce', 'Portfolio', 'SaaS', 'Custom'] as const;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Website Type</h2>
      <p className="text-[var(--text-secondary)]">What kind of website are you looking to build?</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => handleWebsiteTypeSelection(type)}
            className={`p-6 border rounded-lg text-left transition-all ${
              formData.websiteType === type 
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_15px_rgba(0,207,255,0.2)]' 
                : 'border-[#2a3764] bg-[#132044] hover:border-[var(--primary)]/50'
            }`}
          >
            <h3 className="font-bold text-white text-lg">{type}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};
