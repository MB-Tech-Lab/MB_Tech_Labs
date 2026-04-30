import React from 'react';
import Link from 'next/link';

const projects = [
  {
    title: 'MBTL UI Components',
    description: 'A collection of accessible, reusable, and composable React components that power our internal and client projects.',
    tech: ['React', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/mbtechlabs/ui-components',
    stars: 124,
  },
  {
    title: 'Next.js SaaS Boilerplate',
    description: 'An open-source starter kit for building highly scalable SaaS applications with Next.js, Supabase, and Stripe.',
    tech: ['Next.js', 'Supabase', 'Stripe'],
    githubUrl: 'https://github.com/mbtechlabs/saas-boilerplate',
    stars: 342,
  },
  {
    title: 'PostgreSQL Auto-Migrator',
    description: 'A CLI tool written in Go to automatically generate and apply SQL migrations from schema definitions.',
    tech: ['Go', 'PostgreSQL', 'CLI'],
    githubUrl: 'https://github.com/mbtechlabs/pg-migrator',
    stars: 89,
  }
];

export const OpenSourceProjects: React.FC = () => {
  return (
    <section className="py-24 bg-[#050A1A] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Featured Projects</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Explore our open-source repositories. We build tools to solve our own problems and share them with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-8 flex flex-col h-full hover:border-[var(--primary)]/50 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#1a2754] rounded-xl flex items-center justify-center text-white group-hover:text-[var(--primary)] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center text-[var(--text-secondary)] text-sm font-medium">
                  <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {project.stars}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
              <p className="text-[var(--text-secondary)] mb-6 flex-grow">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-[#132044] text-xs text-[var(--text-secondary)] rounded-md border border-[#1a2754]">
                    {t}
                  </span>
                ))}
              </div>
              
              <Link 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[var(--primary)] font-semibold hover:text-[var(--secondary)] transition-colors mt-auto"
              >
                View Repository
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
