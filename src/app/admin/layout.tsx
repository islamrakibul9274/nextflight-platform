import React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-[76px] lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-4 sm:p-8 max-w-7xl">{children}</div>
    </div>
  );
}
