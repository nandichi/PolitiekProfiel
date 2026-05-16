/**
 * JSON-LD helper-functies. Bouwt schema.org-compatible objecten die in
 * <script type="application/ld+json"> kunnen worden gerenderd.
 *
 * Designprincipes:
 *  - Alle URLs absoluut, opgebouwd via SITE_URL.
 *  - @id-velden gebruiken fragmenten zodat schema-graphs onderling kunnen
 *    refereren (`#organization`, `#founder`, `#website`).
 *  - Geen deprecated types (HowTo, ClaimReview, etc.).
 *  - Geen FAQPage gebruikt voor non-FAQ content.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://politiekprofiel.nl";

export const ORG_ID = `${SITE_URL}#organization`;
export const SITE_ID = `${SITE_URL}#website`;
export const FOUNDER_ID = `${SITE_URL}#founder`;

function abs(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// ─────────────────────────────────────────────────────────────────
// Breadcrumbs
// ─────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  /** Relatief pad (`/methodiek`) of absolute URL. */
  item?: string;
}

/**
 * Bouwt een BreadcrumbList. Het laatste item krijgt geen `item`-veld omdat
 * Google de laatste crumb behandelt als de huidige pagina; een URL daar zou
 * zelf-refererend zijn.
 */
export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => {
      const position = i + 1;
      const isLast = i === items.length - 1;
      const base: Record<string, unknown> = {
        "@type": "ListItem",
        position,
        name: it.name,
      };
      if (!isLast && it.item) {
        base.item = abs(it.item);
      }
      return base;
    }),
  };
}

// ─────────────────────────────────────────────────────────────────
// Article (voor methodiek + privacy)
// ─────────────────────────────────────────────────────────────────

export interface ArticleSchemaInput {
  /** Pad zoals `/methodiek`. */
  path: string;
  headline: string;
  description: string;
  /** ISO-8601 datum waarop content voor het laatst significant gewijzigd is. */
  dateModified: string;
  /** ISO-8601 datum eerste publicatie. */
  datePublished: string;
  /** Sectie-label (bv. "Methodiek", "Privacy"). */
  articleSection?: string;
  /** Custom OG image path of absoluut. Default: route's eigen opengraph-image. */
  imagePath?: string;
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  const url = abs(input.path);
  const image = input.imagePath
    ? abs(input.imagePath)
    : abs(`${input.path}/opengraph-image`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: input.headline,
    description: input.description,
    inLanguage: "nl-NL",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@id": FOUNDER_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    isAccessibleForFree: true,
    license: abs("/privacy"),
  };
}

// ─────────────────────────────────────────────────────────────────
// FAQPage
// ─────────────────────────────────────────────────────────────────

export interface FaqEntry {
  question: string;
  /** Plain text antwoord; wordt in `acceptedAnswer.text` gezet. */
  answer: string;
}

/**
 * FAQPage werkt sinds aug 2023 alleen nog voor gov/healthcare in Google's rich
 * results, MAAR het verbetert AI citation rates significant (Princeton GEO).
 * Gebruik daarom voor educational/methodologie content waar Q&A-formaat
 * intrinsiek aanwezig is.
 */
export function buildFaqPage(entries: FaqEntry[], pagePath: string) {
  const url = abs(pagePath);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: "nl-NL",
    isPartOf: { "@id": SITE_ID },
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────
// Quiz (voor /quiz/[tier])
// ─────────────────────────────────────────────────────────────────

export interface QuizSchemaInput {
  /** Pad zoals `/quiz/standard`. */
  path: string;
  name: string;
  description: string;
  /** Aantal vragen in deze tier. */
  numberOfQuestions: number;
  /** Geschatte tijdsduur in ISO 8601 duration format, bv. `PT10M`. */
  timeRequired: string;
  /** Educational level: bv. "general public". */
  educationalLevel?: string;
}

export function buildQuizSchema(input: QuizSchemaInput) {
  const url = abs(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": `${url}#quiz`,
    name: input.name,
    description: input.description,
    inLanguage: "nl-NL",
    url,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    creator: { "@id": FOUNDER_ID },
    about: [
      { "@type": "Thing", name: "Nederlandse politiek" },
      { "@type": "Thing", name: "politiek kompas" },
      { "@type": "Thing", name: "politieke ideologieën" },
    ],
    numberOfQuestions: input.numberOfQuestions,
    timeRequired: input.timeRequired,
    educationalUse: "self-assessment",
    learningResourceType: "self-assessment",
    typicalAgeRange: "16-",
    audience: {
      "@type": "Audience",
      audienceType: "Nederlandse kiezers",
      geographicArea: { "@type": "Country", name: "Netherlands" },
    },
    isAccessibleForFree: true,
    educationalLevel: input.educationalLevel ?? "general public",
  };
}

// ─────────────────────────────────────────────────────────────────
// JSON-LD render helper
// ─────────────────────────────────────────────────────────────────

/**
 * Serialiseert één of meerdere JSON-LD objecten op een veilige manier.
 * Voorkomt XSS via `</script>` injection in string velden door `<` te escapen.
 */
export function jsonLdString(
  schema: Record<string, unknown> | Record<string, unknown>[],
): string {
  const arr = Array.isArray(schema) ? schema : [schema];
  return JSON.stringify(arr.length === 1 ? arr[0] : arr).replace(
    /</g,
    "\\u003c",
  );
}
