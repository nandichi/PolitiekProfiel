/**
 * Anonieme cohort-inzichten op basis van Firestore-resultaten.
 *
 * Privacy-eisen:
 *  - Een cohort wordt alléén getoond als het ≥ MIN_COHORT_SIZE profielen
 *    bevat (k-anonimiteit, default k=50).
 *  - Alleen gemiddelde scores per dimensie / thema. Geen individuele
 *    resultaten, geen IP, geen tijdstempel-koppeling.
 *  - We bewaren geen extra metadata buiten wat al in `results` staat.
 *
 * Bucketing: we maken cohorten op basis van *afgeronde* dimensie-positie
 * (per 40 punten, dus 5 buckets per as = 3125 mogelijke cellen). In de praktijk
 * is alleen een handvol cellen voldoende bevolkt; de meeste worden verworpen
 * wegens te kleine n.
 */
import "server-only";

import type { DimensionId } from "@/lib/dimensions";
import type { DimensionScores } from "@/lib/scoring";
import type { ThemeId } from "@/lib/themes";
import type { ThemeScores } from "@/lib/themes";
import { firestore } from "@/lib/firebase-admin";

export const MIN_COHORT_SIZE = 50;

export type CohortBucket = -2 | -1 | 0 | 1 | 2;

export type CohortKey = Record<DimensionId, CohortBucket>;

export interface CohortStats {
  size: number;
  averageDimensions: DimensionScores;
  averageThemes: Partial<ThemeScores>;
}

const COLL = "results";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

interface CachedAggregate {
  cohorts: Map<string, CohortStats>;
  fetchedAt: number;
  totalProfiles: number;
}

let cache: CachedAggregate | null = null;

export function vectorToCohortKey(vec: DimensionScores): CohortKey {
  return {
    economic: bucketize(vec.economic),
    social: bucketize(vec.social),
    civil: bucketize(vec.civil),
    governance: bucketize(vec.governance),
    trust: bucketize(vec.trust),
  };
}

function bucketize(v: number): CohortBucket {
  if (v <= -60) return -2;
  if (v <= -20) return -1;
  if (v < 20) return 0;
  if (v < 60) return 1;
  return 2;
}

function cohortKeyToString(k: CohortKey): string {
  return `${k.economic}_${k.social}_${k.civil}_${k.governance}_${k.trust}`;
}

function firestoreConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

async function aggregate(): Promise<CachedAggregate> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache;
  if (!firestoreConfigured()) {
    cache = { cohorts: new Map(), fetchedAt: Date.now(), totalProfiles: 0 };
    return cache;
  }
  const db = firestore();
  const snap = await db.collection(COLL).select("dimensions", "themeScores").get();

  const buckets = new Map<
    string,
    {
      n: number;
      dimSums: DimensionScores;
      themeSums: Partial<Record<ThemeId, number>>;
      themeCounts: Partial<Record<ThemeId, number>>;
    }
  >();

  for (const doc of snap.docs) {
    const data = doc.data() as {
      dimensions?: DimensionScores;
      themeScores?: ThemeScores;
    };
    if (!data.dimensions) continue;
    const key = cohortKeyToString(vectorToCohortKey(data.dimensions));
    const existing = buckets.get(key) ?? {
      n: 0,
      dimSums: { economic: 0, social: 0, civil: 0, governance: 0, trust: 0 },
      themeSums: {},
      themeCounts: {},
    };
    existing.n += 1;
    for (const d of [
      "economic",
      "social",
      "civil",
      "governance",
      "trust",
    ] as DimensionId[]) {
      existing.dimSums[d] += data.dimensions[d];
    }
    if (data.themeScores) {
      for (const [t, val] of Object.entries(data.themeScores)) {
        existing.themeSums[t as ThemeId] =
          (existing.themeSums[t as ThemeId] ?? 0) + (val as number);
        existing.themeCounts[t as ThemeId] =
          (existing.themeCounts[t as ThemeId] ?? 0) + 1;
      }
    }
    buckets.set(key, existing);
  }

  const cohorts = new Map<string, CohortStats>();
  for (const [key, acc] of buckets.entries()) {
    if (acc.n < MIN_COHORT_SIZE) continue;
    const averageDimensions: DimensionScores = {
      economic: acc.dimSums.economic / acc.n,
      social: acc.dimSums.social / acc.n,
      civil: acc.dimSums.civil / acc.n,
      governance: acc.dimSums.governance / acc.n,
      trust: acc.dimSums.trust / acc.n,
    };
    const averageThemes: Partial<ThemeScores> = {};
    for (const [t, sum] of Object.entries(acc.themeSums)) {
      const n = acc.themeCounts[t as ThemeId] ?? 0;
      if (n > 0) {
        averageThemes[t as ThemeId] = sum / n;
      }
    }
    cohorts.set(key, {
      size: acc.n,
      averageDimensions,
      averageThemes,
    });
  }

  cache = {
    cohorts,
    fetchedAt: Date.now(),
    totalProfiles: snap.size,
  };
  return cache;
}

