'use client';

import React, { useState } from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step8FileUpload: React.FC = () => {
  const { formData, updateData } = useIntake();
  const [dragActive, setDragActive] = useState(false);

  // Simulated file upload handling
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      updateData({ uploadedAssets: [...formData.uploadedAssets, ...fileNames] });
    }
  };

  const removeFile = (fileName: string) => {
    updateData({ uploadedAssets: formData.uploadedAssets.filter(f => f !== fileName) });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Assets & Branding</h2>
      <p className="text-[var(--text-secondary)]">Upload your logo, brand guidelines, or any imagery.</p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          dragActive ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[#2a3764] bg-[#132044]'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const fileNames = Array.from(e.dataTransfer.files).map(f => f.name);
            updateData({ uploadedAssets: [...formData.uploadedAssets, ...fileNames] });
          }
        }}
      >
        <div className="mx-auto flex justify-center mb-4 text-gray-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        <p className="text-white font-medium mb-1">Drag and drop your files here</p>
        <p className="text-sm text-gray-400 mb-4">PNG, JPG, PDF, SVG, AI</p>
        
        <label className="cursor-pointer bg-[var(--primary)] hover:bg-[var(--secondary)] text-[#0A1330] font-semibold py-2 px-6 rounded-md transition-colors inline-block">
          Browse Files
          <input type="file" multiple className="hidden" onChange={handleSimulatedUpload} />
        </label>
      </div>

      {formData.uploadedAssets.length > 0 && (
        <div className="space-y-2 mt-6">
          <h4 className="text-sm font-medium text-gray-300">Attached Files:</h4>
          {formData.uploadedAssets.map(file => (
            <div key={file} className="flex justify-between items-center bg-[#1a2754] px-4 py-2 rounded-md border border-[#2a3764]">
              <span className="text-sm text-white truncate mr-4">{file}</span>
              <button 
                type="button" 
                onClick={() => removeFile(file)}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
