/**
 * Seed Data + SRG Bridge
 * ----------------------
 * 1. On first admin visit, seeds localStorage with realistic sample
 *    submissions so the dashboard isn't empty.
 * 2. Bridges the SRG system: when a client submits at /start-project,
 *    the SRG payload is converted into an AdminSubmission and stored
 *    in mbtl_submissions.
 */
import type {
  AdminSubmission,
  AdminNotification,
  SrgStatus,
  Priority,
  DevProject,
  Invoice,
  Meeting,
  Client,
  ActivityLog,
} from "../types";
import {
  loadSubmissions,
  saveSubmissions,
  upsertSubmission,
  addNotification,
  generateId,
  saveProjects,
  saveInvoices,
  saveMeetings,
  saveClients,
  saveActivities,
} from "./storage";
import { getTemplate } from "../../srg/templates";
import type { SrgSubmissionPayload } from "../../srg/types";

const SEED_FLAG = "mbtl_seeded_v3";

/* --------------------------- Seed data --------------------------- */

function daysAgo(n: number): number {
  return Date.now() - n * 24 * 60 * 60 * 1000;
}

function hoursAgo(n: number): number {
  return Date.now() - n * 60 * 60 * 1000;
}

const SEED_SUBMISSIONS: AdminSubmission[] = [
  {
    id: "sub_seed_helios_erp",
    sessionId: "srg_seed_helios_erp",
    submittedAt: daysAgo(2),
    updatedAt: hoursAgo(6),
    templateId: "erp",
    templateName: "ERP System",
    projectType: "ERP System",
    projectName: "Helios ERP Modernization",
    client: {
      fullName: "Rajiv Menon",
      email: "rajiv.menon@helioslogistics.com",
      phone: "+91 98765 43210",
      company: "Helios Logistics Pvt Ltd",
      jobTitle: "Chief Technology Officer",
      country: "India",
      timezone: "Asia/Kolkata (IST, UTC+5:30)",
      preferredContact: "email",
    },
    business: {
      legalName: "Helios Logistics Pvt Ltd",
      industry: "Logistics / Supply Chain",
      size: "201-1000",
      website: "https://helioslogistics.com",
      stage: "enterprise",
      annualBudget: "50k_150k",
      targetLaunch: "3_6_months",
      existingStack:
        "Tally for accounting, custom PHP for portal, Salesforce CRM, Excel for ops",
      competitors: "BlackBuck, Rivigo, FarEye",
      mission: "Digitize end-to-end logistics operations across 14 branches",
      vision: "Become India's most reliable tech-enabled logistics network",
      targetAudience: "B2B shippers, fleet owners, warehouse operators",
      description:
        "Replace 14 legacy systems with a unified ERP covering finance, inventory, HR, and operations.",
    },
    goals: {
      primaryGoal:
        "Replace 5+ legacy systems with one unified ERP within 6 months",
      secondaryGoals: [
        "Real-time inventory visibility across warehouses",
        "Automate 80% of purchase order workflows",
        "Reduce month-end close from 10 days to 3",
      ],
      successMetrics:
        "Month-end close in 3 days, 80% PO automation, real-time inventory",
      priorities: {
        speed: 4,
        cost: 3,
        quality: 5,
        scalability: 5,
        innovation: 3,
      },
      deadline: "3_6_months",
      budgetRange: "50k_150k",
    },
    answers: {
      modules_needed: ["finance", "inventory", "procurement", "sales", "hr"],
      user_count: 250,
      warehouse_count: 14,
      entities_count: 3,
      multi_currency: true,
      multi_company: true,
      existing_systems: ["tally", "crm", "legacy"],
      data_migration: "partial",
      compliance_required: ["gst", "tds", "iso27001"],
      audit_trail: true,
      rbac_complexity: "hierarchical",
      hosting_preference: "cloud",
      reporting_needs: ["financial", "custom_dash", "scheduled"],
    },
    uploads: [
      {
        id: "up_seed_1",
        name: "Helios_Process_Flow.pdf",
        size: 2_400_000,
        type: "application/pdf",
        category: "Documents",
        status: "ready",
        uploadedAt: daysAgo(2),
        pageCount: 24,
      },
      {
        id: "up_seed_2",
        name: "chart_of_accounts.xlsx",
        size: 180_000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        category: "Data",
        status: "ready",
        uploadedAt: daysAgo(2),
      },
      {
        id: "up_seed_3",
        name: "helios_logo.png",
        size: 240_000,
        type: "image/png",
        category: "Brand Assets",
        status: "ready",
        uploadedAt: daysAgo(2),
        width: 512,
        height: 512,
      },
    ],
    teamRequirements: {
      staffCount: 250,
      roles: ["Finance Head", "Inventory Manager", "HR Manager", "IT Admin"],
      permissions: ["View", "Edit", "Approve", "Admin"],
      approvalHierarchy: ["Manager", "Department Head", "CFO", "CEO"],
    },
    workflow: {
      approval: {
        type: "approval",
        label: "Procurement Approval",
        enabled: true,
        stages: [
          { id: "s1", name: "PR Raised", description: "", owner: "Requester", slaHours: 4 },
          { id: "s2", name: "Manager Approve", description: "", owner: "Dept Manager", slaHours: 24 },
          { id: "s3", name: "Finance Approve", description: "", owner: "CFO", slaHours: 48 },
          { id: "s4", name: "PO Issue", description: "", owner: "Procurement", slaHours: 8 },
        ],
      },
      payment: {
        type: "payment",
        label: "Payment Run",
        enabled: true,
        stages: [
          { id: "s1", name: "Vendor Selection", description: "", owner: "Procurement", slaHours: 24 },
          { id: "s2", name: "Approval", description: "", owner: "CFO", slaHours: 48 },
          { id: "s3", name: "Payment Release", description: "", owner: "Finance", slaHours: 8 },
        ],
      },
      customer: {
        type: "customer",
        label: "Sales Order Flow",
        enabled: true,
        stages: [
          { id: "s1", name: "Quote", description: "", owner: "Sales", slaHours: 24 },
          { id: "s2", name: "Order", description: "", owner: "Sales", slaHours: 4 },
          { id: "s3", name: "Ship", description: "", owner: "Warehouse", slaHours: 48 },
        ],
      },
    },
    status: "Reviewing",
    priority: "High",
    assignedTeam: {
      "Project Manager": "tm_1",
      "Backend Developer": "tm_3",
      "Business Analyst": "tm_7",
    },
    proposal: null,
    quotation: null,
    notes: "Client is migrating from Tally + custom PHP. High urgency — 6 month deadline.",
    timeline: [
      { status: "New", timestamp: daysAgo(2) },
      { status: "Reviewing", timestamp: hoursAgo(6) },
    ],
  },
  {
    id: "sub_seed_atlas_saaS",
    sessionId: "srg_seed_atlas_saaS",
    submittedAt: daysAgo(5),
    updatedAt: daysAgo(4),
    templateId: "crm",
    templateName: "CRM Platform",
    projectType: "CRM Platform",
    projectName: "Atlas Analytics SaaS",
    client: {
      fullName: "Sarah Chen",
      email: "sarah.chen@atlasanalytics.io",
      phone: "+1 415 555 0182",
      company: "Atlas Analytics Inc",
      jobTitle: "VP Engineering",
      country: "United States",
      timezone: "America/Los_Angeles (PST, UTC-8)",
      preferredContact: "video",
    },
    business: {
      legalName: "Atlas Analytics Inc",
      industry: "Technology / SaaS",
      size: "11-50",
      website: "https://atlasanalytics.io",
      stage: "growth",
      annualBudget: "50k_150k",
      targetLaunch: "3_6_months",
      existingStack: "React, Node.js, Postgres, Mixpanel, HubSpot, Salesforce",
      competitors: "Amplitude, Heap, Pendo",
      mission: "Make product analytics accessible to every team",
      vision: "The analytics layer of every modern SaaS product",
      targetAudience: "Product managers and growth teams at B2B SaaS companies",
      description:
        "A product analytics SaaS processing 2B+ events daily with AI-generated insight summaries.",
    },
    goals: {
      primaryGoal: "Launch analytics SaaS with 90% forecast accuracy",
      secondaryGoals: [
        "Process 2B+ events daily",
        "Sub-second query latency",
        "AI-generated insight summaries",
      ],
      successMetrics: "2B events/day, p99 < 1s, 50 paying customers in 6 months",
      priorities: { speed: 5, cost: 2, quality: 5, scalability: 5, innovation: 4 },
      deadline: "3_6_months",
      budgetRange: "50k_150k",
    },
    answers: {
      sales_model: "b2b_smb",
      modules_needed: ["leads", "deals", "contacts", "email", "forecast", "c360"],
      sales_reps_count: 12,
      monthly_leads: 800,
      pipeline_stages: "New → Contacted → Qualified → Demo → Proposal → Won",
      lead_sources: ["web_form", "ads", "linkedin", "referrals"],
      lead_scoring: true,
      assignment_rules: true,
      ai_features: ["lead_scoring", "deal_predict", "summary", "forecast"],
    },
    uploads: [
      {
        id: "up_seed_4",
        name: "Atlas_Sales_Process.pdf",
        size: 1_200_000,
        type: "application/pdf",
        category: "Documents",
        status: "ready",
        uploadedAt: daysAgo(5),
      },
      {
        id: "up_seed_5",
        name: "atlas_brand_assets.zip",
        size: 8_400_000,
        type: "application/zip",
        category: "Brand Assets",
        status: "ready",
        uploadedAt: daysAgo(5),
      },
    ],
    teamRequirements: {
      staffCount: 12,
      roles: ["Sales Rep", "Sales Manager", "Marketing Lead"],
      permissions: ["View", "Edit", "Approve"],
      approvalHierarchy: ["Sales Manager", "VP Sales", "CEO"],
    },
    workflow: {
      customer: {
        type: "customer",
        label: "Lead to Customer",
        enabled: true,
        stages: [
          { id: "s1", name: "Lead Capture", description: "", owner: "Marketing", slaHours: 1 },
          { id: "s2", name: "Auto-assign", description: "", owner: "System", slaHours: 0 },
          { id: "s3", name: "Qualification", description: "", owner: "Sales Rep", slaHours: 24 },
          { id: "s4", name: "Demo", description: "", owner: "Sales Rep", slaHours: 72 },
          { id: "s5", name: "Proposal", description: "", owner: "Sales Manager", slaHours: 48 },
          { id: "s6", name: "Won", description: "", owner: "Sales Rep", slaHours: 0 },
        ],
      },
    },
    status: "Proposal Ready",
    priority: "High",
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_2",
      "Backend Developer": "tm_3",
      "UI Designer": "tm_4",
    },
    proposal: {
      id: "prop_seed_1",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
      status: "draft",
      sections: [
        { id: "scope", title: "Project Scope", content: "Build a multi-tenant SaaS analytics platform with real-time event ingestion, sub-second queries, and AI-generated insights." },
        { id: "modules", title: "Modules", content: "Lead Management, Deal Pipeline, Contact DB, Email Integration, Forecasting, Customer 360" },
        { id: "timeline", title: "Timeline", content: "16 weeks: 4 weeks architecture, 8 weeks MVP, 4 weeks hardening" },
      ],
    },
    quotation: null,
    notes: "US-based client, prefers video calls. Strong technical team — will co-build.",
    timeline: [
      { status: "New", timestamp: daysAgo(5) },
      { status: "Reviewing", timestamp: daysAgo(4) },
      { status: "Proposal Ready", timestamp: daysAgo(3) },
    ],
  },
  {
    id: "sub_seed_nova_legal",
    sessionId: "srg_seed_nova_legal",
    submittedAt: daysAgo(1),
    updatedAt: daysAgo(1),
    templateId: "custom",
    templateName: "Custom Software",
    projectType: "Custom Software",
    projectName: "Nova AI Legal Assistant",
    client: {
      fullName: "David Okonkwo",
      email: "david@novalegal.com",
      phone: "+44 20 7946 0958",
      company: "Nova Legal Partners",
      jobTitle: "Managing Partner",
      country: "United Kingdom",
      timezone: "Europe/London (GMT, UTC+0)",
      preferredContact: "email",
    },
    business: {
      legalName: "Nova Legal Partners LLP",
      industry: "Legal / Professional Services",
      size: "11-50",
      website: "https://novalegal.com",
      stage: "enterprise",
      annualBudget: "50k_150k",
      targetLaunch: "3_6_months",
      existingStack: "Microsoft 365, Clio, custom SharePoint",
      competitors: "LexisNexis, Thomson Reuters",
      mission: "Make legal research 10x faster with AI",
      vision: "Every lawyer with an AI co-pilot",
      targetAudience: "Mid-size law firms and in-house legal teams",
      description:
        "A retrieval-augmented assistant for a legal firm — ingests 50k+ case documents, cites sources, ships answers with verifiable provenance.",
    },
    goals: {
      primaryGoal: "Launch RAG assistant trusted by lawyers within 4 months",
      secondaryGoals: [
        "Ingest 50k+ case documents",
        "Cite sources on every answer",
        "Verifiable provenance",
      ],
      successMetrics: "90% lawyer satisfaction, 50% faster research, 100% cited answers",
      priorities: { speed: 3, cost: 2, quality: 5, scalability: 4, innovation: 5 },
      deadline: "3_6_months",
      budgetRange: "50k_150k",
    },
    answers: {
      product_summary: "RAG-based legal research assistant with source citations",
      problem_solved: "Legal research is slow, expensive, and hard to verify",
      target_audience: "Mid-size law firms",
      core_features: "Document ingestion, semantic search, cited answers, audit trail",
      user_roles: ["admin", "lawyer", "paralegal", "guest"],
      platforms: ["web", "api"],
      third_party_integrations: ["ai", "storage", "auth"],
      compliance: ["gdpr", "iso27001"],
      expected_users: 200,
      expected_growth: "moderate",
    },
    uploads: [
      {
        id: "up_seed_6",
        name: "Nova_PRD.pdf",
        size: 3_100_000,
        type: "application/pdf",
        category: "Documents",
        status: "ready",
        uploadedAt: daysAgo(1),
        pageCount: 32,
      },
      {
        id: "up_seed_7",
        name: "nova_wireframes.zip",
        size: 12_000_000,
        type: "application/zip",
        category: "Wireframes",
        status: "ready",
        uploadedAt: daysAgo(1),
      },
    ],
    teamRequirements: {
      staffCount: 50,
      roles: ["Lawyer", "Paralegal", "IT Admin", "Managing Partner"],
      permissions: ["View", "Edit", "Admin"],
      approvalHierarchy: ["Managing Partner", "IT Admin"],
    },
    workflow: {
      approval: {
        type: "approval",
        label: "Content Approval",
        enabled: true,
        stages: [
          { id: "s1", name: "Submit", description: "", owner: "Lawyer", slaHours: 0 },
          { id: "s2", name: "Review", description: "", owner: "Senior Partner", slaHours: 24 },
          { id: "s3", name: "Approve/Reject", description: "", owner: "Managing Partner", slaHours: 48 },
        ],
      },
    },
    status: "New",
    priority: "Critical",
    assignedTeam: {},
    proposal: null,
    quotation: null,
    notes: "Hot lead — came via referral. Needs quick response.",
    timeline: [{ status: "New", timestamp: daysAgo(1) }],
  },
  {
    id: "sub_seed_zahra_trust",
    sessionId: "srg_seed_zahra_trust",
    submittedAt: daysAgo(8),
    updatedAt: daysAgo(3),
    templateId: "trust",
    templateName: "Trust / Foundation",
    projectType: "Trust / Foundation",
    projectName: "Zahra Foundation Portal",
    client: {
      fullName: "Zahra Al-Rashid",
      email: "zahra@zahrafoundation.org",
      phone: "+971 50 123 4567",
      company: "Zahra Foundation",
      jobTitle: "Director",
      country: "United Arab Emirates",
      timezone: "Asia/Dubai (GST, UTC+4)",
      preferredContact: "email",
    },
    business: {
      legalName: "Zahra Foundation",
      industry: "Non-profit / NGO",
      size: "11-50",
      website: "https://zahrafoundation.org",
      stage: "nonprofit",
      annualBudget: "15k_50k",
      targetLaunch: "1_3_months",
      existingStack: "WordPress, Google Sheets, Mailchimp",
      competitors: "Islamic Relief, UNHCR",
      mission: "Provide clean water and education to 100k families",
      vision: "A world where every child has clean water and a school",
      targetAudience: "Donors in GCC region, beneficiary families",
      description:
        "Donor portal with recurring donations, tax receipts, and impact dashboards.",
    },
    goals: {
      primaryGoal: "Increase recurring donations by 40% in 6 months",
      secondaryGoals: [
        "Launch donor portal with tax receipts",
        "Public transparency dashboard",
        "Track program impact",
      ],
      successMetrics: "40% increase in recurring donations, 1000 new donors",
      priorities: { speed: 4, cost: 4, quality: 3, scalability: 3, innovation: 2 },
      deadline: "1_3_months",
      budgetRange: "15k_50k",
    },
    answers: {
      trust_type: "public_charitable",
      registration_status: "registered_12a_80g",
      donor_count: 1200,
      annual_fundraise: "1cr_10cr",
      donor_portal_needed: true,
      donor_portal_features: ["history", "tax_receipts", "recurring", "impact_reports"],
      payment_methods: ["upi", "cards", "bank_transfer", "international"],
      donor_receipts: true,
      program_count: 5,
      impact_tracking: ["beneficiaries", "fund_utilization", "geography"],
      public_dashboard: true,
    },
    uploads: [
      {
        id: "up_seed_8",
        name: "Zahra_12A_80G.pdf",
        size: 540_000,
        type: "application/pdf",
        category: "Certificates",
        status: "ready",
        uploadedAt: daysAgo(8),
      },
      {
        id: "up_seed_9",
        name: "zahra_logo.png",
        size: 180_000,
        type: "image/png",
        category: "Logo",
        status: "ready",
        uploadedAt: daysAgo(8),
        width: 400,
        height: 400,
      },
    ],
    teamRequirements: {
      staffCount: 25,
      roles: ["Director", "Program Manager", "Finance", "Field Coordinator"],
      permissions: ["View", "Edit", "Approve"],
      approvalHierarchy: ["Program Manager", "Director", "Board"],
    },
    workflow: {
      customer: {
        type: "customer",
        label: "Donor Journey",
        enabled: true,
        stages: [
          { id: "s1", name: "Discover", description: "", owner: "Marketing", slaHours: 0 },
          { id: "s2", name: "First Donation", description: "", owner: "System", slaHours: 0 },
          { id: "s3", name: "Thank You + Receipt", description: "", owner: "System", slaHours: 1 },
          { id: "s4", name: "Impact Update", description: "", owner: "Programs", slaHours: 720 },
          { id: "s5", name: "Renewal Ask", description: "", owner: "Marketing", slaHours: 1440 },
        ],
      },
      payment: {
        type: "payment",
        label: "Donation Processing",
        enabled: true,
        stages: [
          { id: "s1", name: "Initiate", description: "", owner: "Donor", slaHours: 0 },
          { id: "s2", name: "Payment Gateway", description: "", owner: "System", slaHours: 0 },
          { id: "s3", name: "Success/Failure", description: "", owner: "System", slaHours: 0 },
          { id: "s4", name: "Receipt Generate", description: "", owner: "System", slaHours: 1 },
        ],
      },
    },
    status: "Quotation Sent",
    priority: "Medium",
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_8",
      "UI Designer": "tm_10",
    },
    proposal: {
      id: "prop_seed_2",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(4),
      status: "sent",
      sections: [
        { id: "scope", title: "Project Scope", content: "Donor portal with recurring donations, 80G receipts, and public impact dashboard." },
        { id: "modules", title: "Modules", content: "Donor DB, Donation Processing, Receipts, Impact Dashboard, Broadcast" },
        { id: "timeline", title: "Timeline", content: "10 weeks: 3 weeks design, 5 weeks dev, 2 weeks testing" },
      ],
    },
    quotation: {
      id: "quot_seed_2",
      createdAt: daysAgo(4),
      updatedAt: daysAgo(3),
      status: "sent",
      items: [
        { id: "li1", category: "UI/UX", description: "Donor portal design + mobile-responsive", qty: 1, unitPrice: 6000 },
        { id: "li2", category: "Frontend", description: "React/Next.js donor portal", qty: 1, unitPrice: 12000 },
        { id: "li3", category: "Backend", description: "Node.js API + payment integration", qty: 1, unitPrice: 14000 },
        { id: "li4", category: "Testing", description: "Manual + automated testing", qty: 1, unitPrice: 3000 },
        { id: "li5", category: "Deployment", description: "AWS setup + CI/CD", qty: 1, unitPrice: 2000 },
        { id: "li6", category: "Maintenance", description: "6 months support (annual)", qty: 1, unitPrice: 6000 },
      ],
      paymentTerms: "40% advance, 30% on MVP, 30% on delivery",
      taxRate: 0,
      discount: 5,
      currency: "USD",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: "5% NGO discount applied. Tax-exempt.",
    },
    notes: "Lovely mission-driven client. Flexible on timeline, tight on budget.",
    timeline: [
      { status: "New", timestamp: daysAgo(8) },
      { status: "Reviewing", timestamp: daysAgo(7) },
      { status: "Proposal Ready", timestamp: daysAgo(6) },
      { status: "Proposal Ready", timestamp: daysAgo(5) },
      { status: "Proposal Ready", timestamp: daysAgo(3) },
    ],
  },
  {
    id: "sub_seed_omni_restaurant",
    sessionId: "srg_seed_omni_restaurant",
    submittedAt: daysAgo(20),
    updatedAt: daysAgo(12),
    templateId: "restaurant",
    templateName: "Restaurant / F&B",
    projectType: "Restaurant / F&B",
    projectName: "Omni POS + Ordering Platform",
    client: {
      fullName: "Marco Rossi",
      email: "marco@omnifnb.com",
      phone: "+971 4 123 4567",
      company: "Omni F&B Group",
      jobTitle: "Operations Director",
      country: "United Arab Emirates",
      timezone: "Asia/Dubai (GST, UTC+4)",
      preferredContact: "phone",
    },
    business: {
      legalName: "Omni F&B Group LLC",
      industry: "Restaurant / F&B",
      size: "201-1000",
      website: "https://omnifnb.com",
      stage: "enterprise",
      annualBudget: "50k_150k",
      targetLaunch: "3_6_months",
      existingStack: "Legacy POS, QuickBooks, no online ordering",
      competitors: "Careem DineOut, Deliveroo",
      mission: "Unify online + dine-in operations across 12 outlets",
      vision: "The most tech-forward F&B group in the GCC",
      targetAudience: "Diners in Dubai, Abu Dhabi, Doha",
      description:
        "Multi-outlet POS, online ordering, delivery, loyalty, and centralized menu management.",
    },
    goals: {
      primaryGoal: "Launch online ordering with 30% margin uplift in 4 months",
      secondaryGoals: [
        "Reduce order-to-table time by 40%",
        "Build customer loyalty program",
        "Centralized menu management",
      ],
      successMetrics: "30% margin uplift, 12 outlets live, 50k orders/month",
      priorities: { speed: 5, cost: 3, quality: 4, scalability: 4, innovation: 3 },
      deadline: "3_6_months",
      budgetRange: "50k_150k",
    },
    answers: {
      concept_type: "qsr",
      outlet_count: 12,
      cuisine_types: ["asian", "continental", "mexican"],
      avg_daily_orders: 1800,
      service_modes: ["dinein", "takeaway", "self_delivery", "aggregator"],
      modules_needed: ["pos", "menu", "ordering_web", "mobile_app", "kds", "inventory", "loyalty"],
      pos_detail: "ipad",
      loyalty_detail: ["points", "tiered", "cashback"],
      payment_methods: ["cards", "upi", "wallets"],
      aggregator_integrations: ["zomato", "swiggy"],
      gst_invoicing: true,
    },
    uploads: [
      {
        id: "up_seed_10",
        name: "Omni_Menu.xlsx",
        size: 220_000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        category: "Data",
        status: "ready",
        uploadedAt: daysAgo(20),
      },
      {
        id: "up_seed_11",
        name: "omni_brand.zip",
        size: 15_000_000,
        type: "application/zip",
        category: "Brand Assets",
        status: "ready",
        uploadedAt: daysAgo(20),
      },
    ],
    teamRequirements: {
      staffCount: 350,
      roles: ["Outlet Manager", "Chef", "Cashier", "Delivery Driver"],
      permissions: ["View", "Edit", "Admin"],
      approvalHierarchy: ["Outlet Manager", "Operations Director", "CEO"],
    },
    workflow: {
      customer: {
        type: "customer",
        label: "Order Journey",
        enabled: true,
        stages: [
          { id: "s1", name: "Browse Menu", description: "", owner: "Customer", slaHours: 0 },
          { id: "s2", name: "Add to Cart", description: "", owner: "Customer", slaHours: 0 },
          { id: "s3", name: "Checkout", description: "", owner: "Customer", slaHours: 0 },
          { id: "s4", name: "Payment", description: "", owner: "System", slaHours: 0 },
          { id: "s5", name: "Kitchen", description: "", owner: "Chef", slaHours: 0 },
          { id: "s6", name: "Ready", description: "", owner: "Cashier", slaHours: 0 },
        ],
      },
    },
    status: "Approved",
    priority: "High",
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_2",
      "Backend Developer": "tm_3",
      "UI Designer": "tm_4",
      "QA Engineer": "tm_5",
      "DevOps": "tm_6",
    },
    proposal: {
      id: "prop_seed_3",
      createdAt: daysAgo(18),
      updatedAt: daysAgo(17),
      status: "accepted",
      sections: [
        { id: "scope", title: "Project Scope", content: "Multi-outlet POS, online ordering, KDS, loyalty, centralized menu." },
        { id: "modules", title: "Modules", content: "POS, Menu, Online Ordering, Mobile App, KDS, Inventory, Loyalty" },
      ],
    },
    quotation: {
      id: "quot_seed_3",
      createdAt: daysAgo(16),
      updatedAt: daysAgo(15),
      status: "accepted",
      items: [
        { id: "li1", category: "UI/UX", description: "12-outlet POS + consumer app", qty: 1, unitPrice: 18000 },
        { id: "li2", category: "Frontend", description: "React + React Native", qty: 1, unitPrice: 28000 },
        { id: "li3", category: "Backend", description: "NestJS + PostgreSQL", qty: 1, unitPrice: 32000 },
        { id: "li4", category: "Testing", description: "12 outlets UAT", qty: 1, unitPrice: 8000 },
        { id: "li5", category: "Deployment", description: "AWS + on-prem hybrid", qty: 1, unitPrice: 6000 },
      ],
      paymentTerms: "30% advance, 30% on MVP, 20% on UAT, 20% on go-live",
      taxRate: 5,
      discount: 0,
      currency: "USD",
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: "VAT 5% applicable in UAE.",
    },
    notes: "6-week sprint 1 in progress. KDS pilot at Downtown outlet live.",
    timeline: [
      { status: "New", timestamp: daysAgo(20) },
      { status: "Reviewing", timestamp: daysAgo(19) },
      { status: "Proposal Ready", timestamp: daysAgo(18) },
      { status: "Proposal Ready", timestamp: daysAgo(18) },
      { status: "Proposal Ready", timestamp: daysAgo(16) },
      { status: "Reviewing", timestamp: daysAgo(15) },
      { status: "Approved", timestamp: daysAgo(14) },
      { status: "Approved", timestamp: daysAgo(12) },
    ],
  },
  {
    id: "sub_seed_madrasa_app",
    sessionId: "srg_seed_madrasa_app",
    submittedAt: daysAgo(35),
    updatedAt: daysAgo(2),
    templateId: "jamaat",
    templateName: "Jamaat / Community",
    projectType: "Jamaat / Community",
    projectName: "Madrasa Hub — Community Platform",
    client: {
      fullName: "Imam Yusuf Abdullah",
      email: "yusuf@madrasahub.org",
      phone: "+44 7700 900123",
      company: "Madrasa Hub",
      jobTitle: "Director",
      country: "United Kingdom",
      timezone: "Europe/London (GMT, UTC+0)",
      preferredContact: "email",
    },
    business: {
      legalName: "Madrasa Hub",
      industry: "Religious / Community",
      size: "11-50",
      website: "https://madrasahub.org",
      stage: "nonprofit",
      annualBudget: "15k_50k",
      targetLaunch: "completed",
      existingStack: "WhatsApp, Excel, WordPress",
      competitors: "None in this niche",
      mission: "Centralize madrasa operations across 30 units",
      vision: "A digital backbone for every community madrasa",
      targetAudience: "Madrasa teachers, parents, students in UK",
      description:
        "Member database, attendance, fees, exams, parent portal, broadcast.",
    },
    goals: {
      primaryGoal: "Centralize 30 madrasa units onto one platform",
      secondaryGoals: ["Digitize attendance", "Parent portal", "Fee collection"],
      successMetrics: "30 units live, 90% attendance digitized",
      priorities: { speed: 3, cost: 5, quality: 3, scalability: 4, innovation: 2 },
      deadline: "3_6_months",
      budgetRange: "15k_50k",
    },
    answers: {
      community_type: "madrasa",
      member_count: 2500,
      unit_count: 30,
      hierarchy_levels: "three_level",
      languages: ["en", "ur", "ar"],
      modules_needed: ["members", "madrasa", "events", "announcements", "mobile_app"],
      madrasa_features: ["enrollment", "attendance", "grades", "teachers", "parents", "fees"],
    },
    uploads: [
      {
        id: "up_seed_12",
        name: "Madrasa_Hierarchy.pdf",
        size: 800_000,
        type: "application/pdf",
        category: "Documents",
        status: "ready",
        uploadedAt: daysAgo(35),
      },
    ],
    teamRequirements: {
      staffCount: 30,
      roles: ["Principal", "Teacher", "Parent", "Admin"],
      permissions: ["View", "Edit", "Admin"],
      approvalHierarchy: ["Principal", "Director"],
    },
    workflow: {
      customer: {
        type: "customer",
        label: "Member Journey",
        enabled: true,
        stages: [
          { id: "s1", name: "Onboarding", description: "", owner: "Admin", slaHours: 24 },
          { id: "s2", name: "Profile Verification", description: "", owner: "Principal", slaHours: 48 },
        ],
      },
    },
    status: "Approved",
    priority: "Low",
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_8",
      "UI Designer": "tm_10",
      "QA Engineer": "tm_5",
    },
    proposal: {
      id: "prop_seed_4",
      createdAt: daysAgo(33),
      updatedAt: daysAgo(33),
      status: "accepted",
      sections: [
        { id: "scope", title: "Project Scope", content: "Community platform with madrasa module, events, and mobile app." },
      ],
    },
    quotation: {
      id: "quot_seed_4",
      createdAt: daysAgo(32),
      updatedAt: daysAgo(32),
      status: "accepted",
      items: [
        { id: "li1", category: "UI/UX", description: "Web + mobile design", qty: 1, unitPrice: 5000 },
        { id: "li2", category: "Frontend", description: "React + React Native", qty: 1, unitPrice: 14000 },
        { id: "li3", category: "Backend", description: "Node.js + Postgres", qty: 1, unitPrice: 10000 },
      ],
      paymentTerms: "50% advance, 50% on delivery",
      taxRate: 0,
      discount: 10,
      currency: "USD",
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: "Community discount applied.",
    },
    notes: "Delivered successfully. Now in maintenance.",
    timeline: [
      { status: "New", timestamp: daysAgo(35) },
      { status: "Reviewing", timestamp: daysAgo(34) },
      { status: "Approved", timestamp: daysAgo(32) },
      { status: "Approved", timestamp: daysAgo(28) },
      { status: "Approved", timestamp: daysAgo(7) },
      { status: "Approved", timestamp: daysAgo(3) },
      { status: "Approved", timestamp: daysAgo(2) },
    ],
  },
];

