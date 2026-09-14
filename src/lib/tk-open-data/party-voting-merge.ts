/**
 * Pure samenvoeglogica voor TK-stemgedrag per partij en thema.
 *
 * Staat los van `voting-store.ts` (dat `server-only` importeert en dus niet in
 * een testomgeving laadt), zodat de rekenregel testbaar blijft.
 *
 * Waarom samenvoegen: de wekelijkse TK-refresh schrijft weg onder de
 * partijpagina-slug. Toen die slug voor Progressief Nederland en Groep
 * Markuszower veranderde, bleven oudere rijen onder de oude naam in de
 * database staan. Door bij het lezen de canonieke slug én zijn oude namen op te
 * halen en per thema op te tellen, verdwijnt de opgebouwde historie niet.
 */

export interface PartyThemeVotingRow {
  partySlug: string;
  theme: string;
  voor: number;
  tegen: number;
  onthouding: number;
  totaal: number;
  voorPct: number;
  updatedAt: string;
}

export function mergePartyVotingRows<T extends PartyThemeVotingRow>(
  canonicalSlug: string,
  rows: readonly T[],
): T[] {
  const byTheme = new Map<string, T>();

  for (const row of rows) {
    const previous = byTheme.get(row.theme);

    if (!previous) {
      byTheme.set(row.theme, { ...row, partySlug: canonicalSlug });
      continue;
    }

    const voor = previous.voor + row.voor;
    const tegen = previous.tegen + row.tegen;
    const onthouding = previous.onthouding + row.onthouding;
    const totaal = voor + tegen + onthouding;

    byTheme.set(row.theme, {
      ...previous,
      partySlug: canonicalSlug,
      voor,
      tegen,
      onthouding,
      totaal,
      voorPct: totaal > 0 ? Math.round((voor / totaal) * 100) : 0,
      updatedAt: previous.updatedAt >= row.updatedAt ? previous.updatedAt : row.updatedAt,
    });
  }

  return Array.from(byTheme.values());
}
