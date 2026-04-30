'use client';

import React, { useState } from 'react';
import { useIntake } from './context/IntakeContext';
import { submitIntakeForm } from '../../services/intakeService';

// Import Steps
import { Step1ClientDetails } from './components/steps/Step1ClientDetails';
import { Step2CompanyDetails } from './components/steps/Step2CompanyDetails';
import { Step3DomainDetails } from './components/steps/Step3DomainDetails';
import { Step4WebsiteType } from './components/steps/Step4WebsiteType';
import { Step5SmartDefaults } from './components/steps/Step5SmartDefaults';
import { Step6FeatureSelection } from './components/steps/Step6FeatureSelection';
import { Step7DesignPreferences } from './components/steps/Step7DesignPreferences';
import { Step8FileUpload } from './components/steps/Step8FileUpload';
import { Step9AdditionalReqs } from './components/steps/Step9AdditionalReqs';
import { Step11PricingDisplay } from './components/steps/Step11PricingDisplay';
import { Step12BudgetValidation } from './components/steps/Step12BudgetValidation';
import { Step14Subscription } from './components/steps/Step14Subscription';
import { Step15FinalReview } from './components/steps/Step15FinalReview';

export const IntakeWizard: React.FC = () => {
  const { currentStep, totalSteps, nextStep, prevStep, formData, isLoading, error } = useIntake();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1ClientDetails />;
      case 2: return <Step2CompanyDetails />;
      case 3: return <Step3DomainDetails />;
      case 4: return <Step4WebsiteType />;
      case 5: return <Step5SmartDefaults />;
      case 6: return <Step6FeatureSelection />;
      case 7: return <Step7DesignPreferences />;
      case 8: return <Step8FileUpload />;
      case 9: return <Step9AdditionalReqs />;
      // Step 10 is skipped (Logic processing)
      case 11: return <Step11PricingDisplay />;
      case 12: return <Step12BudgetValidation />;
      // Step 13 is skipped (Logic processing)
      case 14: return <Step14Subscription />;
      case 15: return <Step15FinalReview />;
      default: return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.clientName || !formData.clientEmail || !formData.clientPhone;
    if (currentStep === 2) return !formData.companyName;
    if (currentStep === 4) return !formData.websiteType;
    if (currentStep === 12 && formData.comfortableWithEstimate === null) return true;
    return isLoading;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitIntakeForm(formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#1a2754] border border-[#2a3764] rounded-2xl p-8 md:p-12 text-center animate-fadeIn shadow-2xl">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Project Submitted!</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          We've received your requirements and a secure client portal account is being generated. We'll be in touch shortly via email.
        </p>
      </div>
    );
  }

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-[var(--surface)] border border-[#2a3764] rounded-2xl p-6 md:p-10 shadow-2xl max-w-4xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-[#132044] rounded-full h-2">
          <div 
            className="bg-[var(--primary)] h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,207,255,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-between pt-6 border-t border-[#2a3764]">
        <button
          onClick={prevStep}
          disabled={currentStep === 1 || isLoading || isSubmitting}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            currentStep === 1 || isLoading || isSubmitting
              ? 'opacity-50 cursor-not-allowed text-gray-500' 
              : 'text-gray-300 hover:text-white hover:bg-[#1a2754]'
          }`}
        >
          Back
        </button>
        
        {currentStep === totalSteps ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[var(--primary)] text-[#0A1330] hover:bg-[var(--secondary)] px-8 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] hover:shadow-[0_0_25px_rgba(0,207,255,0.6)] flex items-center"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={isNextDisabled()}
            className={`px-8 py-2.5 rounded-lg font-bold transition-all flex items-center ${
              isNextDisabled()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white text-[#0A1330] hover:bg-gray-200'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        )}
      </div>
    </div>
  );
};
