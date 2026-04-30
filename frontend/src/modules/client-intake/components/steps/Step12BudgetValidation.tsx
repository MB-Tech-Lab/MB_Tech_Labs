'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step12BudgetValidation: React.FC = () => {
  const { formData, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Budget Validation</h2>
      <p className="text-[var(--text-secondary)]">Are you comfortable moving forward with this estimated investment?</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => updateData({ comfortableWithEstimate: true })}
          className={`p-6 border rounded-lg text-center transition-all ${
            formData.comfortableWithEstimate === true 
              ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
              : 'border-[#2a3764] bg-[#132044] hover:border-green-500/50'
          }`}
        >
          <div className="text-3xl mb-2">✅</div>
          <h3 className="font-bold text-white text-lg">Yes, I'm comfortable</h3>
        </button>

        <button
          type="button"
          onClick={() => updateData({ comfortableWithEstimate: false })}
          className={`p-6 border rounded-lg text-center transition-all ${
            formData.comfortableWithEstimate === false 
              ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
              : 'border-[#2a3764] bg-[#132044] hover:border-yellow-500/50'
          }`}
        >
          <div className="text-3xl mb-2">🤔</div>
          <h3 className="font-bold text-white text-lg">No, it's outside my budget</h3>
        </button>
      </div>

      {formData.comfortableWithEstimate === false && (
        <div className="mt-8 p-6 border border-yellow-500/30 bg-yellow-500/5 rounded-lg animate-fadeIn">
          <h4 className="text-lg font-bold text-yellow-500 mb-2">Let's find a solution</h4>
          <p className="text-sm text-gray-300 mb-4">
            We understand every business has financial limits. We may be able to adjust the scope or phase the development. What is your maximum budget for this phase?
          </p>
          <input 
            type="text" 
            value={formData.customBudget}
            onChange={e => updateData({ customBudget: e.target.value })}
            className="w-full bg-[#1a2754] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
            placeholder="e.g. $1,500 maximum"
          />
        </div>
      )}
    </div>
  );
};
