import { readFileSync, writeFileSync } from "node:fs";

const BRAVE_KEY = "BSARb94rzPPV5DQwnDMjlQ25XxH0eoI";

const lists = JSON.parse(
  readFileSync(".work-ai-review/reading-lists.json", "utf8"),
);

// Try to parse "Title: Author (year) - description" or "Title: Author (year). description"
function parseItem(text) {
  const yearMatch = text.match(/\((\d{4})\)/);
  const year = yearMatch ? yearMatch[1] : null;

  let beforeYear = yearMatch
    ? text.slice(0, yearMatch.index).trim()
    : text;
  beforeYear = beforeYear.replace(/[:,]\s*$/, "");

  const lastColon = beforeYear.lastIndexOf(":");
  let title = beforeYear;
  let author = null;
  if (lastColon > 0) {
    title = beforeYear.slice(0, lastColon).trim();
    author = beforeYear.slice(lastColon + 1).trim();
  }
  return { title, author, year };
}

async function braveSearch(query) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(url, {
      headers: {
        "X-Subscription-Token": BRAVE_KEY,
        Accept: "application/json",
      },
    });
    if (r.status === 429) {
      await new Promise((res) => setTimeout(res, 2000 * (attempt + 1)));
      continue;
    }
    if (!r.ok) {
      return { error: `${r.status}: ${await r.text()}` };
    }
    const json = await r.json();
    return { json };
  }
  return { error: "rate-limited" };
}

function scoreMatch(text, parsed) {
  if (!text) return 0;
  const t = text.toLowerCase();
  let s = 0;
  const titleWords = parsed.title
    .toLowerCase()
    .split(/[\s:,]+/)
    .filter((w) => w.length > 3);
  for (const w of titleWords) if (t.includes(w)) s += 1;
  if (parsed.author) {
    const lastName = parsed.author.split(/\s+/).filter(Boolean).pop();
    if (lastName && t.includes(lastName.toLowerCase())) s += 5;
    if (t.includes(parsed.author.toLowerCase())) s += 5;
  }
  if (parsed.year && t.includes(parsed.year)) s += 2;
  return s;
}

const results = [];
let i = 0;
const total = lists.reduce((s, l) => s + l.items.length, 0);

for (const list of lists) {
  for (const item of list.items) {
    i++;
    const parsed = parseItem(item.text);
    const query = parsed.author
      ? `"${parsed.author}" ${parsed.title}`
      : item.text.split(" - ")[0];
    const { json, error } = await braveSearch(query);
    let verdict = "unknown";
    let bestScore = 0;
    let bestTitle = "";
    let bestUrl = "";
    if (error) {
      verdict = "error:" + error;
    } else {
      const web = json?.web?.results || [];
      for (const r of web) {
        const blob = `${r.title || ""} ${r.description || ""}`;
        const score = scoreMatch(blob, parsed);
        if (score > bestScore) {
          bestScore = score;
          bestTitle = r.title || "";
          bestUrl = r.url || "";
        }
      }
      if (bestScore >= 8) verdict = "likely_real";
      else if (bestScore >= 5) verdict = "questionable";
      else verdict = "likely_fake";
    }
    results.push({
      slug: list.slug,
      order: item.order,
      original: item.text,
      parsed,
      query,
      verdict,
      bestScore,
      bestTitle,
      bestUrl,
    });
    process.stdout.write(
      `[${i}/${total}] ${list.ideology.padEnd(28)} #${item.order} ${verdict.padEnd(15)} score=${bestScore}\n`,
    );
    await new Promise((res) => setTimeout(res, 1100));
  }
}

writeFileSync(
  ".work-ai-review/verification.json",
  JSON.stringify(results, null, 2),
);

const counts = results.reduce((acc, r) => {
  acc[r.verdict] = (acc[r.verdict] || 0) + 1;
  return acc;
}, {});
console.log("\nTotaal verdicts:", counts);
