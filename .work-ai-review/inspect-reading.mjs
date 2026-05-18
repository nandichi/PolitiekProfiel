import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`SELECT slug, title FROM ai_content WHERE slug LIKE 'ideology:%:reading' ORDER BY slug`;
console.log(`Found ${rows.length} reading rows`);

const itemsRows = await sql`
  SELECT t.slug, i._order as ord, i.text, i.meta
  FROM ai_content t
  JOIN ai_content_items i ON i._parent_id = t.id
  WHERE t.slug = 'ideology:sociaal-liberaal:reading'
  ORDER BY i._order
`;
console.log(`\nItems for sociaal-liberaal:`);
for (const r of itemsRows) {
  console.log(`  ${r.ord}. text: "${r.text}"`);
  console.log(`     meta: "${r.meta || ""}"`);
}

const allCount = await sql`
  SELECT t.slug, COUNT(i.id) as item_count
  FROM ai_content t
  LEFT JOIN ai_content_items i ON i._parent_id = t.id
  WHERE t.slug LIKE 'ideology:%:reading'
  GROUP BY t.slug
  ORDER BY t.slug
`;
console.log(`\nAll reading lists:`);
for (const r of allCount) console.log(`  ${r.slug}: ${r.item_count} items`);

const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'ai_content_items' ORDER BY ordinal_position`;
console.log(`\nai_content_items columns:`, cols.map((c) => c.column_name).join(", "));
