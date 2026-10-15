import { connectDB } from "./db";
import { MembershipPlan } from "@/models/MembershipPlan";

export type Tier = "VOYAGER" | "STRATOSPHERE" | "APEX";
export type Billing = "monthly" | "yearly";

const FALLBACK: Record<Tier, { monthlyPrice: number; yearlyPrice: number; flightDiscountPercent: number }> = {
  VOYAGER: { monthlyPrice: 0, yearlyPrice: 0, flightDiscountPercent: 0 },
  STRATOSPHERE: { monthlyPrice: 19, yearlyPrice: 190, flightDiscountPercent: 15 },
  APEX: { monthlyPrice: 49, yearlyPrice: 490, flightDiscountPercent: 20 },
};

export async function getTierPricing(tier: Tier): Promise<{ monthlyPrice: number; yearlyPrice: number; flightDiscountPercent: number }> {
  try {
    await connectDB();
    const plan = await MembershipPlan.findOne({ tier }).lean();
    if (plan) {
      return {
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        flightDiscountPercent: plan.flightDiscountPercent,
      };
    }
  } catch {
    // fall through to hardcoded prices
  }
  return FALLBACK[tier];
}

export function priceFor(tier: Tier, billing: Billing, pricing: { monthlyPrice: number; yearlyPrice: number }): number {
  return billing === "yearly" ? pricing.yearlyPrice : pricing.monthlyPrice;
}

export function expiryFor(billing: Billing): Date {
  const d = new Date();
  if (billing === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}
