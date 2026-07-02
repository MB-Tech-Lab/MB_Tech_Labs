/**
 * Trust / NGO Template
 * -------------------
 * For charitable trusts, foundations, and non-profit organizations.
 * Focus: donor management, transparency, fund tracking, community engagement.
 */
import type { SrgTemplate } from "../types";

export const trustTemplate: SrgTemplate = {
  id: "trust",
  name: "Trust / Foundation",
  tagline: "Donor management, transparency & fund tracking",
  description:
    "For charitable trusts, foundations, NGOs, and non-profits managing donors, programs, and impact reporting.",
  icon: "Heart",
  accent: "from-cyan/20 to-cyan/5",
  suggestedGoals: [
    "Increase recurring donations by 40%",
    "Launch donor portal with tax receipts",
    "Track program impact with measurable KPIs",
    "Improve transparency with public dashboards",
  ],
  sections: [
    {
      id: "trust-operations",
      title: "Trust Operations",
      questions: [
        {
          id: "trust_type",
          type: "select",
          label: "What type of trust is this?",
          required: true,
          options: [
            { label: "Public Charitable Trust", value: "public_charitable" },
            { label: "Private Foundation", value: "private_foundation" },
            { label: "Religious Trust", value: "religious" },
            { label: "Educational Trust", value: "educational" },
            { label: "Community Foundation", value: "community" },
          ],
        },
        {
          id: "registration_status",
          type: "select",
          label: "Registration status",
          required: true,
          options: [
            { label: "Registered (12A/80G)", value: "registered_12a_80g" },
            { label: "Registered (12A only)", value: "registered_12a" },
            { label: "Pending registration", value: "pending" },
            { label: "Not registered yet", value: "not_registered" },
          ],
        },
        {
          id: "donor_count",
          type: "number",
          label: "Approximate active donor count",
          required: true,
          min: 0,
          max: 1000000,
          help: "Used to size the donor database and CRM capacity.",
        },
        {
          id: "annual_fundraise",
          type: "select",
          label: "Annual fundraising volume",
          required: true,
          options: [
            { label: "Under ₹10L / $12K", value: "under_10l" },
            { label: "₹10L – ₹1Cr / $12K–$120K", value: "10l_1cr" },
            { label: "₹1Cr – ₹10Cr / $120K–$1.2M", value: "1cr_10cr" },
            { label: "Above ₹10Cr / $1.2M", value: "above_10cr" },
          ],
        },
      ],
    },
    {
      id: "trust-donors",
      title: "Donor Management",
      questions: [
        {
          id: "donor_portal_needed",
          type: "boolean",
          label: "Do you need a donor self-service portal?",
          required: true,
        },
        {
          id: "donor_portal_features",
          type: "multiselect",
          label: "Which portal features do you need?",
          showIf: [{ questionId: "donor_portal_needed", op: "truthy", value: true }],
          options: [
            { label: "Donation history", value: "history" },
            { label: "Tax receipts (80G/12A)", value: "tax_receipts" },
            { label: "Recurring donation setup", value: "recurring" },
            { label: "Impact reports", value: "impact_reports" },
            { label: "Pledge management", value: "pledges" },
            { label: "Donor anonymity toggle", value: "anonymity" },
          ],
        },
        {
          id: "payment_methods",
          type: "multiselect",
          label: "Accepted donation methods",
          required: true,
          options: [
            { label: "UPI", value: "upi" },
            { label: "Credit/Debit Cards", value: "cards" },
            { label: "Net Banking", value: "netbanking" },
            { label: "Bank Transfer (NEFT/RTGS)", value: "bank_transfer" },
            { label: "Cheque/DD", value: "cheque" },
            { label: "International (PayPal/Stripe)", value: "international" },
            { label: "Crypto", value: "crypto" },
          ],
        },
        {
          id: "donor_receipts",
          type: "boolean",
          label: "Auto-generate tax receipts on donation?",
          required: true,
        },
      ],
    },
    {
      id: "trust-programs",
      title: "Programs & Impact",
      questions: [
        {
          id: "program_count",
          type: "number",
          label: "How many active programs/projects do you run?",
          required: true,
          min: 1,
          max: 500,
        },
        {
          id: "impact_tracking",
          type: "multiselect",
          label: "What impact metrics do you track?",
          options: [
            { label: "Beneficiaries reached", value: "beneficiaries" },
            { label: "Funds utilized vs allocated", value: "fund_utilization" },
            { label: "Geographic coverage", value: "geography" },
            { label: "SDG alignment", value: "sdg" },
            { label: "Outcome surveys", value: "surveys" },
            { label: "Volunteer hours", value: "volunteer_hours" },
          ],
        },
        {
          id: "beneficiary_data",
          type: "boolean",
          label: "Do you collect beneficiary personal data?",
        },
        {
          id: "beneficiary_data_detail",
          type: "textarea",
          label: "What beneficiary data is collected and how is it stored today?",
          showIf: [{ questionId: "beneficiary_data", op: "truthy", value: true }],
          maxLength: 800,
        },
        {
          id: "public_dashboard",
          type: "boolean",
          label: "Do you want a public transparency dashboard?",
          required: true,
        },
      ],
    },
    {
      id: "trust-compliance",
      title: "Compliance & Reporting",
      questions: [
        {
          id: "compliance_frameworks",
          type: "multiselect",
          label: "Which compliance frameworks apply?",
          required: true,
          options: [
            { label: "FCRA (foreign contributions)", value: "fcra" },
            { label: "GST", value: "gst" },
            { label: "IT Act 80G/12A", value: "it_act" },
            { label: "DPDP Act (data protection)", value: "dpdp" },
            { label: "RERA (if applicable)", value: "rera" },
            { label: "GDPR (EU donors)", value: "gdpr" },
          ],
        },
        {
          id: "audit_frequency",
          type: "radio",
          label: "Audit reporting frequency",
          required: true,
          options: [
            { label: "Quarterly", value: "quarterly" },
            { label: "Half-yearly", value: "half_yearly" },
            { label: "Annual", value: "annual" },
          ],
        },
        {
          id: "existing_crm",
          type: "text",
          label: "Current CRM or donor management system (if any)",
          placeholder: "e.g. Salesforce, Razorpay, spreadsheets, none",
        },
      ],
    },
  ],
  uploadRequirements: [
    {
      category: "legal",
      label: "Trust Registration Certificate",
      description: "12A/80G registration document",
      required: true,
      accept: ["application/pdf", "image/png", "image/jpeg"],
      maxSizeMB: 10,
    },
    {
      category: "legal",
      label: "FCRA Certificate (if applicable)",
      accept: ["application/pdf"],
      maxSizeMB: 10,
    },
    {
      category: "branding",
      label: "Trust Logo & Brand Assets",
      required: true,
      accept: ["image/png", "image/jpeg", "image/svg+xml", "application/zip"],
      maxSizeMB: 25,
      multiple: true,
    },
    {
      category: "documents",
      label: "Annual Report (latest)",
      accept: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      maxSizeMB: 25,
    },
    {
      category: "data",
      label: "Donor Data Sample (anonymized)",
      description: "CSV/XLSX with sample donor record structure",
      accept: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "text/csv"],
      maxSizeMB: 10,
    },
  ],
  workflowRequirements: [
    {
      flow: "customer",
      label: "Donor Journey",
      description: "From first touch to recurring donor",
      required: true,
      defaultStages: ["Discover", "First Donation", "Thank You + Receipt", "Impact Update", "Renewal Ask"],
    },
    {
      flow: "payment",
      label: "Donation Processing",
      required: true,
      defaultStages: ["Initiate", "Payment Gateway", "Success/Failure", "Receipt Generate", "Bank Settlement"],
    },
    {
      flow: "approval",
      label: "Fund Utilization Approval",
      required: true,
      defaultStages: ["Program Request", "Trustee Review", "Approve", "Disburse", "Utilization Report"],
    },
    {
      flow: "reporting",
      label: "Impact & Compliance Reporting",
      required: true,
      defaultStages: ["Data Collection", "Compile", "Trustee Review", "Publish Dashboard"],
    },
  ],
};
