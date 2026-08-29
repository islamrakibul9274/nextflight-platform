"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, CheckCircle2, Percent, DollarSign } from "lucide-react";

interface CouponDoc {
  _id: string;
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: "SUMMER2026",
    description: "Special seasonal promotion across global routes",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    discountValue: 15,
    minOrderValue: 300,
    maxDiscount: 300,
    validUntil: "2028-12-31",
    usageLimit: 1000,
    isActive: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Coupons & Fare Discounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure promotional campaign codes, discount limits, and expiry dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 uppercase">
              <th className="py-3.5 px-6 font-semibold">Promo Code</th>
              <th className="py-3.5 px-6 font-semibold">Discount</th>
              <th className="py-3.5 px-6 font-semibold">Campaign Description</th>
              <th className="py-3.5 px-6 font-semibold">Min Order</th>
              <th className="py-3.5 px-6 font-semibold">Usage</th>
              <th className="py-3.5 px-6 font-semibold">Valid Until</th>
              <th className="py-3.5 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length > 0 ? (
              coupons.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-extrabold text-sky-600 bg-sky-50/30">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-emerald-600">
                    {c.discountType === "PERCENT" ? `${c.discountValue}% OFF` : `$${c.discountValue} FLAT`}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{c.description}</td>
                  <td className="py-3.5 px-6 font-mono">${c.minOrderValue}</td>
                  <td className="py-3.5 px-6 font-mono font-bold">
                    {c.timesUsed} / {c.usageLimit}
                  </td>
                  <td className="py-3.5 px-6 text-slate-400">
                    {new Date(c.validUntil).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No coupons created.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Promo Code</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountType: e.target.value as "PERCENT" | "FIXED",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Flat Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
