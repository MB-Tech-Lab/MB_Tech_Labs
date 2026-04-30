/**
 * Quote Service
 * 
 * Handles submission of complex project quote requests.
 * Currently simulates network latency until the backend is fully integrated.
 */

// import { apiClient } from './api';

export interface QuoteRequestData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string;
}

export const submitQuoteRequest = async (data: QuoteRequestData): Promise<{ success: boolean; message: string }> => {
  // Simulate network request for 2 seconds
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful response
      resolve({
        success: true,
        message: 'Your quote request has been received. Our team will review your requirements and follow up within 24 hours.',
      });

      // Future actual implementation:
      // return apiClient('/quotes/request', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
    }, 2000);
  });
};
