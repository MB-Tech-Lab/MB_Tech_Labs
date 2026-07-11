/**
 * Custom Template
 * ---------------
 * Fallback for projects that don't fit any specific vertical.
 * Minimal sections, broad questions, flexible structure.
 */
import type { SrgTemplate } from "../types";

export const customTemplate: SrgTemplate = {
  id: "custom",
  name: "Custom Software",
  tagline: "Tailored software for unique requirements",
  description:
    "For bespoke software projects that don't fit a specific vertical — SaaS platforms, internal tools, marketplaces, and unique digital products.",
  icon: "Lightbulb",
  accent: "from-cyan/20 to-cyan/5",
  suggestedGoals: [
    "Validate product-market fit with MVP",
    "Launch v1 in 12 weeks",
    "Achieve product-led growth with self-serve onboarding",
    "Build a scalable foundation for future features",
  ],
  sections: [
    {
      id: "custom-vision",
      title: "Product Vision",
      questions: [
        {
          id: "product_summary",
          type: "textarea",
          label: "Describe your product in 2-3 sentences",
          required: true,
          maxLength: 500,
          placeholder: "We are building [product] that helps [audience] achieve [outcome] by [unique approach].",
        },
        {
          id: "problem_solved",
          type: "textarea",
          label: "What problem does this solve?",
          required: true,
          maxLength: 800,
        },
        {
          id: "target_audience",
          type: "textarea",
          label: "Who is the target audience?",
          required: true,
          maxLength: 600,
          placeholder: "Primary user persona, demographics, roles, geography...",
        },
        {
          id: "unique_value",
          type: "textarea",
          label: "What is your unique value proposition?",
          maxLength: 600,
        },
        {
          id: "competitors",
          type: "textarea",
          label: "Direct / indirect competitors",
          maxLength: 600,
          placeholder: "List competitor products and what differentiates you from each.",
        },
      ],
    },
    {
      id: "custom-features",
      title: "Features & Modules",
      questions: [
        {
          id: "core_features",
          type: "textarea",
          label: "List the core features you need",
          required: true,
          maxLength: 1500,
          placeholder: "Feature 1: ...\nFeature 2: ...\nFeature 3: ...",
        },
        {
          id: "user_roles",
          type: "multiselect",
          label: "User roles / personas needed",
          required: true,
          options: [
            { label: "Admin / Super-admin", value: "admin" },
            { label: "Manager", value: "manager" },
            { label: "Standard user", value: "user" },
            { label: "Guest / Read-only", value: "guest" },
            { label: "Customer / Client", value: "customer" },
            { label: "Vendor / Partner", value: "vendor" },
            { label: "Field agent", value: "agent" },
            { label: "Developer (API access)", value: "developer" },
          ],
        },
        {
          id: "platforms",
          type: "multiselect",
          label: "Platforms to ship on",
          required: true,
          options: [
            { label: "Web application", value: "web" },
            { label: "iOS app", value: "ios" },
            { label: "Android app", value: "android" },
            { label: "Desktop (Mac/Windows)", value: "desktop" },
            { label: "Public API", value: "api" },
            { label: "Browser extension", value: "extension" },
            { label: "CLI tool", value: "cli" },
            { label: "WhatsApp / Telegram bot", value: "bot" },
          ],
        },
        {
          id: "offline_required",
          type: "boolean",
          label: "Need offline / low-connectivity support?",
        },
        {
          id: "realtime_required",
          type: "boolean",
          label: "Need real-time features (chat, live updates)?",
        },
      ],
    },
    {
      id: "custom-tech",
      title: "Technical Requirements",
      questions: [
        {
          id: "third_party_integrations",
          type: "multiselect",
          label: "Third-party integrations needed",
          options: [
            { label: "Payment gateways (Stripe/Razorpay)", value: "payments" },
            { label: "Email (SendGrid/SES)", value: "email" },
            { label: "SMS / WhatsApp", value: "sms" },
            { label: "Maps / Geolocation", value: "maps" },
            { label: "AI / LLM APIs", value: "ai" },
            { label: "Cloud storage (S3)", value: "storage" },
            { label: "Analytics (Mixpanel/GA4)", value: "analytics" },
            { label: "CRM / ERP", value: "crm_erp" },
            { label: "Auth (Google/GitHub/SSO)", value: "auth" },
            { label: "Calendar / scheduling", value: "calendar" },
            { label: "Video / streaming", value: "video" },
            { label: "IoT / hardware", value: "iot" },
          ],
        },
        {
          id: "compliance",
          type: "multiselect",
          label: "Compliance / regulatory needs",
          options: [
            { label: "DPDP Act (India)", value: "dpdp" },
            { label: "GDPR (EU)", value: "gdpr" },
            { label: "HIPAA (US healthcare)", value: "hipaa" },
            { label: "PCI-DSS (payments)", value: "pci" },
            { label: "SOC 2", value: "soc2" },
            { label: "ISO 27001", value: "iso27001" },
            { label: "RBI / SEBI (finance)", value: "rbi_sebi" },
            { label: "None specifically", value: "none" },
          ],
        },
        {
          id: "expected_users",
          type: "number",
          label: "Expected users in 12 months",
          required: true,
          min: 1,
          max: 100000000,
        },
        {
          id: "expected_growth",
          type: "select",
          label: "Expected growth trajectory",
          required: true,
          options: [
            { label: "Slow & steady (<2x/year)", value: "slow" },
            { label: "Moderate (2-5x/year)", value: "moderate" },
            { label: "Rapid (5-10x/year)", value: "rapid" },
            { label: "Viral (>10x/year)", value: "viral" },
          ],
        },
      ],
    },
    {
      id: "custom-delivery",
      title: "Delivery & Engagement",
      questions: [
        {
          id: "engagement_model",
          type: "select",
          label: "Preferred engagement model",
          required: true,
          options: [
            { label: "Fixed scope, fixed price", value: "fixed" },
            { label: "Dedicated team (monthly)", value: "dedicated" },
            { label: "Milestone-based", value: "milestone" },
            { label: "Time & material", value: "tm" },
            { label: "Equity + reduced rate", value: "equity" },
          ],
        },
        {
          id: "involvement_level",
          type: "select",
          label: "Your team's involvement level",
          required: true,
          options: [
            { label: "Hands-off — you build, we review weekly", value: "hands_off" },
            { label: "Collaborative — daily Slack, weekly demos", value: "collab" },
            { label: "Embedded — we work as one team", value: "embedded" },
            { label: "Co-build — your devs + our devs", value: "co_build" },
          ],
        },
        {
          id: "long_term_support",
          type: "boolean",
          label: "Need long-term maintenance & support post-launch?",
          required: true,
        },
        {
          id: "additional_notes",
          type: "textarea",
          label: "Anything else we should know?",
          maxLength: 1500,
        },
      ],
    },
  ],
  uploadRequirements: [
    {
      category: "documents",
      label: "PRD / Feature Document (if any)",
      accept: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      maxSizeMB: 50,
    },
    {
      category: "documents",
      label: "Wireframes / Mockups",
      accept: ["application/pdf", "image/png", "image/jpeg", "application/zip"],
      maxSizeMB: 50,
      multiple: true,
    },
    {
      category: "branding",
      label: "Brand Assets (logo, colors, fonts)",
      accept: ["image/png", "image/jpeg", "image/svg+xml", "application/zip"],
      maxSizeMB: 25,
    },
    {
      category: "data",
      label: "Sample Data (if any)",
      description: "Sample CSV/Excel of data the system will manage",
      accept: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/json"],
      maxSizeMB: 25,
    },
    {
      category: "reference",
      label: "Reference Apps / Competitors",
      description: "Links or screenshots of products you admire",
      accept: ["image/png", "image/jpeg", "application/pdf", "application/zip"],
      maxSizeMB: 25,
      multiple: true,
    },
  ],
  workflowRequirements: [
    {
      flow: "customer",
      label: "User Onboarding Flow",
      required: true,
      defaultStages: ["Sign-up", "Verify Email", "Profile Setup", "First Use", "Activated"],
    },
    {
      flow: "approval",
      label: "Content / Action Approval",
      defaultStages: ["Submit", "Review", "Approve/Reject", "Publish"],
    },
    {
      flow: "payment",
      label: "Payment Flow (if applicable)",
      defaultStages: ["Plan Select", "Checkout", "Payment", "Activate", "Renewal"],
    },
    {
      flow: "reporting",
      label: "Reporting & Analytics",
      defaultStages: ["Data Collection", "Aggregation", "Dashboard Refresh", "Alert Triggers"],
    },
  ],
};
