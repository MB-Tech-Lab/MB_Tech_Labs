import React from 'react';

const stats = [
  {
    label: 'Projects Completed',
    value: '50+',
  },
  {
    label: 'Clients Served',
    value: '30+',
  },
  {
    label: 'Lines of Code',
    value: '1M+',
  },
  {
    label: 'Uptime',
    value: '99.9%',
  }
];

export const Stats: React.FC = () => {
  return (
    <section className="py-16 bg-[#0F1A3A] relative border-y border-[#1a2754] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-[var(--primary)]/5 blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[var(--text-secondary)] uppercase tracking-wider">Trusted by Growing Businesses</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto divide-x divide-[#1a2754]/0 md:divide-[#1a2754]">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center px-4 py-6">
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-[var(--primary)] mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--text-secondary)] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
