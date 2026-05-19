import { customAlphabet } from "nanoid";
import type { PaidTier } from "@/lib/stripe";
import { stripe } from "@/lib/stripe";

const codeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeCode = customAlphabet(codeAlphabet, 10);

export interface CreateFreeQuizPromotionCodeInput {
  code?: string;
  tier?: PaidTier | "all";
  maxRedemptions?: number;
  expiresAt?: string;
  note?: string;
}

export interface CreatedPromotionCode {
  code: string;
  stripeCouponId: string;
  stripePromotionCodeId: string;
}

export async function createFreeQuizPromotionCode(
  input: CreateFreeQuizPromotionCodeInput,
): Promise<CreatedPromotionCode> {
  const tier = input.tier ?? "all";
  const code = normalizeCode(input.code) ?? `PP-${makeCode()}`;
  const productIds = productIdsForTier(tier);

  const coupon = await stripe().coupons.create({
    name: `PolitiekProfiel gratis quiz${tier === "all" ? "" : ` (${tier})`}`,
    percent_off: 100,
    duration: "once",
    ...(productIds.length > 0 ? { applies_to: { products: productIds } } : {}),
    metadata: {
      source: "politiekprofiel-admin",
      tier,
      note: input.note ?? "",
    },
  });

  const promotionCode = await stripe().promotionCodes.create({
    promotion: {
      type: "coupon",
      coupon: coupon.id,
    },
    code,
    active: true,
    max_redemptions: input.maxRedemptions,
    expires_at: input.expiresAt
      ? Math.floor(new Date(input.expiresAt).getTime() / 1000)
      : undefined,
    metadata: {
      source: "politiekprofiel-admin",
      tier,
    },
  });

  return {
    code: promotionCode.code,
    stripeCouponId: coupon.id,
    stripePromotionCodeId: promotionCode.id,
  };
}

function normalizeCode(code: string | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{4,32}$/.test(normalized)) return null;
  return normalized;
}

function productIdsForTier(tier: PaidTier | "all"): string[] {
  const standard = process.env.STRIPE_PRODUCT_STANDARD;
  const extended = process.env.STRIPE_PRODUCT_EXTENDED;
  if (tier === "standard") return standard ? [standard] : [];
  if (tier === "extended") return extended ? [extended] : [];
  return [standard, extended].filter((id): id is string => Boolean(id));
}
