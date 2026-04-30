/**
 * Base API Service Configuration
 * 
 * This module sets up the foundational HTTP client for interacting with the backend.
 * Currently configured to handle base headers and standard error catching.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // If the response is not 2xx, throw an error with the parsed body (if possible)
    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Fallback to status text if JSON parsing fails
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }
    
    // For 204 No Content, return empty object
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
};
