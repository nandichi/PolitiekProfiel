"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const SUBJECTS = [
  "Algemene vraag",
  "Vraag over mijn rapport",
  "Probleem met betalen",
  "Klacht",
  "Pers of samenwerking",
  "Overig",
] as const;

const inputClass =
  "min-h-11 w-full rounded-[2px] border border-rule bg-canvas-raised px-3 py-2.5 text-base text-ink outline-none transition-colors placeholder:text-text-muted hover:border-rule-strong focus-visible:border-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60";
const CONTACT_ERROR =
  "Je bericht kon niet worden verstuurd. Probeer het later opnieuw.";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setError("Vink aan dat je bericht gebruikt mag worden om je te antwoorden.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !json.ok) {
        throw new Error(CONTACT_ERROR);
      }
      setSent(true);
    } catch {
      setError(CONTACT_ERROR);
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-success bg-success/10 p-6"
      >
        <p className="kicker mb-3 text-success">Verstuurd</p>
        <h2 className="display text-2xl leading-tight">
          Je bericht is aangekomen.
        </h2>
        <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-ink-raised">
          Ik lees je bericht zelf en antwoord meestal binnen een dag. Heb je een
          betaalde quiz gekocht en gaat er iets mis met je rapport? Dan heb ik je
          e-mailadres van de betaling nodig, dat mag je in je bericht zetten.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5"
      aria-busy={sending}
      aria-describedby={error ? "contact-form-error" : undefined}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor="contact-name" className="flex flex-col gap-2">
          <span className="kicker">Naam</span>
          <input
            id="contact-name"
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            required
            autoComplete="name"
          />
        </label>
        <label htmlFor="contact-email" className="flex flex-col gap-2">
          <span className="kicker">E-mail</span>
          <input
            id="contact-email"
            className={inputClass}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={200}
            required
            autoComplete="email"
          />
        </label>
      </div>

      <label htmlFor="contact-subject" className="flex flex-col gap-2">
        <span className="kicker">Onderwerp</span>
        <select
          id="contact-subject"
          className={inputClass}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        >
          {SUBJECTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="contact-message" className="flex flex-col gap-2">
        <span className="kicker">Bericht</span>
        <textarea
          id="contact-message"
          className={`${inputClass} min-h-[180px] resize-y`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={4000}
          minLength={10}
          required
        />
      </label>

      <div className="hidden" aria-hidden>
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </div>

      <label className="flex min-h-11 max-w-xl cursor-pointer items-start gap-3 py-2 text-sm leading-relaxed text-ink-raised">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            if (event.target.checked) setError(null);
          }}
          className="mt-0.5 h-5 w-5 shrink-0 rounded-[2px] accent-signal focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-describedby="contact-consent-copy"
        />
        <span id="contact-consent-copy">
          Ik geef toestemming om mijn bericht en e-mailadres te gebruiken om mij
          te antwoorden. Zie de{" "}
          <Link
            href="/privacy"
            className="underline decoration-rule-strong underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            privacyverklaring
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="btn btn-primary min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
          disabled={sending || !consent}
        >
          {sending ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
                strokeWidth={1.8}
                aria-hidden
              />
              Versturen…
            </>
          ) : (
            <>
              Verstuur bericht
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
            </>
          )}
        </button>
        {error && (
          <p
            id="contact-form-error"
            role="alert"
            className="border-l-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
