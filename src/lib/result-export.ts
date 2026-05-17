/**
 * Maak een Markdown-export van een PolitiekProfiel-resultaat.
 *
 * Bedoeld voor A6: gebruikers kunnen hun eigen resultaat lokaal bewaren of
 * delen buiten de site. Geen API-key, geen account; iedereen met het share-id
 * kan deze export downloaden.
 */
import type { StoredResult } from "@/lib/results-store";
import type { IdeologyDoc, PartyDoc, PoliticianDoc } from "@/lib/result-data";
import { DIMENSIONS, dimensionMeta } from "@/lib/dimensions";
import { THEMES } from "@/lib/themes";
import { scoreToBucket, bucketLabel } from "@/lib/buckets";
import { rankByDistance } from "@/lib/scoring";

export interface ExportInput {
  result: StoredResult;
  ideology: IdeologyDoc;
  parties: PartyDoc[];
  politicians: PoliticianDoc[];
  stances: Array<{
    statement: string;
    signedValue: number;
    derivedStance?: string | null;
    dimension: string;
  }>;
}

function formatScore(n: number): string {
  const rounded = Math.round(n);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function buildResultMarkdown(input: ExportInput): string {
  const { result, ideology, parties, politicians, stances } = input;
  const lines: string[] = [];

  lines.push(`# ${ideology.name}`);
  lines.push("");
  lines.push(`> ${ideology.shortDescription}`);
  lines.push("");
  lines.push(
    `*PolitiekProfiel resultaat · share-id \`${result.shareId}\` · gemaakt op ${new Date(
      result.createdAt,
    ).toLocaleString("nl-NL")} · ${result.answeredCount} van ${result.totalQuestions} vragen beantwoord*`,
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  // 1. Dimensies
  lines.push("## Vijf dimensies");
  lines.push("");
  for (const d of DIMENSIONS) {
    const value = result.dimensions[d.id];
    const bucket = scoreToBucket(value);
    lines.push(
      `- **${d.label}** — ${formatScore(value)} (${bucketLabel(bucket)})`,
    );
    lines.push(`  - Pool ${formatScore(-100)}: ${d.poleNegative.label}`);
    lines.push(`  - Pool ${formatScore(100)}: ${d.polePositive.label}`);
  }
  lines.push("");

  // 2. Thema's
  if (result.themeScores) {
    lines.push("## Zeven beleidsthema's");
    lines.push("");
    for (const t of THEMES) {
      const value = result.themeScores[t.id];
      lines.push(`- **${t.label}** — ${formatScore(value)}`);
    }
    lines.push("");
  }

  // 3. Standpunten
  if (stances.length > 0) {
    lines.push("## Wat jij waarschijnlijk vindt");
    lines.push("");
    lines.push(
      "Server-side gedistilleerd uit jouw sterkste antwoorden. Geen AI, geen externe analyse.",
    );
    lines.push("");
    for (const s of stances) {
      const dim = dimensionMeta(
        s.dimension as Parameters<typeof dimensionMeta>[0],
      );
      lines.push(`### ${dim.label}`);
      lines.push(`> ${s.derivedStance ?? s.statement}`);
      lines.push(
        `*Sterkte ${formatScore(s.signedValue * 25)} op een schaal van −50 tot +50.*`,
      );
      lines.push("");
    }
  }

  // 4. Onbesliste of neutrale vragen
  if (result.answers && result.answers.length > 0) {
    const neutral = result.answers.filter((a) => a.value === 0);
    if (neutral.length > 0) {
      lines.push("## Onbesliste vragen");
      lines.push("");
      lines.push(
        `Je gaf bij **${neutral.length}** vragen het antwoord 'neutraal'. Dat kan op een tussenpositie wijzen, maar ook op een onderwerp waar je nog over wilt nadenken.`,
      );
      lines.push("");
    }
  }

  // 5. Paradoxen
  if (result.paradoxes && result.paradoxes.length > 0) {
    lines.push("## Interne spanningen");
    lines.push("");
    for (const p of result.paradoxes) {
      lines.push(`- **${p.type}** (ernst ${p.severity})`);
      if (p.description) lines.push(`  - ${p.description}`);
    }
    lines.push("");
  }

  // 6. Partij-context
  const aligned = parties.filter((p) =>
    Array.isArray(p.ideologySlugs) && p.ideologySlugs.includes(ideology.slug),
  );
  if (aligned.length > 0) {
    lines.push("## Partij-context");
    lines.push("");
    const nl = aligned.filter((p) => p.region === "NL");
    const eu = aligned.filter((p) => p.region === "EU");
    const us = aligned.filter((p) => p.region === "US");
    if (nl.length > 0) {
      lines.push("**Nederland:** " + nl.map((p) => p.name).join(", "));
    }
    if (eu.length > 0) {
      lines.push("**Europa:** " + eu.map((p) => p.name).join(", "));
    }
    if (us.length > 0) {
      lines.push("**Verenigde Staten:** " + us.map((p) => p.name).join(", "));
    }
    lines.push("");
  }

  // 7. Politici (top 10)
  if (politicians.length > 0) {
    const ranked = rankByDistance(
      result.dimensions,
      politicians.map((p) => ({
        id: String(p.id),
        primary: p.name,
        secondary: `${p.party} · ${p.country}`,
        vector: p.positionVector,
      })),
    );
    lines.push("## Top 10 politici qua afstand");
    lines.push("");
    for (const [i, pol] of ranked.slice(0, 10).entries()) {
      lines.push(
        `${i + 1}. **${pol.item.primary}** · ${pol.item.secondary} (afstand ${Math.round(pol.distance)})`,
      );
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    `Gegenereerd door PolitiekProfiel. Geen tracking, geen account, geen reclame. Originele resultaat: https://politiekprofiel.nl/r/${result.shareId}`,
  );

  return lines.join("\n");
}
