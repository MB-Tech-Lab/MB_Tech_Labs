'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const PublicNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Our Work', href: '/work' },
    { name: 'Open Source', href: '/open-source' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a2754] bg-[#0A1330]/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
            <Image 
              src="/img/MBTechLabsLogo.png" 
              alt="MB Tech Labs Logo" 
              width={40}
              height={40}
              className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,207,255,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(0,207,255,0.8)] transition-all"
            />
            <span className="text-xl font-bold text-[var(--primary)] tracking-tight">
              MB Tech Labs
            </span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-[var(--primary)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary)]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-[#0A1330] bg-[var(--primary)] hover:bg-[var(--secondary)] px-5 py-2 rounded-md transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-[var(--primary)] focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0A1330] border-b border-[#1a2754] px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive 
                    ? 'text-[var(--primary)] bg-[#1a2754]/50' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[#1a2754]/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link 
            href="/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 mt-4 text-center rounded-md text-base font-bold text-[#0A1330] bg-[var(--primary)] hover:bg-[var(--secondary)] transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
};
