import type { MetadataRoute } from "next";

const BASE_URL = "https://politiekprofiel.nl";

// Statische lastmod-data per route, te updaten bij significante content-wijzigingen.
// Geen `new Date()` omdat dat elke crawl een vals "gewijzigd" signaal geeft, wat
// Google sinds 2024 actief negeert of als spam-signaal kan interpreteren.
//
// Format: ISO-8601. Update deze waarden wanneer de content op de pagina
// wezenlijk verandert (niet voor styling/refactor changes).
const LAST_MODIFIED = {
  home: "2026-05-16",
  quizQuick: "2026-05-16",
  quizStandard: "2026-05-16",
  quizExtended: "2026-05-16",
  vergelijk: "2026-05-16",
  methodiek: "2026-05-16",
  privacy: "2026-05-16",
  docsApi: "2026-05-16",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
