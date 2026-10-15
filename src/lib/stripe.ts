import Stripe from "stripe";

function getStripeKey(): string | null {
  return process.env.STRIPE_SECRET_KEY || null;
}

function getStripe(): Stripe | null {
  const key = getStripeKey();
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2025-02-24.acacia" as unknown as undefined,
  });
}

export const stripe = getStripe();

export async function createFlightPaymentIntent({
  amount,
  currency = "usd",
  bookingPnr,
  customerEmail,
  description,
}: {
  amount: number; // in cents
  currency?: string;
  bookingPnr: string;
  customerEmail: string;
  description: string;
}) {
  const client = getStripe();
  if (!client) throw new Error("Stripe is not configured");
  try {
    const paymentIntent = await client.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      description,
      receipt_email: customerEmail,
      metadata: {
        bookingPnr,
        platform: "NextFlight",
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    throw error;
  }
}

export async function verifyPaymentIntent(
  paymentIntentId: string,
  expectedAmountCents: number
): Promise<{ paid: boolean; reason?: string }> {
  if (!paymentIntentId || paymentIntentId.startsWith("pi_mock_") || paymentIntentId.startsWith("pi_direct_") || paymentIntentId.startsWith("pi_sim_")) {
    return { paid: false, reason: "Unverified test payment id" };
  }
  const client = getStripe();
  if (!client) return { paid: false, reason: "Stripe not configured" };
  try {
    const pi = await client.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") return { paid: false, reason: `Payment status: ${pi.status}` };
    if (pi.amount < expectedAmountCents) {
      return { paid: false, reason: "Paid amount is less than booking total" };
    }
    return { paid: true };
  } catch (e) {
    console.error("Stripe verify error:", e);
    return { paid: false, reason: "Unable to verify payment" };
  }
}
