"use client";

import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[800px] px-5 sm:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">Terms & Conditions</h1>
          <p className="mt-2 text-[13px] text-white/45">Last updated: January 2025</p>

          <div className="mt-8 space-y-6 text-[13.5px] text-white/65 leading-relaxed">
            <Section title="1. Acceptance of Terms">
              By accessing or using the MB Tech Labs website, Software Requirement Gathering (SRG) portal, admin dashboard, or any related services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
            </Section>
            <Section title="2. Services">
              MB Tech Labs provides software development services including but not limited to custom web applications, mobile apps, enterprise software, AI solutions, cloud infrastructure, and UI/UX design. Specific deliverables, timelines, and pricing are defined in individual project proposals and quotations.
            </Section>
            <Section title="3. Intellectual Property">
              All source code, designs, documentation, and intellectual property created for a client project belongs to the client upon full payment. MB Tech Labs retains the right to use generic, non-confidential components, patterns, and libraries developed during the project in future work. Pre-existing MB Tech Labs IP remains our property.
            </Section>
            <Section title="4. Payment Terms">
              Project payments are structured as defined in the signed quotation. Typical terms: 40% advance, 30% on MVP delivery, 30% on final delivery. Invoices are due within 15 days of issuance. Late payments may incur interest charges of 1.5% per month.
            </Section>
            <Section title="5. Project Scope & Changes">
              Project scope is defined in the SRG and proposal. Any changes requested outside the agreed scope will be evaluated and quoted separately. MB Tech Labs will not begin work on out-of-scope items without written approval.
            </Section>
            <Section title="6. Confidentiality">
              Both parties agree to keep confidential all proprietary information shared during the engagement. This includes business strategies, technical architecture, user data, and pricing. Confidentiality obligations survive termination of the engagement.
            </Section>
            <Section title="7. Warranties">
              MB Tech Labs warrants that delivered software will conform to the specifications in the proposal for a period of 30 days after delivery. This warranty does not cover issues caused by third-party services, client modifications, or misuse. Post-warranty support is available under separate maintenance agreements.
            </Section>
            <Section title="8. Limitation of Liability">
              MB Tech Labs' total liability shall not exceed the total amount paid by the client for the specific project giving rise to the claim. We are not liable for indirect, incidental, or consequential damages including loss of revenue, data, or business opportunity.
            </Section>
            <Section title="9. Career Applications">
              For internship applications submitted through our career portal, MB Tech Labs reserves the right to accept or reject any application without explanation. Submitted information is used solely for evaluation purposes and is kept confidential.
            </Section>
            <Section title="10. Contact">
              For questions about these Terms, email us at legal@mbtechlabs.com.
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