/* --------------------------- Seed: Dev Projects --------------------------- */

const SEED_PROJECTS: DevProject[] = [
  {
    id: "proj_seed_omni",
    name: "Omni POS + Ordering Platform",
    clientId: "client_seed_omni",
    clientName: "Marco Rossi",
    clientCompany: "Omni F&B Group",
    submissionId: "sub_seed_omni_restaurant",
    status: "Development",
    priority: "High",
    techStack: ["React", "React Native", "NestJS", "PostgreSQL", "AWS", "Docker"],
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_2",
      "Backend Developer": "tm_3",
      "UI Designer": "tm_4",
      "QA Engineer": "tm_5",
      "DevOps": "tm_6",
    },
    startDate: daysAgo(12),
    estimatedEndDate: daysAgo(-90),
    currentStage: "Development",
    progress: 35,
    budget: 92000,
    currency: "USD",
    description: "Multi-outlet POS, online ordering, KDS, loyalty, centralized menu management across 12 outlets.",
    tasks: [
      { id: "task_1", title: "POS terminal setup", description: "iPad POS with receipt printing", assigneeId: "tm_2", status: "Done", priority: "High", dueDate: daysAgo(-5), createdAt: daysAgo(12) },
      { id: "task_2", title: "KDS integration", description: "Kitchen display system for order routing", assigneeId: "tm_3", status: "In Progress", priority: "High", dueDate: daysAgo(-10), createdAt: daysAgo(10) },
      { id: "task_3", title: "Loyalty program", description: "Points + tiers + cashback", assigneeId: "tm_2", status: "To Do", priority: "Medium", dueDate: daysAgo(-30), createdAt: daysAgo(5) },
      { id: "task_4", title: "Aggregator integration", description: "Zomato + Swiggy order sync", assigneeId: "tm_3", status: "Review", priority: "Medium", dueDate: daysAgo(-15), createdAt: daysAgo(8) },
    ],
    milestones: [
      { id: "ms_1", title: "POS MVP at Downtown outlet", description: "Single outlet live with POS", dueDate: daysAgo(-5), completed: true, completedAt: daysAgo(3) },
      { id: "ms_2", title: "KDS pilot", description: "Kitchen display at 2 outlets", dueDate: daysAgo(10), completed: false },
      { id: "ms_3", title: "Online ordering launch", description: "Web + app ordering live", dueDate: daysAgo(-45), completed: false },
      { id: "ms_4", title: "All 12 outlets live", description: "Full rollout", dueDate: daysAgo(-90), completed: false },
    ],
    notes: "6-week sprint 1 in progress. KDS pilot at Downtown outlet live.",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
  },
  {
    id: "proj_seed_madrasa",
    name: "Madrasa Hub — Community Platform",
    clientId: "client_seed_madrasa",
    clientName: "Imam Yusuf Abdullah",
    clientCompany: "Madrasa Hub",
    submissionId: "sub_seed_madrasa_app",
    status: "Maintenance",
    priority: "Low",
    techStack: ["React", "React Native", "Node.js", "PostgreSQL", "Vercel"],
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_8",
      "UI Designer": "tm_10",
      "QA Engineer": "tm_5",
    },
    startDate: daysAgo(33),
    estimatedEndDate: daysAgo(-3),
    currentStage: "Maintenance",
    progress: 100,
    budget: 27000,
    currency: "USD",
    description: "Community platform with madrasa module, events, attendance, fees, and mobile app.",
    tasks: [
      { id: "task_5", title: "Bug fixes — attendance sync", description: "Fix offline attendance sync issue", assigneeId: "tm_8", status: "Done", priority: "Medium", dueDate: daysAgo(2), createdAt: daysAgo(10) },
      { id: "task_6", title: "Feature: exam report cards", description: "Add PDF report card generation", assigneeId: "tm_8", status: "In Progress", priority: "Low", dueDate: daysAgo(-7), createdAt: daysAgo(3) },
    ],
    milestones: [
      { id: "ms_5", title: "Platform launch", description: "30 units live", dueDate: daysAgo(3), completed: true, completedAt: daysAgo(3) },
    ],
    notes: "Delivered successfully. Now in maintenance with monthly retainer.",
    createdAt: daysAgo(35),
    updatedAt: daysAgo(2),
  },
  {
    id: "proj_seed_helios",
    name: "Helios ERP Modernization",
    clientId: "client_seed_helios",
    clientName: "Rajiv Menon",
    clientCompany: "Helios Logistics",
    submissionId: "sub_seed_helios_erp",
    status: "Planning",
    priority: "High",
    techStack: ["Next.js", "NestJS", "PostgreSQL", "AWS", "Redis"],
    assignedTeam: {
      "Project Manager": "tm_1",
      "Backend Developer": "tm_3",
      "Business Analyst": "tm_7",
    },
    startDate: daysAgo(3),
    estimatedEndDate: daysAgo(-150),
    currentStage: "Planning",
    progress: 10,
    budget: 120000,
    currency: "USD",
    description: "Replace 14 legacy systems with a unified ERP covering finance, inventory, HR, and operations.",
    tasks: [
      { id: "task_7", title: "Requirements workshop", description: "2-day workshop with all department heads", assigneeId: "tm_7", status: "Done", priority: "High", dueDate: daysAgo(1), createdAt: daysAgo(5) },
      { id: "task_8", title: "Architecture design", description: "Microservices architecture for 14 modules", assigneeId: "tm_3", status: "In Progress", priority: "High", dueDate: daysAgo(-14), createdAt: daysAgo(3) },
      { id: "task_9", title: "Data migration plan", description: "Plan for migrating Tally data", assigneeId: "tm_7", status: "To Do", priority: "Medium", dueDate: daysAgo(-21), createdAt: daysAgo(1) },
    ],
    milestones: [
      { id: "ms_6", title: "Architecture sign-off", description: "CFO + CTO approval on architecture", dueDate: daysAgo(-14), completed: false },
      { id: "ms_7", title: "Finance module MVP", description: "GL + AP + AR live", dueDate: daysAgo(-60), completed: false },
      { id: "ms_8", title: "Full ERP rollout", description: "All 14 branches migrated", dueDate: daysAgo(-150), completed: false },
    ],
    notes: "Architecture in progress. Client wants Tally data migration within first 3 months.",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: "proj_seed_atlas",
    name: "Atlas Analytics SaaS",
    clientId: "client_seed_atlas",
    clientName: "Sarah Chen",
    clientCompany: "Atlas Analytics",
    submissionId: "sub_seed_atlas_saaS",
    status: "UI/UX",
    priority: "High",
    techStack: ["React", "Next.js", "Node.js", "ClickHouse", "GCP"],
    assignedTeam: {
      "Project Manager": "tm_1",
      "Frontend Developer": "tm_2",
      "Backend Developer": "tm_3",
      "UI Designer": "tm_4",
    },
    startDate: daysAgo(7),
    estimatedEndDate: daysAgo(-100),
    currentStage: "UI/UX",
    progress: 20,
    budget: 85000,
    currency: "USD",
    description: "Product analytics SaaS processing 2B+ events daily with AI-generated insight summaries.",
    tasks: [
      { id: "task_10", title: "Design system setup", description: "Component library + design tokens", assigneeId: "tm_4", status: "In Progress", priority: "High", dueDate: daysAgo(-3), createdAt: daysAgo(7) },
      { id: "task_11", title: "Dashboard wireframes", description: "Main analytics dashboard + drill-downs", assigneeId: "tm_4", status: "In Progress", priority: "High", dueDate: daysAgo(-7), createdAt: daysAgo(5) },
      { id: "task_12", title: "Event ingestion pipeline", description: "Kafka + ClickHouse pipeline", assigneeId: "tm_3", status: "To Do", priority: "High", dueDate: daysAgo(-21), createdAt: daysAgo(3) },
    ],
    milestones: [
      { id: "ms_9", title: "Design approval", description: "Client signs off on UI/UX", dueDate: daysAgo(-7), completed: false },
      { id: "ms_10", title: "MVP launch", description: "Core analytics + dashboards", dueDate: daysAgo(-60), completed: false },
    ],
    notes: "Strong technical team on client side — will co-build. Video calls preferred.",
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
];

