"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { Tier } from "@/lib/dimensions";

interface CheckoutButtonProps {
  tier: Extract<Tier, "standard" | "extended">;
  children: ReactNode;
  className?: string;
}

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
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Checkout kon niet worden gestart.");
      }
      window.location.assign(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout.");
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-2">
      <button
        type="button"
        className={className}
        onClick={startCheckout}
        disabled={loading}
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
  );
}
