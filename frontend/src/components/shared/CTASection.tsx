import React from 'react';
import Link from 'next/link';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#132044] to-[#0A1330] border border-[#1a2754] rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--secondary)]/10 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10 tracking-tight">
            Tell us what you want. We'll build it for you.
          </h2>
          
          <div className="mt-10 relative z-10">
            <Link 
              href="/request-quote" 
              className="inline-block px-10 py-5 bg-[var(--primary)] hover:bg-[var(--secondary)] text-[#0A1330] text-xl font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,207,255,0.4)]"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
