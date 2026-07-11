"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Building2,
  Truck,
  Scale,
  Factory,
  Gamepad2,
  Banknote,
  CloudRain,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";
import type { ComponentType } from "react";

const INDUSTRIES: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}[] = [
  { icon: HeartPulse, title: "Healthcare", desc: "HIPAA-compliant patient platforms, telemedicine, EMR systems" },
  { icon: ShoppingBag, title: "E-commerce", desc: "Headless storefronts, marketplaces, payment integrations" },
  { icon: GraduationCap, title: "EdTech", desc: "LMS platforms, assessment tools, live classroom systems" },
  { icon: Building2, title: "Real Estate", desc: "Property management, CRM, listing portals, virtual tours" },
  { icon: Truck, title: "Logistics", desc: "Fleet tracking, warehouse management, supply chain ERPs" },
  { icon: Scale, title: "Legal", desc: "Case management, document automation, AI legal research" },
  { icon: Factory, title: "Manufacturing", desc: "MES, inventory, quality control, IoT integrations" },
  { icon: Gamepad2, title: "Gaming", desc: "Game backends, matchmaking, in-game economies, live ops" },
  { icon: Banknote, title: "FinTech", desc: "Payments, lending, neo-banking, compliance, fraud detection" },
  { icon: CloudRain, title: "Non-Profit", desc: "Donor management, impact tracking, transparency dashboards" },
];

export function Industries() {
  return (
    <Section id="industries">
      <SectionHeading
        eyebrow="Industries"
        title={
          <>
            Deep Domain Expertise Across{" "}
            <span className="text-gradient-cyan">10+ Industries</span>
          </>
        }
        description="We don't just write code — we understand your industry's workflows, compliance requirements, and user expectations. This domain depth means faster delivery and fewer rewrites."
      />
      <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {INDUSTRIES.map((ind, i) => {
          const Icon = ind.icon;
          return (
            <Reveal key={ind.title} delay={(i % 5) * 0.05} y={18}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group glass-panel rounded-2xl p-5 h-full hover:border-cyan/30 transition-colors duration-500 text-center"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-[14px] text-white">
                  {ind.title}
                </h3>
                <p className="mt-2 text-[11.5px] text-white/50 leading-relaxed">
                  {ind.desc}
                </p>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
