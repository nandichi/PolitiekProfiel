export const CHECKOUT_UNAVAILABLE_RESPONSE = "CHECKOUT_UNAVAILABLE" as const;

export function checkoutUnavailableBody() {
  return {
    code: CHECKOUT_UNAVAILABLE_RESPONSE,
    error: "Betalen is tijdelijk niet beschikbaar. Probeer het later opnieuw.",
  } as const;
}
