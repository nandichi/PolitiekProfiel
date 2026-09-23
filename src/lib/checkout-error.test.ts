import { describe, expect, it } from "vitest";
import {
  CHECKOUT_UNAVAILABLE_RESPONSE,
  checkoutUnavailableBody,
} from "./checkout-error";

describe("checkout error normalization", () => {
  it("returns a stable generic visitor response", () => {
    expect(checkoutUnavailableBody()).toEqual({
      code: "CHECKOUT_UNAVAILABLE",
      error: "Betalen is tijdelijk niet beschikbaar. Probeer het later opnieuw.",
    });
    expect(CHECKOUT_UNAVAILABLE_RESPONSE).toBe("CHECKOUT_UNAVAILABLE");
  });

  it("cannot include an infrastructure error message", () => {
    const internalMessage =
      "Stripe request req_secret failed: relation entitlements does not exist";
    const body = JSON.stringify(checkoutUnavailableBody());

    expect(body).not.toContain(internalMessage);
    expect(body).not.toContain("Stripe");
    expect(body).not.toContain("entitlements");
  });
});
