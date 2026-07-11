import { LegalPageLayout, LegalP, LegalList, LegalBullet, LegalCallout, LegalNumbered } from "@/components/mb-tech-labs/LegalPageLayout";

export const metadata = {
  title: "Pricing Policy — MB Tech Labs",
  description: "MB Tech Labs provides custom software development with no fixed prices. Every project receives a custom quotation after the Software Requirement Gathering (SRG) process. Learn how we price our services.",
};

export default function PricingPolicyPage() {
  return (
    <LegalPageLayout
      data={{
        eyebrow: "Pricing Policy",
        title: "Pricing Policy",
        subtitle:
          "MB Tech Labs builds custom software — not off-the-shelf products. There are no fixed prices. Every project is unique, and every quotation is tailored to your specific requirements, timeline, and complexity.",
        lastUpdated: "January 2025",
        ctaTitle: "Need a Custom Quote?",
        ctaDescription:
          "MB Tech Labs does not have fixed pricing. Every project receives a custom quotation after completing the Software Requirement Gathering (SRG).",
        ctaButtonText: "Start Project",
        ctaHref: "/start-project",
        ctaButtonText2: "Contact Sales",
        ctaHref2: "/contact",
        relatedTitle: "Related",
        relatedLinks: [
          { label: "Privacy", href: "/privacy-policy" },
          { label: "Terms", href: "/terms" },
          { label: "Refund", href: "/refund-cancellation" },
        ],
        sections: [
          {
            id: "custom-pricing",
            number: 1,
            title: "Custom Software, Custom Pricing",
            content: (
              <>
                <LegalP>
                  We don't have a price list because we don't sell products. We engineer custom software solutions. The cost of building a 3-page marketing website is vastly different from building a multi-tenant SaaS platform with AI capabilities — and both are different from migrating a legacy ERP system.
                </LegalP>
                <LegalCallout type="info">
                  Every project receives a custom quotation after completing the Software Requirement Gathering (SRG) process. No two quotes are the same.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "pricing-factors",
            number: 2,
            title: "What Affects Pricing",
            content: (
              <>
                <LegalP>Our quotations are based on the following factors:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Requirements</strong> — The scope and complexity of features you need.</LegalBullet>
                  <LegalBullet><strong>Features</strong> — Number of modules, integrations, and user roles.</LegalBullet>
                  <LegalBullet><strong>Timeline</strong> — Urgent projects (ASAP delivery) may require additional resources and carry a premium.</LegalBullet>
                  <LegalBullet><strong>Complexity</strong> — Real-time features, AI/ML, multi-tenant architecture, and compliance requirements increase complexity.</LegalBullet>
                  <LegalBullet><strong>Technology</strong> — The tech stack chosen affects development speed and team allocation.</LegalBullet>
                  <LegalBullet><strong>Team Size</strong> — Projects requiring parallel development across frontend, backend, mobile, and design need larger teams.</LegalBullet>
                  <LegalBullet><strong>Integrations</strong> — Each third-party integration (payment gateways, CRMs, APIs) adds development and testing effort.</LegalBullet>
                  <LegalBullet><strong>Hosting & Infrastructure</strong> — Cloud setup, CI/CD pipelines, and monitoring infrastructure.</LegalBullet>
                  <LegalBullet><strong>Support & Maintenance</strong> — Post-launch SLA-backed support plans (optional, separate agreement).</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "engagement-models",
            number: 3,
            title: "Engagement Models",
            content: (
              <>
                <LegalP>We offer three engagement models:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Fixed Scope, Fixed Price</strong> — Best for MVPs and well-defined projects. Scope, timeline, and price are locked in the proposal. Change requests are billed separately.</LegalBullet>
                  <LegalBullet><strong>Dedicated Team</strong> — Best for ongoing product development. You get a dedicated team (PM, developers, designer) for a monthly retainer. Flexible scope, predictable cost.</LegalBullet>
                  <LegalBullet><strong>Milestone-Based</strong> — Best for enterprise projects. Pay per milestone. Each milestone has a defined deliverable, timeline, and price.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "pricing-process",
            number: 4,
            title: "How Pricing Works",
            content: (
              <>
                <LegalP>Our pricing process is transparent and structured:</LegalP>
                <LegalNumbered items={[
                  "Discovery Call — A free 30-minute call to understand your vision, business goals, and high-level requirements.",
                  "Software Requirement Gathering (SRG) — You complete our 9-step online SRG form. This captures client info, business details, project type, goals, dynamic questions, uploads, workflow, team access, and budget expectations.",
                  "Internal Review — Our team reviews your SRG submission, assesses complexity, and estimates effort (typically 2–3 business days).",
                  "Proposal — We deliver a detailed proposal with scope, modules, deliverables, technology stack, timeline, and milestones.",
                  "Quotation — A line-item quotation with cost breakdown (UI/UX, frontend, backend, testing, deployment, hosting, maintenance), payment terms, and valid-until date.",
                  "Negotiation — We're open to discussion. If the quotation exceeds your budget, we can adjust scope, timeline, or features to fit.",
                  "Agreement — Once you approve the quotation, we sign a project agreement and begin development upon advance payment.",
                ]} />
              </>
            ),
          },
          {
            id: "what-included",
            number: 5,
            title: "What's Included in Every Quotation",
            content: (
              <>
                <LegalP>Every quotation includes:</LegalP>
                <LegalList>
                  <LegalBullet>Complete source code with documentation.</LegalBullet>
                  <LegalBullet>UI/UX design (wireframes, mockups, design system).</LegalBullet>
                  <LegalBullet>Database schema and migrations.</LegalBullet>
                  <LegalBullet>API development with documentation.</LegalBullet>
                  <LegalBullet>Automated testing (unit, integration, end-to-end).</LegalBullet>
                  <LegalBullet>Production deployment on your cloud infrastructure.</LegalBullet>
                  <LegalBullet>CI/CD pipeline setup.</LegalBullet>
                  <LegalBullet>30 days of free post-launch support.</LegalBullet>
                  <LegalBullet>Project handover session with your team.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "what-not-included",
            number: 6,
            title: "What's NOT Included (Unless Specified)",
            content: (
              <>
                <LegalP>The following are billed separately unless explicitly included in your quotation:</LegalP>
                <LegalList>
                  <LegalBullet>Third-party service subscriptions (payment gateway fees, email service, SMS, AI API calls).</LegalBullet>
                  <LegalBullet>Cloud hosting charges (AWS/GCP/Vercel bills paid directly by you).</LegalBullet>
                  <LegalBullet>Domain registration and SSL certificate costs.</LegalBullet>
                  <LegalBullet>App Store and Play Store developer account fees.</LegalBullet>
                  <LegalBullet>Ongoing maintenance beyond the 30-day free support period.</LegalBullet>
                  <LegalBullet>Marketing, SEO, and content writing services.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "payment-structure",
            number: 7,
            title: "Payment Structure",
            content: (
              <>
                <LegalP>Standard payment terms:</LegalP>
                <LegalList>
                  <LegalBullet><strong>40% advance</strong> — Before development begins.</LegalBullet>
                  <LegalBullet><strong>30% on MVP delivery</strong> — Upon milestone approval.</LegalBullet>
                  <LegalBullet><strong>30% on final delivery</strong> — Upon project acceptance.</LegalBullet>
                </LegalList>
                <LegalP>
                  For dedicated team engagements, payment is a monthly retainer billed in advance. For milestone-based engagements, each milestone is invoiced upon approval.
                </LegalP>
              </>
            ),
          },
          {
            id: "taxes",
            number: 8,
            title: "Taxes",
            content: (
              <LegalP>
                All quotations are exclusive of applicable taxes (GST, VAT, or equivalent) unless stated otherwise. For clients in India, 18% GST applies. For international clients, taxes depend on your jurisdiction. Tax is added to the final invoice.
              </LegalP>
            ),
          },
          {
            id: "quotation-validity",
            number: 9,
            title: "Quotation Validity",
            content: (
              <LegalP>
                Quotations are valid for 30 days from the issue date. After 30 days, we may need to re-evaluate pricing based on changed requirements, team availability, or market conditions. We honor the quoted price if you sign the agreement within the validity period.
              </LegalP>
            ),
          },
          {
            id: "no-hidden-costs",
            number: 10,
            title: "No Hidden Costs",
            content: (
              <>
                <LegalCallout type="success">
                  We guarantee no hidden costs. Every line item is in the quotation. If something isn't listed, it's not charged. Change requests are quoted separately before work begins — no surprise invoices.
                </LegalCallout>
                <LegalP>
                  If during development we discover that a feature requires significantly more effort than estimated (due to technical complexity not visible during SRG), we discuss options with you before proceeding: adjust scope, adjust timeline, or issue a change request quote.
                </LegalP>
              </>
            ),
          },
        ],
        faqs: [
          {
            question: "Why don't you have fixed prices?",
            answer: "Because we build custom software, not off-the-shelf products. A simple landing page and a multi-tenant ERP system are completely different projects with different effort, technology, and team requirements. Fixed pricing would mean overcharging simple projects and undercharging complex ones.",
          },
          {
            question: "How much does a typical project cost?",
            answer: "MVPs typically range from ₹40,000–₹2,00,000. Growth products (multi-module platforms) range from ₹2,00,000–₹8,00,000. Enterprise systems (custom ERP, CRM, SaaS) start from ₹8,00,000. Your exact quote depends on the SRG submission.",
          },
          {
            question: "Is the SRG form free?",
            answer: "Yes, completely free. The discovery call, SRG form, proposal, and quotation are all free with no obligation. You only pay when you sign the project agreement and we begin development.",
          },
          {
            question: "What if the quotation exceeds my budget?",
            answer: "Tell us your budget and we'll adjust the scope to fit. We can phase the project (build MVP first, add features later), reduce non-essential features, or adjust the timeline. We're flexible and transparent.",
          },
          {
            question: "Do you offer payment plans?",
            answer: "Our standard payment structure is 40/30/30 across milestones. For larger projects, we can discuss customized payment plans. For dedicated team engagements, monthly retainers are standard.",
          },
        ],
      }}
    />
  );
}
