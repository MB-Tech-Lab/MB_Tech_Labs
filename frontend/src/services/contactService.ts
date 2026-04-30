/**
 * Contact Service
 * 
 * Handles submission of general contact inquiries.
 * Currently simulates network latency until the backend is fully integrated.
 */

// import { apiClient } from './api';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactRequest = async (data: ContactData): Promise<{ success: boolean; message: string }> => {
  // Simulate network request for 1.5 seconds
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful response
      // To test error handling, you could conditionally reject here
      resolve({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you shortly.',
      });

      // Future actual implementation:
      // return apiClient('/contact', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
    }, 1500);
  });
};
