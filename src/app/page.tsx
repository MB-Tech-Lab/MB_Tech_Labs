"use client";

import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Hero } from "@/components/mb-tech-labs/Hero";
import { About } from "@/components/mb-tech-labs/About";
import { Services } from "@/components/mb-tech-labs/Services";
import { Industries } from "@/components/mb-tech-labs/Industries";
import { Process } from "@/components/mb-tech-labs/Process";
import { WhyChooseUs } from "@/components/mb-tech-labs/WhyChooseUs";
import { Testimonials } from "@/components/mb-tech-labs/Testimonials";
import { ProjectEstimation } from "@/components/mb-tech-labs/ProjectEstimation";
import { FAQ } from "@/components/mb-tech-labs/FAQ";
import { CTA } from "@/components/mb-tech-labs/CTA";
import { Footer } from "@/components/mb-tech-labs/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero />
        {/* 2. About */}
        <About />
        {/* 3. Services */}
        <Services />
        {/* 4. Industries */}
        <Industries />
        {/* 5. Development Process */}
        <Process />
        {/* 6. Why Choose MB Tech Labs */}
        <WhyChooseUs />
        {/* 7. Project Estimation Process */}
        <ProjectEstimation />
        {/* 8. Testimonials */}
        <Testimonials />
        {/* 9. FAQ */}
        <FAQ />
        {/* 10. Final CTA */}
        <CTA />
      </main>
      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
