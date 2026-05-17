/**
 * Gedeelde Neon Postgres-client.
 *
 * Gebruikt de Vercel/Neon HTTP-driver (`@neondatabase/serverless`) zodat we
 * geen TCP-connectie nodig hebben en cold starts klein blijven. Voor zware
 * batches kan in de toekomst de Pool variant toegevoegd worden.
 *
 * Connection string komt uit (in volgorde): `DATABASE_URL`,
 * `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`. De HTTP-driver werkt
 * gewoon met de pooled URL.
 */
import "server-only";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED;

let cached: ReturnType<typeof neon> | null = null;

export function getNeonSql() {
  if (!DATABASE_URL) {
    throw new Error(
      "Neon connection string ontbreekt. Zet DATABASE_URL of POSTGRES_URL in de env.",
    );
  }
  if (!cached) {
    cached = neon(DATABASE_URL);
  }
  return cached;
}

export function isNeonConfigured(): boolean {
  return Boolean(DATABASE_URL);
}
