import { describe, it, expect } from "vitest";
import { formatCurrency, generatePNR } from "@/lib/utils";

describe("utils", () => {
  it("formats USD without cents", () => {
    expect(formatCurrency(1200)).toMatch(/\$1,200/);
  });

  it("generates PNRs with AET- prefix and unique values", () => {
    const a = generatePNR();
    const b = generatePNR();
    expect(a).toMatch(/^AET-[A-Z2-9]{6}$/);
    expect(b).toMatch(/^AET-[A-Z2-9]{6}$/);
    expect(a).not.toBe(b);
  });
});
