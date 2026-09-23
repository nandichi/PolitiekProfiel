"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  startStripeCheckout,
  type PaidTierButtonTier,
} from "@/lib/checkout-client";

export interface PaidTierButtonOption {
  tier: PaidTierButtonTier;
  className?: string;
  children: ReactNode;
}

interface PaidTierButtonsProps {
  options: PaidTierButtonOption[];
}

const CHECKOUT_VISITOR_ERROR =
  "Betalen is tijdelijk niet beschikbaar. Probeer het later opnieuw.";

/** Meerdere koopknoppen naast elkaar met gedeelde laad- en foutstatus. */
export function PaidTierButtons({ options }: PaidTierButtonsProps) {
  const [loadingTier, setLoadingTier] = useState<PaidTierButtonTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(tier: PaidTierButtonTier) {
    setLoadingTier(tier);
    setError(null);
    try {
      await startStripeCheckout(tier);
    } catch {
      setError(CHECKOUT_VISITOR_ERROR);
      setLoadingTier(null);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap gap-3" aria-busy={loadingTier !== null}>
        {options.map((option) => (
          <button
            key={option.tier}
            type="button"
            className={`${option.className ?? "btn btn-primary"} min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus`}
            onClick={() => start(option.tier)}
            disabled={loadingTier !== null}
            aria-describedby={error ? "paid-tier-error" : undefined}
          >
            {loadingTier === option.tier ? (
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
              option.children
            )}
          </button>
        ))}
      </div>
      {error && (
        <span
          id="paid-tier-error"
          role="alert"
          className="max-w-sm border-l-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </span>
      )}
    </div>
  );
}
