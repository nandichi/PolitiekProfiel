import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "@/lib/firebase-admin";

/**
 * Hartslag van de wekelijkse TK-stemgedrag-refresh.
 *
 * De cron zelf is alleen met CRON_SECRET aan te roepen, en Vercel bewaart
 * runtime-logs op het gratis plan maar kort. Daarom schrijft de cron na elke
 * run een stempel weg die publiek te lezen is via /api/health/tk-voting, zodat
 * je in één request ziet of de pipeline nog loopt en wanneer voor het laatst.
 */

const COLLECTION = "meta";
const DOC_ID = "tk_voting_refresh";

export interface TkVotingHeartbeat {
  lastRunAt: string | null;
  stemmingen: number | null;
  ok: boolean | null;
  errors: string[] | null;
}

let memory: TkVotingHeartbeat = {
  lastRunAt: null,
  stemmingen: null,
  ok: null,
  errors: null,
};

function hasFirestoreConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export async function recordTkVotingRun(input: {
  stemmingen: number;
  errors: string[];
}): Promise<void> {
  const errors = input.errors.slice(0, 5);
  memory = {
    lastRunAt: new Date().toISOString(),
    stemmingen: input.stemmingen,
    ok: errors.length === 0,
    errors,
  };

  if (!hasFirestoreConfig()) return;

  await firestore()
    .collection(COLLECTION)
    .doc(DOC_ID)
    .set(
      {
        lastRunAt: Timestamp.now(),
        stemmingen: input.stemmingen,
        ok: errors.length === 0,
        errors,
      },
      { merge: true },
    );
}

export async function readTkVotingHeartbeat(): Promise<TkVotingHeartbeat> {
  if (!hasFirestoreConfig()) return memory;

  const snap = await firestore().collection(COLLECTION).doc(DOC_ID).get();
  if (!snap.exists) {
    return { lastRunAt: null, stemmingen: null, ok: null, errors: null };
  }

  const data = snap.data() as {
    lastRunAt?: unknown;
    stemmingen?: number;
    ok?: boolean;
    errors?: string[];
  };
  const last = data.lastRunAt;
  return {
    lastRunAt:
      last instanceof Timestamp
        ? last.toDate().toISOString()
        : last
          ? String(last)
          : null,
    stemmingen: typeof data.stemmingen === "number" ? data.stemmingen : null,
    ok: typeof data.ok === "boolean" ? data.ok : null,
    errors: Array.isArray(data.errors) ? data.errors : null,
  };
}
