'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step11PricingDisplay: React.FC = () => {
  const { formData } = useIntake();
  const estimate = formData.pricingEstimate;

  if (!estimate) return null; // Fallback

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Estimated Investment</h2>
        <p className="text-[var(--text-secondary)]">Based on your requirements, here is the projected cost.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="bg-[#1a2754] border border-[#2a3764] rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]"></div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">One-Time Development</h3>
          <div className="text-4xl font-bold text-white mb-4">
            ${estimate.oneTimeCost.toLocaleString()}
          </div>
          <p className="text-sm text-gray-400">
            Covers design, development, and launch.
          </p>
        </div>

        <div className="bg-[#132044] border border-[var(--primary)]/50 rounded-xl p-8 text-center relative overflow-hidden shadow-[0_0_20px_rgba(0,207,255,0.1)]">
          <div className="absolute top-0 right-0 bg-[var(--primary)] text-[#0A1330] text-xs font-bold px-3 py-1 rounded-bl-lg">
            REQUIRED
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Monthly Service Plan</h3>
          <div className="text-4xl font-bold text-[var(--primary)] mb-4">
            ${estimate.monthlyCost}<span className="text-lg text-gray-400 font-normal">/mo</span>
          </div>
          <p className="text-sm text-gray-400">
            Covers managed hosting, security updates, and maintenance.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-xs text-gray-500 max-w-lg mx-auto">
          * This is an automated estimate. Final pricing may be adjusted during our kickoff call based on exact technical specifications.
        </p>
      </div>
    </div>
  );
};
