/**
 * Admin Storage Engine
 * --------------------
 * Reads/writes submissions from localStorage under `mbtl_submissions`.
 * Also handles notifications and team members. Pure browser runtime.
 */
import type {
  AdminSubmission,
  AdminNotification,
  TeamMember,
  ProjectStatus,
  Priority,
  DashboardStats,
} from "../types";

const SUBMISSIONS_KEY = "mbtl_submissions";
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

/* --------------------------- Submissions --------------------------- */

export function loadSubmissions(): AdminSubmission[] {
  if (typeof window === "undefined") return [];
  const arr = safeParse<AdminSubmission[]>(
    localStorage.getItem(SUBMISSIONS_KEY),
    []
  );
  // sort newest first
  return arr.sort((a, b) => b.submittedAt - a.submittedAt);
}

export function saveSubmissions(items: AdminSubmission[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    console.warn("[Admin] Failed to save submissions:", e);
    return false;
  }
}

export function getSubmission(id: string): AdminSubmission | null {
  const all = loadSubmissions();
  return all.find((s) => s.id === id || s.sessionId === id) ?? null;
}

export function upsertSubmission(sub: AdminSubmission): void {
  const all = loadSubmissions();
  const idx = all.findIndex((s) => s.id === sub.id);
  if (idx >= 0) {
    all[idx] = { ...sub, updatedAt: Date.now() };
  } else {
    all.unshift(sub);
  }
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
  const all = loadSubmissions();
  const filtered = all.filter((s) => s.id !== id && s.sessionId !== id);
  saveSubmissions(filtered);
}

/* --------------------------- Status helpers --------------------------- */

export function setStatus(
  id: string,
  status: ProjectStatus,
  note?: string
): void {
  const all = loadSubmissions();
  const idx = all.findIndex((s) => s.id === id || s.sessionId === id);
  if (idx >= 0) {
    all[idx].status = status;
    all[idx].updatedAt = Date.now();
    // add timeline event
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

export function computeStats(subs: AdminSubmission[]): DashboardStats {
  const stats: DashboardStats = {
    totalLeads: subs.length,
    newSubmissions: 0,
    inReview: 0,
    proposalPending: 0,
    approved: 0,
    inDevelopment: 0,
    completed: 0,
  };
  subs.forEach((s) => {
    switch (s.status) {
      case "New":
        stats.newSubmissions++;
        break;
      case "Reviewing":
      case "Meeting Scheduled":
        stats.inReview++;
        break;
      case "Proposal Ready":
      case "Quotation Sent":
      case "Negotiation":
        stats.proposalPending++;
        break;
      case "Approved":
        stats.approved++;
        break;
      case "Development":
      case "Testing":
        stats.inDevelopment++;
        break;
      case "Delivered":
      case "Completed":
        stats.completed++;
        break;
    }
  });
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
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
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
  if (n) {
    n.read = true;
    saveNotifications(all);
  }
}

export function markAllNotificationsRead(): void {
  const all = loadNotifications();
  all.forEach((n) => (n.read = true));
  saveNotifications(all);
}

/* --------------------------- Team members --------------------------- */

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm_1",
    name: "Aarav Mehta",
    email: "aarav@mbtechlabs.com",
    role: "Project Manager",
    initials: "AM",
    capacity: 40,
    skills: ["Agile", "Scrum", "Client Communication", "Risk Management"],
  },
  {
    id: "tm_2",
    name: "Priya Sharma",
    email: "priya@mbtechlabs.com",
    role: "Frontend Developer",
    initials: "PS",
    capacity: 40,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "tm_3",
    name: "Rohan Kapoor",
    email: "rohan@mbtechlabs.com",
    role: "Backend Developer",
    initials: "RK",
    capacity: 40,
    skills: ["Node.js", "NestJS", "Python", "PostgreSQL", "AWS"],
  },
  {
    id: "tm_4",
    name: "Sara Khan",
    email: "sara@mbtechlabs.com",
    role: "UI Designer",
    initials: "SK",
    capacity: 30,
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
  },
  {
    id: "tm_5",
    name: "Vikram Reddy",
    email: "vikram@mbtechlabs.com",
    role: "QA Engineer",
    initials: "VR",
    capacity: 35,
    skills: ["Cypress", "Playwright", "Jest", "Performance Testing"],
  },
  {
    id: "tm_6",
    name: "Ananya Iyer",
    email: "ananya@mbtechlabs.com",
    role: "DevOps",
    initials: "AI",
    capacity: 25,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
  },
  {
    id: "tm_7",
    name: "Arjun Nair",
    email: "arjun@mbtechlabs.com",
    role: "Business Analyst",
    initials: "AN",
    capacity: 30,
    skills: ["Requirements Analysis", "Process Mapping", "Documentation"],
  },
  {
    id: "tm_8",
    name: "Meera Joshi",
    email: "meera@mbtechlabs.com",
    role: "Frontend Developer",
    initials: "MJ",
    capacity: 40,
    skills: ["React", "Vue", "TypeScript", "GraphQL"],
  },
  {
    id: "tm_9",
    name: "Karan Malhotra",
    email: "karan@mbtechlabs.com",
    role: "Backend Developer",
    initials: "KM",
    capacity: 35,
    skills: ["Java", "Spring", "PostgreSQL", "Microservices"],
  },
  {
    id: "tm_10",
    name: "Diya Patel",
    email: "diya@mbtechlabs.com",
    role: "UI Designer",
    initials: "DP",
    capacity: 30,
    skills: ["Figma", "Illustrator", "Motion Design", "Branding"],
  },
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
