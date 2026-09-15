/**
 * Hoeveel vragen er per thema in iemands quiz zaten, bepaalt wat we over dat
 * thema mogen beweren.
 *
 * Zonder deze grens toont de resultaatpagina een score van 0 voor een thema
 * waarover nooit iets is gevraagd. Dat cijfer is dan niet te onderscheiden van
 * een oprecht neutraal antwoord, terwijl het in werkelijkheid betekent dat de
 * quiz er niets over vroeg.
 */

export type ThemeCoverageState = "geen" | "voorzichtig" | "voldoende";

/** Onder deze grens is een themascore een indicatie, geen uitkomst. */
const ENOUGH_ANSWERS = 3;

export function themeCoverageState(
  count: number | undefined,
): ThemeCoverageState | null {
  if (count === undefined || !Number.isFinite(count)) return null;
  if (count <= 0) return "geen";
  if (count < ENOUGH_ANSWERS) return "voorzichtig";
  return "voldoende";
}

export function themeCoverageLabel(count: number | undefined): string | null {
  const state = themeCoverageState(count);
  if (state === null) return null;
  if (state === "geen") return "Geen vragen over dit thema in jouw quiz";
  const questions = count === 1 ? "1 vraag" : `${count} vragen`;
  if (state === "voorzichtig") return `Voorzichtige indicatie op basis van ${questions}`;
  return `Op basis van ${questions} over dit thema`;
}
