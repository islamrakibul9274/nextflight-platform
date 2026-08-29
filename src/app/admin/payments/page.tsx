"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Search, DollarSign, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: "pi_3NqL2gRqg3b6rhHt1Ci7tYEp",
      pnr: "AET-789X4K",
      customer: "traveler@aetheria.com",
      amount: 2280,
      status: "SUCCEEDED",
      method: "Visa •••• 4242",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "pi_3NqL45Rqg3b6rhHt2Kp9tXQa",
      pnr: "AET-992B1X",
      customer: "j.vance@ridgeview.com",
      amount: 4680,
      status: "SUCCEEDED",
      method: "Amex •••• 1004",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "pi_3NqL99Rqg3b6rhHt5Zp0kLOP",
      pnr: "AET-142M9P",
      customer: "elena.r@geneva.org",
      amount: 1160,
      status: "REFUNDED",
      method: "Mastercard •••• 8812",
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Payment Ledger & Gateway Transactions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time Stripe Payment Intents, charge statuses, automated refunds, and card settlement logs.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 uppercase">
              <th className="py-3.5 px-6 font-semibold">Stripe Payment ID</th>
              <th className="py-3.5 px-6 font-semibold">Booking PNR</th>
              <th className="py-3.5 px-6 font-semibold">Customer Account</th>
              <th className="py-3.5 px-6 font-semibold">Payment Method</th>
              <th className="py-3.5 px-6 font-semibold">Amount</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-6 font-mono text-slate-500 text-[11px]">{p.id}</td>
                <td className="py-3.5 px-6 font-mono font-bold text-sky-600">{p.pnr}</td>
                <td className="py-3.5 px-6">{p.customer}</td>
                <td className="py-3.5 px-6 font-mono">{p.method}</td>
                <td className="py-3.5 px-6 font-mono font-extrabold text-slate-900">
                  ${p.amount} USD
                </td>
                <td className="py-3.5 px-6">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === "SUCCEEDED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-slate-400">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
