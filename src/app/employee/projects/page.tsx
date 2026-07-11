"use client"

import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-white">My Projects</h1>
      <p className="text-[12.5px] text-white/45 mt-0.5 mb-6">Manage your projects</p>
      <div className="rounded-2xl border py-16 text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
        <FolderKanban className="h-10 w-10 text-white/25 mx-auto mb-4" />
        <h3 className="font-display text-[15px] font-semibold text-white">No data yet</h3>
        <p className="mt-2 text-[13px] text-white/45 max-w-sm mx-auto">Projects assigned to you will appear here.</p>
      </div>
    </div>
  );
}
