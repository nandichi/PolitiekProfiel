import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const BRAVE_API_KEY = "BSARb94rzPPV5DQwnDMjlQ25XxH0eoI";
const sql = neon(process.env.DATABASE_URL);

const DRY_RUN = process.argv.includes("--dry");
const RESUME = process.argv.includes("--resume");

const PREFERRED_HOSTS = [
  "www.bol.com",
  "bol.com",
  "www.amazon.nl",
  "amazon.nl",
  "www.managementboek.nl",
  "managementboek.nl",
  "www.athenaeum.nl",
  "athenaeum.nl",
  "www.libris.nl",
  "libris.nl",
  "www.dbnl.org",
  "dbnl.org",
  "www.bibliotheek.nl",
  "bibliotheek.nl",
  "nl.wikipedia.org",
  "en.wikipedia.org",
  "openlibrary.org",
  "www.openlibrary.org",
  "www.goodreads.com",
  "goodreads.com",
];

function parseBookFromText(text) {
  const dashIdx = text.indexOf(" - ");
  const head = dashIdx > 0 ? text.slice(0, dashIdx) : text;
  const yearMatch = head.match(/\((\d{4})\)/);
  const beforeYear = yearMatch ? head.slice(0, yearMatch.index).trim() : head;
  const colonIdx = beforeYear.indexOf(":");
  if (colonIdx > 0) {
    return {
      title: beforeYear.slice(0, colonIdx).trim(),
      author: beforeYear.slice(colonIdx + 1).trim(),
      year: yearMatch ? yearMatch[1] : null,
    };
  }
  return { title: beforeYear.trim(), author: "", year: yearMatch ? yearMatch[1] : null };
}

async function braveSearch(query) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10&country=nl&search_lang=nl`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": BRAVE_API_KEY,
    },
  });
  if (!res.ok) throw new Error(`Brave ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.web?.results ?? [];
}

