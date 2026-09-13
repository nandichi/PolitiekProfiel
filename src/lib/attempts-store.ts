import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { firestore } from "@/lib/firebase-admin";

/**
 * Telt hoe vaak een betaald toegangstoken de quiz heeft afgerond.
 *
 * Bewust NIET in de entitlements-collectie (Payload/Postgres): dat zou een
 * schemamigratie vragen en het koppelt gebruiksdata aan betaaldata. Hier staat
 * alleen token -> aantal pogingen, zonder enige link naar het politieke
 * resultaat. Zonder Firestore-config valt dit terug op een in-memory teller
 * (alleen bruikbaar binnen één invocation).
 */

const COLLECTION = "entitlement_attempts";

/** Hoe vaak iemand een betaalde quiz mag afronden. */
export const MAX_PAID_ATTEMPTS = 2;

const memoryCounts = new Map<string, number>();

function hasFirestoreConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export async function getAttemptCount(token: string): Promise<number> {
  if (!hasFirestoreConfig()) return memoryCounts.get(token) ?? 0;

  try {
    const snap = await firestore().collection(COLLECTION).doc(token).get();
    if (!snap.exists) return 0;
    const data = snap.data() as { count?: number } | undefined;
    return Number(data?.count ?? 0);
  } catch (err) {
    console.error("[attempts] tellen mislukt, sta toe:", err);
    // Fail-open: een teller die stuk is mag een betalende klant niet buiten
    // sluiten. De poging wordt dan niet geteld.
    return 0;
  }
}

export async function recordAttempt(token: string): Promise<number> {
  if (!hasFirestoreConfig()) {
    const next = (memoryCounts.get(token) ?? 0) + 1;
    memoryCounts.set(token, next);
    return next;
  }

  const ref = firestore().collection(COLLECTION).doc(token);
  await ref.set(
    {
      count: FieldValue.increment(1),
      lastAttemptAt: Timestamp.now(),
    },
    { merge: true },
  );
  const snap = await ref.get();
  const data = snap.data() as { count?: number } | undefined;
  return Number(data?.count ?? 1);
}
