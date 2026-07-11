"use client";

import { useSrg } from "../context/SRGContext";
import { Field, TextInput, Select, GlassCard, AnimateIn } from "./ui";
import { motion } from "framer-motion";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "United Arab Emirates",
  "Singapore", "Australia", "Canada", "Germany", "Saudi Arabia",
  "Qatar", "Kuwait", "Bahrain", "Oman", "Nigeria", "South Africa",
  "Malaysia", "Indonesia", "Other",
];

const TIMEZONES = [
  "Asia/Kolkata (IST, UTC+5:30)",
  "Asia/Dubai (GST, UTC+4)",
  "Asia/Singapore (SGT, UTC+8)",
  "America/New_York (EST, UTC-5)",
  "America/Los_Angeles (PST, UTC-8)",
  "Europe/London (GMT, UTC+0)",
  "Europe/Berlin (CET, UTC+1)",
  "Australia/Sydney (AEDT, UTC+11)",
  "Asia/Riyadh (AST, UTC+3)",
  "Africa/Lagos (WAT, UTC+1)",
  "Other",
];

export function Step1ClientInfo() {
  const { session, patchClient } = useSrg();
  const c = session.clientDetails;

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 01
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Let's start with{" "}
            <span className="text-gradient-cyan">who you are.</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            We need a primary point of contact for this engagement. This person
            will receive all project communications and can invite team members
            later.
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <GlassCard strong className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" htmlFor="fullName" required>
              <TextInput
                id="fullName"
                value={c.fullName}
                onChange={(e) => patchClient({ fullName: e.target.value })}
                placeholder="e.g. Aarav Mehta"
                autoComplete="name"
              />
            </Field>
            <Field label="Work Email" htmlFor="email" required>
              <TextInput
                id="email"
                type="email"
                value={c.email}
                onChange={(e) => patchClient({ email: e.target.value })}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Phone Number" htmlFor="phone" required>
              <TextInput
                id="phone"
                type="tel"
                value={c.phone}
                onChange={(e) => patchClient({ phone: e.target.value })}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </Field>
            <Field label="Company" htmlFor="company" required>
              <TextInput
                id="company"
                value={c.company}
                onChange={(e) => patchClient({ company: e.target.value })}
                placeholder="e.g. Acme Inc."
                autoComplete="organization"
              />
            </Field>
            <Field label="Job Title" htmlFor="jobTitle">
              <TextInput
                id="jobTitle"
                value={c.jobTitle}
                onChange={(e) => patchClient({ jobTitle: e.target.value })}
                placeholder="e.g. CTO, Founder, Product Head"
                autoComplete="organization-title"
              />
            </Field>
            <Field label="Country" htmlFor="country" required>
              <Select
                id="country"
                value={c.country}
                onChange={(e) => patchClient({ country: e.target.value })}
                placeholder="Select country"
                options={COUNTRIES.map((c) => ({ label: c, value: c }))}
              />
            </Field>
            <Field label="Timezone" htmlFor="timezone" required>
              <Select
                id="timezone"
                value={c.timezone}
                onChange={(e) => patchClient({ timezone: e.target.value })}
                placeholder="Select your timezone"
                options={TIMEZONES.map((t) => ({ label: t, value: t }))}
              />
            </Field>
            <Field label="Preferred Contact" htmlFor="preferredContact" required>
              <Select
                id="preferredContact"
                value={c.preferredContact}
                onChange={(e) =>
                  patchClient({
                    preferredContact: e.target.value as typeof c.preferredContact,
                  })
                }
                placeholder="How should we reach you?"
                options={[
                  { label: "Email", value: "email" },
                  { label: "Phone / WhatsApp", value: "phone" },
                  { label: "Video call", value: "video" },
                ]}
              />
            </Field>
          </div>
        </GlassCard>
      </AnimateIn>

      <AnimateIn delay={0.2}>
        <div className="flex items-start gap-3 text-[12.5px] text-white/40 px-1">
          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-cyan shrink-0" />
          <p>
            Your information is stored locally in your browser as you fill out
            this form. It is auto-saved every 10 seconds and restored if you
            refresh — nothing is sent anywhere until you submit.
          </p>
        </div>
      </AnimateIn>
    </div>
  );
}
