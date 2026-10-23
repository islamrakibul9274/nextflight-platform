import { describe, expect, it } from "vitest";
import { safeRedirect } from "@/lib/safe-redirect";
describe("post-login redirects", () => {
  it("preserves local paths and query strings", () => {
    expect(safeRedirect("/booking?flightId=abc&cabin=BUSINESS")).toBe(
      "/booking?flightId=abc&cabin=BUSINESS",
    );
  });
  it.each([
    null,
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/%5cexample.com",
    "/%2fexample.com",
    "/\n/example.com",
    "/%xy",
  ])("rejects external or ambiguous destinations: %s", (value) => {
    expect(safeRedirect(value)).toBeNull();
  });
});
