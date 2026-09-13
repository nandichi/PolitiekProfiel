"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startStripeCheckout } from "@/lib/checkout-client";
import type { Tier } from "@/lib/dimensions";

interface ConsentCheckoutButtonProps {
  tier: Extract<Tier, "standard" | "extended">;
  children: ReactNode;
  className?: string;
}

/**
 * Koopknop voor de betaalde quiz. De klant moet eerst expliciet aanvinken dat
 * hij direct toegang wil en daarmee afstand doet van zijn herroepingsrecht.
 * Zonder die verklaring start de checkout niet, ook niet als iemand het
 * endpoint rechtstreeks aanroept: /api/stripe/checkout weigert zonder de flag.
 */
export function ConsentCheckoutButton({
  tier,
  children,
  className = "btn btn-primary",
}: ConsentCheckoutButtonProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    if (!accepted) {
      setError("Vink eerst aan dat je direct toegang wil.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await startStripeCheckout(tier);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout.");
      setLoading(false);
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
      <span className="inline-flex flex-col gap-2">
        <button
          type="button"
          className={className}
          onClick={startCheckout}
          disabled={loading || !accepted}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" strokeWidth={1.8} />
              Naar Stripe…
            </>
          ) : (
            children
          )}
        </button>
        {error && (
          <span role="alert" className="max-w-xs text-xs text-terra">
            {error}
          </span>
        )}
      </span>
    </div>
  );
}
