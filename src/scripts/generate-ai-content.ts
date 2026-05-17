import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

import { IDEOLOGIES } from "../data/ideologies";
import { DIMENSIONS, type DimensionId } from "../lib/dimensions";
import { THEMES } from "../lib/themes";
import {
  SCORE_BUCKETS,
  bucketLabel,
  type ScoreBucket,
} from "../lib/buckets";
import { ALL_PARADOX_TYPES, paradoxTitle, type ParadoxType } from "../lib/paradox";
import { paragraphsToLexical } from "../lib/lexical";

interface SlotPayload {
  slug: string;
  kind:
    | "ideology-essay"
    | "ideology-reading"
    | "ideology-arguments-for"
    | "ideology-arguments-against"
    | "ideology-theme"
    | "dimension-bucket"
    | "paradox";
  title?: string;
  prompt: string;
  systemPrompt: string;
  outputType: "essay" | "list" | "paragraph";
  expectedItems?: number;
}

const SYSTEM_BASE = [
  "Je bent een gespecialiseerde Nederlandstalige redacteur voor PolitiekProfiel.",
  "Je schrijft helder, kalm, gebalanceerd en zonder polarisering.",
  "Vermijd elke partij-promotie of stemadvies.",
  "Vermijd actuele politici met naam in essays; gebruik in plaats daarvan ideologische tradities, denkers en stromingen.",
  "Vermijd emoji's, uitroeptekens en marketingtaal.",
  "Antwoord uitsluitend in geldige JSON volgens het gevraagde schema, zonder uitleg eromheen.",
].join(" ");

function ideologyEssaySlots(): SlotPayload[] {
  return IDEOLOGIES.map((idea) => ({
    slug: `ideology:${idea.slug}:essay`,
    kind: "ideology-essay",
    title: idea.name,
    outputType: "essay",
    systemPrompt: SYSTEM_BASE,
    prompt: [
      `Schrijf een essay van 600 tot 800 woorden over de ideologie "${idea.name}".`,
      `Korte samenvatting van deze stroming: ${idea.shortDescription}`,
      `Vertrek vanuit historische context, kerngedachten, klassieke denkers en hedendaagse vertalingen.`,
      `Behandel hoe deze stroming kijkt naar economie, cultuur, vrijheid, bestuur en instituties.`,
      `Sluit af met spanningen of openliggende vragen binnen de traditie.`,
      `Lever JSON terug met velden: { "body": string }. De body is markdown met alinea's.`,
    ].join("\n"),
  }));
}

function ideologyReadingSlots(): SlotPayload[] {
  return IDEOLOGIES.map((idea) => ({
    slug: `ideology:${idea.slug}:reading`,
    kind: "ideology-reading",
    title: `Leesvoer voor ${idea.name.toLowerCase()}`,
    outputType: "list",
    expectedItems: 7,
    systemPrompt: SYSTEM_BASE,
    prompt: [
      `Stel een leesvoer-lijst samen van 5 tot 8 aanbevelingen voor wie meer wil leren over de ideologie "${idea.name}".`,
      `Mix klassieke werken, recente essays en degelijke overzichten.`,
      `Vermeld kort waarom dit werk relevant is voor deze stroming.`,
      `Geef per item: titel, auteur, type (boek/essay/rapport), 1-zinnige reden.`,
      `Lever JSON terug: { "body": string (1 zin intro), "items": [{ "text": string, "meta": string }] }.`,
      `Velden text en meta zijn in het Nederlands. text = "Titel: Auteur (jaar)" plus 1 zin uitleg. meta = type werk.`,
    ].join("\n"),
  }));
}

function ideologyArgumentsForSlots(): SlotPayload[] {
  return IDEOLOGIES.map((idea) => ({
    slug: `ideology:${idea.slug}:arguments-for`,
    kind: "ideology-arguments-for",
    title: `Sterkste argumenten van ${idea.name.toLowerCase()}`,
    outputType: "list",
    expectedItems: 4,
    systemPrompt: SYSTEM_BASE,
    prompt: [
      `Formuleer 3 tot 4 sterke argumenten ZOALS VERWOORD VANUIT de ideologie "${idea.name}".`,
      `Geen stropop-versies; representeer de stroming op haar best.`,
      `Elk argument: 2-3 zinnen, met onderbouwing.`,
      `Lever JSON terug: { "body": string (1 zin intro), "items": [{ "text": string }] }.`,
    ].join("\n"),
  }));
}

function ideologyArgumentsAgainstSlots(): SlotPayload[] {
  return IDEOLOGIES.map((idea) => ({
    slug: `ideology:${idea.slug}:arguments-against`,
    kind: "ideology-arguments-against",
    title: `Respectvolle tegen-argumenten op ${idea.name.toLowerCase()}`,
    outputType: "list",
    expectedItems: 4,
    systemPrompt: SYSTEM_BASE,
    prompt: [
      `Formuleer 3 tot 4 sterke tegen-argumenten OP de ideologie "${idea.name}", vanuit een andere intellectuele traditie.`,
      `Geen karikatuur; behandel de kritiek serieus, gebalanceerd en in goed Nederlands.`,
      `Elk argument: 2-3 zinnen, met onderbouwing.`,
      `Lever JSON terug: { "body": string (1 zin intro), "items": [{ "text": string }] }.`,
    ].join("\n"),
  }));
}

