import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

export function serverError(logLabel: string, err: unknown) {
  const e = err as Error;
  console.error(`${logLabel}:`, e);
  return NextResponse.json(
    { error: isProd ? "Internal server error" : e.message || "Internal server error" },
    { status: 500 }
  );
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function rateLimited(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: `Too many requests. Try again in ${retryAfter}s.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