/* --------------------------- Seed: Clients --------------------------- */

const SEED_CLIENTS: Client[] = [
  {
    id: "client_seed_helios",
    company: "Helios Logistics Pvt Ltd",
    contactPerson: "Rajiv Menon",
    email: "rajiv.menon@helioslogistics.com",
    phone: "+91 98765 43210",
    website: "https://helioslogistics.com",
    industry: "Logistics / Supply Chain",
    address: "Mumbai, India",
    status: "Active",
    createdAt: daysAgo(2),
    notes: "Enterprise client. Migrating from Tally + custom PHP. High urgency.",
    submissionIds: ["sub_seed_helios_erp"],
    projectIds: ["proj_seed_helios"],
  },
  {
    id: "client_seed_atlas",
    company: "Atlas Analytics Inc",
    contactPerson: "Sarah Chen",
    email: "sarah.chen@atlasanalytics.io",
    phone: "+1 415 555 0182",
    website: "https://atlasanalytics.io",
    industry: "Technology / SaaS",
    address: "San Francisco, USA",
    status: "Active",
    createdAt: daysAgo(5),
    notes: "US-based SaaS startup. Strong technical team. Prefers video calls.",
    submissionIds: ["sub_seed_atlas_saaS"],
    projectIds: ["proj_seed_atlas"],
  },
  {
    id: "client_seed_nova",
    company: "Nova Legal Partners LLP",
    contactPerson: "David Okonkwo",
    email: "david@novalegal.com",
    phone: "+44 20 7946 0958",
    website: "https://novalegal.com",
    industry: "Legal / Professional Services",
    address: "London, UK",
    status: "Prospect",
    createdAt: daysAgo(1),
    notes: "Hot lead via referral. AI legal assistant. Needs quick response.",
    submissionIds: ["sub_seed_nova_legal"],
    projectIds: [],
  },
  {
    id: "client_seed_zahra",
    company: "Zahra Foundation",
    contactPerson: "Zahra Al-Rashid",
    email: "zahra@zahrafoundation.org",
    phone: "+971 50 123 4567",
    website: "https://zahrafoundation.org",
    industry: "Non-profit / NGO",
    address: "Dubai, UAE",
    status: "Active",
    createdAt: daysAgo(8),
    notes: "Mission-driven NGO. Flexible timeline, tight budget. 5% NGO discount.",
    submissionIds: ["sub_seed_zahra_trust"],
    projectIds: [],
  },
  {
    id: "client_seed_omni",
    company: "Omni F&B Group LLC",
    contactPerson: "Marco Rossi",
    email: "marco@omnifnb.com",
    phone: "+971 4 123 4567",
    website: "https://omnifnb.com",
    industry: "Restaurant / F&B",
    address: "Dubai, UAE",
    status: "Active",
    createdAt: daysAgo(20),
    notes: "12-outlet F&B group. VAT 5% applicable. Hybrid deployment.",
    submissionIds: ["sub_seed_omni_restaurant"],
    projectIds: ["proj_seed_omni"],
  },
  {
    id: "client_seed_madrasa",
    company: "Madrasa Hub",
    contactPerson: "Imam Yusuf Abdullah",
    email: "yusuf@madrasahub.org",
    phone: "+44 7700 900123",
    website: "https://madrasahub.org",
    industry: "Religious / Community",
    address: "London, UK",
    status: "Active",
    createdAt: daysAgo(35),
    notes: "Community platform delivered. Monthly maintenance retainer.",
    submissionIds: ["sub_seed_madrasa_app"],
    projectIds: ["proj_seed_madrasa"],
  },
];

