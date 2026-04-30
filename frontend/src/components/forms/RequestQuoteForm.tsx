'use client';

import React, { useState } from 'react';
import { submitQuoteRequest, QuoteRequestData } from '../../services/quoteService';

export const RequestQuoteForm: React.FC = () => {
  const [formData, setFormData] = useState<QuoteRequestData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    projectType: 'Website',
    description: '',
    features: '',
    budget: '<10K',
    timeline: '1-2 Weeks',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await submitQuoteRequest(formData);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-[#0F1A3A] border border-[#1a2754] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--secondary)]/5 blur-[100px] rounded-full pointer-events-none"></div>

      {isSubmitted ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-6 relative z-10">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white">Request Received!</h3>
          <p className="text-[var(--text-secondary)] text-lg max-w-md">
            Thank you for reaching out. Our engineering team will review your requirements and get back to you with a custom quote shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}
          {/* Personal & Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName" 
                value={formData.businessName}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <hr className="border-[#1a2754]" />

          {/* Project Details */}
          <div className="space-y-6">
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">Project Type *</label>
              <select 
                id="projectType" 
                name="projectType" 
                value={formData.projectType}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
              >
                <option>Website</option>
                <option>E-commerce</option>
                <option>Mobile App</option>
                <option>Custom Software</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Budget Range *</label>
                <select 
                  id="budget" 
                  name="budget" 
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                >
                  <option>&lt;10K</option>
                  <option>10K–25K</option>
                  <option>25K–50K</option>
                  <option>50K+</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">Timeline *</label>
                <select 
                  id="timeline" 
                  name="timeline" 
                  value={formData.timeline}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                >
                  <option>Urgent</option>
                  <option>1–2 Weeks</option>
                  <option>1 Month</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Project Description *</label>
              <textarea 
                id="description" 
                name="description" 
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                placeholder="Give us an overview of what you are trying to build..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-2">Features Needed</label>
              <textarea 
                id="features" 
                name="features" 
                rows={3}
                value={formData.features}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-[#132044] border border-[#2a3764] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors disabled:opacity-50"
                placeholder="e.g. User Auth, Payment Gateway, Admin Dashboard..."
              ></textarea>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-[#0A1330] font-bold py-4 rounded-lg transition-all text-lg shadow-[0_0_15px_rgba(0,207,255,0.3)] hover:shadow-[0_0_25px_rgba(0,207,255,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A1330]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
};
