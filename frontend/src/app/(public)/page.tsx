import React from 'react';
import { Hero } from '../../components/home/Hero';
import { SolutionsPreview } from '../../components/home/SolutionsPreview';
import { WorkPreview } from '../../components/home/WorkPreview';
import { CTASection } from '../../components/shared/CTASection';

export default function HomePage() {
  return (
    <div className="bg-[#050A1A] min-h-screen">
      <Hero />
      <SolutionsPreview />
      <WorkPreview />
      <CTASection />
    </div>
  );
}
