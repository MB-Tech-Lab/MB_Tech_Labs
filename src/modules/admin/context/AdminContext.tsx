"use client";

/**
 * Admin Context — Enterprise Edition
 * -----------------------------------
 * Central state management for the entire admin operating system.
 * Holds submissions, clients, projects, invoices, meetings, activities,
 * notifications, team members, and global search state.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  AdminSubmission,
  AdminNotification,
  TeamMember,
  SrgStatus,
  Priority,
  DashboardStats,
  AssignedTeam,
  Proposal,
  Quotation,
  Client,
  DevProject,
  Invoice,
  Meeting,
  ActivityLog,
} from "../types";
import {
  loadSubmissions,
  loadNotifications,
  loadTeamMembers,
  loadClients,
  loadProjects,
  loadInvoices,
  loadMeetings,
  loadActivities,
  setStatus,
  setPriority,
  setAssignedTeam,
  updateSubmission,
  updateProject,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  addActivity,
  computeStats,
  upsertClient,
  upsertProject,
  upsertInvoice,
  upsertMeeting,
} from "../services/storage";
import { seedIfNeeded } from "../services/seed";

interface AdminContextValue {
  submissions: AdminSubmission[];
  clients: Client[];
  projects: DevProject[];
  invoices: Invoice[];
  meetings: Meeting[];
  activities: ActivityLog[];
  notifications: AdminNotification[];
  teamMembers: TeamMember[];
  stats: DashboardStats;
  search: string;
  setSearch: (q: string) => void;
  searchResults: AdminSubmission[];
  refresh: () => void;
  // submission actions
  setStatusOf: (id: string, status: SrgStatus, note?: string) => void;
  setPriorityOf: (id: string, priority: Priority) => void;
  assignTeam: (id: string, team: AssignedTeam) => void;
  updateProposal: (id: string, proposal: Proposal) => void;
  updateQuotation: (id: string, quotation: Quotation) => void;
  updateNotes: (id: string, notes: string) => void;
  // project actions
  updateDevProject: (id: string, patch: Partial<DevProject>) => void;
  upsertDevProject: (project: DevProject) => void;
  // client actions
  upsertClientRecord: (client: Client) => void;
  // invoice actions
  upsertInvoiceRecord: (invoice: Invoice) => void;
  // meeting actions
  upsertMeetingRecord: (meeting: Meeting) => void;
  // notifications
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(() =>
    typeof window !== "undefined" ? (seedIfNeeded(), loadSubmissions()) : []
  );
  const [clients, setClients] = useState<Client[]>(() =>
    typeof window !== "undefined" ? loadClients() : []
  );
  const [projects, setProjects] = useState<DevProject[]>(() =>
    typeof window !== "undefined" ? loadProjects() : []
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    typeof window !== "undefined" ? loadInvoices() : []
  );
  const [meetings, setMeetings] = useState<Meeting[]>(() =>
    typeof window !== "undefined" ? loadMeetings() : []
  );
  const [activities, setActivities] = useState<ActivityLog[]>(() =>
    typeof window !== "undefined" ? loadActivities() : []
  );
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    typeof window !== "undefined" ? loadNotifications() : []
  );
  const [teamMembers] = useState<TeamMember[]>(() =>
    typeof window !== "undefined" ? loadTeamMembers() : []
  );
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    seedIfNeeded();
    setSubmissions(loadSubmissions());
    setClients(loadClients());
    setProjects(loadProjects());
    setInvoices(loadInvoices());
    setMeetings(loadMeetings());
    setActivities(loadActivities());
    setNotifications(loadNotifications());
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 15000);
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const setStatusOf = useCallback(
    (id: string, status: SrgStatus, note?: string) => {
      setStatus(id, status, note);
      addActivity({
        type: "submission",
        action: "Status changed",
        description: `Submission ${id} marked as ${status}`,
        entityId: id,
        entityType: "submission",
        actor: "Admin",
      });
      refresh();
    },
    [refresh]
  );

  const setPriorityOf = useCallback(
    (id: string, priority: Priority) => {
      setPriority(id, priority);
      refresh();
    },
    [refresh]
  );

  const assignTeam = useCallback(
    (id: string, team: AssignedTeam) => {
      setAssignedTeam(id, team);
      refresh();
    },
    [refresh]
  );

  const updateProposal = useCallback(
    (id: string, proposal: Proposal) => {
      updateSubmission(id, { proposal });
      addNotification({
        type: "proposal",
        title: "Proposal updated",
        description: `Proposal for ${id} updated`,
        submissionId: id,
      });
      refresh();
    },
    [refresh]
  );

  const updateQuotation = useCallback(
    (id: string, quotation: Quotation) => {
      updateSubmission(id, { quotation });
      addNotification({
        type: "quotation",
        title: "Quotation updated",
        description: `Quotation for ${id} updated`,
        submissionId: id,
      });
      refresh();
    },
    [refresh]
  );

  const updateNotes = useCallback(
    (id: string, notes: string) => {
      updateSubmission(id, { notes });
      refresh();
    },
    [refresh]
  );

  const updateDevProject = useCallback(
    (id: string, patch: Partial<DevProject>) => {
      updateProject(id, patch);
      addActivity({
        type: "project",
        action: "Project updated",
        description: `Project ${id} updated`,
        entityId: id,
        entityType: "project",
        actor: "Admin",
      });
      refresh();
    },
    [refresh]
  );

  const upsertDevProject = useCallback(
    (project: DevProject) => {
      upsertProject(project);
      addActivity({
        type: "project",
        action: "Project created",
        description: `Project ${project.name} created`,
        entityId: project.id,
        entityType: "project",
        actor: "Admin",
      });
      refresh();
    },
    [refresh]
  );

  const upsertClientRecord = useCallback(
    (client: Client) => {
      upsertClient(client);
      refresh();
    },
    [refresh]
  );

  const upsertInvoiceRecord = useCallback(
    (invoice: Invoice) => {
      upsertInvoice(invoice);
      refresh();
    },
    [refresh]
  );

  const upsertMeetingRecord = useCallback(
    (meeting: Meeting) => {
      upsertMeeting(meeting);
      refresh();
    },
    [refresh]
  );

  const markNotifRead = useCallback(
    (id: string) => {
      markNotificationRead(id);
      refresh();
    },
    [refresh]
  );

  const markAllNotifsRead = useCallback(() => {
    markAllNotificationsRead();
    refresh();
  }, [refresh]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter((s) =>
      [
        s.client.fullName,
        s.client.company,
        s.id,
        s.sessionId,
        s.projectName,
        s.projectType,
        s.templateName,
        s.client.email,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [submissions, search]);

  const stats = useMemo(
    () => computeStats(submissions, projects, invoices, meetings),
    [submissions, projects, invoices, meetings]
  );

  const value: AdminContextValue = {
    submissions,
    clients,
    projects,
    invoices,
    meetings,
    activities,
    notifications,
    teamMembers,
    stats,
    search,
    setSearch,
    searchResults,
    refresh,
    setStatusOf,
    setPriorityOf,
    assignTeam,
    updateProposal,
    updateQuotation,
    updateNotes,
    updateDevProject,
    upsertDevProject,
    upsertClientRecord,
    upsertInvoiceRecord,
    upsertMeetingRecord,
    markNotifRead,
    markAllNotifsRead,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
