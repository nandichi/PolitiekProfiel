"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Mail, Loader2 } from "lucide-react";

interface Props {
  shareId: string;
  /** Optionele compact-variant voor inline gebruik (bv. direct na quiz-submit). */
  variant?: "default" | "compact";
}

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailResultLinkBlock({ shareId, variant = "default" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Vul een geldig e-mailadres in.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setErrorMessage("Bevestig eerst dat we deze e-mail mogen versturen.");
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/email/result-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ shareId, email: trimmed }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        const fallback =
          res.status === 429
            ? "Te veel verzoeken. Probeer het straks opnieuw."
            : `Versturen mislukt (status ${res.status}).`;
        throw new Error(json.error ?? fallback);
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Onbekende fout.");
    }
  }

  const compact = variant === "compact";

  return (
    <div
      className={
        compact
          ? "border border-rule bg-paper-50 p-5"
          : "border border-rule-strong bg-paper p-6 sm:p-7"
      }
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-navy">
          <Mail size={18} strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="kicker mb-2">
            {compact ? "Bewaar je link" : "Mail mij deze link"}
          </p>
          <h3 className="font-display text-lg md:text-xl text-ink leading-snug">
            {compact
              ? "Stuur deze resultaat-link naar je inbox"
              : "Bewaar je resultaat in je inbox"}
          </h3>
          <p className="mt-2 text-sm text-ink-muted max-w-prose">
            Optioneel. We sturen alleen de link naar dit resultaat — geen
            antwoorden of scores. Je e-mailadres wordt niet aan je politieke
            profiel gekoppeld in onze database.
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-5 inline-flex items-center gap-2 border border-success/40 bg-success/10 px-3 py-2 text-sm text-success"
              >
                <Check size={16} strokeWidth={1.8} />
                Verstuurd. Check je inbox (en eventueel spam).
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSubmit}
                className="mt-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor={`email-${shareId}`} className="sr-only">
                    E-mailadres
                  </label>
                  <input
                    id={`email-${shareId}`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="jij@voorbeeld.nl"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setErrorMessage(null);
                      }
                    }}
                    disabled={status === "sending"}
                    className="flex-1 border border-rule-strong bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-ink focus:ring-0"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-navy transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" strokeWidth={1.8} />
                        Versturen
                      </>
                    ) : (
                      "Verstuur link"
                    )}
                  </button>
                </div>

                <label className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (status === "error") {
                        setStatus("idle");
                        setErrorMessage(null);
                      }
                    }}
                    className="mt-0.5 accent-navy"
                  />
                  <span>
                    Ik begrijp dat PolitiekProfiel dit e-mailadres eenmalig
                    gebruikt om mijn resultaat-link te versturen en niet
                    koppelt aan mijn politieke profiel.
                  </span>
                </label>

                {status === "error" && errorMessage ? (
                  <p className="text-xs text-terra">{errorMessage}</p>
                ) : null}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
