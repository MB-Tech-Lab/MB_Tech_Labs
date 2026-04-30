import React from 'react';

const solutions = [
  {
    title: 'Website Development',
    description: 'High-converting, lightning-fast landing pages and full-scale web platforms built with modern tech stacks.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: 'Mobile App Development',
    description: 'Cross-platform mobile experiences that feel native, delivering exceptional performance on iOS and Android.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Desktop Software',
    description: 'Powerful, native desktop applications optimized for complex workflows and enterprise environments.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Custom Software Solutions',
    description: 'Tailor-made backend architectures, APIs, and SaaS platforms built to scale with your business.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

export const Solutions: React.FC = () => {
  return (
    <section className="py-24 bg-[#0A1330] relative border-y border-[#1a2754]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Our Solutions</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            We provide end-to-end engineering services to turn your vision into a robust digital reality.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, idx) => (
            <div 
              key={idx} 
              className="bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-8 hover:bg-[#132044] hover:border-[var(--primary)]/50 hover:shadow-[0_0_30px_rgba(0,207,255,0.1)] transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#1a2754] group-hover:bg-[var(--primary)]/20 rounded-xl flex items-center justify-center text-[var(--primary)] mb-6 transition-colors">
                {solution.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
