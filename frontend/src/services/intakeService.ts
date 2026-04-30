import { apiClient } from './api';
import { IntakeFormData } from '../modules/client-intake/types';

/**
 * Service to handle client intake submission.
 * This prepares the data payload for the backend, automatically generating required accounts.
 */
export async function submitIntakeForm(data: IntakeFormData): Promise<void> {
  // Simulate network delay for backend processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 1. Generate secure random password for the client portal
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return Array.from({length: 12}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  const temporaryPassword = generatePassword();

  // 2. Format username
  const username = data.clientEmail.split('@')[0] + Math.floor(Math.random() * 1000);

  // 3. Prepare full payload mapping
  const payload = {
    client: {
      name: data.clientName,
      email: data.clientEmail,
      phone: data.clientPhone,
      generatedUsername: username,
      // Note: Backend should hash this and email it
      generatedPassword: temporaryPassword, 
    },
    project: {
      companyName: data.companyName,
      industry: data.industry,
      type: data.companyType,
      domain: data.preferredDomain + data.domainExtension,
      websiteType: data.websiteType,
      tier: data.pricingEstimate?.projectTier || 'Standard',
      requirements: data.additionalRequirements,
    },
    technical: {
      pages: data.selectedPages,
      features: data.selectedFeatures,
    },
    design: {
      style: data.designStyle,
      colors: data.colorPreferences,
      references: data.referenceSites,
      assets: data.uploadedAssets,
    },
    financial: {
      estimatedOneTime: data.pricingEstimate?.oneTimeCost,
      estimatedMonthly: data.pricingEstimate?.monthlyCost,
      clientAgreedToEstimate: data.comfortableWithEstimate,
      customBudgetFallback: data.customBudget,
    }
  };

  console.log('--- MOCK SUBMITTING TO BACKEND ---');
  console.log(JSON.stringify(payload, null, 2));

  // FUTURE BACKEND INTEGRATION:
  // await apiClient.post('/api/intake/', payload);
}
