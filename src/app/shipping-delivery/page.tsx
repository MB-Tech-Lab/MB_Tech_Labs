import { LegalPageLayout, LegalP, LegalList, LegalBullet, LegalCallout, LegalNumbered } from "@/components/mb-tech-labs/LegalPageLayout";

export const metadata = {
  title: "Shipping & Delivery Policy — MB Tech Labs",
  description: "MB Tech Labs delivers digital software products. No physical goods are shipped. Learn about our digital deliverables, project timelines, milestones, source code delivery, and deployment process.",
};

export default function ShippingDeliveryPage() {
  return (
    <LegalPageLayout
      data={{
        eyebrow: "Shipping & Delivery",
        title: "Shipping & Delivery Policy",
        subtitle:
          "MB Tech Labs is a software development company. We deliver digital products — web applications, mobile apps, AI solutions, and enterprise software. No physical goods are shipped, stored, or transported.",
        lastUpdated: "January 2025",
        ctaTitle: "Start Your Project",
        ctaDescription: "Ready to build something real? Submit your requirements through our Project Discovery Portal and receive a detailed delivery timeline.",
        ctaButtonText: "Start Your Project",
        ctaHref: "/start-project",
        sections: [
          {
            id: "digital-deliverables",
            number: 1,
            title: "Digital Deliverables",
            content: (
              <>
                <LegalP>
                  All products delivered by MB Tech Labs are digital. We do not manufacture, ship, or deliver any physical goods. Our deliverables include:
                </LegalP>
                <LegalList>
                  <LegalBullet><strong>Source Code</strong> — Complete, documented, and version-controlled source code for all custom software.</LegalBullet>
                  <LegalBullet><strong>Web Applications</strong> — Deployed web platforms accessible via browser, hosted on cloud infrastructure (AWS, GCP, Vercel).</LegalBullet>
                  <LegalBullet><strong>Mobile Applications</strong> — iOS and Android builds distributed via App Store, Play Store, or internal distribution channels.</LegalBullet>
                  <LegalBullet><strong>APIs & Backend Services</strong> — REST/GraphQL endpoints with documentation, SDKs, and Postman collections.</LegalBullet>
                  <LegalBullet><strong>Database Schemas</strong> — Prisma schemas, SQL migrations, seed data, and ER diagrams.</LegalBullet>
                  <LegalBullet><strong>Design Assets</strong> — Figma files, design system documentation, and exported assets.</LegalBullet>
                  <LegalBullet><strong>Documentation</strong> — Technical docs, API references, user guides, and deployment runbooks.</LegalBullet>
                </LegalList>
                <LegalCallout type="info">
                  No physical products are shipped. All deliveries are digital and transferred via secure online channels (private Git repositories, cloud storage, or direct deployment).
                </LegalCallout>
              </>
            ),
          },
          {
            id: "project-timelines",
            number: 2,
            title: "Project Timelines",
            content: (
              <>
                <LegalP>
                  Every project follows a structured timeline defined in the signed proposal. Timelines are estimated based on the scope captured during the Software Requirement Gathering (SRG) process. Typical project durations:
                </LegalP>
                <LegalList>
                  <LegalBullet><strong>MVP (4–8 weeks)</strong> — Core feature set, single platform, standard integrations.</LegalBullet>
                  <LegalBullet><strong>Growth Product (3–5 months)</strong> — Multi-module platform, web + mobile, admin dashboard, AI capabilities.</LegalBullet>
                  <LegalBullet><strong>Enterprise System (6–12 months)</strong> — Custom ERP/CRM/SaaS, multi-tenant, compliance, legacy migration.</LegalBullet>
                </LegalList>
                <LegalP>
                  Timelines may adjust if scope changes are requested mid-project. All timeline changes are documented and agreed upon in writing before implementation begins.
                </LegalP>
              </>
            ),
          },
          {
            id: "milestones",
            number: 3,
            title: "Milestone-Based Delivery",
            content: (
              <>
                <LegalP>
                  Projects are delivered in milestones. Each milestone represents a verifiable, testable increment of the final product. You review and approve each milestone before we proceed to the next.
                </LegalP>
                <LegalNumbered items={[
                  "Milestone 1 — Architecture & Design: System architecture, database schema, UI/UX wireframes, and technology stack finalized.",
                  "Milestone 2 — Core Development: Primary features built, API endpoints functional, database seeded with test data.",
                  "Milestone 3 — Integration & Testing: Third-party integrations, automated tests, performance optimization, security audit.",
                  "Milestone 4 — UAT & Deployment: User acceptance testing, production deployment, documentation handover, team training.",
                ]} />
                <LegalP>
                  Each milestone includes a live demo, a code review, and a written status report. You have 5 business days to review and provide feedback on each milestone.
                </LegalP>
              </>
            ),
          },
          {
            id: "development-process",
            number: 4,
            title: "Development Process",
            content: (
              <>
                <LegalP>
                  Our development follows a structured engineering process:
                </LegalP>
                <LegalList>
                  <LegalBullet><strong>Discovery</strong> — We understand your business, users, and constraints through the SRG process.</LegalBullet>
                  <LegalBullet><strong>Planning</strong> — Architecture diagrams, roadmap, and sprint plan documented.</LegalBullet>
                  <LegalBullet><strong>UI/UX Design</strong> — Wireframes, interactive prototypes, and design system.</LegalBullet>
                  <LegalBullet><strong>Development</strong> — Vertical slices shipped weekly with demos every Friday.</LegalBullet>
                  <LegalBullet><strong>Testing</strong> — Unit, integration, end-to-end, performance, and security testing in CI.</LegalBullet>
                  <LegalBullet><strong>Deployment</strong> — Blue-green or canary releases with rollback plans.</LegalBullet>
                  <LegalBullet><strong>Support</strong> — Post-launch monitoring, bug fixes, and maintenance.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "source-code-delivery",
            number: 5,
            title: "Source Code Delivery",
            content: (
              <>
                <LegalP>
                  All source code is delivered via a private Git repository (GitHub, GitLab, or Bitbucket) created at project kickoff. You receive:
                </LegalP>
                <LegalList>
                  <LegalBullet>Full commit history from day one of development.</LegalBullet>
                  <LegalBullet>Branch protection rules and pull request workflow documentation.</LegalBullet>
                  <LegalBullet>CI/CD pipeline configuration files.</LegalBullet>
                  <LegalBullet>Environment variable templates (.env.example).</LegalBullet>
                  <LegalBullet>Docker Compose files for local development.</LegalBullet>
                  <LegalBullet>README with setup instructions.</LegalBullet>
                </LegalList>
                <LegalP>
                  You own 100% of the source code upon full payment. We never lock you into our tooling or withhold access.
                </LegalP>
              </>
            ),
          },
          {
            id: "deployment",
            number: 6,
            title: "Deployment",
            content: (
              <>
                <LegalP>
                  We handle production deployment on your cloud infrastructure (AWS, GCP, Vercel, or your on-premise servers). Deployment includes:
                </LegalP>
                <LegalList>
                  <LegalBullet>Infrastructure-as-code setup (Terraform or CloudFormation).</LegalBullet>
                  <LegalBullet>CI/CD pipeline with automated testing and deployment.</LegalBullet>
                  <LegalBullet>SSL certificate configuration.</LegalBullet>
                  <LegalBullet>CDN setup for static assets.</LegalBullet>
                  <LegalBullet>Database migration execution.</LegalBullet>
                  <LegalBullet>Environment variable and secrets management.</LegalBullet>
                  <LegalBullet>Health check endpoints and uptime monitoring.</LegalBullet>
                </LegalList>
                <LegalP>
                  Deployment credentials and infrastructure access are transferred to your team at project handover.
                </LegalP>
              </>
            ),
          },
          {
            id: "testing",
            number: 7,
            title: "Testing & Quality Assurance",
            content: (
              <>
                <LegalP>
                  Every deliverable passes through automated and manual testing:
                </LegalP>
                <LegalList>
                  <LegalBullet><strong>Unit Tests</strong> — Individual function and component tests with over 80% coverage.</LegalBullet>
                  <LegalBullet><strong>Integration Tests</strong> — API endpoint and database integration verification.</LegalBullet>
                  <LegalBullet><strong>End-to-End Tests</strong> — Critical user flows tested with Playwright or Cypress.</LegalBullet>
                  <LegalBullet><strong>Performance Tests</strong> — Load testing, response time benchmarking, and memory profiling.</LegalBullet>
                  <LegalBullet><strong>Security Tests</strong> — Dependency scanning, input validation checks, and OWASP compliance.</LegalBullet>
                  <LegalBullet><strong>Cross-Browser Tests</strong> — Chrome, Firefox, Safari, Edge, and mobile browsers.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "documentation",
            number: 8,
            title: "Documentation",
            content: (
              <>
                <LegalP>
                  Comprehensive documentation is delivered with every project:
                </LegalP>
                <LegalList>
                  <LegalBullet><strong>Technical Documentation</strong> — Architecture overview, database schema, API reference (OpenAPI/Swagger).</LegalBullet>
                  <LegalBullet><strong>User Guides</strong> — Admin manual, end-user instructions, and video walkthroughs.</LegalBullet>
                  <LegalBullet><strong>Deployment Guide</strong> — Step-by-step production deployment instructions.</LegalBullet>
                  <LegalBullet><strong>Maintenance Guide</strong> — Backup procedures, monitoring setup, and troubleshooting.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "support",
            number: 9,
            title: "Post-Delivery Support",
            content: (
              <>
                <LegalP>
                  Every project includes 30 days of free post-launch support covering:
                </LegalP>
                <LegalList>
                  <LegalBullet>Bug fixes for issues not caught during UAT.</LegalBullet>
                  <LegalBullet>Minor UI adjustments and text changes.</LegalBullet>
                  <LegalBullet>Deployment configuration tweaks.</LegalBullet>
                  <LegalBullet>Questions about the codebase or architecture.</LegalBullet>
                </LegalList>
                <LegalCallout type="info">
                  Extended support and maintenance plans (SLA-backed) are available as separate agreements. Contact us at support@mbtechlabs.com for details.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "project-handover",
            number: 10,
            title: "Project Handover",
            content: (
              <>
                <LegalP>
                  At project completion, we conduct a structured handover process:
                </LegalP>
                <LegalNumbered items={[
                  "Git repository ownership transfer to your organization.",
                  "Cloud infrastructure credentials handover (AWS root, GCP admin, Vercel team owner).",
                  "Domain registrar and DNS control transfer.",
                  "Database admin credentials and backup verification.",
                  "Third-party service account transfers (payment gateways, email providers, analytics).",
                  "Live code walkthrough session with your engineering team (2–4 hours).",
                  "Final documentation package delivered as a zip file and wiki.",
                ]} />
                <LegalP>
                  The handover is considered complete when you sign the project acceptance form. After handover, you have full control and ownership of all systems.
                </LegalP>
              </>
            ),
          },
        ],
        faqs: [
          {
            question: "Do you ship any physical products?",
            answer: "No. MB Tech Labs is a software development company. All deliverables are digital — source code, web applications, mobile apps, APIs, and documentation. Nothing physical is shipped.",
          },
          {
            question: "How do I receive my project files?",
            answer: "All code is delivered through a private Git repository from day one. At project completion, you receive full ownership transfer, cloud credentials, and a structured handover session with your team.",
          },
          {
            question: "What happens if a milestone is delayed?",
            answer: "If a delay is caused by us, we notify you immediately with a revised timeline and work to catch up without compromising quality. If the delay is caused by pending client feedback or scope changes, the timeline adjusts accordingly with your written approval.",
          },
          {
            question: "Do you provide hosting after launch?",
            answer: "We set up and deploy your project on your cloud account (AWS, GCP, Vercel). You own the infrastructure. We can provide managed hosting as a separate service if preferred.",
          },
          {
            question: "How long is the free post-launch support?",
            answer: "Every project includes 30 days of free support after deployment for bug fixes and minor adjustments. Extended maintenance plans with SLAs are available separately.",
          },
        ],
      }}
    />
  );
}
