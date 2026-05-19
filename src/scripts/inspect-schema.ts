import "dotenv/config";
import { Pool } from "pg";

async function main() {
  const url =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL;
  if (!url) {
    console.error("No DB url");
    process.exit(1);
  }
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  const tables = [
    "payload_locked_documents_rels",
    "payload_locked_documents",
    "quiz_attempts",
    "quiz_events",
    "entitlements",
    "stripe_promotion_codes",
  ];

  for (const t of tables) {
    const res = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_schema='public' AND table_name=$1
       ORDER BY ordinal_position`,
      [t],
    );
    console.log(`\n=== ${t} (${res.rows.length} cols) ===`);
    for (const r of res.rows as Array<{ column_name: string; data_type: string }>) {
      console.log(`  ${r.column_name} :: ${r.data_type}`);
    }
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
