/** Only permit local app paths, including when a browser normalizes backslashes. */
export function safeRedirect(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  try {
    const decoded = decodeURIComponent(value);
    if (/[\\\u0000-\u0020]/.test(decoded) || decoded.startsWith("//"))
      return null;
    const url = new URL(value, "https://nextflight.local");
    return url.origin === "https://nextflight.local" ? value : null;
  } catch {
    return null;
  }
}
