import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

import { getAllSeedQuestions } from "../data/questions";
import { IDEOLOGIES } from "../data/ideologies";
import { POLITICIANS } from "../data/politicians";
import { COUNTRIES } from "../data/countries";
import { PARTIES } from "../data/parties";
import { tagQuestion } from "../data/question-tagger";
import { paragraphsToLexical } from "../lib/lexical";

type SeedCollection =
  | "questions"
  | "ideologies"
  | "politicians"
  | "countries"
  | "parties";

async function upsert(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: SeedCollection,
  whereField: string,
  whereValue: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { [whereField]: { equals: whereValue } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs.length > 0) {
    await (payload.update as (args: unknown) => Promise<unknown>)({
      collection,
      id: existing.docs[0].id,
      data,
    });
    return "updated" as const;
  }
  await (payload.create as (args: unknown) => Promise<unknown>)({
    collection,
    data,
  });
  return "created" as const;
}

async function main() {
  process.env.PAYLOAD_DISABLE_ADMIN ??= "true";
  const payload = await getPayload({ config });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@politiekprofiel.nl";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.SEED_ADMIN_NAME ?? "PolitiekProfiel Admin";

  const existingAdmins = await payload.find({
    collection: "users",
    limit: 1,
    depth: 0,
  });
  if (existingAdmins.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    });
    console.log(`[seed] admin user '${adminEmail}' aangemaakt (wachtwoord uit env of fallback)`);
  } else {
    console.log("[seed] admin user bestaat al, niet overschreven");
  }

  const ALL_QUESTIONS = await getAllSeedQuestions();
  let qCreated = 0;
  let qUpdated = 0;
  for (const q of ALL_QUESTIONS) {
    const tags = tagQuestion(q);
    const res = await upsert(payload, "questions", "statement", q.statement, {
      statement: q.statement,
      dimension: q.dimension,
      direction: q.direction,
      weight: q.weight ?? 1,
      tiers: q.tiers,
      depth: tags.depth,
      discriminator: tags.discriminator,
      themes: tags.themes,
      derivedStance: q.derivedStance,
      info: {
        context: q.info.context,
        argumentsFor: q.info.argumentsFor.map((text) => ({ text })),
        argumentsAgainst: q.info.argumentsAgainst.map((text) => ({ text })),
        sources: q.info.sources.map((s) => ({ label: s.label, url: s.url })),
      },
    });
    if (res === "created") qCreated++;
    else qUpdated++;
  }
  console.log(`[seed] questions: +${qCreated} nieuwe, ~${qUpdated} ge-update (${ALL_QUESTIONS.length} totaal)`);

  let iCreated = 0;
  let iUpdated = 0;
  for (const idea of IDEOLOGIES) {
    const res = await upsert(payload, "ideologies", "slug", idea.slug, {
      name: idea.name,
      slug: idea.slug,
      shortDescription: idea.shortDescription,
      description: paragraphsToLexical(idea.description),
      spectrumPosition: idea.spectrumPosition,
      profileVector: idea.profileVector,
      examplePeople: idea.examplePeople.map((text) => ({ text })),
    });
    if (res === "created") iCreated++;
    else iUpdated++;
  }
  console.log(`[seed] ideologies: +${iCreated} nieuwe, ~${iUpdated} ge-update`);

  let pCreated = 0;
  let pUpdated = 0;
  for (const p of POLITICIANS) {
    const res = await upsert(payload, "politicians", "name", p.name, {
      name: p.name,
      role: p.role,
      country: p.country,
      party: p.party,
      bio: p.bio,
      positionVector: p.positionVector,
      isInternational: p.isInternational,
      ideologySlugs: p.ideologySlugs,
      sources: p.sources.map((s) => ({ label: s.label, url: s.url })),
    });
    if (res === "created") pCreated++;
    else pUpdated++;
  }
  console.log(`[seed] politicians: +${pCreated} nieuwe, ~${pUpdated} ge-update`);

  let prCreated = 0;
  let prUpdated = 0;
  for (const party of PARTIES) {
    const res = await upsert(payload, "parties", "slug", party.slug, {
      name: party.name,
      abbreviation: party.abbreviation,
      slug: party.slug,
      region: party.region,
      regionType: party.regionType,
      country: party.country,
      description: paragraphsToLexical(party.description),
      ideologySlugs: party.ideologySlugs,
      positionVector: party.positionVector,
      founded: party.founded,
      leader: party.leader,
      websiteUrl: party.websiteUrl,
      lastReviewed: party.lastReviewed,
      sources: party.sources.map((s) => ({ label: s.label, url: s.url })),
    });
    if (res === "created") prCreated++;
    else prUpdated++;
  }
  console.log(`[seed] parties: +${prCreated} nieuwe, ~${prUpdated} ge-update`);

  let cCreated = 0;
  let cUpdated = 0;
  for (const c of COUNTRIES) {
    const res = await upsert(payload, "countries", "countryCode", c.countryCode, {
      name: c.name,
      countryCode: c.countryCode,
      description: c.description,
      positionVector: c.positionVector,
      sources: c.sources.map((s) => ({ label: s.label, url: s.url })),
    });
    if (res === "created") cCreated++;
    else cUpdated++;
  }
  console.log(`[seed] countries: +${cCreated} nieuwe, ~${cUpdated} ge-update`);

  console.log("[seed] klaar.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] fout:", err);
  process.exit(1);
});
