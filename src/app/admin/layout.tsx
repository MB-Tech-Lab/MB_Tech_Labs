"use client";

import { AdminProvider } from "@/modules/admin/context/AdminContext";
import { AdminNav } from "@/modules/admin/components/AdminNav";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="relative min-h-screen flex flex-col">
        <ShaderBackground />
        <AdminNav />
        <main className="relative z-10 flex-1 pt-6 pb-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}
