import { NextResponse } from "next/server";
import { getCurrentUserFromDb } from "@/lib/auth";
import { createFlightPaymentIntent } from "@/lib/stripe";
import { getTierPricing, priceFor } from "@/lib/membership";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, unauthorized, badRequest } from "@/lib/api-error";
import { generatePNR } from "@/lib/utils";
import { z } from "zod";

const Schema = z.object({
  tier: z.enum(["STRATOSPHERE", "APEX"]),
  billing: z.enum(["monthly", "yearly"]).optional().default("yearly"),
});

export async function POST(req: Request) {
  try {
    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) return unauthorized("Sign in to purchase a membership");

    const rl = checkRateLimit(getClientKey(req, `member-${dbUser._id}`), 10, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    const { tier, billing } = parsed.data;

    const pricing = await getTierPricing(tier);
    const amount = priceFor(tier, billing, pricing);
    if (amount <= 0) return badRequest("This tier is free");

    try {
      const intent = await createFlightPaymentIntent({
        amount: Math.round(amount * 100),
        currency: "usd",
        bookingPnr: generatePNR(),
        customerEmail: dbUser.email,
        description: `NextFlight ${tier} membership (${billing})`,
      });
      return NextResponse.json({
        clientSecret: intent.clientSecret,
        paymentIntentId: intent.paymentIntentId,
        amount,
        tier,
        billing,
      });
    } catch (e) {
      console.error("Membership intent error:", e);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Payment service unavailable. Try again shortly." }, { status: 502 });
      }
      return NextResponse.json({
        clientSecret: `mock_secret_${Date.now()}`,
        paymentIntentId: `pi_mock_${Date.now()}`,
        amount,
        tier,
        billing,
        mock: true,
      });
    }
  } catch (error: unknown) {
    return serverError("Membership checkout error", error);
  }
}
