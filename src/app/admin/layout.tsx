import React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin/dashboard");

  return (
    <div className="flex min-h-screen bg-slate-100/80 pt-16">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}
