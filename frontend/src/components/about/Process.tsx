import React from 'react';

const steps = [
  {
    title: 'Requirement Analysis',
    description: 'We deeply understand your business logic, goals, and technical needs before starting.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Planning & Proposal',
    description: 'We architect a robust solution, select the best tech stack, and define a clear roadmap.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Development',
    description: 'Our engineers build your product using agile methodologies and modern frameworks.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Delivery & Support',
    description: 'We deploy the application, perform rigorous testing, and provide ongoing maintenance.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
      </svg>
    ),
  },
];

export const Process: React.FC = () => {
  return (
    <section className="py-24 bg-[#0A1330] relative border-y border-[#1a2754]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">How We Build Your Project</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            A transparent and efficient workflow designed to deliver high-quality software on time.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-8 hover:border-[var(--primary)]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#1a2754] group-hover:bg-[var(--primary)]/20 rounded-xl flex items-center justify-center text-[var(--primary)] mb-6 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                <span className="text-[var(--primary)] mr-2">0{idx + 1}.</span> 
                {step.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
