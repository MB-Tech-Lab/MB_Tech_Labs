import React from 'react';
import { IntakeProvider } from '../../../modules/client-intake/context/IntakeContext';
import { IntakeWizard } from '../../../modules/client-intake/IntakeWizard';

export default function RequestQuotePage() {
  return (
    <div className="bg-[#050A1A] min-h-screen pt-24 pb-16 relative">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Project</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl">
            Let's build something incredible. Follow this guided process to scope your project and get an instant, confidential estimate.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <IntakeProvider>
            <IntakeWizard />
          </IntakeProvider>
        </div>
      </div>
    </div>
  );
}
