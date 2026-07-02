/**
 * Template Registry
 * -----------------
 * Central registry of all SRG templates. New templates can be added
 * here and will automatically appear in the template selector UI.
 */
import type { SrgTemplate } from "../types";
import { trustTemplate } from "./trust";
import { hospitalTemplate } from "./hospital";
import { restaurantTemplate } from "./restaurant";
import { jamaatTemplate } from "./jamaat";
import { erpTemplate } from "./erp";
import { crmTemplate } from "./crm";
import { customTemplate } from "./custom";

export const TEMPLATES: SrgTemplate[] = [
  trustTemplate,
  hospitalTemplate,
  restaurantTemplate,
  jamaatTemplate,
  erpTemplate,
  crmTemplate,
  customTemplate,
];

export const TEMPLATES_BY_ID: Record<string, SrgTemplate> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<string, SrgTemplate>
);

export function getTemplate(id: string | null): SrgTemplate | null {
  if (!id) return null;
  return TEMPLATES_BY_ID[id] ?? null;
}

export function listTemplates(): SrgTemplate[] {
  return TEMPLATES;
}
