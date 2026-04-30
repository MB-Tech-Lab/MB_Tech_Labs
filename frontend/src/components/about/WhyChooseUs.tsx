import React from 'react';

const reasons = [
  {
    title: 'Fast Delivery',
    description: 'We utilize a streamlined workflow and modern tech stack to rapidly prototype and deploy your product to market.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Scalable Solutions',
    description: 'Our architectures are designed to handle growth seamlessly, so your software remains robust even under heavy traffic.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    )
  },
  {
    title: 'Client-Focused Approach',
    description: 'We believe in complete transparency. Our custom client portal keeps you updated on progress at every stage.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    )
  },
  {
    title: 'Ongoing Support',
    description: 'Our relationship doesnt end at launch. We provide dedicated maintenance to keep your systems secure and updated.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-[#0A1330] border-y border-[#1a2754]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Why Choose MB Tech Labs?</h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
              We go beyond just writing code. We act as your technical co-founders, building solutions that directly impact your bottom line.
            </p>
            <div className="hidden lg:block w-20 h-1 bg-[var(--primary)] rounded-full"></div>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex flex-col p-6 rounded-2xl bg-[#0F1A3A] border border-[#1a2754] hover:border-[var(--primary)]/30 transition-colors">
                <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center mb-5">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
