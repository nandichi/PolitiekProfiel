/**
 * Schat de leestijd van een tekst in minuten.
 *
 * - 200 woorden per minuut is een conservatieve Nederlandse leessnelheid; iets
 *   onder Engelse benchmarks omdat samengestelde woorden langer zijn.
 * - Minimaal 1 minuut wanneer er enige inhoud is; lege/zeer korte teksten
 *   geven 0 (zodat de UI ze kan onderdrukken).
 */
export function readingMinutes(text: string, wpm = 200): number {
  const words = countWords(text);
  if (words < 25) return 0;
  return Math.max(1, Math.ceil(words / wpm));
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Combineer meerdere tekstbronnen en bereken één leestijd.
 */
export function readingMinutesFor(...texts: Array<string | null | undefined>): number {
  return readingMinutes(texts.filter(Boolean).join(" "));
}
