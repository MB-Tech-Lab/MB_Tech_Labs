/**
 * Admin Storage Engine — Enterprise Edition
 * ------------------------------------------
 * Reads/writes all admin entities from localStorage. Pure browser runtime.
 * Keys:
 *   - mbtl_submissions   -> SRG submissions
 *   - mbtl_clients       -> CRM clients
 *   - mbtl_projects      -> Dev projects
 *   - mbtl_invoices      -> Invoices
 *   - mbtl_meetings      -> Calendar meetings
 *   - mbtl_activities    -> Activity log
 *   - mbtl_notifications -> Notifications
 *   - mbtl_team_members  -> Team members
 */
import type {
  AdminSubmission,
  AdminNotification,
  TeamMember,
  SrgStatus,
  Priority,
  DashboardStats,
  Client,
  DevProject,
  Invoice,
  Meeting,
  ActivityLog,
} from "../types";

const SUBMISSIONS_KEY = "mbtl_submissions";
const CLIENTS_KEY = "mbtl_clients";
const PROJECTS_KEY = "mbtl_projects";
const INVOICES_KEY = "mbtl_invoices";
const MEETINGS_KEY = "mbtl_meetings";
const ACTIVITIES_KEY = "mbtl_activities";
const NOTIFICATIONS_KEY = "mbtl_notifications";
const TEAM_KEY = "mbtl_team_members";

/* --------------------------- Safe parse --------------------------- */

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn("[Admin] Failed to save:", e);
    return false;
  }
}

/* --------------------------- Submissions --------------------------- */

export function loadSubmissions(): AdminSubmission[] {
  if (typeof window === "undefined") return [];
  return safeParse<AdminSubmission[]>(
    localStorage.getItem(SUBMISSIONS_KEY),
    []
  ).sort((a, b) => b.submittedAt - a.submittedAt);
}

export function saveSubmissions(items: AdminSubmission[]): boolean {
  return save(SUBMISSIONS_KEY, items);
}

export function getSubmission(id: string): AdminSubmission | null {
  return loadSubmissions().find((s) => s.id === id || s.sessionId === id) ?? null;
}

export function upsertSubmission(sub: AdminSubmission): void {
  const all = loadSubmissions();
  const idx = all.findIndex((s) => s.id === sub.id);
  if (idx >= 0) all[idx] = { ...sub, updatedAt: Date.now() };
  else all.unshift(sub);
  saveSubmissions(all);
}

export function updateSubmission(
  id: string,
  patch: Partial<AdminSubmission>
): void {
  const all = loadSubmissions();
  const idx = all.findIndex((s) => s.id === id || s.sessionId === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patch, updatedAt: Date.now() };
    saveSubmissions(all);
  }
}

export function deleteSubmission(id: string): void {
  saveSubmissions(loadSubmissions().filter((s) => s.id !== id && s.sessionId !== id));
}

/* --------------------------- Clients --------------------------- */

export function loadClients(): Client[] {
  if (typeof window === "undefined") return [];
  return safeParse<Client[]>(localStorage.getItem(CLIENTS_KEY), []);
}

export function saveClients(items: Client[]): boolean {
  return save(CLIENTS_KEY, items);
}

export function upsertClient(client: Client): void {
  const all = loadClients();
  const idx = all.findIndex((c) => c.id === client.id);
  if (idx >= 0) all[idx] = client;
  else all.unshift(client);
  saveClients(all);
}

/* --------------------------- Dev Projects --------------------------- */

export function loadProjects(): DevProject[] {
  if (typeof window === "undefined") return [];
  return safeParse<DevProject[]>(localStorage.getItem(PROJECTS_KEY), []);
}

export function saveProjects(items: DevProject[]): boolean {
  return save(PROJECTS_KEY, items);
}

export function upsertProject(project: DevProject): void {
  const all = loadProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx >= 0) all[idx] = { ...project, updatedAt: Date.now() };
  else all.unshift(project);
  saveProjects(all);
}

export function updateProject(id: string, patch: Partial<DevProject>): void {
  const all = loadProjects();
  const idx = all.findIndex((p) => p.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patch, updatedAt: Date.now() };
    saveProjects(all);
  }
}

