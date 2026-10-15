import { NextResponse } from "next/server";
import { createFlightPaymentIntent } from "@/lib/stripe";
import { generatePNR } from "@/lib/utils";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, badRequest } from "@/lib/api-error";
import { z } from "zod";

const Schema = z.object({
  amount: z.number().positive("Payment amount must be positive").max(50000, "Amount exceeds limit"),
  currency: z.string().trim().max(10).optional().default("usd"),
  customerEmail: z.string().trim().email("Invalid customer email").optional(),
  description: z.string().trim().max(200).optional(),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "pay-intent"), 20, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const { amount, currency, customerEmail, description } = parsed.data;
    const tempPnr = generatePNR();

    try {
      const intent = await createFlightPaymentIntent({
        amount: Math.round(amount * 100), // convert dollars to cents
        currency,
        bookingPnr: tempPnr,
        customerEmail: customerEmail || "guest@aetheria.com",
        description: description || `NextFlight Booking ${tempPnr}`,
      });

      return NextResponse.json({
        clientSecret: intent.clientSecret,
        paymentIntentId: intent.paymentIntentId,
        pnr: tempPnr,
      });
    } catch (stripeErr: unknown) {
      const err = stripeErr as Error;
      console.error("Stripe intent error:", err);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Payment service unavailable. Try again shortly." },
          { status: 502 }
        );
      }
      // Dev-only mock so local checkout can be tested without Stripe keys
      return NextResponse.json({
        clientSecret: `mock_secret_${Date.now()}`,
        paymentIntentId: `pi_mock_${Date.now()}`,
        pnr: tempPnr,
        mock: true,
      });
    }
  } catch (error: unknown) {
    return serverError("Payment intent error", error);
  }
}
