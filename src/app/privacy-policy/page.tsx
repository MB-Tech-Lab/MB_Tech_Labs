"use client";

import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[800px] px-5 sm:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-[13px] text-white/45">Last updated: January 2025</p>

          <div className="mt-8 space-y-6 text-[13.5px] text-white/65 leading-relaxed">
            <Section title="1. Information We Collect">
              We collect information you provide directly to us through our Software Requirement Gathering (SRG) form, contact forms, and career applications. This includes name, email, phone, company details, project requirements, and uploaded documents. We also collect technical data such as IP address, browser type, and usage patterns through cookies and analytics.
            </Section>
            <Section title="2. How We Use Your Information">
              We use your information to respond to project inquiries, prepare proposals and quotations, deliver contracted services, communicate about project progress, send invoices, and improve our services. For career applicants, we use your information to evaluate your candidacy and communicate about the hiring process.
            </Section>
            <Section title="3. Information Sharing">
              We do not sell, rent, or trade your personal information to third parties. We share information only with team members directly involved in your project, or when required by law. Third-party service providers (payment processors, cloud hosting) receive only the minimum data necessary to perform their functions.
            </Section>
            <Section title="4. Data Security">
              We implement industry-standard security measures including encrypted data transmission (TLS), hashed passwords (bcrypt), JWT-based authentication, role-based access control, and regular security audits. Despite these measures, no system is 100% secure, and we cannot guarantee absolute security.
            </Section>
            <Section title="5. Data Retention">
              We retain your information for as long as your account is active or as needed to provide services. Project data is retained for the duration of the engagement plus 2 years. Career application data is retained for 1 year. You may request deletion of your data at any time.
            </Section>
            <Section title="6. Your Rights">
              You have the right to access, correct, export, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at privacy@mbtechlabs.com.
            </Section>
            <Section title="7. Cookies">
              We use essential cookies for authentication and session management, and analytics cookies to understand how visitors use our website. You can control cookies through your browser settings.
            </Section>
            <Section title="8. Contact">
              For privacy questions or requests, email us at privacy@mbtechlabs.com or write to MB Tech Labs, Privacy Team.
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[15px] font-semibold text-white mb-2">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
