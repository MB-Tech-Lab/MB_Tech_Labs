"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  FileText,
  ListChecks,
  Milestone as MilestoneIcon,
  Users,
  Code2,
  RefreshCw,
  GitBranch,
  X,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  AdminTextarea,
  AdminSelect,
  DevStatusBadge,
  PriorityBadge,
  PageTransition,
  EmptyState,
  ProgressBar,
  Avatar,
  Tabs,
  SectionTitle,
} from "@/modules/admin/components/ui";
import {
  DEV_PROJECT_STAGES,
  type DevProjectStatus,
  type Priority,
} from "@/modules/admin/types";

const STAGE_COLORS: Record<string, string> = {
  Discovery: "#3B82F6",
  Planning: "#8B5CF6",
  "UI/UX": "#EC4899",
  Development: "#25D6FF",
  Testing: "#F59E0B",
  Deployment: "#10B981",
  Maintenance: "#64748B",
  "On Hold": "#F97316",
  Cancelled: "#EF4444",
};

const TASK_STATUS_COLORS: Record<string, string> = {
  "To Do": "#64748B",
  "In Progress": "#3B82F6",
  Review: "#F59E0B",
  Done: "#10B981",
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(amount: number, currency: string): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { projects, teamMembers, updateDevProject } = useAdmin();
  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [notesDraft, setNotesDraft] = useState(project?.notes ?? "");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  if (!project) {
    return (
      <PageTransition>
        <EmptyState
          icon={<X className="h-6 w-6" />}
          title="Project not found"
          description="This project may have been removed."
          action={
            <Link href="/admin/projects">
              <AdminButton variant="primary" size="sm" icon={<ArrowLeft className="h-3.5 w-3.5" />}>
                Back to projects
              </AdminButton>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  const teamIds = Object.values(project.assignedTeam).filter(
    Boolean
  ) as string[];
  const assignedMembers = teamIds
    .map((tid) => teamMembers.find((m) => m.id === tid))
    .filter(Boolean);
  const completedTasks = project.tasks.filter((t) => t.status === "Done").length;
  const completedMilestones = project.milestones.filter(
    (m) => m.completed
  ).length;

  const currentStageIndex = DEV_PROJECT_STAGES.indexOf(project.currentStage);

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Tasks", value: "tasks", count: project.tasks.length },
    {
      label: "Milestones",
      value: "milestones",
      count: project.milestones.length,
    },
    { label: "Timeline", value: "timeline" },
    { label: "Team", value: "team", count: assignedMembers.length },
    { label: "Meetings", value: "meetings" },
    { label: "Files", value: "files" },
    { label: "Notes", value: "notes" },
  ];

  function handleSaveNotes() {
    updateDevProject(project!.id, { notes: notesDraft });
    setSavedAt(Date.now());
  }

  function handleStatusChange(newStatus: DevProjectStatus) {
    const progress = newStatus === "Maintenance" ? 100 : project!.progress;
    updateDevProject(project!.id, {
      status: newStatus,
      currentStage: newStatus,
      progress,
    });
    setShowStatusModal(false);
  }

  function handlePriorityChange(newPriority: Priority) {
    updateDevProject(project!.id, { priority: newPriority });
  }

  return (
    <PageTransition>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-[12.5px] mb-4 transition-colors hover:opacity-80"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <DevStatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <span
              className="inline-flex items-center gap-1 text-[11.5px]"
              style={{ color: "var(--admin-text-muted)" }}
            >
              <Building2 className="h-3 w-3" />
              {project.clientCompany}
            </span>
          </div>
          <h1
            className="font-bold text-2xl sm:text-3xl tracking-tight"
            style={{ color: "var(--admin-text)" }}
          >
            {project.name}
          </h1>
          <p
            className="mt-1.5 text-[13.5px]"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            {project.clientName} · {project.clientCompany}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setShowStatusModal(true)}
            icon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Update Status
          </AdminButton>
          <Link href={`/admin/submissions/${project.submissionId ?? ""}`}>
            <AdminButton
              variant="primary"
              size="sm"
              icon={<Edit3 className="h-3.5 w-3.5" />}
            >
              Edit Project
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-4">
                {/* Description */}
                <AdminCard className="p-5">
                  <SectionTitle
                    eyebrow="About"
                    title="Project Description"
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    {project.description || "No description provided yet."}
                  </p>
                </AdminCard>

                {/* Stage visualization */}
                <AdminCard className="p-5">
                  <SectionTitle
                    eyebrow="Lifecycle"
                    title="Project Stages"
                    description="Discovery → Planning → UI/UX → Development → Testing → Deployment → Maintenance"
                    icon={<ListChecks className="h-4 w-4" />}
                  />
                  <div className="flex items-center gap-1 overflow-x-auto pb-2">
                    {DEV_PROJECT_STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = stage === project.currentStage;
                      const color = STAGE_COLORS[stage] ?? "#64748B";
                      return (
                        <div
                          key={stage}
                          className="flex items-center shrink-0"
                        >
                          <div className="flex flex-col items-center gap-1.5 min-w-[88px]">
                            <div
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all"
                              style={{
                                background: isCompleted || isCurrent ? color : "var(--admin-surface-2)",
                                borderColor: isCompleted || isCurrent ? color : "var(--admin-border)",
                                color: isCompleted || isCurrent ? "#0F172A" : "var(--admin-text-muted)",
                              }}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <span className="text-[12px] font-semibold">
                                  {idx + 1}
                                </span>
                              )}
                            </div>
                            <span
                              className="text-[10.5px] font-medium text-center leading-tight"
                              style={{
                                color: isCurrent
                                  ? "var(--admin-text)"
                                  : "var(--admin-text-muted)",
                              }}
                            >
                              {stage}
                            </span>
                          </div>
                          {idx < DEV_PROJECT_STAGES.length - 1 && (
                            <div
                              className="h-0.5 w-6 mx-0.5 mt-[-18px]"
                              style={{
                                background:
                                  idx < currentStageIndex
                                    ? color
                                    : "var(--admin-border)",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[11px] uppercase tracking-wider font-medium"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Overall Progress
                      </span>
                      <span
                        className="text-[13px] font-semibold tabular-nums"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {project.progress}%
                      </span>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>
                </AdminCard>

                {/* Tech stack */}
                <AdminCard className="p-5">
                  <SectionTitle
                    eyebrow="Engineering"
                    title="Technology Stack"
                    icon={<Code2 className="h-4 w-4" />}
                  />
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.length === 0 && (
                      <span
                        className="text-[12.5px]"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        No technologies defined.
                      </span>
                    )}
                    {project.techStack.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[12px] font-medium"
                        style={{
                          background: "var(--admin-surface-2)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text)",
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--admin-accent)" }}
                        />
                        {t}
                      </span>
                    ))}
                  </div>
                </AdminCard>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <AdminCard className="p-5">
                  <SectionTitle eyebrow="Financials" title="Budget" icon={<DollarSign className="h-4 w-4" />} />
                  <p
                    className="font-bold text-[24px] tabular-nums"
                    style={{ color: "var(--admin-accent)" }}
                  >
                    {formatMoney(project.budget, project.currency)}
                  </p>
                  <p
                    className="text-[11.5px] mt-1"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    Allocated budget
                  </p>
                </AdminCard>

                <AdminCard className="p-5">
                  <SectionTitle eyebrow="Schedule" title="Timeline" icon={<Calendar className="h-4 w-4" />} />
                  <div className="space-y-3">
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-wider font-medium mb-0.5"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Start Date
                      </p>
                      <p
                        className="text-[13px] font-medium"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {formatDate(project.startDate)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-wider font-medium mb-0.5"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Estimated End
                      </p>
                      <p
                        className="text-[13px] font-medium"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {formatDate(project.estimatedEndDate)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-wider font-medium mb-0.5"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Current Stage
                      </p>
                      <p
                        className="text-[13px] font-medium"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {project.currentStage}
                      </p>
                    </div>
                  </div>
                </AdminCard>

                <AdminCard className="p-5">
                  <SectionTitle eyebrow="Settings" title="Quick Adjust" icon={<Edit3 className="h-4 w-4" />} />
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-[11px] uppercase tracking-wider font-medium mb-1"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Priority
                      </label>
                      <AdminSelect
                        value={project.priority}
                        onChange={(e) =>
                          handlePriorityChange(e.target.value as Priority)
                        }
                        options={[
                          { label: "Low", value: "Low" },
                          { label: "Medium", value: "Medium" },
                          { label: "High", value: "High" },
                          { label: "Critical", value: "Critical" },
                        ]}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[11px] uppercase tracking-wider font-medium mb-1"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Status
                      </label>
                      <AdminSelect
                        value={project.status}
                        onChange={(e) =>
                          handleStatusChange(e.target.value as DevProjectStatus)
                        }
                        options={[
                          ...DEV_PROJECT_STAGES,
                          "On Hold",
                          "Cancelled",
                        ].map((s) => ({ label: s, value: s }))}
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Execution"
                title="Tasks"
                description={`${completedTasks} of ${project.tasks.length} completed`}
                icon={<ListChecks className="h-4 w-4" />}
              />
              {project.tasks.length === 0 ? (
                <EmptyState
                  icon={<ListChecks className="h-6 w-6" />}
                  title="No tasks yet"
                  description="Tasks will appear here once the project kicks off."
                />
              ) : (
                <div className="space-y-2">
                  {project.tasks.map((task) => {
                    const assignee = teamMembers.find(
                      (m) => m.id === task.assigneeId
                    );
                    const statusColor = TASK_STATUS_COLORS[task.status];
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                        style={{
                          background: "var(--admin-surface-2)",
                          borderColor: "var(--admin-border)",
                        }}
                      >
                        {task.status === "Done" ? (
                          <CheckCircle2
                            className="h-4 w-4 shrink-0"
                            style={{ color: "#10B981" }}
                          />
                        ) : (
                          <Circle
                            className="h-4 w-4 shrink-0"
                            style={{ color: "var(--admin-text-muted)" }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[13px] font-medium truncate"
                            style={{
                              color: "var(--admin-text)",
                              textDecoration:
                                task.status === "Done" ? "line-through" : "none",
                              opacity: task.status === "Done" ? 0.6 : 1,
                            }}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p
                              className="text-[11.5px] truncate"
                              style={{ color: "var(--admin-text-muted)" }}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>
                        <PriorityBadge priority={task.priority} />
                        <span
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap"
                          style={{
                            background: `${statusColor}1A`,
                            borderColor: `${statusColor}40`,
                            color: statusColor,
                          }}
                        >
                          {task.status}
                        </span>
                        {assignee && (
                          <div className="flex items-center gap-1.5">
                            <Avatar initials={assignee.initials} size="sm" />
                          </div>
                        )}
                        {task.dueDate && (
                          <span
                            className="inline-flex items-center gap-1 text-[10.5px] whitespace-nowrap"
                            style={{ color: "var(--admin-text-muted)" }}
                          >
                            <Clock className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </AdminCard>
          )}

          {activeTab === "milestones" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Roadmap"
                title="Milestones"
                description={`${completedMilestones} of ${project.milestones.length} completed`}
                icon={<MilestoneIcon className="h-4 w-4" />}
              />
              {project.milestones.length === 0 ? (
                <EmptyState
                  icon={<MilestoneIcon className="h-6 w-6" />}
                  title="No milestones yet"
                />
              ) : (
                <div className="relative pl-6">
                  <div
                    className="absolute left-2 top-1 bottom-1 w-px"
                    style={{ background: "var(--admin-border)" }}
                  />
                  <div className="space-y-4">
                    {project.milestones.map((m) => (
                      <div key={m.id} className="relative">
                        <div
                          className="absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2"
                          style={{
                            background: m.completed
                              ? "#10B981"
                              : "var(--admin-surface)",
                            borderColor: m.completed
                              ? "#10B981"
                              : "var(--admin-text-muted)",
                          }}
                        />
                        <div
                          className="rounded-lg border p-3"
                          style={{
                            background: "var(--admin-surface-2)",
                            borderColor: "var(--admin-border)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p
                                className="text-[13px] font-medium"
                                style={{ color: "var(--admin-text)" }}
                              >
                                {m.title}
                              </p>
                              {m.description && (
                                <p
                                  className="text-[11.5px] mt-0.5"
                                  style={{
                                    color: "var(--admin-text-secondary)",
                                  }}
                                >
                                  {m.description}
                                </p>
                              )}
                            </div>
                            <span
                              className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap"
                              style={
                                m.completed
                                  ? {
                                      background: "#10B9811A",
                                      borderColor: "#10B98140",
                                      color: "#10B981",
                                    }
                                  : {
                                      background: "#F59E0B1A",
                                      borderColor: "#F59E0B40",
                                      color: "#F59E0B",
                                    }
                              }
                            >
                              {m.completed ? "Completed" : "Pending"}
                            </span>
                          </div>
                          <div
                            className="mt-2 flex items-center gap-1.5 text-[10.5px]"
                            style={{ color: "var(--admin-text-muted)" }}
                          >
                            <Calendar className="h-3 w-3" />
                            Due {formatDate(m.dueDate)}
                            {m.completedAt && (
                              <>
                                <span>·</span>
                                <CheckCircle2 className="h-3 w-3" />
                                Completed {formatDate(m.completedAt)}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AdminCard>
          )}

          {activeTab === "team" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assignedMembers.length === 0 ? (
                <div className="col-span-full">
                  <AdminCard>
                    <EmptyState
                      icon={<Users className="h-6 w-6" />}
                      title="No team assigned"
                      description="Assign team members from the submission's Team tab."
                      action={
                        project.submissionId && (
                          <Link
                            href={`/admin/submissions/${project.submissionId}/team`}
                          >
                            <AdminButton variant="primary" size="sm">
                              Assign team
                            </AdminButton>
                          </Link>
                        )
                      }
                    />
                  </AdminCard>
                </div>
              ) : (
                assignedMembers.map((m) => (
                  <AdminCard key={m!.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar initials={m!.initials} size="lg" />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-[14px] truncate"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {m!.name}
                        </p>
                        <p
                          className="text-[11.5px]"
                          style={{ color: "var(--admin-accent)" }}
                        >
                          {m!.role}
                        </p>
                        <p
                          className="text-[11px] mt-1 truncate"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          {m!.email}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-3 pt-3 border-t flex flex-wrap gap-1"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      {m!.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded border px-1.5 py-0.5 text-[9.5px]"
                          style={{
                            background: "var(--admin-surface-2)",
                            borderColor: "var(--admin-border)",
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </AdminCard>
                ))
              )}
            </div>
          )}

          {activeTab === "files" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Documents"
                title="Project Files"
                icon={<FileText className="h-4 w-4" />}
              />
              <EmptyState
                icon={<FileText className="h-6 w-6" />}
                title="No files uploaded"
                description="Files shared by the client or team will appear here."
                action={
                  <AdminButton variant="outline" size="sm">
                    Upload file
                  </AdminButton>
                }
              />
            </AdminCard>
          )}

          {activeTab === "timeline" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Lifecycle"
                title="Project Timeline"
                description="Stage-by-stage progress through the development lifecycle"
                icon={<GitBranch className="h-4 w-4" />}
              />
              <div className="relative">
                <div
                  className="absolute left-[15px] top-2 bottom-2 w-px"
                  style={{ background: "var(--admin-border)" }}
                />
                <ol className="space-y-1">
                  {DEV_PROJECT_STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isFuture = idx > currentStageIndex;
                    return (
                      <li key={stage} className="relative flex items-start gap-3 py-2">
                        <span
                          className={`relative z-10 mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-mono ${
                            isDone ? "text-white" : isCurrent ? "text-white" : "text-white/40"
                          }`}
                          style={{
                            background: isDone || isCurrent ? "var(--admin-accent)" : "var(--admin-surface)",
                            borderColor: isDone || isCurrent ? "var(--admin-accent)" : "var(--admin-border)",
                          }}
                        >
                          {isDone ? "✓" : idx + 1}
                        </span>
                        <div className="flex-1 pt-1">
                          <p
                            className="text-[13px] font-medium"
                            style={{ color: isFuture ? "var(--admin-text-muted)" : "var(--admin-text)" }}
                          >
                            {stage}
                          </p>
                          {isCurrent && (
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-accent)" }}>
                              Current stage
                            </p>
                          )}
                          {isFuture && (
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                              Pending
                            </p>
                          )}
                          {isDone && (
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                              Completed
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </AdminCard>
          )}

          {activeTab === "meetings" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Coordination"
                title="Meetings & Schedule"
                description="Upcoming and past meetings for this project"
                icon={<Calendar className="h-4 w-4" />}
              />
              <div className="space-y-2">
                {[
                  { title: "Kickoff Call", date: "Scheduled — Jul 15, 2025", type: "Video", attendees: ["Aarav M.", "Priya S.", "Client"] },
                  { title: "Sprint 1 Review", date: "Scheduled — Jul 29, 2025", type: "Video", attendees: ["Aarav M.", "Rohan K.", "Client"] },
                  { title: "Design Review", date: "Completed — Jul 8, 2025", type: "In-person", attendees: ["Sara K.", "Client"] },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border p-3"
                    style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
                  >
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "var(--admin-accent-bg)", color: "var(--admin-accent)" }}
                    >
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium" style={{ color: "var(--admin-text)" }}>
                        {m.title}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--admin-text-muted)" }}>
                        {m.date} · {m.type}
                      </p>
                    </div>
                    <div className="flex -space-x-1.5">
                      {m.attendees.map((a, j) => (
                        <span
                          key={j}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-medium border-2"
                          style={{
                            background: "var(--admin-accent-bg)",
                            borderColor: "var(--admin-surface)",
                            color: "var(--admin-accent)",
                          }}
                        >
                          {a.split(" ").map((n) => n[0]).join("")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {activeTab === "notes" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Workspace"
                title="Internal Notes"
                description="Visible only to the internal team."
                icon={<Edit3 className="h-4 w-4" />}
                action={
                  <AdminButton
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotes}
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  >
                    Save Notes
                  </AdminButton>
                }
              />
              <AdminTextarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add internal notes, decisions, blockers, context..."
                className="min-h-[240px]"
              />
              {savedAt && (
                <p
                  className="mt-2 text-[11px] flex items-center gap-1.5"
                  style={{ color: "var(--admin-accent)" }}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Saved {new Date(savedAt).toLocaleTimeString()}
                </p>
              )}
            </AdminCard>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Status modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.6)" }}
              onClick={() => setShowStatusModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-xl border p-5"
              style={{
                background: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-semibold text-[15px]"
                  style={{ color: "var(--admin-text)" }}
                >
                  Update Project Status
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="rounded-md p-1"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...DEV_PROJECT_STAGES, "On Hold", "Cancelled"].map((s) => {
                  const isCurrent = s === project.status;
                  const color = STAGE_COLORS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s as DevProjectStatus)}
                      className="rounded-lg border p-2.5 text-[11.5px] font-medium transition-all"
                      style={{
                        background: isCurrent ? `${color}1A` : "var(--admin-surface-2)",
                        borderColor: isCurrent ? `${color}80` : "var(--admin-border)",
                        color: isCurrent ? color : "var(--admin-text-secondary)",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
