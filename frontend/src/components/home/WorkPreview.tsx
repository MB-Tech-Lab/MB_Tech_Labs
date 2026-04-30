import React from 'react';
import Link from 'next/link';

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'A highly scalable multi-vendor marketplace with real-time inventory and seamless checkout.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    title: 'Financial SaaS Dashboard',
    description: 'Real-time analytics and predictive financial modeling for enterprise clients.',
    tech: ['React', 'Django', 'Redis', 'AWS'],
    color: 'from-emerald-500/20 to-teal-500/20',
  },
];

export const WorkPreview: React.FC = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Recent Work</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Explore some of the high-performance applications we've built.
            </p>
          </div>
          <div>
            <Link 
              href="/work" 
              className="inline-flex items-center text-[var(--primary)] font-semibold hover:text-[var(--secondary)] transition-colors"
            >
              View Full Portfolio
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
              {/* Image Placeholder */}
              <div className={`w-full h-64 rounded-2xl bg-gradient-to-br ${project.color} border border-[#2a3764] mb-6 flex items-center justify-center overflow-hidden relative`}>
                <div className="absolute inset-0 bg-[#0F1A3A]/40 group-hover:bg-transparent transition-colors duration-500"></div>
                <svg className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Project Info */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">{project.title}</h3>
                <p className="text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, tIdx) => (
                    <span key={tIdx} className="text-xs font-medium px-3 py-1 bg-[#1a2754] text-[var(--primary)] rounded-full border border-[var(--primary)]/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
