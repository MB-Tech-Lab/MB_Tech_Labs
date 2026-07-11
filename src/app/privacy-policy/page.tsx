import { LegalPageLayout, LegalP, LegalList, LegalBullet, LegalCallout } from "@/components/mb-tech-labs/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy — MB Tech Labs",
  description: "How MB Tech Labs collects, uses, stores, and protects your personal information. Covers data from SRG submissions, career applications, cookies, analytics, and your privacy rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      data={{
        eyebrow: "Privacy Policy",
        title: "Privacy Policy",
        subtitle:
          "Your privacy matters. This policy explains exactly what data we collect, why we collect it, how we store it, and the control you have over it. No hidden tracking, no data selling.",
        lastUpdated: "January 2025",
        ctaTitle: "Privacy Questions?",
        ctaDescription: "If you have concerns about your data or want to exercise your privacy rights, we're here to help.",
        ctaButtonText: "Contact Our Privacy Team",
        ctaHref: "/contact",
        relatedTitle: "Related Policies",
        relatedLinks: [
          { label: "Terms & Conditions", href: "/terms" },
          { label: "Pricing Policy", href: "/pricing-policy" },
          { label: "Refund & Cancellation Policy", href: "/refund-cancellation" },
          { label: "Shipping & Delivery Policy", href: "/shipping-delivery" },
          { label: "Contact Us", href: "/contact" },
        ],
        sections: [
          {
            id: "information-collected",
            number: 1,
            title: "Information We Collect",
            content: (
              <>
                <LegalP>We collect information in three ways:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Information you provide directly</strong> — Name, email, phone, company details, project requirements, uploaded documents when you complete the SRG form, contact form, or career application.</LegalBullet>
                  <LegalBullet><strong>Information collected automatically</strong> — IP address, browser type, device information, pages visited, and usage patterns via cookies and analytics tools.</LegalBullet>
                  <LegalBullet><strong>Information from third parties</strong> — GitHub profile data (for career applicants), LinkedIn profile (if you connect it), and referral information.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "personal-information",
            number: 2,
            title: "Personal Information",
            content: (
              <>
                <LegalP>The personal information we may collect includes:</LegalP>
                <LegalList>
                  <LegalBullet>Full name, email address, phone number</LegalBullet>
                  <LegalBullet>Company name, job title, industry</LegalBullet>
                  <LegalBullet>Country, city, timezone</LegalBullet>
                  <LegalBullet>Date of birth and gender (career applicants only)</LegalBullet>
                  <LegalBullet>Educational background (career applicants only)</LegalBullet>
                  <LegalBullet>Portfolio links: GitHub, LinkedIn, personal website</LegalBullet>
                </LegalList>
                <LegalP>We never collect sensitive information such as race, religion, political opinions, health data, or biometric data.</LegalP>
              </>
            ),
          },
          {
            id: "cookies",
            number: 3,
            title: "Cookies",
            content: (
              <>
                <LegalP>We use two types of cookies:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Essential cookies</strong> — Required for authentication, session management, and security. These cannot be disabled.</LegalBullet>
                  <LegalBullet><strong>Analytics cookies</strong> — Help us understand how visitors use our website so we can improve it. These are optional and can be disabled in your browser settings.</LegalBullet>
                </LegalList>
                <LegalP>We do not use advertising cookies, tracking pixels, or third-party ad networks. We do not sell your browsing data.</LegalP>
              </>
            ),
          },
          {
            id: "analytics",
            number: 4,
            title: "Analytics",
            content: (
              <LegalP>
                We use privacy-respecting analytics to understand website usage. This includes page views, unique visitors, referral sources, and general geographic data (country-level). We do not use this data to identify individual users. Analytics data is aggregated and anonymized.
              </LegalP>
            ),
          },
          {
            id: "project-data",
            number: 5,
            title: "Project Data",
            content: (
              <>
                <LegalP>
                  When you submit a Software Requirement Gathering (SRG) form, the data you provide — business information, project goals, workflow requirements, budget, timeline — is stored securely in our database. This data is used to:
                </LegalP>
                <LegalList>
                  <LegalBullet>Prepare proposals and quotations tailored to your needs.</LegalBullet>
                  <LegalBullet>Assign the right team members to your project.</LegalBullet>
                  <LegalBullet>Reference project requirements during development.</LegalBullet>
                  <LegalBullet>Improve our service offerings based on common patterns.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "uploaded-documents",
            number: 6,
            title: "Uploaded Documents",
            content: (
              <LegalP>
                Documents uploaded during the SRG process (brand assets, process flows, sample data, reference materials) are stored securely and accessible only to authorized team members assigned to your project. Files are encrypted at rest and in transit. We do not share your uploaded documents with any third party.
              </LegalP>
            ),
          },
          {
            id: "career-applications",
            number: 7,
            title: "Career Applications & Resume Uploads",
            content: (
              <>
                <LegalP>
                  When you apply for an internship through our career portal, we collect:
                </LegalP>
                <LegalList>
                  <LegalBullet>Personal information (name, email, phone, education details)</LegalBullet>
                  <LegalBullet>Resume file (stored as a secure URL link you provide)</LegalBullet>
                  <LegalBullet>Project details, hackathon participation, GitHub profile</LegalBullet>
                  <LegalBullet>Essay responses</LegalBullet>
                </LegalList>
                <LegalP>
                  This data is used solely for evaluating your candidacy and communicating about the hiring process. Application data is retained for 12 months after submission, after which it is automatically deleted unless you join our team.
                </LegalP>
              </>
            ),
          },
          {
            id: "how-data-used",
            number: 8,
            title: "How Your Data Is Used",
            content: (
              <>
                <LegalP>We use your data to:</LegalP>
                <LegalList>
                  <LegalBullet>Respond to your inquiries and project requests.</LegalBullet>
                  <LegalBullet>Prepare proposals, quotations, and contracts.</LegalBullet>
                  <LegalBullet>Deliver contracted software development services.</LegalBullet>
                  <LegalBullet>Communicate about project progress, invoices, and meetings.</LegalBullet>
                  <LegalBullet>Evaluate job applications and conduct interviews.</LegalBullet>
                  <LegalBullet>Improve our website, services, and internal processes.</LegalBullet>
                  <LegalBullet>Comply with legal and regulatory obligations.</LegalBullet>
                </LegalList>
                <LegalCallout type="warning">
                  We do NOT sell, rent, or trade your personal information to any third party. We do NOT use your data for unsolicited marketing.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "storage",
            number: 9,
            title: "Data Storage",
            content: (
              <LegalP>
                Your data is stored in our database hosted on secure cloud infrastructure. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is restricted to authorized personnel using role-based access control with JWT authentication. Database backups are encrypted and stored in a separate geographic region.
              </LegalP>
            ),
          },
          {
            id: "security",
            number: 10,
            title: "Data Security",
            content: (
              <>
                <LegalP>We implement industry-standard security measures:</LegalP>
                <LegalList>
                  <LegalBullet>Passwords hashed with bcrypt (never stored in plain text).</LegalBullet>
                  <LegalBullet>JWT-based authentication with refresh token rotation.</LegalBullet>
                  <LegalBullet>Role-based access control (6 roles with granular permissions).</LegalBullet>
                  <LegalBullet>Input validation and sanitization (Zod schemas on every endpoint).</LegalBullet>
                  <LegalBullet>SQL injection protection via Prisma ORM parameterized queries.</LegalBullet>
                  <LegalBullet>XSS protection via React's built-in escaping.</LegalBullet>
                  <LegalBullet>Regular dependency security scanning.</LegalBullet>
                  <LegalBullet>HTTPS enforced on all endpoints with HSTS.</LegalBullet>
                </LegalList>
                <LegalCallout type="warning">
                  Despite our best efforts, no system is 100% secure. In the event of a data breach, we will notify all affected users within 72 hours in accordance with applicable data protection laws.
                </LegalCallout>
              </>
            ),
          },
          {
            id: "third-party-services",
            number: 11,
            title: "Third-Party Services",
            content: (
              <>
                <LegalP>We integrate with the following third-party services. Each has its own privacy policy:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Google Analytics</strong> — Website usage analytics (anonymized, aggregated).</LegalBullet>
                  <LegalBullet><strong>GitHub</strong> — Source code hosting and candidate evaluation.</LegalBullet>
                  <LegalBullet><strong>LinkedIn</strong> — Professional profile verification for career applicants.</LegalBullet>
                  <LegalBullet><strong>Cloud providers (AWS/GCP)</strong> — Application hosting and database storage.</LegalBullet>
                  <LegalBullet><strong>Email service providers</strong> — Transactional email delivery.</LegalBullet>
                </LegalList>
                <LegalP>We share only the minimum data necessary for each service to function. We do not give third parties access to your project data or uploaded documents.</LegalP>
              </>
            ),
          },
          {
            id: "user-rights",
            number: 12,
            title: "Your Rights",
            content: (
              <>
                <LegalP>You have the following rights regarding your personal data:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Access</strong> — Request a copy of all data we hold about you.</LegalBullet>
                  <LegalBullet><strong>Correction</strong> — Request correction of inaccurate or incomplete data.</LegalBullet>
                  <LegalBullet><strong>Deletion</strong> — Request deletion of your data ("right to be forgotten").</LegalBullet>
                  <LegalBullet><strong>Export</strong> — Receive your data in a portable, machine-readable format.</LegalBullet>
                  <LegalBullet><strong>Opt-out</strong> — Unsubscribe from marketing communications at any time.</LegalBullet>
                  <LegalBullet><strong>Object</strong> — Object to processing of your data for specific purposes.</LegalBullet>
                </LegalList>
                <LegalP>To exercise any of these rights, email privacy@mbtechlabs.com. We respond within 30 days.</LegalP>
              </>
            ),
          },
          {
            id: "data-retention",
            number: 13,
            title: "Data Retention",
            content: (
              <>
                <LegalP>We retain data for the following periods:</LegalP>
                <LegalList>
                  <LegalBullet><strong>Active client data</strong> — Duration of engagement plus 2 years.</LegalBullet>
                  <LegalBullet><strong>Career applications</strong> — 12 months after submission.</LegalBullet>
                  <LegalBullet><strong>Website analytics</strong> — 26 months (then aggregated and anonymized).</LegalBullet>
                  <LegalBullet><strong>Financial records</strong> — 7 years (as required by tax law).</LegalBullet>
                  <LegalBullet><strong>Server logs</strong> — 90 days.</LegalBullet>
                </LegalList>
              </>
            ),
          },
          {
            id: "childrens-privacy",
            number: 14,
            title: "Children's Privacy",
            content: (
              <LegalP>
                Our services are intended for businesses and professionals. We do not knowingly collect data from children under 16. Career applicants must be at least 18 years old or have parental consent. If you believe we have collected data from a minor, please contact us immediately for deletion.
              </LegalP>
            ),
          },
          {
            id: "policy-updates",
            number: 15,
            title: "Policy Updates",
            content: (
              <LegalP>
                We may update this Privacy Policy from time to time. Material changes will be notified via email to registered users and posted on this page with an updated "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </LegalP>
            ),
          },
          {
            id: "contact",
            number: 16,
            title: "Contact",
            content: (
              <LegalP>
                For privacy questions, data requests, or concerns, contact us at privacy@mbtechlabs.com or through our contact page. We are committed to resolving all privacy inquiries promptly and transparently.
              </LegalP>
            ),
          },
        ],
        faqs: [
          {
            question: "Do you sell my data to third parties?",
            answer: "Never. We do not sell, rent, or trade your personal information to anyone. Your data is used solely for providing our services and communicating with you.",
          },
          {
            question: "How do I delete my data?",
            answer: "Email privacy@mbtechlabs.com with your request. We will delete your personal data within 30 days, except for data we are legally required to retain (such as financial records).",
          },
          {
            question: "Where is my data stored?",
            answer: "Your data is stored on secure cloud infrastructure with encryption at rest (AES-256) and in transit (TLS 1.3). Access is restricted to authorized personnel with role-based permissions.",
          },
          {
            question: "Do you use cookies for advertising?",
            answer: "No. We only use essential cookies for authentication and optional analytics cookies for understanding website usage. We do not use advertising cookies, tracking pixels, or ad networks.",
          },
          {
            question: "What happens to my career application data?",
            answer: "Your application data is retained for 12 months. If you're not selected, your data is automatically deleted after that period. If you join our team, your data is transferred to your employee record.",
          },
        ],
      }}
    />
  );
}
