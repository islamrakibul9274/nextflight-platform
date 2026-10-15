import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth";

describe("auth password hashing", () => {
  it("hashes and verifies, rejects wrong password", async () => {
    const hash = await hashPassword("StrongPass123");
    expect(hash).not.toContain("StrongPass123");
    expect(await verifyPassword("StrongPass123", hash)).toBe(true);
    expect(await verifyPassword("WrongPass999", hash)).toBe(false);
  }, 15000);
});
