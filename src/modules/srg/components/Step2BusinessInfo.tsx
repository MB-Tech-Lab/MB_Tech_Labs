"use client";

import { useSrg } from "../context/SRGContext";
import { Field, TextInput, Select, TextArea, GlassCard, AnimateIn } from "./ui";

const INDUSTRIES = [
  "Technology / SaaS",
  "Healthcare / Medical",
  "Finance / Banking / Insurance",
  "Education / EdTech",
  "Retail / E-commerce",
  "Manufacturing",
  "Logistics / Supply Chain",
  "Real Estate",
  "Hospitality / Travel",
  "Restaurant / F&B",
  "Media / Entertainment",
  "Construction",
  "Agriculture",
  "Government / Public Sector",
  "Non-profit / NGO",
  "Religious / Community",
  "Legal / Professional Services",
  "Automotive",
  "Energy / Utilities",
  "Other",
];

const SIZES = [
  { label: "1–10 employees", value: "1-10" },
  { label: "11–50 employees", value: "11-50" },
  { label: "51–200 employees", value: "51-200" },
  { label: "201–1,000 employees", value: "201-1000" },
  { label: "1,000+ employees", value: "1000+" },
];

const STAGES = [
  { label: "Idea stage (pre-launch)", value: "idea" },
  { label: "Startup (early revenue)", value: "startup" },
  { label: "Growth (scaling)", value: "growth" },
  { label: "Enterprise (mature)", value: "enterprise" },
  { label: "Non-profit", value: "nonprofit" },
];

const BUDGETS = [
  { label: "Under $5K / ₹40K", value: "under_5k" },
  { label: "$5K – $15K / ₹40K–₹1.2L", value: "5k_15k" },
  { label: "$15K – $50K / ₹1.2L–₹4L", value: "15k_50k" },
  { label: "$50K – $150K / ₹4L–₹12L", value: "50k_150k" },
  { label: "$150K+ / ₹12L+", value: "above_150k" },
  { label: "Not sure yet", value: "unsure" },
];

const LAUNCH_WINDOWS = [
  { label: "ASAP (within 4 weeks)", value: "asap" },
  { label: "1–3 months", value: "1_3_months" },
  { label: "3–6 months", value: "3_6_months" },
  { label: "6–12 months", value: "6_12_months" },
  { label: "More than 12 months", value: "over_12_months" },
  { label: "No specific deadline", value: "flexible" },
];

export function Step2BusinessInfo() {
  const { session, patchBusiness } = useSrg();
  const b = session.businessDetails;

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 02
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Tell us about your{" "}
            <span className="text-gradient-cyan">business.</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            The more we understand about your organization, the better we can
            tailor the architecture, integrations, and roadmap.
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <GlassCard strong className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Legal Entity Name" htmlFor="legalName" required>
              <TextInput
                id="legalName"
                value={b.legalName}
                onChange={(e) => patchBusiness({ legalName: e.target.value })}
                placeholder="e.g. Acme Private Limited"
              />
            </Field>
            <Field label="Industry" htmlFor="industry" required>
              <Select
                id="industry"
                value={b.industry}
                onChange={(e) => patchBusiness({ industry: e.target.value })}
                placeholder="Select industry"
                options={INDUSTRIES.map((i) => ({ label: i, value: i }))}
              />
            </Field>
            <Field label="Company Size" htmlFor="size" required>
              <Select
                id="size"
                value={b.size}
                onChange={(e) =>
                  patchBusiness({ size: e.target.value as typeof b.size })
                }
                placeholder="Select company size"
                options={SIZES}
              />
            </Field>
            <Field label="Business Stage" htmlFor="stage" required>
              <Select
                id="stage"
                value={b.stage}
                onChange={(e) =>
                  patchBusiness({ stage: e.target.value as typeof b.stage })
                }
                placeholder="Select stage"
                options={STAGES}
              />
            </Field>
            <Field label="Website (if any)" htmlFor="website">
              <TextInput
                id="website"
                type="url"
                value={b.website}
                onChange={(e) => patchBusiness({ website: e.target.value })}
                placeholder="https://yourcompany.com"
              />
            </Field>
            <Field label="Annual Software Budget" htmlFor="annualBudget" required>
              <Select
                id="annualBudget"
                value={b.annualBudget}
                onChange={(e) => patchBusiness({ annualBudget: e.target.value })}
                placeholder="Select budget range"
                options={BUDGETS}
              />
            </Field>
            <Field
              label="Target Launch Window"
              htmlFor="targetLaunch"
              required
              className="sm:col-span-2"
            >
              <Select
                id="targetLaunch"
                value={b.targetLaunch}
                onChange={(e) => patchBusiness({ targetLaunch: e.target.value })}
                placeholder="When do you need this live?"
                options={LAUNCH_WINDOWS}
              />
            </Field>
            <Field
              label="Existing Tech Stack"
              htmlFor="existingStack"
              description="Tools, platforms, and software your team currently uses"
              className="sm:col-span-2"
            >
              <TextArea
                id="existingStack"
                value={b.existingStack}
                onChange={(e) =>
                  patchBusiness({ existingStack: e.target.value })
                }
                placeholder="e.g. We use Tally for accounting, Salesforce for CRM, custom PHP for our website, and Excel for everything else..."
                maxLength={800}
              />
            </Field>
            <Field
              label="Direct Competitors"
              htmlFor="competitors"
              description="Who are you competing with? Helps us understand your space."
              className="sm:col-span-2"
            >
              <TextArea
                id="competitors"
                value={b.competitors}
                onChange={(e) =>
                  patchBusiness({ competitors: e.target.value })
                }
                placeholder="e.g. Competitor A (better mobile app), Competitor B (better pricing), Competitor C (legacy but trusted)..."
                maxLength={800}
              />
            </Field>
          </div>
        </GlassCard>
      </AnimateIn>
    </div>
  );
}
