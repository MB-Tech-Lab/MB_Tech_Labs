import React from 'react';

export default function LegalPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-12">Legal Information</h1>
        
        <div className="space-y-12">
          <section className="bg-[#0A1330] p-8 rounded-2xl border border-[#1a2754]">
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Privacy Policy</h2>
            <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
              At MB Tech Labs, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Information We Collect</h3>
            <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes: Personal Data (such as your name, shipping address, email address, and telephone number) that you voluntarily give to us when registering with the Site or when choosing to participate in various activities.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Use of Your Information</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to create and manage your account, email you regarding your account or order, and fulfill and manage purchases.
            </p>
          </section>

          <section className="bg-[#0A1330] p-8 rounded-2xl border border-[#1a2754]">
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Terms of Service</h2>
            <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
              By accessing the website at mbtl.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Use License</h3>
            <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on MB Tech Labs website for personal, non-commercial transitory viewing only.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Disclaimer</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The materials on MB Tech Labs website are provided on an 'as is' basis. MB Tech Labs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