/**
 * Haal het cohort op dat past bij de gegeven gebruikersvector. Retourneert
 * `null` als het cohort te klein is (privacy-floor) of als er geen data is.
 */
export async function getCohortForVector(
  vector: DimensionScores,
): Promise<CohortStats | null> {
  const agg = await aggregate();
  const key = cohortKeyToString(vectorToCohortKey(vector));
  return agg.cohorts.get(key) ?? null;
}

export async function getTotalProfileCount(): Promise<number> {
  const agg = await aggregate();
  return agg.totalProfiles;
}

/** Lijst alle typology-clusters (Pew-stijl) die voldoende bevolkt zijn. */
export async function listTypologyClusters(): Promise<
  Array<{
    name: string;
    description: string;
    centroid: DimensionScores;
    size: number;
  }>
> {
  const agg = await aggregate();
  // We gebruiken een hand-gecureerde lijst van archetypes en vinden voor elk
  // het bestbevolkte cohort dat eraan voldoet. Dit is geen echte k-means,
  // maar geeft wel een Pew-achtige interpretatie zonder een live model.
  const archetypes: Array<{
    name: string;
    description: string;
    target: DimensionScores;
  }> = [
    {
      name: "Progressieve grootstedeling",
      description:
        "Klimaatambitieus, sociaal-progressief, libertair op burgerrechten, pro-EU.",
      target: { economic: 50, social: 70, civil: 50, governance: 70, trust: 30 },
    },
    {
      name: "Sociaal-conservatieve middenburger",
      description:
        "Wantrouwig tegen snelle culturele verandering, sterk op zorg en bestaanszekerheid, voorzichtig met EU.",
      target: { economic: 30, social: -40, civil: -20, governance: -20, trust: 10 },
    },
    {
      name: "Liberaal-conservatief",
      description:
        "Markt-vriendelijk, sterke instituties, beperkte overheidsinmenging, voorzichtig pro-EU.",
      target: { economic: -50, social: -10, civil: -10, governance: 10, trust: 30 },
    },
    {
      name: "Nationaal-populist",
      description:
        "Wantrouwen jegens elites, restrictief op migratie, EU-kritisch, sterke nadruk op identiteit.",
      target: { economic: 0, social: -70, civil: -30, governance: -70, trust: -60 },
    },
    {
      name: "Eco-radicaal",
      description:
        "Sterk groen, herverdelend, libertair op burgerrechten, kritisch op markteconomie.",
      target: { economic: 70, social: 70, civil: 40, governance: 50, trust: 10 },
    },
    {
      name: "Technocratisch-centrist",
      description:
        "Pragmatisch, vertrouwen in instituties, multilevel governance, gematigd progressief.",
      target: { economic: 10, social: 30, civil: 20, governance: 60, trust: 50 },
    },
    {
      name: "Klassiek links",
      description:
        "Sterk herverdelend, sociaaldemocratisch, kritisch op markt en privatisering.",
      target: { economic: 70, social: 30, civil: 20, governance: 10, trust: 0 },
    },
    {
      name: "Klassiek rechts-liberaal",
      description:
        "Vrije markt, kleine staat, voorzichtig met grote culturele verandering, sterk vertrouwen rechtsstaat.",
      target: { economic: -60, social: -20, civil: 10, governance: 20, trust: 40 },
    },
  ];

  const out: Array<{
    name: string;
    description: string;
    centroid: DimensionScores;
    size: number;
  }> = [];

  for (const arch of archetypes) {
    const key = cohortKeyToString(vectorToCohortKey(arch.target));
    const cohort = agg.cohorts.get(key);
    if (!cohort) continue;
    out.push({
      name: arch.name,
      description: arch.description,
      centroid: cohort.averageDimensions,
      size: cohort.size,
    });
  }

  return out.sort((a, b) => b.size - a.size);
}
