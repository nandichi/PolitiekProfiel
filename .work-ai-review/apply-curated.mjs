import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";

const sql = neon(process.env.DATABASE_URL);
const curated = JSON.parse(
  readFileSync(".work-ai-review/curated-lists.json", "utf8"),
);

function lex(text) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          textFormat: 0,
          children: [
            {
              type: "text",
              format: 0,
              style: "",
              mode: "normal",
              text,
              detail: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  };
}

function itemText(item) {
  return `${item.title}: ${item.author} (${item.year}) - ${item.why}`;
}

function newItemId() {
  return randomBytes(12).toString("hex");
}

const now = new Date().toISOString();
let updated = 0,
  inserted = 0,
  deleted = 0;

for (const [ideologySlug, list] of Object.entries(curated)) {
  const slug = `ideology:${ideologySlug}:reading`;
  const rows = await sql`SELECT id FROM ai_content WHERE slug = ${slug} LIMIT 1`;
  if (rows.length === 0) {
    console.error(`[skip] geen record voor ${slug}`);
    continue;
  }
  const parentId = rows[0].id;

  const body = lex(list.intro);
  await sql`
    UPDATE ai_content
    SET body = ${JSON.stringify(body)}::jsonb,
        model = 'human-curated-2026 (brave-verified)',
        generated_at = ${now},
        prompt = 'Handmatig gecureerd door redactie, elke titel + auteur + jaartal geverifieerd via Brave Search voor opslag.',
        human_edited = true,
        updated_at = ${now}
    WHERE id = ${parentId}
  `;
  updated++;

  const del = await sql`DELETE FROM ai_content_items WHERE _parent_id = ${parentId}`;
  deleted += del.length;

  let order = 1;
  for (const item of list.items) {
    const id = newItemId();
    const text = itemText(item);
    const meta = item.type;
    await sql`
      INSERT INTO ai_content_items (_order, _parent_id, id, text, meta)
      VALUES (${order}, ${parentId}, ${id}, ${text}, ${meta})
    `;
    inserted++;
    order++;
  }

  console.log(
    `  ${slug.padEnd(45)} body=updated items=${list.items.length}`,
  );
}

console.log(
  `\nKlaar. bodies geupdate: ${updated}. items verwijderd: (parents) ${updated}. items ingevoegd: ${inserted}.`,
);
