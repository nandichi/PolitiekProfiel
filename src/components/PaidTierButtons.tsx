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

/** Meerdere koopknoppen naast elkaar met gedeelde laad- en foutstatus. */
export function PaidTierButtons({ options }: PaidTierButtonsProps) {
  const [loadingTier, setLoadingTier] = useState<PaidTierButtonTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(tier: PaidTierButtonTier) {
    setLoadingTier(tier);
    setError(null);
    try {
      await startStripeCheckout(tier);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout.");
      setLoadingTier(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.tier}
            type="button"
            className={option.className ?? "btn btn-primary"}
            onClick={() => start(option.tier)}
            disabled={loadingTier !== null}
          >
            {loadingTier === option.tier ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={1.8} />
                Naar Stripe…
              </>
            ) : (
              option.children
            )}
          </button>
        ))}
      </div>
      {error && (
        <span role="alert" className="max-w-xs text-xs text-terra">
          {error}
        </span>
      )}
    </div>
  );
}
