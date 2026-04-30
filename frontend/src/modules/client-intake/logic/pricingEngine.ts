'use server';

import { WebsiteType, PricingEstimate, ProjectTier } from '../types';

// NOTE: This logic strictly runs on the server. Values here are internal cost/pricing abstractions 
// and will never be bundled to the client.
const BASE_COSTS: Record<WebsiteType, number> = {
  Business: 2500,
  Portfolio: 1500,
  'E-commerce': 5000,
  SaaS: 8000,
  Custom: 3000, // Starts at a base, inflates heavily with features
};

const FEATURE_COMPLEXITY_COSTS: Record<string, number> = {
  'Payment Gateway': 800,
  'User Accounts': 1000,
  'Dashboard': 1500,
  'Admin Panel': 2000,
  'Subscription Billing': 1200,
  'Inventory Management': 1500,
  'WhatsApp Integration': 300,
  'Email/SMS Notifications': 500,
  'Search/Filter': 600,
  'Reviews/Testimonials': 400,
};

const MONTHLY_BASE: Record<ProjectTier, number> = {
  Standard: 150,
  Advanced: 400,
  Enterprise: 1000,
};

/**
 * Server Action: Calculates internal project costs based on inputs and returns 
 * abstracted estimates to the client.
 */
export async function calculateProjectCost(
  type: WebsiteType | null,
  features: string[],
  pageCount: number
): Promise<PricingEstimate> {
  // Simulate heavy computation / db lookup
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!type) {
    throw new Error('Website type is required for calculation');
  }

  // 1. Base Cost
  let totalCost = BASE_COSTS[type];

  // 2. Feature Costs
  let featureComplexityScore = 0;
  features.forEach(feature => {
    const cost = FEATURE_COMPLEXITY_COSTS[feature] || 100; // generic minor feature cost
    totalCost += cost;
    featureComplexityScore += cost;
  });

  // 3. Pages Cost
  if (pageCount > 5) {
    totalCost += (pageCount - 5) * 200;
  }

  // Determine Project Tier
  let tier: ProjectTier = 'Standard';
  if (totalCost > 10000 || featureComplexityScore > 4000) {
    tier = 'Enterprise';
  } else if (totalCost > 4000 || featureComplexityScore > 1500) {
    tier = 'Advanced';
  }

  // Randomize slightly to obscure exact formula boundaries from users
  const abstractedCost = Math.ceil(totalCost / 100) * 100; 

  return {
    oneTimeCost: abstractedCost,
    monthlyCost: MONTHLY_BASE[tier],
    projectTier: tier
  };
}
