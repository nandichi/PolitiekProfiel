import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

function lexToPlainText(v) {
  if (!v?.root?.children) return "";
  return v.root.children
    .map((n) => (n?.children || []).map((c) => c?.text || "").join(""))
    .filter(Boolean)
    .join("\n\n");
}

const text = (s, format = 0) => ({
  type: "text",
  format,
  style: "",
  mode: "normal",
  text: s,
  detail: 0,
  version: 1,
});

const paragraph = (children) => ({
  type: "paragraph",
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  textFormat: 0,
  children,
});

const heading = (tag, children) => ({
  type: "heading",
  tag,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
});

const list = (children, tag = "ul") => ({
  type: "list",
  listType: tag === "ul" ? "bullet" : "number",
  tag,
  start: 1,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
});

const listitem = (children, value) => ({
  type: "listitem",
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  value,
  children,
});

// Parses inline markdown: **bold**, *italic*, _italic_, `code`. Returns array of text nodes.
function inlineToNodes(s) {
  if (!s) return [];
  const out = [];
  // Tokenize by **...** then by *...* and _..._
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("**", i)) {
      const end = s.indexOf("**", i + 2);
      if (end > i + 2) {
        out.push(text(s.slice(i + 2, end), 1));
        i = end + 2;
        continue;
      }
    }
    if (s[i] === "*" && s[i + 1] !== "*") {
      const end = s.indexOf("*", i + 1);
      if (end > i + 1 && s[end - 1] !== " " && s[end - 1] !== "*") {
        out.push(text(s.slice(i + 1, end), 2));
        i = end + 1;
        continue;
      }
    }
    // accumulate plain chars until next special
    let j = i;
    while (j < s.length) {
      if (s.startsWith("**", j)) break;
      if (s[j] === "*" && s[j + 1] !== "*") break;
      j++;
    }
    if (j > i) out.push(text(s.slice(i, j)));
    if (j === i) {
      out.push(text(s.slice(i)));
      i = s.length;
    } else {
      i = j;
    }
  }
  return out.filter((n) => n.text !== "");
}

// Convert markdown-ish text to a Lexical root structure.
function markdownToLexical(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  function flushPara(buf) {
    if (buf.length === 0) return;
    const merged = buf.join(" ").replace(/\s+/g, " ").trim();
    if (merged) blocks.push(paragraph(inlineToNodes(merged)));
  }

  let buf = [];
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushPara(buf);
      buf = [];
      i++;
      continue;
    }

    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      flushPara(buf);
      buf = [];
      const level = Math.min(6, hMatch[1].length);
      // We treat #=h2, ##=h3, ###+=h4 etc. (essay titel als h2)
      const tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      blocks.push(heading(tag, inlineToNodes(hMatch[2])));
      i++;
      continue;
    }

    const liMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (liMatch) {
      flushPara(buf);
      buf = [];
      const items = [];
      let v = 1;
      while (i < lines.length) {
        const m = lines[i].trim().match(/^[-*]\s+(.+)$/);
        if (!m) break;
        items.push(listitem(inlineToNodes(m[1]), v++));
        i++;
      }
      blocks.push(list(items, "ul"));
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushPara(buf);
      buf = [];
      const items = [];
      let v = 1;
      while (i < lines.length) {
        const m = lines[i].trim().match(/^\d+\.\s+(.+)$/);
        if (!m) break;
        items.push(listitem(inlineToNodes(m[1]), v++));
        i++;
      }
      blocks.push(list(items, "ol"));
      continue;
    }

    buf.push(trimmed);
    i++;
  }
  flushPara(buf);

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: blocks,
    },
  };
}

// Detects whether the plain text contains markdown patterns
function hasMarkdown(t) {
  return (
    /^#{1,6}\s/m.test(t) ||
    /\*\*[^*\n]+\*\*/.test(t) ||
    /^[-*]\s/m.test(t) ||
    /^\d+\.\s/m.test(t)
  );
}

const records = await sql`SELECT id, slug, kind, body FROM ai_content WHERE kind != 'ideology-reading'`;
const now = new Date().toISOString();
let processed = 0,
  rewritten = 0;
const changes = [];

for (const r of records) {
  processed++;
  const plain = lexToPlainText(r.body);
  if (!hasMarkdown(plain)) continue;
  const newBody = markdownToLexical(plain);
  await sql`UPDATE ai_content SET body = ${JSON.stringify(newBody)}::jsonb, updated_at = ${now} WHERE id = ${r.id}`;
  rewritten++;
  changes.push(r.slug);
}

console.log(`Verwerkt: ${processed}. Herparseerd (markdown -> lexical): ${rewritten}.`);
console.log("Aangepaste slugs:");
for (const s of changes) console.log("  -", s);
