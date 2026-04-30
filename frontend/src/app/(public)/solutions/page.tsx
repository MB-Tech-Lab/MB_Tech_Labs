import React from 'react';
import { Solutions } from '../../../components/solutions/Solutions';
import { ProjectTypes } from '../../../components/solutions/ProjectTypes';
import { Technologies } from '../../../components/solutions/Technologies';
import { CTASection } from '../../../components/shared/CTASection';

export default function SolutionsPage() {
  return (
    <div className="bg-[#050A1A] min-h-screen pt-16">
      <Solutions />
      <ProjectTypes />
      <Technologies />
      <CTASection />
    </div>
  );
}
