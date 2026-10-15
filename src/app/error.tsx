"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-md w-full text-center space-y-4" role="alert">
        <h2 className="text-xl font-extrabold text-slate-900">Something went wrong</h2>
        <p className="text-sm text-slate-500">
          {process.env.NODE_ENV === "production"
            ? "Try again. If the problem continues, return home."
            : error.message}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
