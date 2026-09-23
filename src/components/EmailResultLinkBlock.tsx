"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Mail, Loader2 } from "lucide-react";

interface Props {
  shareId: string;
  /** Optionele compact-variant voor inline gebruik (bv. direct na quiz-submit). */
  variant?: "default" | "compact";
}

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_SEND_ERROR =
  "De link kon niet worden verstuurd. Probeer het later opnieuw.";

export function EmailResultLinkBlock({ shareId, variant = "default" }: Props) {
  const reduce = useReducedMotion();
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
        throw new Error(
          res.status === 429
            ? "Te veel verzoeken. Probeer het straks opnieuw."
            : EMAIL_SEND_ERROR,
        );
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : EMAIL_SEND_ERROR);
    }
  }

  const compact = variant === "compact";
  const errorId = `email-result-error-${shareId}`;
  const consentId = `email-result-consent-${shareId}`;

  return (
    <section
      aria-labelledby={`email-result-heading-${shareId}`}
      className={
        compact
          ? "border border-rule bg-canvas-raised p-5"
          : "border border-rule-strong bg-canvas-raised p-6 sm:p-7"
      }
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-signal" aria-hidden>
          <Mail size={18} strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="kicker mb-2">
            {compact ? "Bewaar je link" : "Mail mij deze link"}
          </p>
          <h3
            id={`email-result-heading-${shareId}`}
            className="display text-lg leading-snug text-ink md:text-xl"
          >
            {compact
              ? "Stuur deze resultaat-link naar je inbox"
              : "Bewaar je resultaat in je inbox"}
          </h3>
          <p className="mt-2 max-w-[68ch] text-sm text-text-muted">
            Optioneel. We sturen alleen de link naar dit resultaat, geen
            antwoorden of scores. Je e-mailadres wordt niet aan je politieke
            profiel gekoppeld in onze database.
          </p>

          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reduce ? 0 : 0.22 }}
                  className="mt-5 inline-flex items-center gap-2 border border-success bg-success/10 px-3 py-2 text-sm text-success"
                >
                  <Check size={16} strokeWidth={1.8} aria-hidden />
                  Verstuurd. Check je inbox en eventueel je spammap.
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reduce ? 0 : 0.22 }}
                  onSubmit={handleSubmit}
                  className="mt-5 space-y-3"
                  aria-busy={status === "sending"}
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
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
                      className="min-h-11 flex-1 rounded-[2px] border border-rule-strong bg-canvas px-3 py-2.5 text-base text-ink outline-none transition-colors placeholder:text-text-muted focus-visible:border-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
                      aria-invalid={status === "error"}
                      aria-describedby={
                        status === "error" ? errorId : consentId
                      }
                      required
                    />
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn btn-primary min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                            strokeWidth={1.8}
                            aria-hidden
                          />
                          Versturen
                        </>
                      ) : (
                        "Verstuur link"
                      )}
                    </button>
                  </div>

                  <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-xs leading-relaxed text-text-muted">
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
                      className="mt-0.5 h-5 w-5 shrink-0 rounded-[2px] accent-signal focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
                      aria-describedby={consentId}
                    />
                    <span id={consentId}>
                      Ik begrijp dat PolitiekProfiel dit e-mailadres eenmalig
                      gebruikt om mijn resultaat-link te versturen en niet
                      koppelt aan mijn politieke profiel.
                    </span>
                  </label>

                  {status === "error" && errorMessage ? (
                    <p
                      id={errorId}
                      role="alert"
                      className="border-l-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
                    >
                      {errorMessage}
                    </p>
                  ) : null}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
