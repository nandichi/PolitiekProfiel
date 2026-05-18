import { NextResponse } from "next/server";
import { appendEvents, type EventInput, type QuizEventType } from "@/lib/tracking-store";
import type { Tier } from "@/lib/dimensions";

const VALID_TYPES: ReadonlySet<QuizEventType> = new Set([
  "quiz-started",
  "question-viewed",
  "question-answered",
  "question-skipped",
  "question-back",
  "info-opened",
  "resume-prompt",
  "adaptive-batch",
  "quiz-completed",
  "quiz-abandoned",
]);

const VALID_TIERS: ReadonlySet<Tier> = new Set(["quick", "standard", "extended"]);
const ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/;
const MAX_BATCH = 200;

export const runtime = "nodejs";

interface RawEvent {
  type?: unknown;
  attemptId?: unknown;
  trackingId?: unknown;
  tier?: unknown;
  adaptive?: unknown;
  questionId?: unknown;
  value?: unknown;
  cursor?: unknown;
  timeOnQuestionMs?: unknown;
  occurredAt?: unknown;
  meta?: unknown;
}

function parseEvent(raw: RawEvent): EventInput | null {
  if (typeof raw !== "object" || raw === null) return null;

  const type = raw.type;
  if (typeof type !== "string" || !VALID_TYPES.has(type as QuizEventType)) {
    return null;
  }

  const attemptId = raw.attemptId;
  const trackingId = raw.trackingId;
  if (
    typeof attemptId !== "string" ||
    !ID_PATTERN.test(attemptId) ||
    typeof trackingId !== "string" ||
    !ID_PATTERN.test(trackingId)
  ) {
    return null;
  }

  const occurredAt = raw.occurredAt;
  if (typeof occurredAt !== "string") return null;
  const occurredAtTime = Date.parse(occurredAt);
  if (!Number.isFinite(occurredAtTime)) return null;

  const event: EventInput = {
    type: type as QuizEventType,
    attemptId,
    trackingId,
    occurredAt: new Date(occurredAtTime).toISOString(),
  };

  if (typeof raw.tier === "string" && VALID_TIERS.has(raw.tier as Tier)) {
    event.tier = raw.tier as Tier;
  }
  if (typeof raw.adaptive === "boolean") {
    event.adaptive = raw.adaptive;
  }
  if (typeof raw.questionId === "number" && Number.isFinite(raw.questionId)) {
    event.questionId = Math.trunc(raw.questionId);
  }
  if (typeof raw.value === "number" && Number.isFinite(raw.value)) {
    const v = Math.trunc(raw.value);
    if (v >= -2 && v <= 2) event.value = v;
  }
  if (typeof raw.cursor === "number" && Number.isFinite(raw.cursor)) {
    event.cursor = Math.trunc(raw.cursor);
  }
  if (
    typeof raw.timeOnQuestionMs === "number" &&
    Number.isFinite(raw.timeOnQuestionMs) &&
    raw.timeOnQuestionMs >= 0
  ) {
    event.timeOnQuestionMs = Math.trunc(raw.timeOnQuestionMs);
  }
  if (typeof raw.meta === "object" && raw.meta !== null && !Array.isArray(raw.meta)) {
    event.meta = raw.meta as Record<string, unknown>;
  }

  return event;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ongeldige JSON." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, error: "Verwachte object met events." },
      { status: 400 },
    );
  }

  const rawEvents = (body as { events?: unknown }).events;
  if (!Array.isArray(rawEvents)) {
    return NextResponse.json(
      { ok: false, error: "Veld 'events' moet een array zijn." },
      { status: 400 },
    );
  }
  if (rawEvents.length === 0) {
    return NextResponse.json({ ok: true, accepted: 0 });
  }
  if (rawEvents.length > MAX_BATCH) {
    return NextResponse.json(
      { ok: false, error: `Batch te groot (max ${MAX_BATCH}).` },
      { status: 413 },
    );
  }

  const parsed: EventInput[] = [];
  for (const raw of rawEvents) {
    const event = parseEvent(raw as RawEvent);
    if (event) parsed.push(event);
  }

  if (parsed.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Geen geldige events." },
      { status: 400 },
    );
  }

  try {
    await appendEvents(parsed);
  } catch (err) {
    console.error("[track] appendEvents failed", err);
    return NextResponse.json(
      { ok: false, error: "Opslaan mislukt." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, accepted: parsed.length });
}
