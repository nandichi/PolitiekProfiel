import {
  DIMENSION_IDS,
  TIER_PER_DIMENSION,
  TIER_QUESTION_COUNT,
  type DimensionId,
  type Tier,
} from "@/lib/dimensions";
import { THEME_IDS, type ThemeId } from "@/lib/themes";
import type { AnswerValue } from "@/lib/dimensions";

export type QuestionDepth = "broad" | "deep";

export interface AdaptiveQuestion {
  id: number;
  dimension: DimensionId;
  direction: 1 | -1;
  weight: number;
  depth: QuestionDepth;
  discriminator: number;
  themes: ThemeId[];
}

export interface AnswerSnapshot {
  questionId: number;
  value: AnswerValue | null;
}

export interface AdaptiveContext {
  tier: Tier;
  seenIds: number[];
  answers: AnswerSnapshot[];
  pool: AdaptiveQuestion[];
}

const PHASE_THRESHOLDS: Record<Tier, { refine: number; verify: number }> = {
  quick: { refine: 5, verify: 12 },
  standard: { refine: 12, verify: 40 },
  extended: { refine: 16, verify: 64 },
};

export function tierBatchSize(tier: Tier, alreadyAnswered: number): number {
  const total = TIER_QUESTION_COUNT[tier];
  const remaining = Math.max(0, total - alreadyAnswered);
  if (alreadyAnswered === 0) return Math.min(tier === "quick" ? 5 : 10, remaining);
  return Math.min(5, remaining);
}

export function tierIsComplete(tier: Tier, answeredCount: number): boolean {
  return answeredCount >= TIER_QUESTION_COUNT[tier];
}

function dimensionPartialScores(
  ctx: AdaptiveContext,
): Record<DimensionId, { sum: number; weight: number; count: number }> {
  const map = new Map<number, AdaptiveQuestion>();
  for (const q of ctx.pool) map.set(q.id, q);
  const acc: Record<DimensionId, { sum: number; weight: number; count: number }> = {
    economic: { sum: 0, weight: 0, count: 0 },
    social: { sum: 0, weight: 0, count: 0 },
    civil: { sum: 0, weight: 0, count: 0 },
    governance: { sum: 0, weight: 0, count: 0 },
    trust: { sum: 0, weight: 0, count: 0 },
  };
  for (const a of ctx.answers) {
    const q = map.get(a.questionId);
    if (!q || a.value === null) continue;
    acc[q.dimension].sum += q.direction * a.value * q.weight;
    acc[q.dimension].weight += 2 * q.weight;
    acc[q.dimension].count += 1;
  }
  return acc;
}

