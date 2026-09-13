import type { Tier } from "@/lib/dimensions";

export type PaidTierButtonTier = Extract<Tier, "standard" | "extended">;

interface CheckoutResponse {
  url?: string;
  error?: string;
}

/** Start een Stripe-checkout voor een betaalde quiz. */
export async function startStripeCheckout(
  tier: PaidTierButtonTier,
  promotionCode?: string | null,
): Promise<void> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      tier,
      ...(promotionCode ? { promotionCode } : {}),
    }),
  });
  const json = (await res.json().catch(() => ({}))) as CheckoutResponse;
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? "Checkout kon niet worden gestart.");
  }
  window.location.assign(json.url);
}
