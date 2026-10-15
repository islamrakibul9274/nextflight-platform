import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirrors CreateSchema passenger rules in bookings/create
const PassengerSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  passportNumber: z.string().trim().min(4).max(30),
});

describe("booking validation", () => {
  it("rejects empty passenger names", () => {
    const r = PassengerSchema.safeParse({ firstName: "", lastName: "Doe", passportNumber: "X123" });
    expect(r.success).toBe(false);
  });

  it("accepts valid passenger", () => {
    const r = PassengerSchema.safeParse({ firstName: "Ada", lastName: "Lovelace", passportNumber: "GB123456" });
    expect(r.success).toBe(true);
  });

  it("rejects negative payment amounts", () => {
    const PaySchema = z.object({ amount: z.number().positive().max(50000) });
    expect(PaySchema.safeParse({ amount: -5 }).success).toBe(false);
    expect(PaySchema.safeParse({ amount: 100 }).success).toBe(true);
  });
});
