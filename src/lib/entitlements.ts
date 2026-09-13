import "server-only";

import { nanoid } from "nanoid";
import { payload } from "@/lib/payload";
import type { Tier } from "@/lib/dimensions";
import { isPaidTier, type PaidTier } from "@/lib/stripe";
import { getAttemptCount, MAX_PAID_ATTEMPTS, recordAttempt } from "@/lib/attempts-store";

const TOKEN_LENGTH = 32;

export type EntitlementStatus = "pending" | "paid" | "revoked";

export interface EntitlementAccess {
  ok: boolean;
  status: EntitlementStatus | "missing" | "consumed" | "wrong-tier";
}

interface EntitlementDoc {
  id: string | number;
  token: string;
  tier: PaidTier;
  status: EntitlementStatus;
  consumedAt?: string | null;
}

export function normalizeEntitlementToken(token: unknown): string | null {
  if (typeof token !== "string") return null;
  const trimmed = token.trim();
  if (!/^[A-Za-z0-9_-]{24,64}$/.test(trimmed)) return null;
  return trimmed;
}

export async function createPendingEntitlement(input: {
  tier: PaidTier;
  stripePriceId: string;
}): Promise<{ token: string }> {
  const p = await payload();
  const token = nanoid(TOKEN_LENGTH);
  await p.create({
    collection: "entitlements",
    data: {
      token,
      tier: input.tier,
      status: "pending",
      stripePriceId: input.stripePriceId,
    },
  });
  return { token };
}

export async function attachCheckoutSession(input: {
  token: string;
  stripeCheckoutSessionId: string;
}): Promise<void> {
  const doc = await findEntitlementByToken(input.token);
  if (!doc) return;
  const p = await payload();
  await p.update({
    collection: "entitlements",
    id: doc.id,
    data: {
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
    },
  });
}

export async function markEntitlementPaid(input: {
  token: string;
  tier: PaidTier;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  amountTotal?: number;
  currency?: string;
}): Promise<{ firstPaidTransition: boolean }> {
  const doc = await findEntitlementByToken(input.token);
  if (!doc || doc.tier !== input.tier) {
    return { firstPaidTransition: false };
  }

  const wasAlreadyPaid = doc.status === "paid";

  const p = await payload();
  await p.update({
    collection: "entitlements",
    id: doc.id,
    data: {
      status: "paid",
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId,
      amountTotal: input.amountTotal,
      currency: input.currency,
      paidAt: new Date().toISOString(),
    },
  });

  return { firstPaidTransition: !wasAlreadyPaid };
}

export async function markEntitlementConsumed(token: string): Promise<void> {
  const doc = await findEntitlementByToken(token);
  if (!doc || doc.consumedAt) return;

  const p = await payload();
  await p.update({
    collection: "entitlements",
    id: doc.id,
    data: {
      consumedAt: new Date().toISOString(),
    },
  });
}

/**
 * Trekt de toegang in na een refund of een betwiste betaling. De koppeling
 * loopt via het Stripe payment intent, want dat is het enige veld dat zowel op
 * de checkout-sessie als op de refund terugkomt.
 */
export async function revokeEntitlementByPaymentIntent(
  stripePaymentIntentId: string,
): Promise<{ revoked: boolean }> {
  if (!stripePaymentIntentId) return { revoked: false };

  const p = await payload();
  const res = await p.find({
    collection: "entitlements",
    where: { stripePaymentIntentId: { equals: stripePaymentIntentId } },
    limit: 1,
    depth: 0,
  });
  if (res.docs.length === 0) return { revoked: false };

  const doc = res.docs[0] as unknown as EntitlementDoc;
  if (doc.status === "revoked") return { revoked: false };

  await p.update({
    collection: "entitlements",
    id: doc.id,
    data: { status: "revoked" },
  });
  return { revoked: true };
}

export async function validateEntitlementForTier(input: {
  tier: Tier;
  token?: unknown;
}): Promise<EntitlementAccess> {
  if (!isPaidTier(input.tier)) {
    return { ok: true, status: "paid" };
  }

  const token = normalizeEntitlementToken(input.token);
  if (!token) return { ok: false, status: "missing" };

  const doc = await findEntitlementByToken(token);
  if (!doc) return { ok: false, status: "missing" };
  if (doc.tier !== input.tier) return { ok: false, status: "wrong-tier" };
  if (doc.status !== "paid") return { ok: false, status: doc.status };

  // Een betaalde quiz mag een beperkt aantal keer worden afgerond. De teller
  // staat bewust buiten de entitlements zelf (zie lib/attempts-store.ts).
  const attempts = await getAttemptCount(token);
  if (attempts >= MAX_PAID_ATTEMPTS) return { ok: false, status: "consumed" };

  return { ok: true, status: "paid" };
}

/**
 * Registreert een afgeronde betaalde quiz. Bij het laatste toegestane bezoek
 * wordt de entitlement ook op `consumed` gezet, zodat het admin-overzicht
 * dezelfde status laat zien als de teller.
 */
export async function registerPaidAttempt(
  token: string,
): Promise<{ attempts: number; exhausted: boolean }> {
  const attempts = await recordAttempt(token);
  const exhausted = attempts >= MAX_PAID_ATTEMPTS;
  if (exhausted) {
    await markEntitlementConsumed(token);
  }
  return { attempts, exhausted };
}

async function findEntitlementByToken(
  token: string,
): Promise<EntitlementDoc | null> {
  const p = await payload();
  const res = await p.find({
    collection: "entitlements",
    where: { token: { equals: token } },
    limit: 1,
    depth: 0,
  });
  if (res.docs.length === 0) return null;
  return res.docs[0] as unknown as EntitlementDoc;
}
