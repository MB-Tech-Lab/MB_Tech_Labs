/**
 * Hospital Template
 * -----------------
 * For hospitals, clinics, and healthcare providers.
 * Focus: patient management, appointments, EMR, billing, compliance.
 */
import type { SrgTemplate } from "../types";

export const hospitalTemplate: SrgTemplate = {
  id: "hospital",
  name: "Hospital / Healthcare",
  tagline: "Patient management, EMR, appointments & compliance",
  description:
    "For hospitals, clinics, diagnostics chains, and healthcare providers managing patients, records, and care delivery.",
  icon: "Stethoscope",
  accent: "from-cyan/25 to-cyan/5",
  suggestedGoals: [
    "Reduce patient wait time by 50%",
    "Launch patient mobile app with appointment booking",
    "Digitize all medical records (paperless EMR)",
    "Enable online pharmacy & lab reports",
  ],
  sections: [
    {
      id: "hospital-facility",
      title: "Facility Profile",
      questions: [
        {
          id: "facility_type",
          type: "select",
          label: "Facility type",
          required: true,
          options: [
            { label: "Multi-specialty Hospital", value: "multispecialty" },
            { label: "Single-specialty Clinic", value: "specialty_clinic" },
            { label: "Diagnostic Center", value: "diagnostic" },
            { label: "Dental Clinic", value: "dental" },
            { label: "Eye Hospital", value: "eye" },
            { label: "Maternity Home", value: "maternity" },
            { label: "Nursing Home", value: "nursing_home" },
            { label: "Telemedicine Platform", value: "telemedicine" },
          ],
        },
        {
          id: "bed_capacity",
          type: "number",
          label: "Bed capacity (if applicable)",
          min: 0,
          max: 10000,
        },
        {
          id: "department_count",
          type: "number",
          label: "Number of departments/specialties",
          required: true,
          min: 1,
          max: 100,
        },
        {
          id: "daily_patients",
          type: "number",
          label: "Average daily patient footfall",
          required: true,
          min: 1,
          max: 100000,
          help: "Includes OPD, IPD, diagnostics, and pharmacy visits.",
        },
        {
          id: "locations",
          type: "number",
          label: "Number of locations/branches",
          required: true,
          min: 1,
          max: 500,
        },
      ],
    },
    {
      id: "hospital-modules",
      title: "Required Modules",
      questions: [
        {
          id: "modules_needed",
          type: "multiselect",
          label: "Which modules do you need?",
          required: true,
          options: [
            { label: "Patient Registration (EMR)", value: "emr" },
            { label: "Appointment Booking", value: "appointments" },
            { label: "OPD/IPD Management", value: "opd_ipd" },
            { label: "Pharmacy Management", value: "pharmacy" },
            { label: "Laboratory & Reports", value: "lab" },
            { label: "Radiology (PACS)", value: "radiology" },
            { label: "Billing & Insurance", value: "billing" },
            { label: "Scheduling (Doctor Roster)", value: "scheduling" },
            { label: "Patient Mobile App", value: "mobile_app" },
            { label: "Telemedicine", value: "telemedicine" },
            { label: "Inventory (Medical Supplies)", value: "inventory" },
            { label: "HR & Payroll", value: "hr_payroll" },
          ],
        },
        {
          id: "emr_detail",
          type: "textarea",
          label: "What patient data fields must the EMR capture?",
          showIf: [
            {
              questionId: "modules_needed",
              op: "contains",
              value: "emr",
            },
          ],
          maxLength: 800,
          placeholder: "Demographics, history, vitals, allergies, medications, lab reports...",
        },
        {
          id: "patient_app_features",
          type: "multiselect",
          label: "Patient mobile app features",
          showIf: [
            {
              questionId: "modules_needed",
              op: "contains",
              value: "mobile_app",
            },
          ],
          options: [
            { label: "Book appointments", value: "book" },
            { label: "View lab reports", value: "reports" },
            { label: "Online consultation", value: "tele" },
            { label: "Medication reminders", value: "meds" },
            { label: "Bill payment", value: "pay" },
            { label: "Health records download", value: "records" },
            { label: "Family member profiles", value: "family" },
          ],
        },
      ],
    },
    {
      id: "hospital-integrations",
      title: "Integrations & Compliance",
      questions: [
        {
          id: "external_integrations",
          type: "multiselect",
          label: "External systems to integrate",
          options: [
            { label: "ABDM (Ayushman Bharat)", value: "abdm" },
            { label: "Insurance TPA", value: "tpa" },
            { label: "Lab machines (HL7)", value: "hl7" },
            { label: "PACS / DICOM", value: "dicom" },
            { label: "Payment Gateways", value: "payments" },
            { label: "WhatsApp / SMS", value: "whatsapp" },
            { label: "Government portals", value: "govt" },
          ],
        },
        {
          id: "compliance_standards",
          type: "multiselect",
          label: "Compliance standards to follow",
          required: true,
          options: [
            { label: "DPDP Act 2023 (India)", value: "dpdp" },
            { label: "HIPAA (US patients)", value: "hipaa" },
            { label: "NABH accreditation", value: "nabh" },
            { label: "ISO 27001", value: "iso27001" },
            { label: "GDPR (EU patients)", value: "gdpr" },
            { label: "MCI/State Medical Council", value: "mci" },
          ],
        },
        {
          id: "abha_required",
          type: "boolean",
          label: "Do you need ABHA (Health ID) integration?",
        },
      ],
    },
    {
      id: "hospital-ops",
      title: "Operations & Billing",
      questions: [
        {
          id: "insurance_handling",
          type: "select",
          label: "Insurance/cashless handling",
          required: true,
          options: [
            { label: "Cashless with TPA", value: "cashless_tpa" },
            { label: "Reimbursement only", value: "reimbursement" },
            { label: "Both", value: "both" },
            { label: "No insurance", value: "none" },
          ],
        },
        {
          id: "opd_hours",
          type: "text",
          label: "OPD operating hours",
          placeholder: "e.g. 9 AM – 9 PM, 24x7 emergency",
        },
        {
          id: "language_support",
          type: "multiselect",
          label: "Languages to support in UI",
          required: true,
          options: [
            { label: "English", value: "en" },
            { label: "Hindi", value: "hi" },
            { label: "Marathi", value: "mr" },
            { label: "Tamil", value: "ta" },
            { label: "Telugu", value: "te" },
            { label: "Kannada", value: "kn" },
            { label: "Bengali", value: "bn" },
            { label: "Gujarati", value: "gu" },
            { label: "Arabic", value: "ar" },
          ],
        },
      ],
    },
  ],
  uploadRequirements: [
    {
      category: "legal",
      label: "Hospital Registration Certificate",
      required: true,
      accept: ["application/pdf"],
      maxSizeMB: 10,
    },
    {
      category: "legal",
      label: "NABH/MCI Accreditation (if any)",
      accept: ["application/pdf"],
      maxSizeMB: 10,
    },
    {
      category: "branding",
      label: "Hospital Logo & Branding",
      required: true,
      accept: ["image/png", "image/jpeg", "image/svg+xml", "application/zip"],
      maxSizeMB: 25,
      multiple: true,
    },
    {
      category: "documents",
      label: "Department & Doctor List",
      description: "PDF/XLSX with departments, doctors, and specializations",
      required: true,
      accept: ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      maxSizeMB: 15,
    },
    {
      category: "documents",
      label: "Existing Process Flow (optional)",
      description: "Diagrams of current appointment/billing workflow",
      accept: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      maxSizeMB: 25,
    },
    {
      category: "reference",
      label: "Reference Hospital Apps (optional)",
      description: "Screenshots or links to apps you like",
      accept: ["image/png", "image/jpeg", "application/zip"],
      maxSizeMB: 25,
      multiple: true,
    },
  ],
  workflowRequirements: [
    {
      flow: "customer",
      label: "Patient Journey",
      required: true,
      defaultStages: ["Registration", "OPD Consultation", "Investigation", "Diagnosis", "Treatment", "Follow-up"],
    },
    {
      flow: "approval",
      label: "Treatment Approval",
      description: "Insurance / cashless approval flow",
      required: true,
      defaultStages: ["Pre-auth Request", "TPA Review", "Approval/Denial", "Treatment", "Final Claim"],
    },
    {
      flow: "payment",
      label: "Billing & Insurance",
      required: true,
      defaultStages: ["Generate Bill", "Insurance Claim", "Patient Co-pay", "Receipt", "Settlement"],
    },
    {
      flow: "verification",
      label: "Patient Verification",
      required: true,
      defaultStages: ["ID Proof", "ABHA Link", "Insurance Card", "Consent Form"],
    },
    {
      flow: "reporting",
      label: "Medical & Operational Reports",
      required: true,
      defaultStages: ["Lab Result", "Doctor Review", "Patient Notification", "Record Update"],
    },
    {
      flow: "staff",
      label: "Doctor & Staff Workflow",
      defaultStages: ["Roster", "Check-in", "Consultation Queue", "Notes", "Sign-off"],
    },
  ],
};
