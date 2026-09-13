import { NextResponse } from "next/server";
import { isValidEmail, sendEmail } from "@/lib/email";
import {
  ContactMessageEmail,
  contactMessageEmailText,
} from "@/emails/ContactMessageEmail";

export const runtime = "nodejs";

/**
 * Contactformulier. Er staat nergens meer een publiek e-mailadres op de site:
 * berichten komen hier binnen en gaan per mail naar de eigenaar, met de
 * afzender als reply-to zodat antwoorden direct bij de bezoeker uitkomen.
 *
 * Er wordt niets opgeslagen: geen database, geen log van de inhoud.
 */

const CONTACT_INBOX = process.env.CONTACT_TO_EMAIL || "naoufal.exe@gmail.com";

const MAX_NAME = 80;
const MAX_SUBJECT = 120;
const MAX_MESSAGE = 4000;

// In-memory rate limiter per serverless instance: max 4 berichten per IP per
// 10 minuten. Zelfde aanpak als /api/email/result-link.
const RATE_LIMIT_MAX = 4;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt <= now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

interface Body {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  /** Honeypot: moet leeg blijven. */
  website?: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Te veel berichten. Probeer het over een paar minuten opnieuw." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON." }, { status: 400 });
  }

  // Honeypot ingevuld? Doe alsof het gelukt is, maar verstuur niets.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > MAX_NAME) {
    return NextResponse.json(
      { error: "Vul je naam in (2 tot 80 tekens)." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Vul een geldig e-mailadres in." },
      { status: 400 },
    );
  }
  if (subject.length < 2 || subject.length > MAX_SUBJECT) {
    return NextResponse.json(
      { error: "Kies of vul een onderwerp in (max 120 tekens)." },
      { status: 400 },
    );
  }
  if (message.length < 10 || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: "Je bericht moet tussen 10 en 4000 tekens zijn." },
      { status: 400 },
    );
  }

  const receivedAt = new Date().toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "full",
    timeStyle: "short",
  });

  const result = await sendEmail({
    to: CONTACT_INBOX,
    replyTo: email,
    subject: `[Contact] ${name}: ${subject}`,
    react: ContactMessageEmail({ name, email, subject, message, receivedAt }),
    text: contactMessageEmailText({
      name,
      email,
      subject,
      message,
      receivedAt,
    }),
    tags: [{ name: "type", value: "contact" }],
  });

  if (!result.ok) {
    console.error("[contact] verzenden mislukt:", result.error);
    return NextResponse.json(
      {
        error:
          "Je bericht kon niet worden verstuurd. Probeer het later opnieuw.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
