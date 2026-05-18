import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { firestore } from "@/lib/firebase-admin";
import { payload } from "@/lib/payload";
import { markSubmitted as markAttemptSubmitted } from "@/lib/tracking-store";
import type { DimensionScores } from "@/lib/scoring";
import type { Tier } from "@/lib/dimensions";
import type { ThemeScores } from "@/lib/themes";
import type { DimensionConfidence } from "@/lib/confidence";

export interface StoredParadox {
  dimension?: string;
  theme?: string;
  type: string;
  severity: number;
  description?: string;
  exampleQuestionIds?: number[];
}

export interface StoredAnswer {
  questionId: number;
  value: number;
}

export interface StoredResult {
  shareId: string;
  tier: Tier;
  ideologySlug: string;
  dimensions: DimensionScores;
  themeScores?: ThemeScores;
  confidence?: DimensionConfidence;
  paradoxes?: StoredParadox[];
  answers?: StoredAnswer[];
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
  createdAt: string;
  attemptId?: string;
}

const FIRESTORE_COLLECTION = "results";

function useFirestore(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

/**
 * Bouwt een nieuw object dat alleen properties met een gedefinieerde waarde
 * bevat. Firestore weigert `undefined` als waarde, dus elk veld dat optioneel
 * is op TypeScript-niveau (bv. `paradox.dimension`, `paradox.theme`) moet hier
 * langs voordat het naar Firestore gaat.
 */
function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

export async function createResult(input: {
  tier: Tier;
  ideologySlug: string;
  dimensions: DimensionScores;
  themeScores?: ThemeScores;
  confidence?: DimensionConfidence;
  paradoxes?: StoredParadox[];
  answers?: StoredAnswer[];
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
  attemptId?: string;
}): Promise<StoredResult> {
  const shareId = nanoid(12);
  const createdAt = new Date().toISOString();

  const record: StoredResult = {
    shareId,
    tier: input.tier,
    ideologySlug: input.ideologySlug,
    dimensions: input.dimensions,
    themeScores: input.themeScores,
    confidence: input.confidence,
    paradoxes: input.paradoxes,
    answers: input.answers,
    answeredCount: input.answeredCount,
    skippedCount: input.skippedCount,
    totalQuestions: input.totalQuestions,
    createdAt,
    attemptId: input.attemptId,
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (useFirestore()) {
    const db = firestore();
    // Sanitiseer alle undefined velden weg vóór de write. Paradox-objecten
    // kunnen optionele `dimension`/`theme`/`description` velden hebben die
    // afhankelijk van het paradox-type leeg blijven; Firestore zou de hele
    // write afwijzen als die als undefined binnenkomen.
    const cleanedParadoxes = (input.paradoxes ?? []).map((px) =>
      omitUndefined({
        dimension: px.dimension,
        theme: px.theme,
        type: px.type,
        severity: px.severity,
        description: px.description,
        exampleQuestionIds: px.exampleQuestionIds,
      }) as StoredParadox,
    );
    const payloadForFirestore = omitUndefined({
      ...record,
      paradoxes: cleanedParadoxes.length > 0 ? cleanedParadoxes : undefined,
      createdAt: Timestamp.fromDate(new Date(createdAt)),
    });
    await db
      .collection(FIRESTORE_COLLECTION)
      .doc(shareId)
      .set(payloadForFirestore);
  } else {
    const p = await payload();
    const paradoxesForPayload = (input.paradoxes ?? []).map((px) => ({
      dimension: px.dimension,
      theme: px.theme,
      type: px.type,
      severity: px.severity,
      description: px.description,
      exampleQuestionIds: (px.exampleQuestionIds ?? []).map((qid) => ({
        questionId: qid,
      })),
    }));
    await p.create({
      collection: "results",
      data: {
        shareId,
        attemptId: input.attemptId,
        lengthTier: input.tier,
        ideologySlug: input.ideologySlug,
        dimensions: input.dimensions,
        themeScores: input.themeScores,
        confidence: input.confidence,
        paradoxes: paradoxesForPayload,
        answers: input.answers,
        answeredCount: input.answeredCount,
        skippedCount: input.skippedCount,
        totalQuestions: input.totalQuestions,
      },
    });
  }

  if (input.attemptId) {
    try {
      await markAttemptSubmitted(input.attemptId, shareId);
    } catch (err) {
      console.error("[results] markAttemptSubmitted failed", err);
    }
  }

  return record;
}

export async function getResult(shareId: string): Promise<StoredResult | null> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (useFirestore()) {
    const db = firestore();
    const snap = await db.collection(FIRESTORE_COLLECTION).doc(shareId).get();
    if (!snap.exists) return null;
    const data = snap.data() as Record<string, unknown>;
    const created = data?.createdAt;
    const createdAtIso =
      created instanceof Timestamp ? created.toDate().toISOString() : String(created);
    return {
      shareId,
      tier: data.tier as Tier,
      ideologySlug: String(data.ideologySlug),
      dimensions: data.dimensions as DimensionScores,
      themeScores: data.themeScores as ThemeScores | undefined,
      confidence: data.confidence as DimensionConfidence | undefined,
      paradoxes: Array.isArray(data.paradoxes)
        ? (data.paradoxes as StoredParadox[])
        : undefined,
      answers: Array.isArray(data.answers)
        ? (data.answers as StoredAnswer[])
        : undefined,
      answeredCount: Number(data.answeredCount ?? 0),
      skippedCount: Number(data.skippedCount ?? 0),
      totalQuestions: Number(data.totalQuestions ?? 0),
      createdAt: createdAtIso,
    };
  }

  const p = await payload();
  const res = await p.find({
    collection: "results",
    where: { shareId: { equals: shareId } },
    limit: 1,
    depth: 0,
  });
  if (res.docs.length === 0) return null;
  const doc = res.docs[0] as unknown as {
    shareId: string;
    lengthTier: Tier;
    ideologySlug: string;
    dimensions: DimensionScores;
    themeScores?: Partial<ThemeScores>;
    confidence?: Partial<DimensionConfidence>;
    paradoxes?: Array<{
      dimension?: string;
      theme?: string;
      type: string;
      severity: number;
      description?: string;
      exampleQuestionIds?: Array<{ questionId: number }>;
    }>;
    answers?: StoredAnswer[];
    answeredCount: number;
    skippedCount: number;
    totalQuestions: number;
    createdAt: string;
  };
  return {
    shareId: doc.shareId,
    tier: doc.lengthTier,
    ideologySlug: doc.ideologySlug,
    dimensions: doc.dimensions,
    themeScores: doc.themeScores
      ? (doc.themeScores as ThemeScores)
      : undefined,
    confidence: doc.confidence
      ? (doc.confidence as DimensionConfidence)
      : undefined,
    paradoxes: doc.paradoxes?.map((px) => ({
      dimension: px.dimension,
      theme: px.theme,
      type: px.type,
      severity: px.severity,
      description: px.description,
      exampleQuestionIds: (px.exampleQuestionIds ?? []).map((e) => e.questionId),
    })),
    answers: doc.answers,
    answeredCount: doc.answeredCount,
    skippedCount: doc.skippedCount,
    totalQuestions: doc.totalQuestions,
    createdAt: doc.createdAt,
  };
}
