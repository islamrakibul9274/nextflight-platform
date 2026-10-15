import { loadStripe, Stripe } from "@stripe/stripe-js";

let promise: Promise<Stripe | null> | null = null;

export function getStripePromise(): Promise<Stripe | null> {
  if (!promise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    promise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return promise;
}

export const DEMO_TEST_CARD = "4242 4242 4242 4242";
export const DEMO_TEST_EXPIRY = "12/34";
export const DEMO_TEST_CVC = "123";
