import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { firestore } from "@/lib/firebase-admin";
import { entitlementAttemptKey, nextReservedAttempt } from "@/lib/attempt-reservation";

/** Maximum number of completed paid quizzes per entitlement. */
export const MAX_PAID_ATTEMPTS = 2;
const COLLECTION = "entitlement_attempts";

export type AttemptReservation =
  | { ok: true; count: number; alreadyReserved: boolean; shareId: string }
  | { ok: false; reason: "unavailable" | "exhausted" };

function hasFirestoreConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

/**
 * Atomically reserves one paid completion. The document key is a SHA-256
 * digest, never the bearer entitlement token. Reusing the same submission ID
 * returns the original reservation instead of consuming a second attempt.
 */
export async function reserveAttempt(
  token: string,
  submissionId: string,
): Promise<AttemptReservation> {
  if (!hasFirestoreConfig()) return { ok: false, reason: "unavailable" };

  const db = firestore();
  const key = entitlementAttemptKey(token);
  const ref = db.collection(COLLECTION).doc(key);
  // Read the historical raw-token document only during the compatibility
  // transition so a customer never regains attempts after this hardening.
  const legacyRef = db.collection(COLLECTION).doc(token);

  try {
    return await db.runTransaction(async (transaction) => {
      const [snap, legacySnap] = await Promise.all([
        transaction.get(ref),
        transaction.get(legacyRef),
      ]);
      const data = snap.data() as
        | { count?: unknown; submissionIds?: unknown; submissionShareIds?: unknown }
        | undefined;
      const legacy = legacySnap.data() as { count?: unknown } | undefined;
      const submissionIds = Array.isArray(data?.submissionIds)
        ? data.submissionIds.filter((value): value is string => typeof value === "string")
        : [];
      const submissionShareIds =
        data?.submissionShareIds && typeof data.submissionShareIds === "object"
          ? Object.fromEntries(
              Object.entries(data.submissionShareIds as Record<string, unknown>).filter(
                (entry): entry is [string, string] => typeof entry[1] === "string",
              ),
            )
          : {};
      const currentCount = Number.isSafeInteger(data?.count)
        ? Number(data?.count)
        : Number.isSafeInteger(legacy?.count)
          ? Number(legacy?.count)
          : 0;

      if (submissionShareIds[submissionId]) {
        return {
          ok: true,
          count: currentCount,
          alreadyReserved: true,
          shareId: submissionShareIds[submissionId],
        };
      }

      const alreadyReserved = submissionIds.includes(submissionId);
      const next = alreadyReserved
        ? { ok: true as const, count: currentCount }
        : nextReservedAttempt(currentCount, MAX_PAID_ATTEMPTS);
      if (!next.ok) return { ok: false, reason: "exhausted" } as const;
      const shareId = nanoid(12);

      transaction.set(
        ref,
        {
          count: next.count,
          submissionIds: alreadyReserved
            ? submissionIds
            : [...submissionIds, submissionId].slice(-MAX_PAID_ATTEMPTS),
          submissionShareIds: { ...submissionShareIds, [submissionId]: shareId },
          lastAttemptAt: Timestamp.now(),
        },
        { merge: true },
      );
      return { ok: true, count: next.count, alreadyReserved, shareId };
    });
  } catch (error) {
    console.error("[attempts] atomic reservation failed", error);
    return { ok: false, reason: "unavailable" };
  }
}
