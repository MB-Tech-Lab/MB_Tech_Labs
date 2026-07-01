"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Section, SectionHeading, Reveal, staggerContainer, staggerItem } from "./primitives";

const TESTIMONIALS = [
  {
    quote:
      "MB Tech Labs rebuilt our ERP from the ground up in 14 weeks. The new system runs four times faster, costs a third as much to operate, and our internal teams actually enjoy using it. They treated our roadmap like it was their own company's.",
    author: "Rajiv Menon",
    role: "CTO, Helios Logistics",
    initials: "RM",
  },
  {
    quote:
      "We have worked with five agencies before MB Tech Labs. None of them came close. The architecture decisions they made on day one are still paying dividends three years later — and they are still on the project with us.",
    author: "Sarah Chen",
    role: "VP Engineering, Atlas SaaS",
    initials: "SC",
  },
  {
    quote:
      "Their AI team built a retrieval system that genuinely understands our 50,000 case files. Lawyers trust it. That is the highest bar in our industry, and they cleared it without a single compromise on accuracy or security.",
    author: "David Okonkwo",
    role: "Managing Partner, Nova Legal",
    initials: "DO",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Client Testimonials"
        title={
          <>
            Words From the Teams{" "}
            <span className="text-gradient-cyan">We Build With</span>
          </>
        }
        description="Long-term partnerships measured in shipped product, not closed deals. Here is what our partners say about working with us."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {TESTIMONIALS.map((t) => (
          <motion.figure
            key={t.author}
            variants={staggerItem}
            className="group relative glass-panel rounded-2xl p-7 flex flex-col hover:border-cyan/30 transition-colors duration-500"
          >
            <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-full bg-cyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center justify-between">
              <Quote className="h-7 w-7 text-cyan/40" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-cyan text-cyan"
                  />
                ))}
              </div>
            </div>

            <blockquote className="mt-5 text-[14.5px] leading-relaxed text-white/75 flex-1">
              “{t.quote}”
            </blockquote>

            <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan/30 to-cyan/5 border border-cyan/25 font-display font-semibold text-[13px] text-cyan-soft">
                {t.initials}
              </span>
              <div>
                <div className="font-medium text-[14px] text-white">
                  {t.author}
                </div>
                <div className="text-[12px] text-white/50">{t.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}