/* --------------------------- Invoices --------------------------- */

export function loadInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  return safeParse<Invoice[]>(localStorage.getItem(INVOICES_KEY), []);
}

export function saveInvoices(items: Invoice[]): boolean {
  return save(INVOICES_KEY, items);
}

export function upsertInvoice(invoice: Invoice): void {
  const all = loadInvoices();
  const idx = all.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) all[idx] = invoice;
  else all.unshift(invoice);
  saveInvoices(all);
}

/* --------------------------- Meetings --------------------------- */

export function loadMeetings(): Meeting[] {
  if (typeof window === "undefined") return [];
  return safeParse<Meeting[]>(localStorage.getItem(MEETINGS_KEY), []);
}

export function saveMeetings(items: Meeting[]): boolean {
  return save(MEETINGS_KEY, items);
}

export function upsertMeeting(meeting: Meeting): void {
  const all = loadMeetings();
  const idx = all.findIndex((m) => m.id === meeting.id);
  if (idx >= 0) all[idx] = meeting;
  else all.unshift(meeting);
  saveMeetings(all);
}

/* --------------------------- Activities --------------------------- */

export function loadActivities(): ActivityLog[] {
  if (typeof window === "undefined") return [];
  return safeParse<ActivityLog[]>(localStorage.getItem(ACTIVITIES_KEY), [])
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function saveActivities(items: ActivityLog[]): boolean {
  return save(ACTIVITIES_KEY, items.slice(0, 200));
}

export function addActivity(activity: Omit<ActivityLog, "id" | "timestamp">): void {
  const all = loadActivities();
  all.unshift({
    ...activity,
    id: `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  });
  saveActivities(all);
}

/* --------------------------- Status helpers --------------------------- */

export function setStatus(
  id: string,
  status: SrgStatus,
  note?: string
): void {
  const all = loadSubmissions();
  const idx = all.findIndex((s) => s.id === id || s.sessionId === id);
  if (idx >= 0) {
    all[idx].status = status;
    all[idx].updatedAt = Date.now();
    all[idx].timeline = all[idx].timeline || [];
    const existing = all[idx].timeline.find((t) => t.status === status);
    if (!existing) {
      all[idx].timeline.push({ status, timestamp: Date.now(), note });
    } else if (note) {
      existing.note = note;
    }
    saveSubmissions(all);
  }
}

export function setPriority(id: string, priority: Priority): void {
  updateSubmission(id, { priority });
}

export function setAssignedTeam(
  id: string,
  assignedTeam: Record<string, string | null>
): void {
  updateSubmission(id, { assignedTeam });
}

/* --------------------------- Stats --------------------------- */

export function computeStats(
  subs: AdminSubmission[],
  projects?: DevProject[],
  invoices?: Invoice[],
  meetings?: Meeting[]
): DashboardStats {
  const stats: DashboardStats = {
    totalLeads: subs.length,
    newSubmissions: 0,
    inReview: 0,
    proposalPending: 0,
    approved: 0,
    inDevelopment: 0,
    completed: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingQuotations: 0,
    pendingProposals: 0,
    upcomingMeetings: 0,
  };
  subs.forEach((s) => {
    switch (s.status) {
      case "New": stats.newSubmissions++; break;
      case "Reviewing":
      case "Meeting Scheduled": stats.inReview++; break;
      case "Proposal Ready":
      case "Quotation Sent":
      case "Negotiation": stats.proposalPending++; break;
      case "Approved": stats.approved++; break;
      case "Rejected": stats.inDevelopment++; break; // reused
      case "Archived": stats.completed++; break; // reused
    }
    if (s.proposal && s.proposal.status === "draft") stats.pendingProposals++;
    if (s.quotation && s.quotation.status === "draft") stats.pendingQuotations++;
  });
  if (projects) {
    stats.activeProjects = projects.filter(
      (p) => !["Maintenance", "Cancelled"].includes(p.status)
    ).length;
  }
  if (invoices) {
    stats.totalRevenue = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);
  }
  if (meetings) {
    const now = Date.now();
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
    stats.upcomingMeetings = meetings.filter(
      (m) => m.status === "scheduled" && m.date >= now && m.date <= weekFromNow
    ).length;
  }
  return stats;
}

/* --------------------------- Notifications --------------------------- */

export function loadNotifications(): AdminNotification[] {
  if (typeof window === "undefined") return [];
  return safeParse<AdminNotification[]>(
    localStorage.getItem(NOTIFICATIONS_KEY),
    []
  ).sort((a, b) => b.timestamp - a.timestamp);
}

export function saveNotifications(items: AdminNotification[]): void {
  save(NOTIFICATIONS_KEY, items);
}

export function addNotification(
  n: Omit<AdminNotification, "id" | "timestamp" | "read">
): void {
  const all = loadNotifications();
  all.unshift({
    ...n,
    id: `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    read: false,
  });
  saveNotifications(all.slice(0, 50));
}

export function markNotificationRead(id: string): void {
  const all = loadNotifications();
  const n = all.find((x) => x.id === id);
  if (n) { n.read = true; saveNotifications(all); }
}

export function markAllNotificationsRead(): void {
  const all = loadNotifications();
  all.forEach((n) => (n.read = true));
  saveNotifications(all);
}

/* --------------------------- Team members --------------------------- */

const DEFAULT_TEAM: TeamMember[] = [
  { id: "tm_1", name: "Aarav Mehta", email: "aarav@mbtechlabs.com", role: "Project Manager", initials: "AM", capacity: 40, skills: ["Agile", "Scrum", "Client Communication", "Risk Management"], status: "Available" },
  { id: "tm_2", name: "Priya Sharma", email: "priya@mbtechlabs.com", role: "Frontend Developer", initials: "PS", capacity: 40, skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], status: "Busy" },
  { id: "tm_3", name: "Rohan Kapoor", email: "rohan@mbtechlabs.com", role: "Backend Developer", initials: "RK", capacity: 40, skills: ["Node.js", "NestJS", "Python", "PostgreSQL", "AWS"], status: "Available" },
  { id: "tm_4", name: "Sara Khan", email: "sara@mbtechlabs.com", role: "UI Designer", initials: "SK", capacity: 30, skills: ["Figma", "Design Systems", "Prototyping", "User Research"], status: "Available" },
  { id: "tm_5", name: "Vikram Reddy", email: "vikram@mbtechlabs.com", role: "QA Engineer", initials: "VR", capacity: 35, skills: ["Cypress", "Playwright", "Jest", "Performance Testing"], status: "Available" },
  { id: "tm_6", name: "Ananya Iyer", email: "ananya@mbtechlabs.com", role: "DevOps", initials: "AI", capacity: 25, skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"], status: "On Leave" },
  { id: "tm_7", name: "Arjun Nair", email: "arjun@mbtechlabs.com", role: "Business Analyst", initials: "AN", capacity: 30, skills: ["Requirements Analysis", "Process Mapping", "Documentation"], status: "Available" },
  { id: "tm_8", name: "Meera Joshi", email: "meera@mbtechlabs.com", role: "Frontend Developer", initials: "MJ", capacity: 40, skills: ["React", "Vue", "TypeScript", "GraphQL"], status: "Available" },
  { id: "tm_9", name: "Karan Malhotra", email: "karan@mbtechlabs.com", role: "Backend Developer", initials: "KM", capacity: 35, skills: ["Java", "Spring", "PostgreSQL", "Microservices"], status: "Busy" },
  { id: "tm_10", name: "Diya Patel", email: "diya@mbtechlabs.com", role: "UI Designer", initials: "DP", capacity: 30, skills: ["Figma", "Illustrator", "Motion Design", "Branding"], status: "Available" },
];

export function loadTeamMembers(): TeamMember[] {
  if (typeof window === "undefined") return DEFAULT_TEAM;
  const stored = localStorage.getItem(TEAM_KEY);
  if (!stored) {
    localStorage.setItem(TEAM_KEY, JSON.stringify(DEFAULT_TEAM));
    return DEFAULT_TEAM;
  }
  return safeParse<TeamMember[]>(stored, DEFAULT_TEAM);
}

/* --------------------------- ID generation --------------------------- */

export function generateId(prefix = "sub"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
