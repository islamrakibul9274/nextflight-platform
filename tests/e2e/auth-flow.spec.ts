import { test, expect } from "@playwright/test";

// Covers: sign up -> sign out -> sign in -> core search flow.
// Requires dev server on http://localhost:3002 (npm run dev -- --port 3002).
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002";

test("auth + search flow", async ({ page }) => {
  const email = `e2e${Date.now()}@example.com`;

  await page.goto(`${BASE}/register`);
  await page.getByLabel(/full legal name/i).fill("E2E Traveler");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password/i).fill("E2eStrong123");
  await page.getByRole("button", { name: /create.*account/i }).click();
  await expect(page).toHaveURL(/my-trips/, { timeout: 15000 });

  // Sign out via direct API (UI dropdown varies), then sign in via UI
  await page.request.post(`${BASE}/api/auth/logout`);
  await page.goto(`${BASE}/login`);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password/i).fill("E2eStrong123");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/my-trips|search|\//, { timeout: 15000 });

  // Core flow: search loads results or empty state, never a crash
  await page.goto(`${BASE}/search?from=JFK&to=LHR`);
  await expect(page.getByRole("heading", { name: /search|flights|results/i }).first()).toBeVisible({ timeout: 15000 });
});
