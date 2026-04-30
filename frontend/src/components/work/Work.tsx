import React from 'react';

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
  {
    title: 'Healthcare Booking App',
    description: 'HIPAA-compliant patient portal and appointment scheduling application.',
    tech: ['React Native', 'Firebase', 'GraphQL'],
    color: 'from-rose-500/20 to-orange-500/20',
  },
  {
    title: 'Logistics Management System',
    description: 'Internal tool for tracking fleet movements and optimizing delivery routes globally.',
    tech: ['Vue.js', 'Python', 'Docker', 'Google Maps API'],
    color: 'from-amber-500/20 to-yellow-500/20',
  },
];

export const Work: React.FC = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Our Work</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Explore some of the high-performance applications we've built for forward-thinking companies.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
              {/* Image Placeholder */}
              <div className={`w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br ${project.color} border border-[#2a3764] mb-6 flex items-center justify-center overflow-hidden relative`}>
                <div className="absolute inset-0 bg-[#0F1A3A]/40 group-hover:bg-transparent transition-colors duration-500"></div>
                <svg className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Project Info */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">{project.title}</h3>
                <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
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