/* --------------------------- Seed: Invoices --------------------------- */

const SEED_INVOICES: Invoice[] = [
  {
    id: "inv_seed_1",
    invoiceNumber: "INV-2025-001",
    clientId: "client_seed_omni",
    clientName: "Marco Rossi",
    clientCompany: "Omni F&B Group",
    amount: 27600,
    currency: "USD",
    status: "Paid",
    issueDate: daysAgo(14),
    dueDate: daysAgo(0),
    paidDate: daysAgo(2),
    projectId: "proj_seed_omni",
    items: [
      { description: "40% advance — Omni POS + Ordering Platform", amount: 27600 },
    ],
    notes: "VAT 5% included",
  },
  {
    id: "inv_seed_2",
    invoiceNumber: "INV-2025-002",
    clientId: "client_seed_madrasa",
    clientName: "Imam Yusuf Abdullah",
    clientCompany: "Madrasa Hub",
    amount: 13500,
    currency: "USD",
    status: "Paid",
    issueDate: daysAgo(33),
    dueDate: daysAgo(18),
    paidDate: daysAgo(20),
    projectId: "proj_seed_madrasa",
    items: [
      { description: "50% advance — Madrasa Hub Platform", amount: 13500 },
    ],
  },
  {
    id: "inv_seed_3",
    invoiceNumber: "INV-2025-003",
    clientId: "client_seed_madrasa",
    clientName: "Imam Yusuf Abdullah",
    clientCompany: "Madrasa Hub",
    amount: 13500,
    currency: "USD",
    status: "Paid",
    issueDate: daysAgo(3),
    dueDate: daysAgo(-12),
    paidDate: daysAgo(1),
    projectId: "proj_seed_madrasa",
    items: [
      { description: "50% final — Madrasa Hub Platform", amount: 13500 },
    ],
  },
  {
    id: "inv_seed_4",
    invoiceNumber: "INV-2025-004",
    clientId: "client_seed_omni",
    clientName: "Marco Rossi",
    clientCompany: "Omni F&B Group",
    amount: 27600,
    currency: "USD",
    status: "Pending",
    issueDate: daysAgo(5),
    dueDate: daysAgo(-25),
    projectId: "proj_seed_omni",
    items: [
      { description: "30% on MVP — Omni POS + Ordering Platform", amount: 27600 },
    ],
  },
  {
    id: "inv_seed_5",
    invoiceNumber: "INV-2025-005",
    clientId: "client_seed_atlas",
    clientName: "Sarah Chen",
    clientCompany: "Atlas Analytics Inc",
    amount: 17000,
    currency: "USD",
    status: "Pending",
    issueDate: daysAgo(3),
    dueDate: daysAgo(-12),
    projectId: "proj_seed_atlas",
    items: [
      { description: "20% advance — Atlas Analytics SaaS", amount: 17000 },
    ],
  },
  {
    id: "inv_seed_6",
    invoiceNumber: "INV-2025-006",
    clientId: "client_seed_zahra",
    clientName: "Zahra Al-Rashid",
    clientCompany: "Zahra Foundation",
    amount: 12255,
    currency: "USD",
    status: "Overdue",
    issueDate: daysAgo(15),
    dueDate: daysAgo(1),
    projectId: undefined,
    items: [
      { description: "30% advance — Zahra Foundation Portal", amount: 12255 },
    ],
    notes: "5% NGO discount applied. Tax-exempt.",
  },
  {
    id: "inv_seed_7",
    invoiceNumber: "INV-2025-007",
    clientId: "client_seed_madrasa",
    clientName: "Imam Yusuf Abdullah",
    clientCompany: "Madrasa Hub",
    amount: 500,
    currency: "USD",
    status: "Draft",
    issueDate: daysAgo(0),
    dueDate: daysAgo(-30),
    items: [
      { description: "Monthly maintenance retainer — December", amount: 500 },
    ],
  },
];

