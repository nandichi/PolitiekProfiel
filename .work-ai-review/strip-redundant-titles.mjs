import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`SELECT slug, body FROM ai_content WHERE slug LIKE 'ideology:%:essay' ORDER BY slug`;
console.log(`Found ${rows.length} essays\n`);

function extractText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
}

const DRY_RUN = process.argv.includes("--dry");
let updated = 0;
let skipped = 0;

for (const r of rows) {
  const body = r.body;
  const root = body?.root;
  if (!root || !Array.isArray(root.children) || root.children.length === 0) {
    console.log(`SKIP ${r.slug}: empty root`);
    skipped++;
    continue;
  }

  const first = root.children[0];
  const isTopHeading = first?.type === "heading" && (first.tag === "h2" || first.tag === "h1");

  if (!isTopHeading) {
    console.log(`SKIP ${r.slug}: first child is ${first?.type}/${first?.tag}, not a top heading`);
    skipped++;
    continue;
  }

  const headingText = extractText(first);
  const newChildren = root.children.slice(1);
  const newBody = { ...body, root: { ...root, children: newChildren } };

  console.log(`${DRY_RUN ? "[DRY] " : ""}STRIP ${r.slug}: removing "${first.tag}: ${headingText}"`);

  if (!DRY_RUN) {
    await sql`UPDATE ai_content SET body = ${newBody}, updated_at = NOW() WHERE slug = ${r.slug}`;
  }
  updated++;
}

console.log(`\n${DRY_RUN ? "[DRY RUN] " : ""}Updated: ${updated}, Skipped: ${skipped}`);
