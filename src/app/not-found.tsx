import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-[#527c8a]">
        <Compass size={30} strokeWidth={1.3} aria-hidden="true" />
      </span>
      <p className="section-kicker">404 / A SMALL DETOUR</p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-slate-900">
        Let’s get you back on course.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
        This page may have moved, or the link may be incomplete. Your next
        journey is still out there.
      </p>
      <Link href="/" className="button-primary mt-7">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to NextFlight
      </Link>
    </div>
  );
}