/* --------------------------- Seed: Meetings --------------------------- */

const SEED_MEETINGS: Meeting[] = [
  {
    id: "mtg_seed_1",
    title: "Helios ERP — Architecture Review",
    type: "review",
    clientId: "client_seed_helios",
    clientName: "Rajiv Menon",
    projectId: "proj_seed_helios",
    date: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    duration: 90,
    attendees: ["Aarav Mehta", "Rohan Kapoor", "Arjun Nair", "Rajiv Menon"],
    location: "Google Meet",
    notes: "Review microservices architecture proposal. CFO + CTO will join.",
    status: "scheduled",
  },
  {
    id: "mtg_seed_2",
    title: "Atlas Analytics — Design Approval",
    type: "client",
    clientId: "client_seed_atlas",
    clientName: "Sarah Chen",
    projectId: "proj_seed_atlas",
    date: Date.now() + 4 * 24 * 60 * 60 * 1000,
    duration: 60,
    attendees: ["Aarav Mehta", "Sara Khan", "Sarah Chen"],
    location: "Zoom",
    notes: "Walk through dashboard designs and get sign-off on UI direction.",
    status: "scheduled",
  },
  {
    id: "mtg_seed_3",
    title: "Nova Legal — Discovery Call",
    type: "kickoff",
    clientId: "client_seed_nova",
    clientName: "David Okonkwo",
    date: Date.now() + 1 * 24 * 60 * 60 * 1000,
    duration: 45,
    attendees: ["Aarav Mehta", "Arjun Nair", "David Okonkwo"],
    location: "Google Meet",
    notes: "Initial discovery call. Understand legal RAG requirements.",
    status: "scheduled",
  },
  {
    id: "mtg_seed_4",
    title: "Omni POS — Sprint Demo",
    type: "review",
    clientId: "client_seed_omni",
    clientName: "Marco Rossi",
    projectId: "proj_seed_omni",
    date: Date.now() + 5 * 24 * 60 * 60 * 1000,
    duration: 60,
    attendees: ["Aarav Mehta", "Priya Sharma", "Rohan Kapoor", "Marco Rossi"],
    location: "Google Meet",
    notes: "Demo KDS pilot at Downtown outlet. Show online ordering progress.",
    status: "scheduled",
  },
  {
    id: "mtg_seed_5",
    title: "Weekly Team Standup",
    type: "internal",
    date: Date.now() + 1 * 60 * 60 * 1000, // 1 hour from now
    duration: 30,
    attendees: ["Aarav Mehta", "Priya Sharma", "Rohan Kapoor", "Sara Khan"],
    location: "Office / Meet",
    notes: "Weekly sync across all active projects.",
    status: "scheduled",
  },
  {
    id: "mtg_seed_6",
    title: "Zahra Foundation — Follow-up",
    type: "follow-up",
    clientId: "client_seed_zahra",
    clientName: "Zahra Al-Rashid",
    date: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    duration: 30,
    attendees: ["Aarav Mehta", "Zahra Al-Rashid"],
    location: "Phone",
    notes: "Follow up on quotation. Client asked for payment plan options.",
    status: "completed",
  },
];

