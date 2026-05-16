import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { firestore } from "@/lib/firebase-admin";
import { payload } from "@/lib/payload";
import type { DimensionScores } from "@/lib/scoring";
import type { Tier } from "@/lib/dimensions";

export interface StoredResult {
  shareId: string;
  tier: Tier;
  ideologySlug: string;
  dimensions: DimensionScores;
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
  createdAt: string;
}

const FIRESTORE_COLLECTION = "results";

function useFirestore(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export async function createResult(input: {
  tier: Tier;
  ideologySlug: string;
  dimensions: DimensionScores;
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
}): Promise<StoredResult> {
  const shareId = nanoid(12);
  const createdAt = new Date().toISOString();

  const record: StoredResult = {
    shareId,
    tier: input.tier,
    ideologySlug: input.ideologySlug,
    dimensions: input.dimensions,
    answeredCount: input.answeredCount,
    skippedCount: input.skippedCount,
    totalQuestions: input.totalQuestions,
    createdAt,
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (useFirestore()) {
    const db = firestore();
    await db
      .collection(FIRESTORE_COLLECTION)
      .doc(shareId)
      .set({
        ...record,
        createdAt: Timestamp.fromDate(new Date(createdAt)),
      });
  } else {
    const p = await payload();
    await p.create({
      collection: "results",
      data: {
        shareId,
        lengthTier: input.tier,
        ideologySlug: input.ideologySlug,
        dimensions: input.dimensions,
        answeredCount: input.answeredCount,
        skippedCount: input.skippedCount,
        totalQuestions: input.totalQuestions,
      },
    });
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
    answeredCount: doc.answeredCount,
    skippedCount: doc.skippedCount,
    totalQuestions: doc.totalQuestions,
    createdAt: doc.createdAt,
  };
}
