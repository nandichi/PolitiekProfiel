import pg from "pg";
const { Pool } = pg;
const url =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL;
console.log("connecting to:", new URL(url).host);
const pool = new Pool({ connectionString: url });
try {
  const r = await pool.query("SELECT COUNT(*)::int AS c FROM parties");
  console.log("parties:", r.rows[0]);
} finally {
  await pool.end();
}
