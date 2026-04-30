import React from 'react';

export const Vision: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[#0A1330]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary)] to-transparent mx-auto mb-8 rounded-full"></div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
            Building the Future of <span className="text-[var(--primary)]">Digital Solutions</span>
          </h2>
          
          <p className="text-lg md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto font-light">
            We don't just build software for today. Our vision is rooted in long-term innovation, focusing on highly scalable systems, proactive problem solving, and architectures that adapt to the ever-evolving technological landscape. We partner with visionaries to engineer platforms that stand the test of time.
          </p>
        </div>
      </div>
    </section>
  );
};
