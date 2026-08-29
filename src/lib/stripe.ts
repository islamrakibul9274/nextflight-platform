import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as unknown as undefined,
});

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
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      description,
      receipt_email: customerEmail,
      metadata: {
        bookingPnr,
        platform: "AETHERIA",
      },
      automatic_payment_methods: {
        enabled: true,
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
