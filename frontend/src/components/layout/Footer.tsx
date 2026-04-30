import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#050A1A] border-t border-[#1a2754] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image 
                src="/img/MBTechLabsLogo.png" 
                alt="MB Tech Labs Logo" 
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-bold text-[var(--primary)] tracking-tight">MB Tech Labs</span>
            </Link>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Building high-performance software solutions for modern businesses. We bridge the gap between complex technical requirements and elegant user experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/solutions" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Solutions</Link></li>
              <li><Link href="/work" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Our Work</Link></li>
              <li><Link href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Request a Quote</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/legal" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-[#1a2754] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-secondary)]">
          <p>&copy; {currentYear} MB Tech Labs. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            {/* Social links placeholders */}
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