function dimensionBucketSlots(): SlotPayload[] {
  const slots: SlotPayload[] = [];
  for (const dim of DIMENSIONS) {
    for (const bucket of SCORE_BUCKETS) {
      slots.push({
        slug: `dimension:${dim.id}:bucket:${bucket}`,
        kind: "dimension-bucket",
        title: `${dim.label}, ${bucketLabel(bucket)}`,
        outputType: "paragraph",
        systemPrompt: SYSTEM_BASE,
        prompt: dimensionBucketPrompt(dim.id, dim.label, bucket),
      });
    }
  }
  return slots;
}

function dimensionBucketPrompt(
  id: DimensionId,
  label: string,
  bucket: ScoreBucket,
): string {
  const dim = DIMENSIONS.find((d) => d.id === id)!;
  return [
    `Schrijf een paragraaf van 150 tot 200 woorden voor iemand met score "${bucketLabel(bucket).toLowerCase()}" op de dimensie "${label}".`,
    `Korte uitleg van wat deze dimensie meet: ${dim.description}`,
    `Negatieve pool: ${dim.poleNegative.label}, ${dim.poleNegative.description}`,
    `Positieve pool: ${dim.polePositive.label}, ${dim.polePositive.description}`,
    `Verklaar wat een score in deze bucket waarschijnlijk betekent: welke houdingen, welke politici en stromingen passen daarbij in Nederland en West-Europa.`,
    `Schrijf in de tweede persoon ('je'). Hou het gebalanceerd, nuchter, geen marketingtaal.`,
    `Lever JSON terug: { "body": string }.`,
  ].join("\n");
}

function ideologyThemeSlots(): SlotPayload[] {
  const slots: SlotPayload[] = [];
  for (const idea of IDEOLOGIES) {
    for (const theme of THEMES) {
      slots.push({
        slug: `ideology:${idea.slug}:theme:${theme.id}`,
        kind: "ideology-theme",
        title: `${idea.name} over ${theme.label.toLowerCase()}`,
        outputType: "paragraph",
        systemPrompt: SYSTEM_BASE,
        prompt: [
          `Schrijf een paragraaf van 100 tot 150 woorden over hoe iemand met ideologie "${idea.name}" doorgaans denkt over het thema "${theme.label}".`,
          `Korte ideologie: ${idea.shortDescription}`,
          `Thema-context: ${theme.description}`,
          `Vermeld welke beleidskeuzes typisch passen en welke spanningen kunnen optreden binnen de stroming op dit thema.`,
          `Gebalanceerd, geen partij-namen, in goed Nederlands.`,
          `Lever JSON terug: { "body": string }.`,
        ].join("\n"),
      });
    }
  }
  return slots;
}

function paradoxSlots(): SlotPayload[] {
  return ALL_PARADOX_TYPES.map((type) => ({
    slug: `paradox:${type}`,
    kind: "paradox",
    title: paradoxTitle(type),
    outputType: "paragraph",
    systemPrompt: SYSTEM_BASE,
    prompt: paradoxPrompt(type),
  }));
}

function paradoxPrompt(type: ParadoxType): string {
  const explanations: Record<ParadoxType, string> = {
    "economic-mismatch":
      "iemand combineert binnen economisch beleid sterke voorkeuren voor markt en sterke voorkeuren voor publieke uitgaven of bescherming",
    "social-mismatch":
      "iemand laat in sociaal-cultureel beleid tegelijk openheid en traditionele behoudendheid zien op verschillende thema's",
    "civil-mismatch":
      "iemand wil tegelijk maximale persoonlijke vrijheid en sterke ordehandhaving of veiligheidsmaatregelen",
    "governance-mismatch":
      "iemand wil zowel meer EU-samenwerking als sterke nationale soevereiniteit",
    "trust-mismatch":
      "iemand vertrouwt sommige instituties wel en wantrouwt andere diep",
    "klimaat-economie":
      "iemand hecht aan ambitieus klimaatbeleid maar wil tegelijk economische lasten en regels laag houden",
    "migratie-economie":
      "iemand combineert tegengestelde houdingen tegenover migratie op verschillende dimensies (humanitair vs arbeidsmarkt)",
    "democratie-trust":
      "iemand wil sterke democratische instituties maar wantrouwt het huidige bestel diep",
  };
  return [
    `Schrijf een paragraaf van 120 tot 160 woorden over een veelvoorkomende politieke spanning: ${explanations[type]}.`,
    `Leg uit waarom dit interessant is om te zien in jezelf, en waarom dit GEEN tegenstrijdigheid hoeft te zijn maar vaak duidt op een complex waardenpatroon.`,
    `Schrijf in de tweede persoon ('je'). Gebalanceerd, geen oordeel. Geef een uitnodiging tot zelfreflectie.`,
    `Lever JSON terug: { "body": string }.`,
  ].join("\n");
}

