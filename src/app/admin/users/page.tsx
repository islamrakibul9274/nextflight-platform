"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Shield, Crown, UserCheck } from "lucide-react";

interface UserDoc {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  membershipTier: "VOYAGER" | "STRATOSPHERE" | "APEX";
  homeAirport?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/admin/users${q}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpdateRole = async (id: string, newRole: "USER" | "ADMIN") => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTier = async (
    id: string,
    tier: "VOYAGER" | "STRATOSPHERE" | "APEX"
  ) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, membershipTier: tier }),
      });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User & Customer Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage platform accounts, grant administrative privileges, and adjust Stratosphere club tiers.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 uppercase">
              <th className="py-3.5 px-6 font-semibold">User Name</th>
              <th className="py-3.5 px-6 font-semibold">Email</th>
              <th className="py-3.5 px-6 font-semibold">Home Base</th>
              <th className="py-3.5 px-6 font-semibold">Role</th>
              <th className="py-3.5 px-6 font-semibold">Membership Tier</th>
              <th className="py-3.5 px-6 font-semibold">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">{u.email}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-sky-600">
                    {u.homeAirport || "JFK"}
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleUpdateRole(u._id, e.target.value as "USER" | "ADMIN")
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold outline-hidden cursor-pointer ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={u.membershipTier}
                      onChange={(e) =>
                        handleUpdateTier(
                          u._id,
                          e.target.value as "VOYAGER" | "STRATOSPHERE" | "APEX"
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold outline-hidden cursor-pointer ${
                        u.membershipTier === "APEX"
                          ? "bg-indigo-100 text-indigo-900 border border-indigo-200"
                          : u.membershipTier === "STRATOSPHERE"
                          ? "bg-sky-100 text-sky-900 border border-sky-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <option value="VOYAGER">VOYAGER (Free)</option>
                      <option value="STRATOSPHERE">STRATOSPHERE ($19/mo)</option>
                      <option value="APEX">APEX BLACK ($49/mo)</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-6 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
