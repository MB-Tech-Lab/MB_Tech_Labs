import React from 'react';

const communityItems = [
  {
    title: 'Open Source Projects',
    description: 'We actively maintain and contribute to tools that empower developers worldwide, believing that software grows best when shared.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Community Contributions',
    description: 'From fixing bugs in popular libraries to organizing local tech meetups, we are committed to giving back to the ecosystem.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Knowledge Sharing',
    description: 'We frequently publish technical articles, case studies, and tutorials to help aspiring engineers navigate complex architectures.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export const Community: React.FC = () => {
  return (
    <section className="py-24 bg-[#0A1330] relative border-y border-[#1a2754]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Open Source & Community</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            We don't just consume technology; we help build it. MB Tech Labs is deeply invested in the open-source ecosystem.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {communityItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-8 hover:bg-[#132044] hover:shadow-[0_0_30px_rgba(0,207,255,0.1)] transition-all duration-300 group text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#1a2754] group-hover:bg-[var(--primary)]/20 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-6 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
