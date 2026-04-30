import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">High-Performance</span> Websites for Modern Businesses
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            From idea to launch — we design, develop, and scale your digital presence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#contact" 
              className="w-full sm:w-auto px-8 py-4 bg-[var(--primary)] hover:bg-[var(--secondary)] text-[#0A1330] text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,207,255,0.4)]"
            >
              Get Started
            </Link>
            <Link 
              href="#work" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#2a3764] hover:bg-[#1a2754] text-white text-lg font-medium rounded-lg transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
