import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" && "min-h-9 px-3 py-2 text-xs",
        size === "md" && "min-h-11 px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3.5 text-sm",
        variant === "primary" &&
          "bg-slate-900 text-white hover:bg-sky-600 shadow-md",
        variant === "secondary" &&
          "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
        variant === "ghost" &&
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl border border-slate-200/90 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[11px] font-semibold text-rose-600 mt-1">
      {message}
    </p>
  );
}

export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-10"
      role="status"
      aria-label={label}
    >
      <div
        className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-sky-600 animate-spin"
        aria-hidden
      />
      <span className="text-xs font-semibold text-slate-500">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 px-6">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