/* --------------------------- Seed: Activities --------------------------- */

const SEED_ACTIVITIES: ActivityLog[] = [
  { id: "act_1", type: "submission", action: "New submission", description: "Nova AI Legal Assistant submitted by David Okonkwo", timestamp: daysAgo(1), entityId: "sub_seed_nova_legal", entityType: "submission", actor: "System" },
  { id: "act_2", type: "project", action: "Project created", description: "Helios ERP Modernization project created", timestamp: daysAgo(5), entityId: "proj_seed_helios", entityType: "project", actor: "Aarav Mehta" },
  { id: "act_3", type: "invoice", action: "Invoice paid", description: "INV-2025-001 paid by Omni F&B Group ($27,600)", timestamp: daysAgo(2), entityId: "inv_seed_1", entityType: "invoice", actor: "System" },
  { id: "act_4", type: "quotation", action: "Quotation sent", description: "Quotation sent to Zahra Foundation ($40,850)", timestamp: daysAgo(3), entityId: "sub_seed_zahra_trust", entityType: "submission", actor: "Aarav Mehta" },
  { id: "act_5", type: "team", action: "Team assigned", description: "6 team members assigned to Omni POS project", timestamp: daysAgo(12), entityId: "proj_seed_omni", entityType: "project", actor: "Aarav Mehta" },
  { id: "act_6", type: "meeting", action: "Meeting scheduled", description: "Architecture Review with Helios scheduled for +2 days", timestamp: daysAgo(1), entityId: "mtg_seed_1", entityType: "meeting", actor: "Aarav Mehta" },
  { id: "act_7", type: "project", action: "Stage update", description: "Atlas Analytics moved to UI/UX stage", timestamp: daysAgo(3), entityId: "proj_seed_atlas", entityType: "project", actor: "Aarav Mehta" },
  { id: "act_8", type: "invoice", action: "Invoice overdue", description: "INV-2025-006 is now overdue (Zahra Foundation)", timestamp: daysAgo(1), entityId: "inv_seed_6", entityType: "invoice", actor: "System" },
  { id: "act_9", type: "submission", action: "Status changed", description: "Atlas Analytics marked as Proposal Ready", timestamp: daysAgo(3), entityId: "sub_seed_atlas_saaS", entityType: "submission", actor: "Aarav Mehta" },
  { id: "act_10", type: "project", action: "Milestone completed", description: "POS MVP at Downtown outlet completed for Omni", timestamp: daysAgo(3), entityId: "proj_seed_omni", entityType: "project", actor: "Aarav Mehta" },
];

