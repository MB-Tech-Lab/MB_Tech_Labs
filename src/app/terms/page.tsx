import { LegalPageLayout, LegalP, LegalList, LegalBullet, LegalCallout } from "@/components/mb-tech-labs/LegalPageLayout";

export const metadata = {
  title: "Terms & Conditions — MB Tech Labs",
  description: "The terms and conditions governing software development services provided by MB Tech Labs. Covers client responsibilities, payment terms, intellectual property, confidentiality, warranties, and dispute resolution.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      data={{
        eyebrow: "Terms & Conditions",
        title: "Terms & Conditions",
        subtitle:
          "These terms govern the relationship between MB Tech Labs and our clients. By engaging our services, you agree to these terms. We've written them in plain English — no hidden clauses.",
        lastUpdated: "January 2025",
        ctaTitle: "Questions?",
        ctaDescription: "If you have questions about these terms before starting a project, we're happy to clarify. Reach out anytime.",
        ctaButtonText: "Contact Us",
        ctaHref: "/contact",
        relatedTitle: "Related Documents",
        relatedLinks: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Pricing Policy", href: "/pricing-policy" },
          { label: "Refund Policy", href: "/refund-cancellation" },
          { label: "Shipping Policy", href: "/shipping-delivery" },
          { label: "Contact", href: "/contact" },
        ],
        sections: [
          {
            id: "introduction",
            number: 1,
            title: "Introduction",
            content: (
              <LegalP>
                These Terms & Conditions ("Terms") govern the provision of software development, consulting, and related services by MB Tech Labs ("we", "us", "our") to you ("client", "you"). By submitting a Software Requirement Gathering (SRG) form, signing a proposal, or making a payment, you acknowledge that you have read, understood, and agreed to these Terms.
              </LegalP>
            ),
          },
          {
            id: "acceptance",
            number: 2,
            title: "Acceptance of Terms",
            content: (
              <>
                <LegalP>
                  These Terms constitute a legally binding agreement between you and MB Tech Labs. If you do not agree to any provision, you must not engage our services. We may update these Terms from time to time; the version current at the time of your project engagement applies.
                </LegalP>
                <LegalCallout type="info">
                  By proceeding with any MB Tech Labs service, you confirm that you are authorized to enter into this agreement on behalf of your organization.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "services",
            number: 3,
            title: "Services",
            content: (
              <>
                <LegalP>
                  MB Tech Labs provides the following services:
                </LegalP>
                <LegalList>
                  <LegalBullet>Custom website and web application development</LegalBullet>
                  <LegalBullet>Enterprise software and ERP systems</LegalBullet>
                  <LegalBullet>Mobile application development (iOS and Android)</LegalBullet>
                  <LegalBullet>Artificial intelligence and machine learning solutions</LegalBullet>
                  <LegalBullet>Cloud infrastructure setup and DevOps</LegalBullet>
                  <LegalBullet>API development and integration</LegalBullet>
                  <LegalBullet>UI/UX design and design systems</LegalBullet>
                  <LegalBullet>Software consulting and technical advisory</LegalBullet>
                </LegalList>
                <LegalP>
                  The specific scope, deliverables, timeline, and pricing for each engagement are defined in a separate proposal and quotation document.
                </LegalP>
              </>
            ),
          },
          {
            id: "client-responsibilities",
            number: 4,
            title: "Client Responsibilities",
            content: (
              <>
                <LegalP>To ensure successful project delivery, you agree to:</LegalP>
                <LegalList>
                  <LegalBullet>Provide accurate and complete information during the SRG process.</LegalBullet>
                  <LegalBullet>Designate a primary point of contact who can make decisions and approve deliverables.</LegalBullet>
                  <LegalBullet>Review milestones within 5 business days of delivery and provide consolidated feedback.</LegalBullet>
                  <LegalBullet>Provide timely access to existing systems, accounts, and data required for integration.</LegalBullet>
                  <LegalBullet>Ensure you have the legal right to share all content, branding, and data provided to us.</LegalBullet>
                  <LegalBullet>Make payments according to the agreed schedule.</LegalBullet>
                </LegalList>
                <LegalCallout type="warning">
                  Client delays exceeding 14 days may result in project suspension. Reactivation may incur additional costs.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "payment-terms",
            number: 5,
            title: "Payment Terms",
            content: (
              <>
                <LegalP>Payment schedules are defined in each project quotation. Standard terms:</LegalP>
                <LegalList>
                  <LegalBullet><strong>40% advance</strong> — Due before development begins.</LegalBullet>
                  <LegalBullet><strong>30% on MVP delivery</strong> — Due within 7 days of milestone approval.</LegalBullet>
                  <LegalBullet><strong>30% on final delivery</strong> — Due within 7 days of project acceptance.</LegalBullet>
                </LegalList>
                <LegalP>
                  Invoices are payable within 15 days of issuance. Late payments incur interest at 1.5% per month. We accept bank transfers, UPI, and international wire transfers. All prices are exclusive of applicable taxes unless stated otherwise.
                </LegalP>
              </>
            ),
          },
          {
            id: "project-scope",
            number: 6,
            title: "Project Scope & Changes",
            content: (
              <>
                <LegalP>
                  The project scope is defined by the SRG submission and the signed proposal. Any work outside this scope — including new features, design changes, or integration additions — is treated as a change request.
                </LegalP>
                <LegalP>
                  Change requests are evaluated for impact on timeline, cost, and architecture. We provide a written quote for each change request. Work begins only after you approve the change request in writing. There are no silent scope changes or surprise invoices.
                </LegalP>
              </>
            ),
          },
          {
            id: "revisions",
            number: 7,
            title: "Revisions",
            content: (
              <>
                <LegalP>
                  Each milestone includes up to 2 rounds of revisions at no additional cost. A revision round is defined as consolidated feedback on a delivered milestone. Additional rounds or feedback that fundamentally changes the agreed scope are billed as change requests.
                </LegalP>
              </>
            ),
          },
          {
            id: "intellectual-property",
            number: 8,
            title: "Intellectual Property",
            content: (
              <>
                <LegalP>
                  Upon full payment, all custom-developed source code, designs, documentation, and deliverables created specifically for your project become your intellectual property.
                </LegalP>
                <LegalCallout type="info">
                  MB Tech Labs retains the right to reuse generic, non-confidential architectural patterns, code libraries, and development workflows developed during your project in future engagements. Your specific business logic, branding, and data remain strictly confidential.
                </LegalCallout>
                <LegalP>
                  Pre-existing MB Tech Labs IP, including internal tools, frameworks, and templates, remains our property. You receive a perpetual, non-exclusive license to use any such components embedded in your deliverables.
                </LegalP>
              </>
            ),
          },
          {
            id: "confidentiality",
            number: 9,
            title: "Confidentiality",
            content: (
              <LegalP>
                Both parties agree to maintain confidentiality of all proprietary information shared during the engagement, including business strategies, technical architecture, user data, pricing, and project details. Confidentiality obligations survive termination of the engagement for a period of 3 years. We are happy to sign a mutual NDA before any technical discussion.
              </LegalP>
            ),
          },
          {
            id: "communication",
            number: 10,
            title: "Communication",
            content: (
              <>
                <LegalP>
                  Project communication occurs through agreed channels — typically Slack, email, and weekly video calls. We provide:
                </LegalP>
                <LegalList>
                  <LegalBullet>Weekly progress demos (30–60 minutes).</LegalBullet>
                  <LegalBullet>Daily updates via Slack or project management tool.</LegalBullet>
                  <LegalBullet>Written status reports after each milestone.</LegalBullet>
                  <LegalBullet>Direct access to the project lead for urgent issues.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "timelines-delays",
            number: 11,
            title: "Timelines & Delays",
            content: (
              <LegalP>
                Project timelines are estimates based on the scope defined at project start. While we strive to meet all deadlines, delays may occur due to scope changes, pending client feedback, third-party service outages, or technical discoveries during development. We notify you of any anticipated delay within 24 hours of identifying it, along with a revised timeline and mitigation plan.
              </LegalP>
            ),
          },
          {
            id: "termination",
            number: 12,
            title: "Termination",
            content: (
              <>
                <LegalP>
                  Either party may terminate the engagement with 14 days written notice. In the event of termination:
                </LegalP>
                <LegalList>
                  <LegalBullet>You pay for all work completed up to the termination date.</LegalBullet>
                  <LegalBullet>We deliver all completed code, designs, and documentation up to the termination point.</LegalBullet>
                  <LegalBullet>Advance payments for uncompleted milestones are refunded on a pro-rata basis, minus the cost of work already in progress.</LegalBullet>
                  <LegalBullet>Any deliverables already handed over remain your property if fully paid for.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "warranty",
            number: 13,
            title: "Warranty",
            content: (
              <>
                <LegalP>
                  We warrant that delivered software will conform to the specifications in the signed proposal for a period of 30 days after final delivery. During this period, we will fix any defects that prevent the software from functioning as specified at no additional cost.
                </LegalP>
                <LegalCallout type="warning">
                  This warranty does not cover issues caused by client modifications, third-party service changes, server environment changes, or misuse of the software.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "liability",
            number: 14,
            title: "Limitation of Liability",
            content: (
              <LegalP>
                MB Tech Labs' total liability for any claim arising from this agreement shall not exceed the total amount paid by you for the specific project giving rise to the claim. We are not liable for indirect, incidental, special, or consequential damages, including loss of revenue, data, profits, or business opportunity. We are not liable for issues arising from third-party services, client-provided content, or force majeure events.
              </LegalP>
            ),
          },
          {
            id: "third-party",
            number: 15,
            title: "Third-Party Services",
            content: (
              <LegalP>
                Our software may integrate with third-party services (payment gateways, cloud providers, email services, AI APIs). We are not responsible for outages, changes, or deprecations of these services. We will assist in migrating to alternative services if a third-party provider discontinues their offering.
              </LegalP>
            ),
          },
          {
            id: "open-source",
            number: 16,
            title: "Open Source Software",
            content: (
              <LegalP>
                We use open-source libraries and frameworks in our projects. All open-source components are used in accordance with their respective licenses (MIT, Apache 2.0, BSD, etc.). We do not use GPL-licensed components in proprietary client software without explicit written consent.
              </LegalP>
            ),
          },
          {
            id: "force-majeure",
            number: 17,
            title: "Force Majeure",
            content: (
              <LegalP>
                Neither party is liable for delays or failures caused by events beyond their reasonable control, including natural disasters, pandemics, war, terrorism, government actions, internet outages, or power failures. The affected party will notify the other within 48 hours and resume work as soon as conditions permit.
              </LegalP>
            ),
          },
          {
            id: "dispute-resolution",
            number: 18,
            title: "Dispute Resolution",
            content: (
              <LegalP>
                In the event of a dispute, both parties agree to first attempt resolution through good-faith negotiations for a period of 30 days. If unresolved, disputes will be submitted to binding arbitration. The governing law is the jurisdiction in which MB Tech Labs is registered.
              </LegalP>
            ),
          },
          {
            id: "governing-law",
            number: 19,
            title: "Governing Law",
            content: (
              <LegalP>
                These Terms are governed by the laws of India. Any legal proceedings arising from these Terms will be brought in the courts having jurisdiction over MB Tech Labs' registered office.
              </LegalP>
            ),
          },
          {
            id: "contact",
            number: 20,
            title: "Contact Information",
            content: (
              <LegalP>
                For questions about these Terms & Conditions, contact us at legal@mbtechlabs.com or through our contact page.
              </LegalP>
            ),
          },
        ],
        faqs: [
          {
            question: "Who owns the source code after the project is complete?",
            answer: "You do — 100%. Upon full payment, all custom-developed code, designs, and documentation are your intellectual property. We transfer the Git repository ownership to you at handover.",
          },
          {
            question: "What happens if I want to cancel the project mid-way?",
            answer: "You can cancel with 14 days written notice. You pay for work completed up to the cancellation date, and we deliver all completed code and assets. Advance payments for uncompleted milestones are refunded pro-rata minus work already in progress.",
          },
          {
            question: "Do you sign NDAs?",
            answer: "Yes. We sign mutual NDAs before any technical discussion. We take confidentiality seriously — your business logic, data, and project details remain private.",
          },
          {
            question: "What if I need changes after the project is delivered?",
            answer: "The 30-day post-launch warranty covers bug fixes. New features or changes after the warranty period are handled as a separate engagement or under a maintenance agreement.",
          },
          {
            question: "Can you work with our existing development team?",
            answer: "Absolutely. We can embed with your team, co-build, or hand off at completion. The engagement model is flexible and defined in the proposal.",
          },
        ],
      }}
    />
  );
}
