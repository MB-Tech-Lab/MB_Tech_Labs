export type Role =
  | 'admin'
  | 'executive_officer'
  | 'hr'
  | 'manager'
  | 'team_lead'
  | 'senior_developer'
  | 'junior_developer'
  | 'intern'
  | 'marketing';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}