function pickBestLink(results, parsed, looksLikeMatch) {
  if (!results?.length) return null;

  function score(r) {
    let host = "";
    try {
      host = new URL(r.url).hostname.toLowerCase();
    } catch {
      return -1;
    }
    const hostIdx = PREFERRED_HOSTS.indexOf(host);
    if (hostIdx < 0) return -1;
    if (!looksLikeMatch(r.title, r.description, r.url)) return -1;
    let s = 1000 - hostIdx * 10;
    if (host === "www.bol.com" || host === "bol.com") s += 20;
    return s;
  }

  const ranked = results
    .map((r) => ({ r, s: score(r) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  return ranked[0]?.r ?? null;
}

function fallbackBolSearch(parsed) {
  const q = [parsed.title, parsed.author].filter(Boolean).join(" ");
  return `https://www.bol.com/nl/nl/s/?searchtext=${encodeURIComponent(q)}`;
}

function rateLimit(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const filterSlug = process.argv.find((a) => a.startsWith("--slug="))?.slice(7);
const rows = filterSlug
  ? await sql`
      SELECT t.slug, i.id as item_id, i._order as ord, i.text, i.meta, i.link
      FROM ai_content t
      JOIN ai_content_items i ON i._parent_id = t.id
      WHERE t.slug = ${filterSlug}
      ORDER BY i._order
    `
  : await sql`
      SELECT t.slug, i.id as item_id, i._order as ord, i.text, i.meta, i.link
      FROM ai_content t
      JOIN ai_content_items i ON i._parent_id = t.id
      WHERE t.slug LIKE 'ideology:%:reading'
      ORDER BY t.slug, i._order
    `;
console.log(`Found ${rows.length} reading items across all ideologies\n`);

const results = [];
let processed = 0;
let withLink = 0;
let withFallback = 0;

for (const r of rows) {
  if (RESUME && r.link) {
    results.push({ slug: r.slug, ord: r.ord, link: r.link, source: "existing" });
    withLink++;
    continue;
  }
  const parsed = parseBookFromText(r.text);
  let chosen = null;
  let source = "fallback";

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['"`’]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const titleNorm = norm(parsed.title);
  const titleTokens = titleNorm.split(" ").filter((t) => t.length > 2);
  const authorLastNorm = norm((parsed.author || "").split(/\s+/).pop() || "");

  function looksLikeMatch(resultTitle, resultDesc, resultUrl) {
    const hay = norm((resultTitle || "") + " " + (resultDesc || "") + " " + (resultUrl || ""));
    if (titleTokens.length === 0) return false;
    const titleHits = titleTokens.filter((t) => hay.includes(t)).length;
    const titleRatio = titleHits / titleTokens.length;
    const authorOk = !authorLastNorm || hay.includes(authorLastNorm);
    return titleRatio >= 0.6 && authorOk;
  }

  function pickBolProductPage(results) {
    for (const rr of results) {
      try {
        const u = new URL(rr.url);
        const h = u.hostname;
        if (
          (h === "www.bol.com" || h === "bol.com") &&
          u.pathname.includes("/p/") &&
          looksLikeMatch(rr.title, rr.description, rr.url)
        ) {
          return rr.url;
        }
      } catch {}
    }
    return null;
  }

  function pickBolAnyPage(results) {
    for (const rr of results) {
      try {
        const u = new URL(rr.url);
        const h = u.hostname;
        if (
          (h === "www.bol.com" || h === "bol.com") &&
          /\/(p|f|l)\//.test(u.pathname) &&
          looksLikeMatch(rr.title, rr.description, rr.url)
        ) {
          return rr.url;
        }
      } catch {}
    }
    return null;
  }

  // Stage 1: bol.com product page (specific book)
  try {
    const r1 = await braveSearch(
      `"${parsed.title}" ${parsed.author} site:bol.com inurl:/p/`,
    );
    const hit = pickBolProductPage(r1);
    if (hit) {
      chosen = hit;
      source = "bol-product";
    }
  } catch (e) {
    console.error(`  bol-product error:`, e.message);
  }
  await rateLimit(1100);

  // Stage 2: any bol.com page
  if (!chosen) {
    try {
      const r2 = await braveSearch(
        `"${parsed.title}" ${parsed.author} site:bol.com`,
      );
      const hit = pickBolProductPage(r2) || pickBolAnyPage(r2);
      if (hit) {
        chosen = hit;
        source = hit.includes("/p/") ? "bol-product" : "bol-page";
      }
    } catch (e) {
      console.error(`  bol-any error:`, e.message);
    }
    await rateLimit(1100);
  }

  // Stage 3: broad search with preference ranking
  if (!chosen) {
    try {
      const r3 = await braveSearch(
        `"${parsed.title}" ${parsed.author}`.trim(),
      );
      const best = pickBestLink(r3, parsed, looksLikeMatch);
      if (best) {
        chosen = best.url;
        try {
          const h = new URL(best.url).hostname.replace(/^www\./, "");
          source = h;
        } catch {
          source = "brave";
        }
      }
    } catch (e) {
      console.error(`  brave broad error:`, e.message);
    }
  }

  if (!chosen) {
    chosen = fallbackBolSearch(parsed);
    source = "bol-search";
    withFallback++;
  } else {
    withLink++;
  }

  const out = {
    slug: r.slug,
    ord: r.ord,
    item_id: r.item_id,
    title: parsed.title,
    author: parsed.author,
    year: parsed.year,
    link: chosen,
    source,
  };
  results.push(out);
  processed++;
  console.log(
    `[${processed}/${rows.length}] ${r.slug.replace("ideology:", "").replace(":reading", "")} #${r.ord}: ${parsed.title} → ${source} → ${chosen}`,
  );

  if (!DRY_RUN) {
    await sql`UPDATE ai_content_items SET link = ${chosen} WHERE id = ${r.item_id}`;
  }

  await rateLimit(1100);
}

writeFileSync(
  ".work-ai-review/book-link-results.json",
  JSON.stringify(results, null, 2),
);
console.log(`\nDone. Brave matches: ${withLink}, fallbacks: ${withFallback}`);
console.log(`Results saved to .work-ai-review/book-link-results.json`);
