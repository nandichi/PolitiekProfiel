import type { MetadataRoute } from "next";
import {
  getAllCountriesSeed,
  getAllIdeologiesSeed,
  getAllPartiesSeed,
  getAllPoliticiansSeed,
  getAllQuestionsSeed,
} from "@/lib/seed-readers";
import { GLOSSARY } from "@/data/woordenboek";

const BASE_URL = "https://politiekprofiel.nl";

// Statische lastmod-data per route, te updaten bij significante content-wijzigingen.
// Geen `new Date()` omdat dat elke crawl een vals "gewijzigd" signaal geeft, wat
// Google sinds 2024 actief negeert of als spam-signaal kan interpreteren.
//
// Format: ISO-8601. Update deze waarden wanneer de content op de pagina
// wezenlijk verandert (niet voor styling/refactor changes).
const LAST_MODIFIED = {
  home: "2026-05-17",
  quizQuick: "2026-05-17",
  quizStandard: "2026-05-17",
  quizExtended: "2026-05-17",
  vergelijk: "2026-05-17",
  methodiek: "2026-05-17",
  privacy: "2026-05-17",
  docsApi: "2026-05-17",
  verkennen: "2026-05-17",
  hubs: "2026-05-17",
  details: "2026-05-17",
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [questions, politicians] = await Promise.all([
    getAllQuestionsSeed(),
    Promise.resolve(getAllPoliticiansSeed()),
  ]);
  const ideologies = getAllIdeologiesSeed();
  const parties = getAllPartiesSeed();
  const countries = getAllCountriesSeed();

  const hubs: MetadataRoute.Sitemap = [
    "/verkennen",
    "/stellingen",
    "/ideologieen",
    "/politici",
    "/partijen",
    "/landen",
    "/woordenboek",
    "/coalitie",
    "/turing-test",
    "/evolutie",
    "/typology",
    "/citaten",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: LAST_MODIFIED.hubs,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const details: MetadataRoute.Sitemap = [
    ...questions.map((q) => ({
      url: `${BASE_URL}/stelling/${q.id}`,
      lastModified: LAST_MODIFIED.details,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...ideologies.map((i) => ({
      url: `${BASE_URL}/ideologie/${i.slug}`,
      lastModified: LAST_MODIFIED.details,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...politicians.map((p) => ({
      url: `${BASE_URL}/politici/${p.slug}`,
      lastModified: LAST_MODIFIED.details,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...parties.map((p) => ({
      url: `${BASE_URL}/partij/${p.slug}`,
      lastModified: LAST_MODIFIED.details,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...countries.map((c) => ({
      url: `${BASE_URL}/land/${c.countryCode.toLowerCase()}`,
      lastModified: LAST_MODIFIED.details,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...GLOSSARY.map((g) => ({
      url: `${BASE_URL}/woordenboek/${g.slug}`,
      lastModified: LAST_MODIFIED.details,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "nl-NL": `${BASE_URL}/`,
          "x-default": `${BASE_URL}/`,
        },
      },
    },
    // Aanbevolen quiz-tier krijgt hoogste priority na homepage. De andere
    // twee tiers zijn varianten en concurreren niet om dezelfde queries.
    {
      url: `${BASE_URL}/quiz/standard`,
      lastModified: LAST_MODIFIED.quizStandard,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "nl-NL": `${BASE_URL}/quiz/standard`,
          "x-default": `${BASE_URL}/quiz/standard`,
        },
      },
    },
    {
      url: `${BASE_URL}/quiz/quick`,
      lastModified: LAST_MODIFIED.quizQuick,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "nl-NL": `${BASE_URL}/quiz/quick`,
          "x-default": `${BASE_URL}/quiz/quick`,
        },
      },
    },
    {
      url: `${BASE_URL}/quiz/extended`,
      lastModified: LAST_MODIFIED.quizExtended,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "nl-NL": `${BASE_URL}/quiz/extended`,
          "x-default": `${BASE_URL}/quiz/extended`,
        },
      },
    },
    {
      url: `${BASE_URL}/methodiek`,
      lastModified: LAST_MODIFIED.methodiek,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "nl-NL": `${BASE_URL}/methodiek`,
          "x-default": `${BASE_URL}/methodiek`,
        },
      },
    },
    {
      url: `${BASE_URL}/vergelijk`,
      lastModified: LAST_MODIFIED.vergelijk,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          "nl-NL": `${BASE_URL}/vergelijk`,
          "x-default": `${BASE_URL}/vergelijk`,
        },
      },
    },
    {
      url: `${BASE_URL}/docs/api`,
      lastModified: LAST_MODIFIED.docsApi,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: LAST_MODIFIED.privacy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...hubs,
    ...details,
  ];
}
