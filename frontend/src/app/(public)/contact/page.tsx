import React from 'react';
import { ContactForm } from '../../../components/forms/ContactForm';

export default function ContactPage() {
  return (
    <div className="bg-[#050A1A] min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Contact Us</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Have a question or want to discuss a project? Reach out to our team and we'll get back to you shortly.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
