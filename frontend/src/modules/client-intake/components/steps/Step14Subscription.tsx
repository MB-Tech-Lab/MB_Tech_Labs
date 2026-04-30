'use client';

import React from 'react';

export const Step14Subscription: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Service Agreement</h2>
      <p className="text-[var(--text-secondary)]">Please review our ongoing service terms.</p>
      
      <div className="bg-[#1a2754] border border-[#2a3764] rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Monthly Service Plan Acknowledgement</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          This project includes a mandatory monthly service plan that covers premium hosting, SSL certificates, security patches, API maintenance, and technical support.
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          <strong>Important:</strong> Our systems are fully managed. To ensure security and performance, we do not provide direct hosting access. Failure to maintain the monthly service plan will result in automated suspension of the website until the account is brought current.
        </p>
      </div>
    </div>
  );
};
