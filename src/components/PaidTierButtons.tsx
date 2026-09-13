"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startStripeCheckout, type PaidTierButtonTier } from "@/lib/checkout-client";

export interface PaidTierButtonOption {
  tier: PaidTierButtonTier;
  className?: string;
  children: ReactNode;
}

interface PaidTierButtonsProps {
  options: PaidTierButtonOption[];
}

/**
 * Meerdere koopknoppen met één gedeelde herroepingsverklaring erboven. Gebruik
 * dit waar twee tiers naast elkaar staan, zodat de klant niet twee identieke
 * checkboxes ziet.
 */
export function PaidTierButtons({ options }: PaidTierButtonsProps) {
  const [accepted, setAccepted] = useState(false);
  const [loadingTier, setLoadingTier] = useState<PaidTierButtonTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(tier: PaidTierButtonTier) {
    if (!accepted) {
      setError("Vink eerst aan dat je direct toegang wil.");
      return;
    }
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
      <label className="flex max-w-md cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => {
            setAccepted(event.target.checked);
            if (event.target.checked) setError(null);
          }}
          className="mt-1 h-4 w-4 shrink-0 accent-terra"
        />
        <span>
          Ik wil direct toegang tot de quiz en doe daarmee afstand van mijn
          herroepingsrecht. Zie{" "}
          <Link href="/herroepingsrecht" className="underline">
            herroepingsrecht en refunds
          </Link>
          .
        </span>
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.tier}
            type="button"
            className={option.className ?? "btn btn-primary"}
            onClick={() => start(option.tier)}
            disabled={loadingTier !== null || !accepted}
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
