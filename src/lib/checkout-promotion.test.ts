import { describe, expect, it } from "vitest";
import {
  buildPromotionCheckoutOptions,
  normalizePromotionCode,
} from "./checkout-promotion";

describe("checkout promotion options", () => {
  it("normalizes an owner Stripe promotion code", () => {
    expect(normalizePromotionCode("  naoufal-test_26  ")).toBe(
      "NAOUFAL-TEST_26",
    );
  });

  it("rejects malformed promotion codes", () => {
    expect(normalizePromotionCode("spaces are not allowed")).toBeNull();
    expect(normalizePromotionCode("x")).toBeNull();
  });

  it("pre-applies a verified Stripe code as a no-cost Checkout discount", () => {
    expect(buildPromotionCheckoutOptions("promo_123")).toEqual({
      discounts: [{ promotion_code: "promo_123" }],
    });
  });

  it("keeps the normal Stripe customer code field enabled without a code", () => {
    expect(buildPromotionCheckoutOptions(null)).toEqual({
      allowPromotionCodes: true,
    });
  });
});
