import { createHash } from "node:crypto";

export function isSubmissionId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{16,128}$/.test(value);
}

export function entitlementAttemptKey(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function nextReservedAttempt(
  currentCount: number,
  maximum: number,
): { ok: boolean; count: number } {
  const count = Number.isSafeInteger(currentCount) && currentCount >= 0 ? currentCount : maximum;
  if (count >= maximum) return { ok: false, count };
  return { ok: true, count: count + 1 };
}