function allSlots(): SlotPayload[] {
  return [
    ...ideologyEssaySlots(),
    ...ideologyReadingSlots(),
    ...ideologyArgumentsForSlots(),
    ...ideologyArgumentsAgainstSlots(),
    ...dimensionBucketSlots(),
    ...ideologyThemeSlots(),
    ...paradoxSlots(),
  ];
}

interface OpenAiResponse {
  body: string;
  items?: Array<{ text: string; meta?: string }>;
}

async function generateWithOpenAi(
  slot: SlotPayload,
  model: string,
): Promise<OpenAiResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY ontbreekt.");

  const url = "https://api.openai.com/v1/chat/completions";
  const messages = [
    { role: "system", content: slot.systemPrompt },
    { role: "user", content: slot.prompt },
  ];
  const body = JSON.stringify({
    model,
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 2200,
    messages,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI ${res.status}: ${text}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Lege response uit OpenAI.");
  let parsed: OpenAiResponse;
  try {
    parsed = JSON.parse(content) as OpenAiResponse;
  } catch {
    throw new Error("Kon JSON-response niet parsen.");
  }
  if (!parsed.body || typeof parsed.body !== "string") {
    throw new Error("Response mist 'body' veld.");
  }
  return parsed;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number,
  label: string,
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const delay = 1000 * Math.pow(2, i);
      console.warn(`[ai] retry ${i + 1}/${retries} voor ${label} na ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function parseArgs(): {
  force: boolean;
  onlyKind?: string;
  onlySlug?: string;
  model: string;
} {
  const args = process.argv.slice(2);
  return {
    force: args.includes("--force"),
    onlyKind: args.find((a) => a.startsWith("--kind="))?.split("=")[1],
    onlySlug: args.find((a) => a.startsWith("--slug="))?.split("=")[1],
    model:
      args.find((a) => a.startsWith("--model="))?.split("=")[1] ??
      process.env.OPENAI_MODEL ??
      "gpt-4o-mini",
  };
}

async function main() {
  process.env.PAYLOAD_DISABLE_ADMIN ??= "true";
  const { force, onlyKind, onlySlug, model } = parseArgs();

  if (!process.env.OPENAI_API_KEY) {
    console.error("[ai] OPENAI_API_KEY ontbreekt. Zet deze in .env.local.");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  let slots = allSlots();
  if (onlyKind) slots = slots.filter((s) => s.kind === onlyKind);
  if (onlySlug) slots = slots.filter((s) => s.slug === onlySlug);

  console.log(`[ai] ${slots.length} slots te verwerken, model=${model}`);
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, slot] of slots.entries()) {
    const existing = await payload.find({
      collection: "aiContent",
      where: { slug: { equals: slot.slug } },
      limit: 1,
      depth: 0,
    });
    const found = existing.docs[0] as
      | { id: number | string; humanEdited?: boolean }
      | undefined;
    if (found && !force) {
      skipped++;
      continue;
    }
    if (found?.humanEdited && force) {
      console.log(`[ai] overslaan ${slot.slug} (humanEdited)`);
      skipped++;
      continue;
    }

    try {
      const response = await withRetry(
        () => generateWithOpenAi(slot, model),
        3,
        slot.slug,
      );
      const lexicalBody = paragraphsToLexical(response.body);

      const data = {
        slug: slot.slug,
        kind: slot.kind,
        title: slot.title,
        body: lexicalBody,
        items: (response.items ?? []).map((i) => ({
          text: i.text,
          meta: i.meta,
        })),
        model,
        generatedAt: new Date().toISOString(),
        prompt: `${slot.systemPrompt}\n\n${slot.prompt}`,
        humanEdited: false,
      };

      if (found) {
        await (payload.update as (args: unknown) => Promise<unknown>)({
          collection: "aiContent",
          id: found.id,
          data,
        });
      } else {
        await (payload.create as (args: unknown) => Promise<unknown>)({
          collection: "aiContent",
          data,
        });
      }
      generated++;
      console.log(
        `[ai] (${index + 1}/${slots.length}) ${found ? "ge-update" : "aangemaakt"}: ${slot.slug}`,
      );
    } catch (e) {
      failed++;
      console.error(`[ai] FOUT bij ${slot.slug}:`, e);
    }
  }

  console.log(
    `[ai] klaar. gegenereerd: ${generated}, overgeslagen: ${skipped}, mislukt: ${failed}`,
  );
  process.exit(failed > 0 ? 2 : 0);
}

main().catch((err) => {
  console.error("[ai] fatale fout:", err);
  process.exit(1);
});
