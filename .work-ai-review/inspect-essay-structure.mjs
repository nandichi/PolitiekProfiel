import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`SELECT slug, body FROM ai_content WHERE slug LIKE 'ideology:%:essay' ORDER BY slug`;
console.log(`Found ${rows.length} essay rows\n`);

function extractText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
}

function walk(node, stats) {
  if (!node) return;
  if (node.type === "paragraph") {
    stats.paragraphs++;
    stats.paraLens.push(extractText(node).length);
  }
  if (node.type === "heading") {
    const tag = node.tag || "h3";
    stats.headings[tag] = (stats.headings[tag] || 0) + 1;
    stats.headingList.push({ tag, text: extractText(node) });
  }
  if (Array.isArray(node.children)) {
    for (const c of node.children) walk(c, stats);
  }
}

const summary = [];
for (const r of rows) {
  const root = r.body?.root;
  if (!root) {
    console.log(`${r.slug}: NO ROOT`);
    continue;
  }
  const stats = { paragraphs: 0, headings: {}, headingList: [], paraLens: [] };
  walk(root, stats);
  const firstChild = root.children?.[0];
  const firstHeadingText = firstChild?.type === "heading" ? extractText(firstChild) : null;
  const totalChars = stats.paraLens.reduce((a, b) => a + b, 0);
  const avgParaLen = stats.paraLens.length ? Math.round(totalChars / stats.paraLens.length) : 0;
  const maxParaLen = stats.paraLens.length ? Math.max(...stats.paraLens) : 0;
  console.log(`${r.slug}`);
  console.log(
    `  first: ${firstChild?.type}${firstHeadingText ? ` (${firstChild.tag}: "${firstHeadingText.slice(0, 70)}")` : ""}`,
  );
  console.log(
    `  paragraphs: ${stats.paragraphs}, headings: ${JSON.stringify(stats.headings)}, chars: ${totalChars} (avg ${avgParaLen}, max ${maxParaLen})`,
  );
  console.log(`  headings list: ${stats.headingList.map((h) => h.tag + ":" + h.text).join(" | ")}`);
  console.log();
  summary.push({ slug: r.slug, chars: totalChars, headings: stats.headings, firstHeading: firstHeadingText });
}

console.log("\n=== SUMMARY ===");
const totals = summary.reduce(
  (acc, s) => {
    acc.minChars = Math.min(acc.minChars, s.chars);
    acc.maxChars = Math.max(acc.maxChars, s.chars);
    acc.avgChars += s.chars;
    return acc;
  },
  { minChars: Infinity, maxChars: 0, avgChars: 0 },
);
totals.avgChars = Math.round(totals.avgChars / summary.length);
console.log(totals);
