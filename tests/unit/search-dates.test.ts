import { describe, expect, it } from "vitest";
import { dateAfterDays, localDateInput } from "@/lib/search-dates";

describe("search calendar dates", () => {
  it("uses local calendar components without a UTC conversion", () => {
    expect(localDateInput(new Date(2026, 9, 24, 0, 5))).toBe("2026-10-24");
  });
  it("handles month/year boundaries and leap days", () => {
    expect(dateAfterDays(7, new Date(2026, 11, 28))).toBe("2027-01-04");
    expect(dateAfterDays(1, new Date(2028, 1, 28))).toBe("2028-02-29");
  });
  it("does not mutate the original date", () => {
    const original = new Date(2026, 9, 24);
    dateAfterDays(14, original);
    expect(localDateInput(original)).toBe("2026-10-24");
  });
});
