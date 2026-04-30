'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { ALL_AVAILABLE_FEATURES } from '../../logic/smartDefaults';

export const Step6FeatureSelection: React.FC = () => {
  const { formData, updateData } = useIntake();

  const handleToggleFeature = (feature: string) => {
    const features = formData.selectedFeatures;
    if (features.includes(feature)) {
      updateData({ selectedFeatures: features.filter(f => f !== feature) });
    } else {
      updateData({ selectedFeatures: [...features, feature] });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Feature Requirements</h2>
      <p className="text-[var(--text-secondary)]">Select any specific features or integrations you need.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_AVAILABLE_FEATURES.map(feature => {
          const isSelected = formData.selectedFeatures.includes(feature);
          return (
            <label 
              key={feature} 
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                  : 'border-[#2a3764] bg-[#132044] hover:border-[var(--primary)]/50'
              }`}
            >
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => handleToggleFeature(feature)}
                className="w-4 h-4 text-[var(--primary)] bg-gray-700 border-gray-600 rounded focus:ring-[var(--primary)] focus:ring-2"
              />
              <span className="text-white text-sm font-medium">{feature}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
