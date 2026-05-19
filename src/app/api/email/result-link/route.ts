import { NextResponse } from "next/server";
import { getResult } from "@/lib/results-store";
import { isValidEmail, sendEmail } from "@/lib/email";
import { ResultLinkEmail, resultLinkEmailText } from "@/emails/ResultLinkEmail";

export const runtime = "nodejs";

const SHARE_ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/;

// Eenvoudige in-memory rate limiter per Vercel-instance: max 5 requests per IP
// per 60 seconden. Eerste verdedigingslinie tegen misbruik (mailbom naar
// derden). Bij hogere belasting later vervangen door Upstash Ratelimit.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
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

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

function tierLabelFor(tier: string | undefined): string | undefined {
  if (tier === "quick") return "Quick";
  if (tier === "standard") return "Standaard";
  if (tier === "extended") return "Uitgebreide";
  return undefined;
}

interface Body {
  shareId?: string;
  email?: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het straks opnieuw." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON." }, { status: 400 });
  }

  const shareId = typeof body.shareId === "string" ? body.shareId.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!SHARE_ID_PATTERN.test(shareId)) {
    return NextResponse.json(
      { error: "Ongeldige resultaat-ID." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Vul een geldig e-mailadres in." },
      { status: 400 },
    );
  }

  const stored = await getResult(shareId);
  if (!stored) {
    // Bewust generieke fout: lekt niet of een share-ID wel/niet bestaat.
    return NextResponse.json(
      { error: "Resultaat niet gevonden." },
      { status: 404 },
    );
  }

  const resultUrl = `${siteUrl()}/r/${shareId}`;
  const tierLabel = tierLabelFor(stored.tier);

  const result = await sendEmail({
    to: email,
    subject: "Jouw PolitiekProfiel-resultaat",
    react: ResultLinkEmail({ resultUrl, tierLabel }),
    text: resultLinkEmailText({ resultUrl, tierLabel }),
    tags: [
      { name: "type", value: "result-link" },
      { name: "tier", value: stored.tier ?? "unknown" },
    ],
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Verzenden mislukt." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