/* --------------------------- Seed runner --------------------------- */

/**
 * Phase 2: No seed data. The dashboard reads from the backend API.
 * This function is kept for backward compatibility but does nothing.
 */
export function seedIfNeeded(): void {
  // No-op — all data comes from the backend API now.
}

/* --------------------------- SRG → Admin bridge --------------------------- */

/**
 * Convert an SRG submission payload (from /start-project) into an
 * AdminSubmission and persist it in mbtl_submissions. Also fires a
 * notification.
 */
export function ingestSrgSubmission(payload: SrgSubmissionPayload): AdminSubmission {
  const template = getTemplate(payload.templateId);
  const templateName = template?.name ?? payload.templateId;
  const projectName = deriveProjectName(payload, templateName);

  // Build SRG sections for display (question label + answer)
  const srgSections = template
    ? template.sections.map((section) => ({
        id: section.id,
        title: section.title,
        questions: section.questions
          .filter((q) => payload.answers[q.id] !== undefined && payload.answers[q.id] !== null && payload.answers[q.id] !== "")
          .map((q) => ({
            id: q.id,
            label: q.label,
            type: q.type,
            answer: payload.answers[q.id],
          })),
      })).filter((s) => s.questions.length > 0)
    : [];

  // Detect duplicate (same sessionId) and replace
  const existing = loadSubmissions();
  const existingIdx = existing.findIndex(
    (s) => s.sessionId === payload.sessionId
  );

  // Pick a priority based on budget + deadline
  const priority: Priority = detectPriority(payload);

  const submission: AdminSubmission = {
    id: existingIdx >= 0 ? existing[existingIdx].id : generateId("sub"),
    sessionId: payload.sessionId,
    submittedAt: payload.submittedAt,
    updatedAt: Date.now(),
    templateId: payload.templateId,
    templateName,
    projectType: payload.projectType,
    projectName,
    client: {
      fullName: payload.clientDetails.fullName,
      email: payload.clientDetails.email,
      phone: payload.clientDetails.phone,
      company: payload.clientDetails.company,
      jobTitle: payload.clientDetails.jobTitle,
      country: payload.clientDetails.country,
      timezone: payload.clientDetails.timezone,
      preferredContact: payload.clientDetails.preferredContact,
    },
    business: {
      ...payload.businessDetails,
      mission: "",
      vision: "",
      targetAudience: "",
      description: payload.businessDetails.existingStack,
    },
    goals: payload.projectGoals,
    answers: payload.answers,
    uploads: payload.uploads.map((u) => ({
      id: u.id,
      name: u.name,
      size: u.size,
      type: u.type,
      category: u.category,
      status: u.status,
      uploadedAt: u.uploadedAt,
      width: u.width,
      height: u.height,
      durationSec: u.durationSec,
      pageCount: u.pageCount,
      previewDataUrl: u.previewDataUrl,
    })),
    teamRequirements: {
      roles: payload.teamRoles.map((r) => r.role),
      permissions: payload.teamRoles.flatMap((r) => r.permissions),
      approvalHierarchy: [],
    },
    workflow: payload.workflow as Record<string, never>,
    status: "New",
    priority,
    assignedTeam: {},
    proposal: null,
    quotation: null,
    notes: "",
    timeline: [{ status: "New", timestamp: payload.submittedAt }],
    srgSections,
  };

  if (existingIdx >= 0) {
    // preserve admin-side metadata (status, team, proposal, quotation, notes, timeline)
    const preserved = existing[existingIdx];
    submission.status = preserved.status;
    submission.priority = preserved.priority;
    submission.assignedTeam = preserved.assignedTeam;
    submission.proposal = preserved.proposal;
    submission.quotation = preserved.quotation;
    submission.notes = preserved.notes;
    submission.timeline = preserved.timeline;
    existing[existingIdx] = submission;
    saveSubmissions(existing);
  } else {
    upsertSubmission(submission);
    // Fire a notification
    addNotification({
      type: "submission",
      title: "New submission received",
      description: `${projectName} — ${payload.clientDetails.company}`,
      submissionId: submission.id,
    });
  }

  return submission;
}

function deriveProjectName(
  payload: SrgSubmissionPayload,
  templateName: string
): string {
  const company = payload.clientDetails.company;
  // strip suffixes like "Pvt Ltd", "Inc", "LLP", etc.
  const shortCompany = company
    .replace(/\s+(Pvt\s+Ltd|Private\s+Limited|Inc|LLP|LLC|Ltd|Limited|Corp|Corporation|GmbH|S\.A\.|S\.r\.l)\.?$/i, "")
    .trim();
  return `${shortCompany || company || "New Project"} — ${templateName}`;
}

function detectPriority(payload: SrgSubmissionPayload): Priority {
  const budget = payload.businessDetails.annualBudget;
  const deadline = payload.projectGoals.deadline;
  if (deadline === "asap") return "Critical";
  if (budget === "above_150k" || budget === "50k_150k") return "High";
  if (budget === "15k_50k") return "Medium";
  return "Low";
}
