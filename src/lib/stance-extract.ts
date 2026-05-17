import "server-only";

import { payload } from "@/lib/payload";
import type { DimensionId } from "@/lib/dimensions";
import type { ThemeId } from "@/lib/themes";
import type { StoredAnswer } from "@/lib/results-store";
import type { StanceItem } from "@/components/result/StanceExtract";

interface QuestionDoc {
  id: number;
  statement: string;
  dimension: DimensionId;
  direction: "positive" | "negative";
  weight?: number;
  themes?: ThemeId[];
  derivedStance?: string | null;
}

export async function extractStances(
  answers: StoredAnswer[],
  limit = 6,
): Promise<StanceItem[]> {
  if (answers.length === 0) return [];

  const ids = answers.map((a) => a.questionId).filter((n) => Number.isInteger(n));
  if (ids.length === 0) return [];

  const p = await payload();
  const res = await p.find({
    collection: "questions",
    where: { id: { in: ids } },
    limit: ids.length + 10,
    depth: 0,
    pagination: false,
  });
  const docs = res.docs as unknown as QuestionDoc[];
  const byId = new Map<number, QuestionDoc>();
  for (const d of docs) byId.set(d.id, d);

  const candidates: StanceItem[] = [];
  for (const a of answers) {
    if (a.value === 0 || a.value === null) continue;
    const doc = byId.get(a.questionId);
    if (!doc) continue;
    const direction = doc.direction === "positive" ? 1 : -1;
    const signedValue = direction * a.value;
    const weight = doc.weight ?? 1;
    candidates.push({
      questionId: doc.id,
      statement: doc.statement,
      derivedStance: doc.derivedStance,
      dimension: doc.dimension,
      signedValue,
      value: a.value,
      weight,
      themes: doc.themes,
    });
  }

  candidates.sort((a, b) => {
    const aStrength = Math.abs(a.signedValue) * a.weight;
    const bStrength = Math.abs(b.signedValue) * b.weight;
    if (bStrength !== aStrength) return bStrength - aStrength;
    return Math.abs(b.signedValue) - Math.abs(a.signedValue);
  });

  const seenDims = new Map<string, number>();
  const picked: StanceItem[] = [];
  for (const c of candidates) {
    const seen = seenDims.get(c.dimension) ?? 0;
    if (seen >= 2) continue;
    picked.push(c);
    seenDims.set(c.dimension, seen + 1);
    if (picked.length >= limit) break;
  }
  return picked;
}

export async function getQuestionsByIds(
  ids: ReadonlyArray<number>,
): Promise<Map<number, { id: number; statement: string }>> {
  const map = new Map<number, { id: number; statement: string }>();
  if (ids.length === 0) return map;
  const p = await payload();
  const res = await p.find({
    collection: "questions",
    where: { id: { in: ids as number[] } },
    limit: ids.length + 10,
    depth: 0,
    pagination: false,
  });
  for (const d of res.docs as unknown as Array<{
    id: number;
    statement: string;
  }>) {
    map.set(d.id, { id: d.id, statement: d.statement });
  }
  return map;
}
