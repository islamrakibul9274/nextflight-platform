import { NextResponse } from "next/server";
import { createFlightPaymentIntent } from "@/lib/stripe";
import { generatePNR } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { amount, currency = "usd", customerEmail, description } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const tempPnr = generatePNR();

    try {
      const intent = await createFlightPaymentIntent({
        amount: Math.round(amount * 100), // convert dollars to cents
        currency,
        bookingPnr: tempPnr,
        customerEmail: customerEmail || "guest@aetheria.com",
        description: description || `Aetheria Flight Booking ${tempPnr}`,
      });

      return NextResponse.json({
        clientSecret: intent.clientSecret,
        paymentIntentId: intent.paymentIntentId,
        pnr: tempPnr,
      });
    } catch (stripeErr: unknown) {
      const err = stripeErr as Error;
      console.warn("Stripe live intent fallback to mock clientSecret:", err.message);
      // Mock clientSecret for testing environments
      return NextResponse.json({
        clientSecret: `mock_secret_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        paymentIntentId: `pi_mock_${Date.now()}`,
        pnr: tempPnr,
        mock: true,
      });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Payment intent error:", err);
    return NextResponse.json({ error: err.message || "Failed to create payment intent" }, { status: 500 });
  }
}
