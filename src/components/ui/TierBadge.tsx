import React from "react";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tier = "VOYAGER" | "STRATOSPHERE" | "APEX";

const STYLES: Record<Tier, string> = {
  VOYAGER: "bg-slate-100 text-slate-600 border-slate-200",
  STRATOSPHERE: "bg-amber-50 text-amber-700 border-amber-200",
  APEX: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const LABELS: Record<Tier, string> = {
  VOYAGER: "Voyager",
  STRATOSPHERE: "Stratosphere ✓",
  APEX: "Apex Black ✓",
};

export function TierBadge({ tier, className }: { tier?: Tier | string | null; className?: string }) {
  if (!tier || (tier !== "VOYAGER" && tier !== "STRATOSPHERE" && tier !== "APEX")) return null;
  const verified = tier !== "VOYAGER";
  return (
    <span
      title={verified ? `${tier} verified member` : "Voyager member"}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border",
        STYLES[tier],
        className
      )}
    >
      {verified && <BadgeCheck className="w-3 h-3" aria-hidden />}
      <span>{LABELS[tier]}</span>
    </span>
  );
}
