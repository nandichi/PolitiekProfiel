import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "@/lib/firebase-admin";
import { payload } from "@/lib/payload";
import type { QuizEventType } from "@/lib/tracking-store";
import type { Tier } from "@/lib/dimensions";

export interface QueryFilters {
  from?: Date;
  to?: Date;
  tier?: Tier;
  adaptive?: boolean;
  ideology?: string;
}

export interface KpiSummary {
  starts: number;
  completes: number;
  abandoned: number;
  completionRate: number;
  uniqueVisitors: number;
  avgDurationMs: number;
}

export interface TimeSeriesPoint {
  date: string;
  starts: number;
  completes: number;
}

export interface FunnelPoint {
  label: string;
  value: number;
}

export interface QuestionStat {
  questionId: number;
  views: number;
  answered: number;
  skipped: number;
  dropoffPct: number;
  avgTimeMs: number;
  valueCounts: Record<string, number>;
}

export interface IdeologyCount {
  ideologySlug: string;
  count: number;
}

export interface TierCount {
  tier: string;
  count: number;
}

export interface ParadoxCount {
  type: string;
  count: number;
  avgSeverity: number;
}

export interface AttemptSummary {
  attemptId: string;
  trackingId: string;
  tier: string;
  adaptive: boolean;
  startedAt: string;
  completedAt?: string;
  submitted: boolean;
  abandoned: boolean;
  shareId?: string;
  questionsSeen: number;
  questionsAnswered: number;
  questionsSkipped: number;
  durationMs?: number;
}

export interface DashboardData {
  kpi: KpiSummary;
  timeSeries: TimeSeriesPoint[];
  funnel: FunnelPoint[];
  questions: QuestionStat[];
  ideologies: IdeologyCount[];
  tiers: TierCount[];
  paradoxes: ParadoxCount[];
  recentAttempts: AttemptSummary[];
  dataSource: "firestore" | "postgres";
  totalsEstimated: boolean;
}

export interface RawEvent {
  type: QuizEventType;
  attemptId: string;
  trackingId: string;
  tier?: string;
  adaptive?: boolean;
  questionId?: number;
  value?: number;
  cursor?: number;
  timeOnQuestionMs?: number;
  occurredAt: string;
  meta?: Record<string, unknown>;
}

const MAX_EVENTS = 20000;
const MAX_ATTEMPTS_FOR_KPI = 10000;
const MAX_RESULTS_FOR_AGG = 10000;
const RECENT_ATTEMPTS_LIMIT = 25;

function useFirestore(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date(0).toISOString();
}

