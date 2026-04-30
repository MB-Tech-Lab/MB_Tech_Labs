'use client';

import React from 'react';
import { useIntake } from '../../context/IntakeContext';

export const Step15FinalReview: React.FC = () => {
  const { formData } = useIntake();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Final Review</h2>
      <p className="text-[var(--text-secondary)]">Please review your project details before submitting.</p>
      
      <div className="bg-[#1a2754] border border-[#2a3764] rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Client Info</h3>
          <p className="text-white">{formData.clientName} ({formData.clientEmail})</p>
          <p className="text-gray-400">{formData.companyName} - {formData.websiteType}</p>
        </div>

        <div className="border-t border-[#2a3764] pt-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Technical Details</h3>
          <p className="text-gray-300 text-sm mb-1"><strong>Domain:</strong> {formData.preferredDomain}{formData.domainExtension}</p>
          <p className="text-gray-300 text-sm mb-1"><strong>Pages:</strong> {formData.selectedPages.length} requested</p>
          <p className="text-gray-300 text-sm"><strong>Features:</strong> {formData.selectedFeatures.join(', ')}</p>
        </div>

        <div className="border-t border-[#2a3764] pt-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Investment</h3>
          {formData.pricingEstimate ? (
            <p className="text-[var(--primary)] font-bold text-xl">
              ${formData.pricingEstimate.oneTimeCost.toLocaleString()} + ${formData.pricingEstimate.monthlyCost}/mo
            </p>
          ) : (
            <p className="text-red-400">Estimate error</p>
          )}
          {formData.comfortableWithEstimate === false && (
            <p className="text-yellow-500 text-sm mt-1">Requested custom budget: {formData.customBudget}</p>
          )}
        </div>
      </div>
    </div>
  );
};
