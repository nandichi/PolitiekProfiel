/**
 * Vertaalt stemgedrag (per partij, per thema) naar een 5-dimensionale vector
 * via een theme→dimension matrix die we afleiden uit de questions-database.
 *
 * Logica:
 *  - We tellen voor elk paar (theme, dimension) hoe vaak vragen met dat thema
 *    op die dimensie scoren. We gebruiken `direction` om het teken te bepalen.
 *  - Het resultaat is een gewichten-matrix W[theme][dimension] die optelt
 *    tot 1 per thema.
 *  - Voor een partij projecteren we een theme-score (range -100..+100, waarbij
 *    +100 = altijd voor 'positief geframede' moties) op een dimensie-vector.
 *
 * Limitations:
 *  - We hebben geen per-motie directionality (wat 'voor' op een specifieke
 *    motie inhoudt qua dimensie). We benaderen via theme-aggregaat.
 *  - Politici stemmen meestal met de partij. Individuele afwijkingen kunnen we
 *    pas tonen als we per-MP stemmingen gaan opslaan (toekomstig werk).
 */
import "server-only";

import type { DimensionId } from "@/lib/dimensions";
import type { DimensionScores } from "@/lib/scoring";
import type { ThemeId } from "@/lib/themes";
import { THEME_IDS } from "@/lib/themes";
import { getAllSeedQuestions } from "@/data/questions";
import type { PartyThemeVoting } from "@/lib/tk-open-data/voting-store";

type ThemeDimensionMatrix = Record<ThemeId, Record<DimensionId, number>>;

let cachedMatrix: ThemeDimensionMatrix | null = null;

async function buildMatrix(): Promise<ThemeDimensionMatrix> {
  if (cachedMatrix) return cachedMatrix;
  const questions = await getAllSeedQuestions();
  const matrix: ThemeDimensionMatrix = THEME_IDS.reduce((acc, t) => {
    acc[t] = {
      economic: 0,
      social: 0,
      civil: 0,
      governance: 0,
      trust: 0,
    };
    return acc;
  }, {} as ThemeDimensionMatrix);

  for (const q of questions) {
    if (!q.themes || q.themes.length === 0) continue;
    const sign = q.direction === "positive" ? 1 : -1;
    const weight = (q.weight ?? 1) * sign;
    for (const theme of q.themes) {
      matrix[theme][q.dimension] += weight;
    }
  }

  for (const t of THEME_IDS) {
    let totalAbs = 0;
    for (const d of [
      "economic",
      "social",
      "civil",
      "governance",
      "trust",
    ] as DimensionId[]) {
      totalAbs += Math.abs(matrix[t][d]);
    }
    if (totalAbs > 0) {
      for (const d of [
        "economic",
        "social",
        "civil",
        "governance",
        "trust",
      ] as DimensionId[]) {
        matrix[t][d] /= totalAbs;
      }
    }
  }

  cachedMatrix = matrix;
  return matrix;
}

/**
 * Bereken een afgeleide dimensievector op basis van stemgedrag-percentages.
 *
 * Idee: voor elk thema in de voting-records, bereken een 'theme-score' in
 * range [-100, +100] (waarbij +100 = altijd voor 'progressief' geframede
 * moties). We weten echter niet of een individuele motie progressief of
 * conservatief is, dus we gebruiken voorPct als globale richting: hoog
 * voorPct = 'partij stemt vaak voor (motie-)voorstellen op dit thema' →
 * meer actie/verandering, wat we projecteren als positieve uitslag.
 *
 * In de praktijk werkt dit als een ruwe proxy: een partij die op klimaat
 * vaak 'voor' stemt op moties komt op de klimaat-as als 'ambitieus' uit.
 * Voor 'soeverein vs geïntegreerd' werkt dit aanmerkelijk slechter; dat
 * vraagt directionality-labels per motie (toekomstig werk).
 */
export async function projectVotingToDimensions(
  votingByTheme: ReadonlyArray<PartyThemeVoting>,
): Promise<{
  vector: DimensionScores;
  totalMotions: number;
  coverage: number;
} | null> {
  if (votingByTheme.length === 0) return null;
  const matrix = await buildMatrix();

  const vector: DimensionScores = {
    economic: 0,
    social: 0,
    civil: 0,
    governance: 0,
    trust: 0,
  };
  let totalMotions = 0;
  const seenThemes = new Set<ThemeId>();

  for (const rec of votingByTheme) {
    if (rec.theme === "overig") continue;
    const themeWeights = matrix[rec.theme];
    if (!themeWeights) continue;
    seenThemes.add(rec.theme);
    totalMotions += rec.totaal;
    const score = rec.voorPct * 2 - 100;
    for (const d of [
      "economic",
      "social",
      "civil",
      "governance",
      "trust",
    ] as DimensionId[]) {
      vector[d] += score * themeWeights[d];
    }
  }

  if (totalMotions === 0) return null;

  for (const d of [
    "economic",
    "social",
    "civil",
    "governance",
    "trust",
  ] as DimensionId[]) {
    vector[d] = Math.max(-100, Math.min(100, Math.round(vector[d])));
  }

  return {
    vector,
    totalMotions,
    coverage: seenThemes.size / THEME_IDS.length,
  };
}
