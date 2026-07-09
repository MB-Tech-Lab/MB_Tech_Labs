"use client";

import { AdminProvider } from "@/modules/admin/context/AdminContext";
import { AdminShell } from "@/modules/admin/components/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
