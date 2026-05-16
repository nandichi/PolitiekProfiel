"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "politiekprofiel-consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function close() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "ack");
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Privacymelding"
      className="fixed inset-x-4 bottom-4 z-30 md:left-auto md:right-6 md:max-w-md border border-rule-strong bg-paper p-5 shadow-card"
    >
      <button
        type="button"
        onClick={close}
        className="absolute top-3 right-3 text-ink-muted hover:text-ink"
        aria-label="Sluiten"
      >
        <X size={16} strokeWidth={1.6} />
      </button>
      <p className="kicker mb-2">Geen tracking, geen reclame</p>
      <p className="text-sm text-ink-soft pr-4">
        Wij gebruiken geen tracking-cookies en geen analytics. Je quizvoortgang
        wordt lokaal in je browser bewaard.{" "}
        <Link href="/privacy" className="underline-offset-4">
          Lees onze privacyverklaring
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" className="btn-primary" onClick={close}>
          Begrepen
        </button>
      </div>
    </div>
  );
}
