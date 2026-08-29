import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100/80 pt-16">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}
