export type WebsiteType = 'Business' | 'E-commerce' | 'Portfolio' | 'SaaS' | 'Custom';
export type ProjectTier = 'Standard' | 'Advanced' | 'Enterprise';

export interface PricingEstimate {
  oneTimeCost: number;
  monthlyCost: number;
  projectTier: ProjectTier;
}

export interface IntakeFormData {
  // Step 1: Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  // Step 2: Company
  companyName: string;
  industry: string;
  companyType: string;

  // Step 3: Domain
  preferredDomain: string;
  domainExtension: string;

  // Step 4: Website Type
  websiteType: WebsiteType | null;

  // Step 5: Smart Defaults (Pages)
  selectedPages: string[];

  // Step 6: Features
  selectedFeatures: string[];

  // Step 7: Design
  colorPreferences: string;
  referenceSites: string;
  designStyle: string;

  // Step 8: Uploads (Simulated array of strings/file names for now)
  uploadedAssets: string[];

  // Step 9: Additional
  additionalRequirements: string;

  // Pricing
  pricingEstimate: PricingEstimate | null;

  // Step 12: Budget Validation
  comfortableWithEstimate: boolean | null;
  customBudget: string;
}

export const INITIAL_FORM_DATA: IntakeFormData = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  companyName: '',
  industry: '',
  companyType: '',
  preferredDomain: '',
  domainExtension: '.com',
  websiteType: null,
  selectedPages: [],
  selectedFeatures: [],
  colorPreferences: '',
  referenceSites: '',
  designStyle: '',
  uploadedAssets: [],
  additionalRequirements: '',
  pricingEstimate: null,
  comfortableWithEstimate: null,
  customBudget: '',
};
