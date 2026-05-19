import Stripe from "stripe";
import type { Tier } from "@/lib/dimensions";

export type PaidTier = Exclude<Tier, "quick">;

const STRIPE_API_VERSION = "2026-04-22.dahlia";

let stripeClient: Stripe | null = null;

export function stripe(): Stripe {
  if (stripeClient) return stripeClient;

  const key = process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_RESTRICTED_KEY or STRIPE_SECRET_KEY is required.");
  }

  stripeClient = new Stripe(key, {
    apiVersion: STRIPE_API_VERSION,
  });
  return stripeClient;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function isPaidTier(tier: unknown): tier is PaidTier {
  return tier === "standard" || tier === "extended";
}

export function priceIdForTier(tier: PaidTier): string {
  const key =
    tier === "standard" ? "STRIPE_PRICE_STANDARD" : "STRIPE_PRICE_EXTENDED";
  const priceId = process.env[key];
  if (!priceId) {
    throw new Error(`${key} is required.`);
  }
  return priceId;
}

export function paidTierLabel(tier: PaidTier): string {
  return tier === "standard" ? "Standaard quiz" : "Uitgebreide quiz";
}
