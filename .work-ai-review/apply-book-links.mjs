import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const sql = neon(process.env.DATABASE_URL);

const results = JSON.parse(readFileSync(".work-ai-review/book-link-results.json", "utf8"));
console.log(`Loaded ${results.length} results\n`);

function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isQuestionable(item) {
  const url = (item.link || "").toLowerCase();
  if (!url) return "no-link";
  if (url.includes("/p/summary-of-")) return "summary-of";
  if (url.includes("conversation-starters")) return "conv-starters";
  if (url.includes("/p/pivotal-points") || url.includes("pivotal-guide")) return "pivotal-guide";
  return null;
}

function bolSearchUrl(title, author) {
  const q = [title, author].filter(Boolean).join(" ");
  return `https://www.bol.com/nl/nl/s/?searchtext=${encodeURIComponent(q)}`;
}

const DRY = process.argv.includes("--dry");
let applied = 0;
let downgraded = 0;
const downgrades = [];

for (const r of results) {
  let link = r.link;
  const reason = isQuestionable(r);
  if (reason) {
    link = bolSearchUrl(r.title, r.author);
    downgraded++;
    downgrades.push({ slug: r.slug, ord: r.ord, title: r.title, reason, was: r.link, now: link });
  }

  if (!DRY) {
    await sql`UPDATE ai_content_items SET link = ${link} WHERE id = ${r.item_id}`;
  }
  applied++;
}

console.log(`${DRY ? "[DRY] " : ""}Applied: ${applied}, Downgraded (replaced with search URL): ${downgraded}`);
if (downgrades.length) {
  console.log("\nDowngrades:");
  for (const d of downgrades) {
    console.log(`  ${d.slug} #${d.ord} "${d.title}" (${d.reason})`);
    console.log(`    was: ${d.was}`);
    console.log(`    now: ${d.now}`);
  }
}
