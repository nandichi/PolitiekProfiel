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
  "w-full border border-rule bg-paper-50 px-3 py-2 text-sm text-ink outline-none focus:border-ink";

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
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Versturen mislukt.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout.");
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-rule bg-paper-50 p-6">
        <p className="kicker mb-3">Verstuurd</p>
        <p className="display text-2xl leading-tight">Je bericht is aangekomen.</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Ik lees je bericht zelf en antwoord meestal binnen een dag. Heb je een
          betaalde quiz gekocht en gaat er iets mis met je rapport? Dan heb ik je
          e-mailadres van de betaling nodig, dat mag je in je bericht zetten.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="kicker">Naam</span>
          <input
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            required
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="kicker">E-mail</span>
          <input
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

      <label className="flex flex-col gap-1.5">
        <span className="kicker">Onderwerp</span>
        <select
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

      <label className="flex flex-col gap-1.5">
        <span className="kicker">Bericht</span>
        <textarea
          className={`${inputClass} min-h-[180px] resize-y`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={4000}
          minLength={10}
          required
        />
      </label>

      {/* Honeypot: onzichtbaar voor bezoekers, bots vullen hem in. */}
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

      <label className="flex max-w-xl cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            if (event.target.checked) setError(null);
          }}
          className="mt-1 h-4 w-4 shrink-0 accent-terra"
        />
        <span>
          Ik geef toestemming om mijn bericht en e-mailadres te gebruiken om mij
          te antwoorden. Zie de{" "}
          <Link href="/privacy" className="underline">
            privacyverklaring
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={sending || !consent}
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" strokeWidth={1.8} />
              Versturen…
            </>
          ) : (
            <>
              Verstuur bericht
              <ArrowRight size={16} strokeWidth={1.8} />
            </>
          )}
        </button>
        {error && (
          <span role="alert" className="text-xs text-terra">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
