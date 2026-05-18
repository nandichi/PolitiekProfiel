import { readFileSync, writeFileSync } from "node:fs";

const BRAVE_KEY = "BSARb94rzPPV5DQwnDMjlQ25XxH0eoI";
const curated = JSON.parse(
  readFileSync(".work-ai-review/curated-lists.json", "utf8"),
);

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
    if (!r.ok) return { error: `${r.status}: ${await r.text()}` };
    return { json: await r.json() };
  }
  return { error: "rate-limited" };
}

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function score(blob, item) {
  const t = normalize(blob);
  let s = 0;
  // title key words
  const titleWords = normalize(item.title)
    .split(" ")
    .filter((w) => w.length > 3);
  let titleHits = 0;
  for (const w of titleWords) if (t.includes(w)) titleHits++;
  if (titleHits >= Math.max(2, Math.floor(titleWords.length * 0.6))) s += 5;
  // author last name
  const authors = item.author.split(/\s*&\s*|\s+and\s+/);
  for (const a of authors) {
    const tokens = a.trim().split(/\s+/).filter(Boolean);
    const last = tokens[tokens.length - 1];
    if (last && t.includes(normalize(last))) s += 4;
  }
  // year
  if (item.year && t.includes(item.year)) s += 2;
  return { score: s, titleHits, totalTitleWords: titleWords.length };
}

const out = [];
let i = 0;
const totalItems = Object.values(curated).reduce(
  (s, v) => s + v.items.length,
  0,
);

for (const [ideology, list] of Object.entries(curated)) {
  for (const item of list.items) {
    i++;
    const query = `"${item.author.split("&")[0].trim()}" "${item.title.split(":")[0].trim()}" ${item.year}`;
    const { json, error } = await braveSearch(query);
    let bestScore = 0,
      bestBlob = "",
      bestUrl = "",
      bestHits = 0;
    if (error) {
      out.push({ ideology, item, query, error });
      console.log(
        `[${i}/${totalItems}] ${ideology.padEnd(28)} ERR ${error}`,
      );
      continue;
    }
    const results = json?.web?.results || [];
    for (const r of results) {
      const blob = `${r.title || ""} ${r.description || ""}`;
      const { score: sc, titleHits } = score(blob, item);
      if (sc > bestScore) {
        bestScore = sc;
        bestBlob = blob;
        bestUrl = r.url;
        bestHits = titleHits;
      }
    }
    const verdict =
      bestScore >= 9 ? "verified" : bestScore >= 5 ? "partial" : "missing";
    out.push({
      ideology,
      item,
      query,
      verdict,
      bestScore,
      bestHits,
      bestBlob: bestBlob.slice(0, 200),
      bestUrl,
    });
    console.log(
      `[${i}/${totalItems}] ${ideology.padEnd(28)} ${verdict.padEnd(8)} score=${bestScore} :: ${item.author.split(",")[0].slice(0, 22).padEnd(22)} | ${item.title.slice(0, 50)}`,
    );
    await new Promise((res) => setTimeout(res, 1100));
  }
}

writeFileSync(
  ".work-ai-review/curated-verification.json",
  JSON.stringify(out, null, 2),
);

const counts = out.reduce((a, x) => {
  a[x.verdict || "error"] = (a[x.verdict || "error"] || 0) + 1;
  return a;
}, {});
console.log("\nVerdicts:", counts);

const missing = out.filter((x) => x.verdict !== "verified");
if (missing.length > 0) {
  console.log("\nNiet-volledig geverifieerd (controleer):");
  for (const m of missing) {
    console.log(
      `  ${m.ideology} :: ${m.item.author} :: ${m.item.title} (${m.item.year}) -> ${m.verdict} score=${m.bestScore}`,
    );
    if (m.bestUrl) console.log(`    top: ${m.bestUrl}`);
  }
}
