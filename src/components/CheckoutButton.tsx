"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  startStripeCheckout,
  type PaidTierButtonTier,
} from "@/lib/checkout-client";

interface CheckoutButtonProps {
  tier: PaidTierButtonTier;
  children: ReactNode;
  className?: string;
}

const CHECKOUT_VISITOR_ERROR =
  "Betalen is tijdelijk niet beschikbaar. Probeer het later opnieuw.";

export function CheckoutButton({
  tier,
  children,
  className = "btn btn-primary",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const promotionCode = new URLSearchParams(window.location.search).get(
        "promo",
      );
      await startStripeCheckout(tier, promotionCode);
    } catch {
      setError(CHECKOUT_VISITOR_ERROR);
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        className={`${className} min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus`}
        onClick={startCheckout}
        disabled={loading}
        aria-busy={loading}
        aria-describedby={error ? `checkout-error-${tier}` : undefined}
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
              strokeWidth={1.8}
              aria-hidden
            />
            Naar Stripe…
          </>
        ) : (
          children
        )}
      </button>
      {error && (
        <span
          id={`checkout-error-${tier}`}
          role="alert"
          className="max-w-sm border-l-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </span>
      )}
    </span>
  );
}
