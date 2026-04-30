'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IntakeFormData, INITIAL_FORM_DATA, WebsiteType } from '../types';
import { SMART_PAGES, SMART_FEATURES } from '../logic/smartDefaults';
import { calculateProjectCost } from '../logic/pricingEngine';

interface IntakeContextType {
  currentStep: number;
  totalSteps: number;
  formData: IntakeFormData;
  isLoading: boolean;
  error: string | null;
  updateData: (data: Partial<IntakeFormData>) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  handleWebsiteTypeSelection: (type: WebsiteType) => void;
}

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export const IntakeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We have 15 distinct conceptual steps, though some are purely display/logic
  const TOTAL_STEPS = 15;

  const updateData = (data: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleWebsiteTypeSelection = (type: WebsiteType) => {
    // Apply Smart Defaults
    updateData({
      websiteType: type,
      selectedPages: SMART_PAGES[type],
      selectedFeatures: SMART_FEATURES[type]
    });
  };

  const nextStep = async () => {
    setError(null);
    
    // Step 10: Trigger Cost Engine Logic before moving to Pricing Display (Step 11)
    if (currentStep === 9) {
      setIsLoading(true);
      try {
        const estimate = await calculateProjectCost(
          formData.websiteType, 
          formData.selectedFeatures, 
          formData.selectedPages.length
        );
        updateData({ pricingEstimate: estimate });
        setCurrentStep(11); // Skip 10 as it's the logic step we just ran
      } catch (err: any) {
        setError(err.message || 'Failed to calculate pricing');
        return; // Halt progression
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Step 13: Infrastructure handling (Transparent) before moving to Step 14
    if (currentStep === 12) {
      // Logic for marking standard vs advanced is already handled by `projectTier` in the estimate
      setCurrentStep(14); // Skip 13
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 11) {
      setCurrentStep(9); // Skip 10 backwards
      return;
    }
    if (currentStep === 14) {
      setCurrentStep(12); // Skip 13 backwards
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const jumpToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  return (
    <IntakeContext.Provider value={{
      currentStep,
      totalSteps: TOTAL_STEPS,
      formData,
      isLoading,
      error,
      updateData,
      nextStep,
      prevStep,
      jumpToStep,
      handleWebsiteTypeSelection
    }}>
      {children}
    </IntakeContext.Provider>
  );
};

export const useIntake = () => {
  const context = useContext(IntakeContext);
  if (context === undefined) {
    throw new Error('useIntake must be used within an IntakeProvider');
  }
  return context;
};
