const PROMOTION_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,63}$/;

export interface PromotionCheckoutOptions {
  allowPromotionCodes?: boolean;
  discounts?: Array<{ promotion_code: string }>;
  paymentMethodCollection?: "if_required";
}

export function normalizePromotionCode(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const code = value.trim().toUpperCase();
  return PROMOTION_CODE_PATTERN.test(code) ? code : null;
}

/**
 * Stripe accepts either a customer-entered promotion field or a pre-applied
 * discount. A full no-cost order uses the latter and remains a Stripe order.
 */
export function buildPromotionCheckoutOptions(
  promotionCodeId: string | null,
): PromotionCheckoutOptions {
  if (!promotionCodeId) return { allowPromotionCodes: true };

  return {
    discounts: [{ promotion_code: promotionCodeId }],
    paymentMethodCollection: "if_required",
  };
}
