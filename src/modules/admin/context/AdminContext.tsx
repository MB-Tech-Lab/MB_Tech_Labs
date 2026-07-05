"use client";

/**
 * Admin Context
 * -------------
 * Central state management for the Project Control Center.
 * Holds submissions, notifications, team members, and search state.
 * Auto-refreshes from localStorage on mount and exposes actions.
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
  ProjectStatus,
  Priority,
  DashboardStats,
  AssignedTeam,
  Proposal,
  Quotation,
} from "../types";
import {
  loadSubmissions,
  loadNotifications,
  loadTeamMembers,
  setStatus,
  setPriority,
  setAssignedTeam,
  updateSubmission,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  computeStats,
} from "../services/storage";
import { seedIfNeeded } from "../services/seed";

interface AdminContextValue {
  submissions: AdminSubmission[];
  notifications: AdminNotification[];
  teamMembers: TeamMember[];
  stats: DashboardStats;
  search: string;
  setSearch: (q: string) => void;
  searchResults: AdminSubmission[];
  refresh: () => void;
  setStatusOf: (id: string, status: ProjectStatus, note?: string) => void;
  setPriorityOf: (id: string, priority: Priority) => void;
  assignTeam: (id: string, team: AssignedTeam) => void;
  updateProposal: (id: string, proposal: Proposal) => void;
  updateQuotation: (id: string, quotation: Quotation) => void;
  updateNotes: (id: string, notes: string) => void;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Lazy initializers read from localStorage on first render (client-only).
  // This avoids setState-during-effect warnings while still hydrating
  // immediately on mount.
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(() =>
    typeof window !== "undefined" ? (seedIfNeeded(), loadSubmissions()) : []
  );
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    typeof window !== "undefined" ? loadNotifications() : []
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    typeof window !== "undefined" ? loadTeamMembers() : []
  );
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    seedIfNeeded();
    setSubmissions(loadSubmissions());
    setNotifications(loadNotifications());
    setTeamMembers(loadTeamMembers());
  }, []);

  useEffect(() => {
    // refresh every 15 seconds in case other tabs (SRG) wrote
    const id = setInterval(refresh, 15000);
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const setStatusOf = useCallback(
    (id: string, status: ProjectStatus, note?: string) => {
      setStatus(id, status, note);
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

  const stats = useMemo(() => computeStats(submissions), [submissions]);

  const value: AdminContextValue = {
    submissions,
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
