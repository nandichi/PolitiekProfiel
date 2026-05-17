/**
 * Coalitie-simulator: zoek combinaties van Nederlandse partijen die samen
 * minimaal `targetSeats` zetels halen en bereken hun gewogen 5-dimensie
 * afstand tot een gebruikersvector.
 *
 * Geen stemadvies: dit is een gedachte-experiment dat alleen werkt vanuit
 * meegegeven `seatsTK2025` en `positionVector` per partij.
 */
import type { DimensionScores } from "@/lib/scoring";
import type { SeedParty } from "@/data/parties";
import { distance } from "@/lib/scoring";

export interface CoalitionInput {
  slug: string;
  name: string;
  abbreviation: string;
  seats: number;
  vector: DimensionScores;
  coalitionStatus?: SeedParty["coalitionStatus"];
}

export interface CoalitionCandidate {
  parties: CoalitionInput[];
  totalSeats: number;
  weightedDistance: number;
  spread: number;
}

const DEFAULT_MAJORITY = 76;

function weightedCentroid(
  parties: ReadonlyArray<CoalitionInput>,
): DimensionScores {
  const total = parties.reduce((s, p) => s + p.seats, 0) || 1;
  const sum: DimensionScores = {
    economic: 0,
    social: 0,
    civil: 0,
    governance: 0,
    trust: 0,
  };
  for (const p of parties) {
    sum.economic += p.vector.economic * p.seats;
    sum.social += p.vector.social * p.seats;
    sum.civil += p.vector.civil * p.seats;
    sum.governance += p.vector.governance * p.seats;
    sum.trust += p.vector.trust * p.seats;
  }
  return {
    economic: sum.economic / total,
    social: sum.social / total,
    civil: sum.civil / total,
    governance: sum.governance / total,
    trust: sum.trust / total,
  };
}

function coalitionSpread(parties: ReadonlyArray<CoalitionInput>): number {
  if (parties.length < 2) return 0;
  let max = 0;
  for (let i = 0; i < parties.length; i++) {
    for (let j = i + 1; j < parties.length; j++) {
      const d = distance(parties[i].vector, parties[j].vector);
      if (d > max) max = d;
    }
  }
  return max;
}

/**
 * Genereer alle coalities tot maxSize partijen die samen minimaal majority
 * zetels halen. Aflopend gesorteerd op match (laagste afstand eerst).
 *
 * Performance: voor 16 partijen × maxSize 6 = ~14_500 combinaties, prima
 * voor server-side rendering en build-time.
 */
export function findCoalitions(options: {
  parties: ReadonlyArray<CoalitionInput>;
  userVector?: DimensionScores;
  majority?: number;
  totalSeats?: number;
  maxSize?: number;
  limit?: number;
}): CoalitionCandidate[] {
  const {
    parties,
    userVector,
    majority = DEFAULT_MAJORITY,
    maxSize = 6,
    limit = 50,
  } = options;

  // Filter: alleen partijen met >= 1 zetel meedoen
  const pool = parties.filter((p) => p.seats > 0);
  const candidates: CoalitionCandidate[] = [];

  function combine(start: number, current: CoalitionInput[], seats: number) {
    if (seats >= majority) {
      const centroid = weightedCentroid(current);
      const d = userVector ? distance(userVector, centroid) : 0;
      candidates.push({
        parties: current.slice(),
        totalSeats: seats,
        weightedDistance: d,
        spread: coalitionSpread(current),
      });
      // We hoeven niet door te gaan: meer partijen = nooit kleinere coalitie
      // maar wel mogelijk lagere afstand. Voor diversiteit blijven we
      // doorbouwen tot maxSize.
    }
    if (current.length >= maxSize) return;
    for (let i = start; i < pool.length; i++) {
      current.push(pool[i]);
      combine(i + 1, current, seats + pool[i].seats);
      current.pop();
    }
  }

  combine(0, [], 0);

  // Sorteer: hoofdmaat = match met user. Bij gelijke score: minder partijen wint.
  candidates.sort((a, b) => {
    if (a.weightedDistance !== b.weightedDistance) {
      return a.weightedDistance - b.weightedDistance;
    }
    if (a.parties.length !== b.parties.length) {
      return a.parties.length - b.parties.length;
    }
    return a.spread - b.spread;
  });

  return candidates.slice(0, limit);
}

/**
 * Voorgedefinieerde "scenario" coalities: huidige kabinet, klassieke varianten,
 * brede coalities. Voor de niet-personalised view op /coalitie.
 */
export interface PresetCoalition {
  name: string;
  description: string;
  slugs: string[];
  parties: CoalitionInput[];
}

export function presetCoalitions(
  parties: ReadonlyArray<CoalitionInput>,
): PresetCoalition[] {
  return [
    {
      name: "Kabinet-Jetten",
      description:
        "Het zittende minderheidskabinet van D66, VVD en CDA (sinds 23 februari 2026, 66 zetels).",
      slugs: ["d66", "vvd", "cda"],
    },
    {
      name: "Paars-plus",
      description:
        "Klassieke paarse coalitie verbreed: D66, VVD, GL-PvdA met aanvulling.",
      slugs: ["d66", "vvd", "groenlinks-pvda", "volt"],
    },
    {
      name: "Rechts-kabinet",
      description:
        "Rechtse meerderheidsvariant: PVV, VVD, BBB, JA21, eventueel met DNA.",
      slugs: ["pvv", "vvd", "bbb", "ja21", "dna"],
    },
    {
      name: "Progressief blok",
      description:
        "GL-PvdA, D66, Volt, PvdD, DENK — progressief, klimaatambitieus, pro-EU.",
      slugs: ["groenlinks-pvda", "d66", "volt", "pvdd", "denk"],
    },
    {
      name: "Brede middenkoers",
      description:
        "D66, VVD, CDA, GL-PvdA, NSC-opvolgers — brede meerderheid in het midden.",
      slugs: ["d66", "vvd", "cda", "groenlinks-pvda"],
    },
  ]
    .map((preset) => ({
      ...preset,
      parties: preset.slugs
        .map((s) => parties.find((p) => p.slug === s))
        .filter((p): p is CoalitionInput => Boolean(p)),
    }))
    .filter((preset) => preset.parties.length >= 2);
}