function valueBucket(value: number): string {
  if (value <= -2) return "strong-negative";
  if (value < 0) return "mild-negative";
  if (value === 0) return "neutral";
  if (value < 2) return "mild-positive";
  return "strong-positive";
}

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function buildTimeSeries(
  attempts: AttemptSummary[],
  from: Date,
  to: Date,
): TimeSeriesPoint[] {
  const map = new Map<string, TimeSeriesPoint>();
  const cur = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  );
  const end = new Date(
    Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()),
  );
  while (cur.getTime() <= end.getTime()) {
    const key = cur.toISOString().slice(0, 10);
    map.set(key, { date: key, starts: 0, completes: 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  for (const a of attempts) {
    const startKey = dateKey(a.startedAt);
    const point = map.get(startKey);
    if (point) point.starts += 1;
    if (a.submitted && a.completedAt) {
      const completeKey = dateKey(a.completedAt);
      const completePoint = map.get(completeKey);
      if (completePoint) completePoint.completes += 1;
    }
  }
  return Array.from(map.values());
}

function buildKpi(attempts: AttemptSummary[]): KpiSummary {
  let completes = 0;
  let abandoned = 0;
  let durSum = 0;
  let durCount = 0;
  const visitors = new Set<string>();
  for (const a of attempts) {
    if (a.submitted) completes += 1;
    if (a.abandoned) abandoned += 1;
    visitors.add(a.trackingId);
    if (typeof a.durationMs === "number" && a.durationMs > 0 && a.submitted) {
      durSum += a.durationMs;
      durCount += 1;
    }
  }
  const starts = attempts.length;
  return {
    starts,
    completes,
    abandoned,
    completionRate: starts > 0 ? completes / starts : 0,
    uniqueVisitors: visitors.size,
    avgDurationMs: durCount > 0 ? durSum / durCount : 0,
  };
}

function buildFunnel(
  attempts: AttemptSummary[],
  questions: QuestionStat[],
): FunnelPoint[] {
  const starts = attempts.length;
  const sawAny = attempts.filter((a) => a.questionsSeen >= 1).length;
  const answeredFive = attempts.filter((a) => a.questionsAnswered >= 5).length;
  const halfway = attempts.filter((a) => a.questionsAnswered >= 15).length;
  const submitted = attempts.filter((a) => a.submitted).length;
  void questions;
  return [
    { label: "Quiz gestart", value: starts },
    { label: "Eerste vraag bekeken", value: sawAny },
    { label: "5+ vragen beantwoord", value: answeredFive },
    { label: "15+ vragen beantwoord", value: halfway },
    { label: "Profiel ingediend", value: submitted },
  ];
}

function buildQuestionStats(events: RawEvent[]): QuestionStat[] {
  const map = new Map<number, QuestionStat>();
  for (const e of events) {
    if (e.questionId === undefined) continue;
    let stat = map.get(e.questionId);
    if (!stat) {
      stat = {
        questionId: e.questionId,
        views: 0,
        answered: 0,
        skipped: 0,
        dropoffPct: 0,
        avgTimeMs: 0,
        valueCounts: {},
      };
      map.set(e.questionId, stat);
    }
    if (e.type === "question-viewed") {
      stat.views += 1;
    } else if (e.type === "question-answered") {
      stat.answered += 1;
      if (typeof e.value === "number") {
        const bucket = valueBucket(e.value);
        stat.valueCounts[bucket] = (stat.valueCounts[bucket] ?? 0) + 1;
      }
      if (typeof e.timeOnQuestionMs === "number" && e.timeOnQuestionMs > 0) {
        const prevAvg = stat.avgTimeMs;
        const newCount = stat.answered;
        stat.avgTimeMs =
          prevAvg + (e.timeOnQuestionMs - prevAvg) / Math.max(1, newCount);
      }
    } else if (e.type === "question-skipped") {
      stat.skipped += 1;
      stat.valueCounts.skipped = (stat.valueCounts.skipped ?? 0) + 1;
    }
  }
  for (const stat of map.values()) {
    if (stat.views > 0) {
      stat.dropoffPct = Math.max(
        0,
        1 - (stat.answered + stat.skipped) / stat.views,
      );
    }
  }
  return Array.from(map.values()).sort((a, b) => b.views - a.views);
}

function defaultRange(filters: QueryFilters): { from: Date; to: Date } {
  const to = filters.to ?? new Date();
  const from =
    filters.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

interface RawAttempt {
  attemptId: string;
  trackingId: string;
  tier: string;
  adaptive: boolean;
  startedAt: string;
  completedAt?: string;
  lastEventAt?: string;
  submitted: boolean;
  abandoned: boolean;
  shareId?: string;
  questionsSeen: number;
  questionsAnswered: number;
  questionsSkipped: number;
  questionsBack: number;
  infoOpenedCount: number;
  durationMs?: number;
}

function toAttemptSummary(a: RawAttempt): AttemptSummary {
  return {
    attemptId: a.attemptId,
    trackingId: a.trackingId,
    tier: a.tier,
    adaptive: a.adaptive,
    startedAt: a.startedAt,
    completedAt: a.completedAt,
    submitted: a.submitted,
    abandoned: a.abandoned,
    shareId: a.shareId,
    questionsSeen: a.questionsSeen,
    questionsAnswered: a.questionsAnswered,
    questionsSkipped: a.questionsSkipped,
    durationMs: a.durationMs,
  };
}

async function fetchPostgresAttempts(
  from: Date,
  to: Date,
  filters: QueryFilters,
): Promise<RawAttempt[]> {
  const p = await payload();
  const where: Record<string, unknown> = {
    startedAt: { greater_than_equal: from.toISOString(), less_than_equal: to.toISOString() },
  };
  if (filters.tier) where.tier = { equals: filters.tier };
  if (typeof filters.adaptive === "boolean")
    where.adaptive = { equals: filters.adaptive };

  const docs: RawAttempt[] = [];
  let page = 1;
  const limit = 500;
  for (;;) {
    const res = await p.find({
      collection: "quiz-attempts",
      where,
      sort: "-startedAt",
      limit,
      page,
      depth: 0,
    });
    for (const doc of res.docs as unknown as RawAttempt[]) {
      docs.push(doc);
      if (docs.length >= MAX_ATTEMPTS_FOR_KPI) break;
    }
    if (docs.length >= MAX_ATTEMPTS_FOR_KPI) break;
    if (!res.hasNextPage) break;
    page += 1;
  }
  return docs;
}

async function fetchPostgresEvents(
  from: Date,
  to: Date,
  filters: QueryFilters,
): Promise<RawEvent[]> {
  const p = await payload();
  const where: Record<string, unknown> = {
    occurredAt: { greater_than_equal: from.toISOString(), less_than_equal: to.toISOString() },
    type: {
      in: ["question-viewed", "question-answered", "question-skipped"],
    },
  };
  if (filters.tier) where.tier = { equals: filters.tier };
  const events: RawEvent[] = [];
  let page = 1;
  const limit = 1000;
  for (;;) {
    const res = await p.find({
      collection: "quiz-events",
      where,
      sort: "occurredAt",
      limit,
      page,
      depth: 0,
    });
    for (const doc of res.docs as unknown as RawEvent[]) {
      events.push(doc);
      if (events.length >= MAX_EVENTS) break;
    }
    if (events.length >= MAX_EVENTS) break;
    if (!res.hasNextPage) break;
    page += 1;
  }
  return events;
}

async function fetchPostgresResults(
  from: Date,
  to: Date,
  filters: QueryFilters,
): Promise<{
  ideologies: IdeologyCount[];
  tiers: TierCount[];
  paradoxes: ParadoxCount[];
}> {
  const p = await payload();
  const where: Record<string, unknown> = {
    createdAt: { greater_than_equal: from.toISOString(), less_than_equal: to.toISOString() },
  };
  if (filters.tier) where.lengthTier = { equals: filters.tier };
  if (filters.ideology) where.ideologySlug = { equals: filters.ideology };

  const ideologyMap = new Map<string, number>();
  const tierMap = new Map<string, number>();
  const paradoxMap = new Map<string, { count: number; sevSum: number }>();
  let page = 1;
  const limit = 500;
  let total = 0;
  for (;;) {
    const res = await p.find({
      collection: "results",
      where,
      sort: "-createdAt",
      limit,
      page,
      depth: 0,
    });
    for (const doc of res.docs as unknown as Array<{
      ideologySlug: string;
      lengthTier: string;
      paradoxes?: Array<{ type: string; severity: number }>;
    }>) {
      ideologyMap.set(
        doc.ideologySlug,
        (ideologyMap.get(doc.ideologySlug) ?? 0) + 1,
      );
      tierMap.set(doc.lengthTier, (tierMap.get(doc.lengthTier) ?? 0) + 1);
      for (const px of doc.paradoxes ?? []) {
        const entry = paradoxMap.get(px.type) ?? { count: 0, sevSum: 0 };
        entry.count += 1;
        entry.sevSum += px.severity;
        paradoxMap.set(px.type, entry);
      }
      total += 1;
      if (total >= MAX_RESULTS_FOR_AGG) break;
    }
    if (total >= MAX_RESULTS_FOR_AGG) break;
    if (!res.hasNextPage) break;
    page += 1;
  }

  return {
    ideologies: Array.from(ideologyMap.entries())
      .map(([ideologySlug, count]) => ({ ideologySlug, count }))
      .sort((a, b) => b.count - a.count),
    tiers: Array.from(tierMap.entries())
      .map(([tier, count]) => ({ tier, count }))
      .sort((a, b) => b.count - a.count),
    paradoxes: Array.from(paradoxMap.entries())
      .map(([type, v]) => ({
        type,
        count: v.count,
        avgSeverity: v.count > 0 ? v.sevSum / v.count : 0,
      }))
      .sort((a, b) => b.count - a.count),
  };
}

async function getDashboardDataPostgres(
  filters: QueryFilters,
): Promise<DashboardData> {
  const { from, to } = defaultRange(filters);
  const [attemptsRaw, events, results] = await Promise.all([
    fetchPostgresAttempts(from, to, filters),
    fetchPostgresEvents(from, to, filters),
    fetchPostgresResults(from, to, filters),
  ]);
  const attempts = attemptsRaw.map(toAttemptSummary);
  const questions = buildQuestionStats(events);
  const kpi = buildKpi(attempts);
  const timeSeries = buildTimeSeries(attempts, from, to);
  const funnel = buildFunnel(attempts, questions);
  const recentAttempts = attempts.slice(0, RECENT_ATTEMPTS_LIMIT);
  return {
    kpi,
    timeSeries,
    funnel,
    questions,
    ideologies: results.ideologies,
    tiers: results.tiers,
    paradoxes: results.paradoxes,
    recentAttempts,
    dataSource: "postgres",
    totalsEstimated:
      attemptsRaw.length >= MAX_ATTEMPTS_FOR_KPI ||
      events.length >= MAX_EVENTS,
  };
}

function rawAttemptFromFirestore(doc: Record<string, unknown>): RawAttempt {
  return {
    attemptId: String(doc.attemptId ?? ""),
    trackingId: String(doc.trackingId ?? ""),
    tier: String(doc.tier ?? ""),
    adaptive: Boolean(doc.adaptive),
    startedAt: toIso(doc.startedAt),
    completedAt: doc.completedAt ? toIso(doc.completedAt) : undefined,
    lastEventAt: doc.lastEventAt ? toIso(doc.lastEventAt) : undefined,
    submitted: Boolean(doc.submitted),
    abandoned: Boolean(doc.abandoned),
    shareId: typeof doc.shareId === "string" ? doc.shareId : undefined,
    questionsSeen: Number(doc.questionsSeen ?? 0),
    questionsAnswered: Number(doc.questionsAnswered ?? 0),
    questionsSkipped: Number(doc.questionsSkipped ?? 0),
    questionsBack: Number(doc.questionsBack ?? 0),
    infoOpenedCount: Number(doc.infoOpenedCount ?? 0),
    durationMs:
      typeof doc.durationMs === "number" ? doc.durationMs : undefined,
  };
}

function rawEventFromFirestore(doc: Record<string, unknown>): RawEvent {
  return {
    type: String(doc.type) as QuizEventType,
    attemptId: String(doc.attemptId ?? ""),
    trackingId: String(doc.trackingId ?? ""),
    tier: typeof doc.tier === "string" ? doc.tier : undefined,
    adaptive: typeof doc.adaptive === "boolean" ? doc.adaptive : undefined,
    questionId:
      typeof doc.questionId === "number" ? doc.questionId : undefined,
    value: typeof doc.value === "number" ? doc.value : undefined,
    cursor: typeof doc.cursor === "number" ? doc.cursor : undefined,
    timeOnQuestionMs:
      typeof doc.timeOnQuestionMs === "number"
        ? doc.timeOnQuestionMs
        : undefined,
    occurredAt: toIso(doc.occurredAt),
    meta:
      typeof doc.meta === "object" && doc.meta !== null
        ? (doc.meta as Record<string, unknown>)
        : undefined,
  };
}

async function getDashboardDataFirestore(
  filters: QueryFilters,
): Promise<DashboardData> {
  const { from, to } = defaultRange(filters);
  const db = firestore();

  let attemptsQuery = db
    .collection("quiz-attempts")
    .where("startedAt", ">=", Timestamp.fromDate(from))
    .where("startedAt", "<=", Timestamp.fromDate(to))
    .orderBy("startedAt", "desc")
    .limit(MAX_ATTEMPTS_FOR_KPI);
  if (filters.tier) {
    attemptsQuery = attemptsQuery.where("tier", "==", filters.tier);
  }
  if (typeof filters.adaptive === "boolean") {
    attemptsQuery = attemptsQuery.where("adaptive", "==", filters.adaptive);
  }
  const attemptsSnap = await attemptsQuery.get();
  const attemptsRaw: RawAttempt[] = attemptsSnap.docs.map((d) =>
    rawAttemptFromFirestore(d.data()),
  );

  let eventsQuery = db
    .collection("quiz-events")
    .where("occurredAt", ">=", Timestamp.fromDate(from))
    .where("occurredAt", "<=", Timestamp.fromDate(to))
    .where("type", "in", [
      "question-viewed",
      "question-answered",
      "question-skipped",
    ])
    .orderBy("occurredAt", "asc")
    .limit(MAX_EVENTS);
  if (filters.tier) {
    eventsQuery = eventsQuery.where("tier", "==", filters.tier);
  }
  const eventsSnap = await eventsQuery.get();
  const events: RawEvent[] = eventsSnap.docs.map((d) =>
    rawEventFromFirestore(d.data()),
  );

  let resultsQuery = db
    .collection("results")
    .where("createdAt", ">=", Timestamp.fromDate(from))
    .where("createdAt", "<=", Timestamp.fromDate(to))
    .orderBy("createdAt", "desc")
    .limit(MAX_RESULTS_FOR_AGG);
  if (filters.tier) {
    resultsQuery = resultsQuery.where("tier", "==", filters.tier);
  }
  if (filters.ideology) {
    resultsQuery = resultsQuery.where("ideologySlug", "==", filters.ideology);
  }
  const resultsSnap = await resultsQuery.get();

  const ideologyMap = new Map<string, number>();
  const tierMap = new Map<string, number>();
  const paradoxMap = new Map<string, { count: number; sevSum: number }>();
  for (const docSnap of resultsSnap.docs) {
    const data = docSnap.data() as {
      ideologySlug?: string;
      tier?: string;
      paradoxes?: Array<{ type?: string; severity?: number }>;
    };
    if (data.ideologySlug) {
      ideologyMap.set(
        data.ideologySlug,
        (ideologyMap.get(data.ideologySlug) ?? 0) + 1,
      );
    }
    if (data.tier) {
      tierMap.set(data.tier, (tierMap.get(data.tier) ?? 0) + 1);
    }
    for (const px of data.paradoxes ?? []) {
      if (!px.type) continue;
      const entry = paradoxMap.get(px.type) ?? { count: 0, sevSum: 0 };
      entry.count += 1;
      entry.sevSum += px.severity ?? 0;
      paradoxMap.set(px.type, entry);
    }
  }

  const attempts = attemptsRaw.map(toAttemptSummary);
  const questions = buildQuestionStats(events);
  const kpi = buildKpi(attempts);
  const timeSeries = buildTimeSeries(attempts, from, to);
  const funnel = buildFunnel(attempts, questions);
  const recentAttempts = attempts.slice(0, RECENT_ATTEMPTS_LIMIT);

  return {
    kpi,
    timeSeries,
    funnel,
    questions,
    ideologies: Array.from(ideologyMap.entries())
      .map(([ideologySlug, count]) => ({ ideologySlug, count }))
      .sort((a, b) => b.count - a.count),
    tiers: Array.from(tierMap.entries())
      .map(([tier, count]) => ({ tier, count }))
      .sort((a, b) => b.count - a.count),
    paradoxes: Array.from(paradoxMap.entries())
      .map(([type, v]) => ({
        type,
        count: v.count,
        avgSeverity: v.count > 0 ? v.sevSum / v.count : 0,
      }))
      .sort((a, b) => b.count - a.count),
    recentAttempts,
    dataSource: "firestore",
    totalsEstimated:
      attemptsRaw.length >= MAX_ATTEMPTS_FOR_KPI ||
      events.length >= MAX_EVENTS,
  };
}

export async function getDashboardData(
  filters: QueryFilters,
): Promise<DashboardData> {
  if (useFirestore()) {
    return getDashboardDataFirestore(filters);
  }
  return getDashboardDataPostgres(filters);
}

export async function getAttemptDetail(attemptId: string): Promise<{
  attempt: RawAttempt | null;
  events: RawEvent[];
  shareId?: string;
}> {
  if (useFirestore()) {
    const db = firestore();
    const attemptSnap = await db
      .collection("quiz-attempts")
      .doc(attemptId)
      .get();
    if (!attemptSnap.exists) {
      return { attempt: null, events: [] };
    }
    const attempt = rawAttemptFromFirestore(attemptSnap.data() ?? {});
    const eventsSnap = await db
      .collection("quiz-events")
      .where("attemptId", "==", attemptId)
      .orderBy("occurredAt", "asc")
      .limit(2000)
      .get();
    const events = eventsSnap.docs.map((d) =>
      rawEventFromFirestore(d.data()),
    );
    return { attempt, events, shareId: attempt.shareId };
  }

  const p = await payload();
  const res = await p.find({
    collection: "quiz-attempts",
    where: { attemptId: { equals: attemptId } },
    limit: 1,
    depth: 0,
  });
  if (res.docs.length === 0) {
    return { attempt: null, events: [] };
  }
  const attempt = res.docs[0] as unknown as RawAttempt;
  const evRes = await p.find({
    collection: "quiz-events",
    where: { attemptId: { equals: attemptId } },
    sort: "occurredAt",
    limit: 2000,
    depth: 0,
  });
  const events = evRes.docs as unknown as RawEvent[];
  return { attempt, events, shareId: attempt.shareId };
}

export async function getVisitorDetail(trackingId: string): Promise<{
  attempts: AttemptSummary[];
}> {
  if (useFirestore()) {
    const db = firestore();
    const snap = await db
      .collection("quiz-attempts")
      .where("trackingId", "==", trackingId)
      .orderBy("startedAt", "desc")
      .limit(100)
      .get();
    const attempts = snap.docs.map((d) =>
      toAttemptSummary(rawAttemptFromFirestore(d.data())),
    );
    return { attempts };
  }
  const p = await payload();
  const res = await p.find({
    collection: "quiz-attempts",
    where: { trackingId: { equals: trackingId } },
    sort: "-startedAt",
    limit: 100,
    depth: 0,
  });
  const attempts = (res.docs as unknown as RawAttempt[]).map(toAttemptSummary);
  return { attempts };
}

export async function getQuestionDetail(questionId: number): Promise<{
  events: RawEvent[];
}> {
  if (useFirestore()) {
    const db = firestore();
    const snap = await db
      .collection("quiz-events")
      .where("questionId", "==", questionId)
      .orderBy("occurredAt", "desc")
      .limit(5000)
      .get();
    return { events: snap.docs.map((d) => rawEventFromFirestore(d.data())) };
  }
  const p = await payload();
  const res = await p.find({
    collection: "quiz-events",
    where: { questionId: { equals: questionId } },
    sort: "-occurredAt",
    limit: 5000,
    depth: 0,
  });
  return { events: res.docs as unknown as RawEvent[] };
}
