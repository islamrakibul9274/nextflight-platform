import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUserFromDb } from "@/lib/auth";
import { verifyPaymentIntent } from "@/lib/stripe";
import { getTierPricing, priceFor, expiryFor } from "@/lib/membership";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, unauthorized, badRequest } from "@/lib/api-error";
import { z } from "zod";

const Schema = z.object({
  tier: z.enum(["VOYAGER", "STRATOSPHERE", "APEX"]),
  billing: z.enum(["monthly", "yearly"]).optional().default("yearly"),
  paymentIntentId: z.string().trim().max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) return unauthorized("Sign in to change membership");

    const rl = checkRateLimit(getClientKey(req, `member-confirm-${dbUser._id}`), 10, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    const { tier, billing, paymentIntentId } = parsed.data;

    await connectDB();

    if (tier === "VOYAGER") {
      // Downgrade is always free
      dbUser.membershipTier = "VOYAGER";
      dbUser.membershipExpiresAt = undefined;
      await dbUser.save();
      return NextResponse.json({ success: true, tier, message: "Downgraded to Silver Voyager." });
    }

    const pricing = await getTierPricing(tier);
    const amount = priceFor(tier, billing, pricing);

    if (!paymentIntentId) return badRequest("Payment is required for paid tiers");
    const check = await verifyPaymentIntent(paymentIntentId, Math.round(amount * 100));
    if (!check.paid) {
      return NextResponse.json(
        { error: `Membership payment not verified: ${check.reason || "unknown"}` },
        { status: 402 }
      );
    }

    dbUser.membershipTier = tier;
    dbUser.membershipExpiresAt = expiryFor(billing);
    await dbUser.save();

    return NextResponse.json({
      success: true,
      tier,
      membershipExpiresAt: dbUser.membershipExpiresAt,
      message: `Welcome to ${tier}.`,
    });
  } catch (error: unknown) {
    return serverError("Membership confirm error", error);
  }
}
