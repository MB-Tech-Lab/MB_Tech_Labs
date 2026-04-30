'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step7DesignPreferences: React.FC = () => {
  const { formData, updateData } = useIntake();

  const styles = ['Modern & Minimal', 'Bold & Vibrant', 'Corporate & Professional', 'Dark Mode Focused', 'Playful & Creative'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Design Preferences</h2>
      <p className="text-[var(--text-secondary)]">Help us understand the look and feel you want.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Primary Design Style</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {styles.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => updateData({ designStyle: style })}
                className={`p-3 border rounded-lg text-left transition-all ${
                  formData.designStyle === style 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white' 
                    : 'border-[#2a3764] bg-[#132044] text-gray-300 hover:border-[var(--primary)]/50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Brand Colors</label>
          <input 
            type="text" 
            value={formData.colorPreferences}
            onChange={e => updateData({ colorPreferences: e.target.value })}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="e.g., #0A1330 (Deep Blue), or 'Neon Green and Black'"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Reference Websites (Optional)</label>
          <textarea 
            value={formData.referenceSites}
            onChange={e => updateData({ referenceSites: e.target.value })}
            rows={3}
            className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
            placeholder="Links to websites you like..."
          />
        </div>
      </div>
    </div>
  );
};