function themeCoverage(ctx: AdaptiveContext): Record<ThemeId, number> {
  const map = new Map<number, AdaptiveQuestion>();
  for (const q of ctx.pool) map.set(q.id, q);
  const counts: Record<ThemeId, number> = {
    klimaat: 0,
    zorg: 0,
    migratie: 0,
    economie: 0,
    eu: 0,
    democratie: 0,
    wonen: 0,
  };
  for (const a of ctx.answers) {
    const q = map.get(a.questionId);
    if (!q) continue;
    for (const t of q.themes) {
      if (a.value !== null) counts[t] += 1;
    }
  }
  return counts;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  let s = seed >>> 0;
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function hashAnswers(ctx: AdaptiveContext): number {
  let h = 2166136261;
  for (const a of ctx.answers) {
    h ^= a.questionId & 0xffffffff;
    h = Math.imul(h, 16777619);
    h ^= ((a.value ?? 3) + 5) & 0xff;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickInitialBatch(
  ctx: AdaptiveContext,
): AdaptiveQuestion[] {
  const need = tierBatchSize(ctx.tier, 0);
  const broad = ctx.pool.filter(
    (q) => q.depth === "broad" && !ctx.seenIds.includes(q.id),
  );
  const perDim = Math.max(2, Math.floor(need / DIMENSION_IDS.length));

  const grouped = new Map<DimensionId, AdaptiveQuestion[]>();
  for (const q of broad) {
    if (!grouped.has(q.dimension)) grouped.set(q.dimension, []);
    grouped.get(q.dimension)!.push(q);
  }

  const seed = hashAnswers(ctx) ^ Date.now();
  const out: AdaptiveQuestion[] = [];

  for (const dim of DIMENSION_IDS) {
    const candidates = grouped.get(dim) ?? [];
    if (candidates.length === 0) continue;
    const shuffled = seededShuffle(candidates, seed + dim.charCodeAt(0));
    const balanced = balanceDirections(shuffled, perDim);
    out.push(...balanced.slice(0, perDim));
  }

  return interleaveByDimension(out).slice(0, need);
}

function balanceDirections(
  candidates: AdaptiveQuestion[],
  count: number,
): AdaptiveQuestion[] {
  const positives = candidates.filter((c) => c.direction === 1);
  const negatives = candidates.filter((c) => c.direction === -1);
  const out: AdaptiveQuestion[] = [];
  const halfPos = Math.ceil(count / 2);
  const halfNeg = count - halfPos;
  out.push(...positives.slice(0, halfPos));
  out.push(...negatives.slice(0, halfNeg));
  if (out.length < count) {
    const rest = candidates.filter((c) => !out.includes(c));
    out.push(...rest.slice(0, count - out.length));
  }
  return out;
}

function interleaveByDimension(qs: AdaptiveQuestion[]): AdaptiveQuestion[] {
  const groups = new Map<DimensionId, AdaptiveQuestion[]>();
  for (const q of qs) {
    if (!groups.has(q.dimension)) groups.set(q.dimension, []);
    groups.get(q.dimension)!.push(q);
  }
  const max = Math.max(0, ...Array.from(groups.values()).map((g) => g.length));
  const out: AdaptiveQuestion[] = [];
  for (let i = 0; i < max; i++) {
    for (const dim of DIMENSION_IDS) {
      const g = groups.get(dim);
      if (g && g[i]) out.push(g[i]);
    }
  }
  return out;
}

export function pickNextBatch(ctx: AdaptiveContext): AdaptiveQuestion[] {
  const answered = ctx.answers.filter((a) => a !== null).length;
  if (tierIsComplete(ctx.tier, answered)) return [];

  const need = tierBatchSize(ctx.tier, answered);
  if (need === 0) return [];

  const available = ctx.pool.filter((q) => !ctx.seenIds.includes(q.id));
  if (available.length === 0) return [];

  const thresholds = PHASE_THRESHOLDS[ctx.tier];
  let phase: "refine" | "verify" | "balance";
  if (answered < thresholds.refine) phase = "balance";
  else if (answered < thresholds.verify) phase = "refine";
  else phase = "verify";

  const dimAcc = dimensionPartialScores(ctx);
  const dimRanks = DIMENSION_IDS.map((d) => {
    const ent = dimAcc[d];
    const avgWeight = ent.weight === 0 ? 0 : ent.sum / ent.weight;
    const certainty = Math.abs(avgWeight);
    const coverage = ent.count;
    return {
      dim: d,
      certainty,
      coverage,
      need: Math.max(
        0,
        TIER_PER_DIMENSION[ctx.tier] / TIER_QUESTION_COUNT[ctx.tier] * answered -
          coverage,
      ),
    };
  }).sort((a, b) => {
    if (phase === "refine") return a.certainty - b.certainty;
    if (phase === "verify") return b.certainty - a.certainty;
    return b.need - a.need;
  });

  const themesCount = themeCoverage(ctx);
  const themesByCoverage = [...THEME_IDS].sort(
    (a, b) => themesCount[a] - themesCount[b],
  );

  const scored = available.map((q) => {
    let score = q.discriminator;
    const dimIndex = dimRanks.findIndex((r) => r.dim === q.dimension);
    score += Math.max(0, 50 - dimIndex * 8);
    for (const t of q.themes) {
      const ti = themesByCoverage.indexOf(t);
      if (ti !== -1) score += Math.max(0, 20 - ti * 3);
    }
    if (phase === "refine" && q.depth === "deep") score += 15;
    if (phase === "balance" && q.depth === "broad") score += 15;
    if (phase === "verify" && q.depth === "deep") score += 10;
    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const picked: AdaptiveQuestion[] = [];
  const dimCount: Record<DimensionId, number> = {
    economic: 0,
    social: 0,
    civil: 0,
    governance: 0,
    trust: 0,
  };
  for (const cand of scored) {
    if (picked.length >= need) break;
    if (dimCount[cand.q.dimension] >= Math.ceil(need / 2)) continue;
    picked.push(cand.q);
    dimCount[cand.q.dimension] += 1;
  }

  if (picked.length < need) {
    for (const cand of scored) {
      if (picked.length >= need) break;
      if (picked.includes(cand.q)) continue;
      picked.push(cand.q);
    }
  }

  return interleaveByDimension(picked);
}
