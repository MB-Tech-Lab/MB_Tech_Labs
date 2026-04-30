import React from 'react';

const technologies = [
  {
    category: 'Frontend',
    items: ['Next.js', 'React']
  },
  {
    category: 'Backend',
    items: ['Django', 'Node.js']
  },
  {
    category: 'Database',
    items: ['PostgreSQL', 'MySQL']
  },
  {
    category: 'Cloud',
    items: ['AWS', 'Firebase']
  }
];

export const Technologies: React.FC = () => {
  return (
    <section className="py-24 bg-[#050A1A] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Technologies We Work With</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Our stack is carefully chosen to ensure performance, security, and scalability for every project.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {technologies.map((techGroup, idx) => (
            <div key={idx} className="bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-6 hover:border-[var(--primary)]/50 transition-colors">
              <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-[#1a2754] flex items-center">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] mr-3"></span>
                {techGroup.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {techGroup.items.map((item, itemIdx) => (
                  <span 
                    key={itemIdx} 
                    className="px-4 py-2 bg-[#132044] text-[var(--primary)] rounded-lg font-medium text-sm border border-[var(--primary)]/20 hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
