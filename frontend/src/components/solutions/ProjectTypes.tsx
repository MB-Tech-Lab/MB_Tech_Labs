import React from 'react';

const projectTypes = [
  {
    title: 'Business Websites',
    description: 'High-performance corporate websites built with Next.js for blazing fast SEO and user experience.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: 'E-commerce Platforms',
    description: 'Scalable multi-vendor stores and custom retail platforms with secure payment integrations.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps using React Native for iOS and Android platforms.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Custom Software Solutions',
    description: 'Complex SaaS applications, internal dashboards, and custom CRM architectures.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

export const ProjectTypes: React.FC = () => {
  return (
    <section className="py-24 bg-[#050A1A] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Project Types We Handle</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            From simple landing pages to enterprise-grade platforms, we have the expertise to deliver.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projectTypes.map((project, idx) => (
            <div 
              key={idx} 
              className="bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-8 hover:bg-[#132044] hover:shadow-[0_0_30px_rgba(0,207,255,0.1)] transition-all duration-300 flex flex-col sm:flex-row items-start gap-6"
            >
              <div className="w-16 h-16 shrink-0 bg-[#1a2754] rounded-xl flex items-center justify-center text-[var(--primary)] transition-colors">
                {project.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
