import { LegalPageLayout, LegalP, LegalList, LegalBullet, LegalCallout, LegalNumbered } from "@/components/mb-tech-labs/LegalPageLayout";

export const metadata = {
  title: "Refund & Cancellation Policy — MB Tech Labs",
  description: "MB Tech Labs' refund and cancellation policy for custom software development services. Covers advance payments, milestone refunds, cancellation process, non-refundable work, and dispute resolution.",
};

export default function RefundCancellationPage() {
  return (
    <LegalPageLayout
      data={{
        eyebrow: "Refund & Cancellation",
        title: "Refund & Cancellation Policy",
        subtitle:
          "Custom software development is a service, not a product. This policy explains how cancellations, refunds, and payments work when you engage MB Tech Labs for a software project.",
        lastUpdated: "January 2025",
        ctaTitle: "Have Questions?",
        ctaDescription: "If you're unsure about payment terms before starting, we're happy to walk you through the process — no surprises, ever.",
        ctaButtonText: "Contact Us",
        ctaHref: "/contact",
        sections: [
          {
            id: "custom-services",
            number: 1,
            title: "Custom Services, Not Products",
            content: (
              <>
                <LegalP>
                  MB Tech Labs builds custom software tailored to your specific requirements. Because every project is unique and built to order, our refund policy differs from typical e-commerce product returns. Work performed cannot be "returned" — but we have fair, transparent policies for cancellations and disputes.
                </LegalP>
                <LegalCallout type="info">
                  Think of it like hiring an architect: once the blueprint is drawn, the architect's time has been spent. The same applies to custom software engineering.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "advance-payments",
            number: 2,
            title: "Advance Payments",
            content: (
              <>
                <LegalP>
                  A 40% advance payment is required before development begins. This covers:
                </LegalP>
                <LegalList>
                  <LegalBullet>Architecture design and technology selection.</LegalBullet>
                  <LegalBullet>Database schema design.</LegalBullet>
                  <LegalBullet>UI/UX wireframing and design system creation.</LegalBullet>
                  <LegalBullet>Project setup (Git repository, CI/CD, cloud infrastructure).</LegalBullet>
                  <LegalBullet>Sprint planning and developer allocation.</LegalBullet>
                </LegalList>
                <LegalCallout type="warning">
                  The advance payment is non-refundable once development work has begun, as it covers the initial engineering and planning effort.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "milestone-payments",
            number: 3,
            title: "Milestone Payments",
            content: (
              <LegalP>
                Beyond the advance, payments are tied to milestone approvals. You review each milestone before paying for it. If a milestone doesn't meet the agreed specification, you can request revisions (up to 2 rounds included) before payment is due. You only pay for milestones you approve.
              </LegalP>
            ),
          },
          {
            id: "cancellation",
            number: 4,
            title: "Cancellation Process",
            content: (
              <>
                <LegalP>You may cancel a project at any time by providing written notice. Here's how it works:</LegalP>
                <LegalNumbered items={[
                  "Send a cancellation request via email to projects@mbtechlabs.com.",
                  "We acknowledge within 48 hours and schedule a closure call.",
                  "We complete and deliver any work already in progress (up to 5 business days).",
                  "You receive all completed code, designs, and documentation up to the cancellation point.",
                  "A final invoice is issued for work completed beyond what's already been paid for.",
                  "Project assets are transferred within 7 days of final payment.",
                ]} />
              </>
            ),
          },
          {
            id: "refund-eligibility",
            number: 5,
            title: "Refund Eligibility",
            content: (
              <>
                <LegalP>Refunds are available in the following scenarios:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Before development begins</strong> — Full refund of the advance payment minus a 10% administrative fee (covers SRG processing, proposal preparation, and team allocation).</LegalBullet>
                  <LegalBullet><strong>After development begins, before first milestone</strong> — Refund of advance minus the cost of work completed (architecture, design, setup). Itemized breakdown provided.</LegalBullet>
                  <LegalBullet><strong>After first milestone approval</strong> — No refund on approved milestones. Uncompleted future milestones are not charged.</LegalBullet>
                  <LegalBullet><strong>MB Tech Labs-initiated cancellation</strong> — Full refund of any payments for uncompleted milestones.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "non-refundable",
            number: 6,
            title: "Non-Refundable Work",
            content: (
              <>
                <LegalP>The following are non-refundable once performed:</LegalP>
                <LegalList>
                  <LegalBullet>Discovery and SRG analysis.</LegalBullet>
                  <LegalBullet>Architecture design and technical planning.</LegalBullet>
                  <LegalBullet>UI/UX design work (wireframes, mockups, design system).</LegalBullet>
                  <LegalBullet>Any approved milestone deliverables.</LegalBullet>
                  <LegalBullet>Third-party service setup fees (domain registration, SSL, cloud account setup).</LegalBullet>
                  <LegalBullet>Change request work that has been completed and approved.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "completed-deliverables",
            number: 7,
            title: "Completed Deliverables",
            content: (
              <LegalP>
                Once a milestone is approved and paid for, it is considered a completed deliverable. Completed deliverables are not eligible for refund. However, if a defect is found in a completed deliverable that prevents it from functioning as specified, it is covered under our 30-day warranty and will be fixed at no cost.
              </LegalP>
            ),
          },
          {
            id: "consultation-fees",
            number: 8,
            title: "Consultation Fees",
            content: (
              <LegalP>
                Paid consultations (technical advisory, code reviews, architecture audits) are non-refundable once the consultation session has been conducted. If you need to reschedule, provide at least 24 hours notice. No-shows are charged in full.
              </LegalP>
            ),
          },
          {
            id: "proposal-fees",
            number: 9,
            title: "Proposal Fees",
            content: (
              <LegalP>
                We do not charge for standard proposals and quotations. However, if you request a detailed technical specification document (50+ pages) or a proof-of-concept build before engaging, a fee may apply. This fee is communicated upfront and is non-refundable.
              </LegalP>
            ),
          },
          {
            id: "client-delays",
            number: 10,
            title: " Client Delays",
            content: (
              <>
                <LegalP>
                  If you are unable to provide feedback, assets, or approvals for more than 14 days, the project may be suspended. During suspension:
                </LegalP>
                <LegalList>
                  <LegalBullet>No development work occurs — you are not charged.</LegalBullet>
                  <LegalBullet>Team members may be reassigned to other projects.</LegalBullet>
                  <LegalBullet>Reactivation may take up to 2 weeks depending on team availability.</LegalBullet>
                  <LegalBullet>Projects suspended for more than 60 days may be terminated with final invoicing for completed work.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "project-suspension",
            number: 11,
            title: "Project Suspension by MB Tech Labs",
            content: (
              <LegalP>
                We reserve the right to suspend a project if payments are more than 15 days overdue. During payment-related suspension, no development work occurs and no charges accrue. The project resumes within 3 business days of payment being received.
              </LegalP>
            ),
          },
          {
            id: "termination",
            number: 12,
            title: "Termination",
            content: (
              <LegalP>
                Either party may terminate the engagement with 14 days written notice. Upon termination, you pay for all work completed up to the termination date. We deliver all completed code and assets. Advance payments for uncompleted milestones are refunded pro-rata, minus the cost of work already in progress. See the Cancellation Process section for details.
              </LegalP>
            ),
          },
          {
            id: "dispute-resolution",
            number: 13,
            title: "Dispute Resolution",
            content: (
              <>
                <LegalP>
                  If you believe a refund is owed that we have not provided, follow this process:
                </LegalP>
                <LegalNumbered items={[
                  "Submit a written dispute to projects@mbtechlabs.com within 30 days of the issue.",
                  "We review and respond within 7 business days with a resolution or clarification.",
                  "If unresolved, both parties attempt good-faith negotiation for 30 days.",
                  "If still unresolved, the dispute goes to binding arbitration.",
                ]} />
                <LegalP>
                  We are committed to fair resolution. In 5+ years of operation, we have resolved every dispute through direct communication without arbitration.
                </LegalP>
              </>
            ),
          },
        ],
        faqs: [
          {
            question: "Can I get my advance payment back?",
            answer: "If you cancel before development begins, you receive a full refund minus a 10% administrative fee. Once development has started, the advance covers the initial engineering work and is non-refundable.",
          },
          {
            question: "What if I'm not happy with a milestone deliverable?",
            answer: "Each milestone includes up to 2 rounds of revisions. If the deliverable still doesn't meet the agreed specification after revisions, we will rework it at no cost. You only pay for milestones you approve.",
          },
          {
            question: "What happens to my code if I cancel mid-project?",
            answer: "You receive all completed code, designs, and documentation up to the cancellation point — once you've paid for the work completed. We transfer the Git repository to you within 7 days.",
          },
          {
            question: "Do you charge for consultations?",
            answer: "Initial discovery calls and standard proposals are free. Paid consultations (technical advisory, code reviews) are non-refundable once conducted. We always communicate fees upfront.",
          },
          {
            question: "What if MB Tech Labs cancels the project?",
            answer: "If we initiate cancellation, you receive a full refund for any uncompleted milestones. We deliver all completed work up to that point at no additional charge.",
          },
        ],
      }}
    />
  );
}
