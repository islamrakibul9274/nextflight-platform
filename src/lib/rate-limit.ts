// Simple in-memory sliding-window rate limiter.
// Suitable for single-instance dev/small prod. For multi-instance prod, replace with Redis/Upstash.
type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

function cleanup() {
  const now = Date.now();
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }
  // Prevent unbounded growth
  if (store.size > 5000) {
    const keys = Array.from(store.keys()).slice(0, 1000);
    for (const k of keys) store.delete(k);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function getClientKey(req: Request, suffix = ""): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0].trim() : null) || "unknown-ip";
  return `${ip}${suffix ? `:${suffix}` : ""}`;
}
