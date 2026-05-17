/**
 * Markdown-export van een PolitiekProfiel-resultaat.
 *
 * `GET /api/r/[id]/export.md` → tekst/Markdown bestand voor download.
 */
import { NextResponse } from "next/server";
import { getResult } from "@/lib/results-store";
import {
  getAllParties,
  getAllPoliticians,
  getIdeologyBySlug,
} from "@/lib/result-data";
import { extractStances } from "@/lib/stance-extract";
import { buildResultMarkdown } from "@/lib/result-export";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const result = await getResult(id);
  if (!result) {
    return new NextResponse("Niet gevonden", { status: 404 });
  }

  const [ideology, parties, politicians, stances] = await Promise.all([
    getIdeologyBySlug(result.ideologySlug),
    getAllParties(),
    getAllPoliticians(),
    result.answers ? extractStances(result.answers, 8) : Promise.resolve([]),
  ]);
  if (!ideology) {
    return new NextResponse("Ideologie niet gevonden", { status: 404 });
  }

  const markdown = buildResultMarkdown({
    result,
    ideology,
    parties,
    politicians,
    stances: stances.map((s) => ({
      statement: s.statement,
      signedValue: s.signedValue,
      derivedStance: s.derivedStance,
      dimension: s.dimension,
    })),
  });

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="politiekprofiel-${id}.md"`,
      "Cache-Control": "private, max-age=300",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
