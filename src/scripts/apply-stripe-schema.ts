import "dotenv/config";
import { Pool } from "pg";

const SQL = `
DO $$ BEGIN
  CREATE TYPE "public"."enum_entitlements_tier" AS ENUM('standard', 'extended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_entitlements_status" AS ENUM('pending', 'paid', 'revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enum_stripe_promotion_codes_tier" AS ENUM('all', 'standard', 'extended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "entitlements" (
  "id" serial PRIMARY KEY NOT NULL,
  "token" varchar NOT NULL,
  "tier" "enum_entitlements_tier" NOT NULL,
  "status" "enum_entitlements_status" DEFAULT 'pending' NOT NULL,
  "stripe_checkout_session_id" varchar,
  "stripe_payment_intent_id" varchar,
  "stripe_price_id" varchar,
  "amount_total" numeric,
  "currency" varchar,
  "paid_at" timestamp(3) with time zone,
  "consumed_at" timestamp(3) with time zone,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "stripe_promotion_codes" (
  "id" serial PRIMARY KEY NOT NULL,
  "code" varchar,
  "tier" "enum_stripe_promotion_codes_tier" DEFAULT 'all' NOT NULL,
  "max_redemptions" numeric,
  "expires_at" timestamp(3) with time zone,
  "note" varchar,
  "stripe_coupon_id" varchar,
  "stripe_promotion_code_id" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "entitlements_token_idx" ON "entitlements" USING btree ("token");
CREATE INDEX IF NOT EXISTS "entitlements_status_idx" ON "entitlements" USING btree ("status");
CREATE INDEX IF NOT EXISTS "entitlements_stripe_checkout_session_id_idx" ON "entitlements" USING btree ("stripe_checkout_session_id");
CREATE INDEX IF NOT EXISTS "entitlements_stripe_payment_intent_id_idx" ON "entitlements" USING btree ("stripe_payment_intent_id");
CREATE INDEX IF NOT EXISTS "entitlements_updated_at_idx" ON "entitlements" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "entitlements_created_at_idx" ON "entitlements" USING btree ("created_at");

CREATE UNIQUE INDEX IF NOT EXISTS "stripe_promotion_codes_code_idx" ON "stripe_promotion_codes" USING btree ("code");
CREATE INDEX IF NOT EXISTS "stripe_promotion_codes_updated_at_idx" ON "stripe_promotion_codes" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "stripe_promotion_codes_created_at_idx" ON "stripe_promotion_codes" USING btree ("created_at");

ALTER TABLE "payload_locked_documents_rels"
  ADD COLUMN IF NOT EXISTS "quiz_attempts_id" integer,
  ADD COLUMN IF NOT EXISTS "quiz_events_id" integer,
  ADD COLUMN IF NOT EXISTS "entitlements_id" integer,
  ADD COLUMN IF NOT EXISTS "stripe_promotion_codes_id" integer;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_quiz_attempts_fk"
    FOREIGN KEY ("quiz_attempts_id") REFERENCES "public"."quiz_attempts"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_quiz_events_fk"
    FOREIGN KEY ("quiz_events_id") REFERENCES "public"."quiz_events"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_attempts_id_idx"
  ON "payload_locked_documents_rels" USING btree ("quiz_attempts_id");
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_quiz_events_id_idx"
  ON "payload_locked_documents_rels" USING btree ("quiz_events_id");

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_entitlements_fk"
    FOREIGN KEY ("entitlements_id") REFERENCES "public"."entitlements"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_stripe_promotion_codes_fk"
    FOREIGN KEY ("stripe_promotion_codes_id") REFERENCES "public"."stripe_promotion_codes"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_entitlements_id_idx"
  ON "payload_locked_documents_rels" USING btree ("entitlements_id");
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_stripe_promotion_codes_id_idx"
  ON "payload_locked_documents_rels" USING btree ("stripe_promotion_codes_id");

CREATE TABLE IF NOT EXISTS "payload_migrations" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar,
  "batch" numeric,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

INSERT INTO "payload_migrations" ("name", "batch")
SELECT '20260519_200413_entitlements_and_promotion_codes', 1
WHERE NOT EXISTS (
  SELECT 1 FROM "payload_migrations"
  WHERE "name" = '20260519_200413_entitlements_and_promotion_codes'
);
`;

async function main() {
  const url =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL;
  if (!url) {
    console.error("No database URL in env.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("[stripe-schema] applying ...");
    await pool.query(SQL);
    const rows = await pool.query<{ name: string }>(
      `SELECT name FROM payload_migrations ORDER BY id DESC LIMIT 5`,
    );
    console.log("[stripe-schema] last migrations:", rows.rows);
    console.log("[stripe-schema] done.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[stripe-schema] failed:", err);
  process.exit(1);
});
