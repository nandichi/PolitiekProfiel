import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { DimensionBar } from "@/components/DimensionBar";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getResult, type StoredResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";
import { THEMES } from "@/lib/themes";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import { EvolutionPicker } from "@/components/evolution/EvolutionPicker";

const PAGE_PATH = "/evolutie";
const PAGE_TITLE = "Politieke evolutie";
const PAGE_DESCRIPTION =
  "Plak meerdere share-IDs en zie hoe je politieke vector zich over de tijd ontwikkelt. Geen account en geen server-opslag van de keten; jij beheert de ID-lijst lokaal.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: `${PAGE_TITLE} · PolitiekProfiel`,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "website",
  },
  robots: { index: true, follow: true },
};

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

function parseIds(input?: string): string[] {
  if (!input) return [];
  return Array.from(
    new Set(
      input
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter((s) => /^[A-Za-z0-9_-]{6,32}$/.test(s)),
    ),
  );
}

interface ResolvedEntry {
  id: string;
  result: StoredResult | null;
  ideologyName: string | null;
}

export default async function EvolutiePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ids = parseIds(sp.ids);

  const resolved: ResolvedEntry[] = await Promise.all(
    ids.map(async (id) => {
      const result = await getResult(id).catch(() => null);
      const ideo = result ? await getIdeologyBySlug(result.ideologySlug) : null;
      return { id, result, ideologyName: ideo?.name ?? null };
    }),
  );

  const valid = resolved.filter(
    (r): r is ResolvedEntry & { result: NonNullable<ResolvedEntry["result"]> } =>
      r.result !== null,
  );
  // Sorteer chronologisch: oudste eerst.
  valid.sort(
    (a, b) =>
      new Date(a.result.createdAt).getTime() -
      new Date(b.result.createdAt).getTime(),
  );

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Politieke evolutie", item: PAGE_PATH },
  ]);

  return (
    <Container width="bleed" className="pt-12 md:pt-20 pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <ScrollReveal variant="stagger" immediate>
        <ScrollRevealItem>
          <Kicker number="C1">Politieke evolutie</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Jouw eigen{" "}
            <em className="display-italic font-light text-navy">tijdlijn</em>.
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            We bewaren niet wie wat heeft ingevuld. Daarom werk je hier met
            share-IDs: korte codes die je vindt onderaan jouw resultaatpagina.
            Plak er meerdere achter elkaar en je ziet hoe je vector evolueert.
            De lijst staat in de URL; bookmark hem of stuur hem aan jezelf
            via een notitie-app.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-12 border-t border-ink pt-10">
        <Kicker number={1}>Voeg share-IDs toe</Kicker>
        <div className="mt-6">
          <EvolutionPicker initialIds={ids} />
        </div>
      </section>

      {valid.length === 0 && ids.length > 0 && (
        <p className="mt-10 text-sm text-terra">
          Geen geldige resultaten gevonden voor: {ids.join(", ")}
        </p>
      )}

      {valid.length > 0 && (
        <>
          {/* Tijdlijn van profielen */}
          <section className="mt-16 border-t border-ink pt-10">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>Tijdlijn</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  {valid.length} momenten, chronologisch.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-10 space-y-12">
                  {valid.map((entry, i) => (
                    <li
                      key={entry.id}
                      className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6"
                    >
                      <div>
                        <p className="index-num text-xs">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="kicker mt-2">
                          {new Date(entry.result.createdAt).toLocaleDateString(
                            "nl-NL",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                        <p className="display text-lg mt-2 text-ink">
                          {entry.ideologyName ?? entry.result.ideologySlug}
                        </p>
                        <Link
                          href={`/r/${entry.id}`}
                          className="mt-2 inline-block text-xs text-ink-2 hover:text-navy no-underline"
                        >
                          Bekijk volledig →
                        </Link>
                      </div>
                      <div className="max-w-2xl">
                        {DIMENSIONS.map((d, idx) => (
                          <DimensionBar
                            key={d.id}
                            dimension={d.id}
                            value={entry.result.dimensions[d.id]}
                            index={idx}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          {/* Delta-tabel */}
          {valid.length >= 2 && (
            <section className="mt-16 border-t border-ink pt-10">
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={3}>Verandering per dimensie</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Van eerste naar laatste meting.
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <table className="mt-8 w-full max-w-3xl border-collapse">
                    <thead>
                      <tr className="border-b border-ink">
                        <th className="kicker text-left pb-3">Dimensie</th>
                        <th className="kicker text-right pb-3">Eerste</th>
                        <th className="kicker text-right pb-3">Laatste</th>
                        <th className="kicker text-right pb-3">Δ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DIMENSIONS.map((d) => {
                        const first = valid[0].result.dimensions[d.id];
                        const last =
                          valid[valid.length - 1].result.dimensions[d.id];
                        const delta = last - first;
                        const sign = delta > 0 ? "+" : delta < 0 ? "" : "±";
                        return (
                          <tr key={d.id} className="border-b border-rule">
                            <td className="py-3 text-sm text-ink">{d.label}</td>
                            <td className="py-3 mono tabular-nums text-sm text-ink-2 text-right">
                              {Math.round(first)}
                            </td>
                            <td className="py-3 mono tabular-nums text-sm text-ink-2 text-right">
                              {Math.round(last)}
                            </td>
                            <td
                              className={`py-3 mono tabular-nums text-sm text-right ${
                                Math.abs(delta) > 5
                                  ? delta > 0
                                    ? "text-navy"
                                    : "text-terra"
                                  : "text-ink-muted"
                              }`}
                            >
                              {sign}
                              {Math.round(delta)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ScrollRevealItem>

                {/* Thema's delta */}
                <ScrollRevealItem>
                  {valid[0].result.themeScores &&
                  valid[valid.length - 1].result.themeScores ? (
                    <table className="mt-8 w-full max-w-3xl border-collapse">
                      <thead>
                        <tr className="border-b border-ink">
                          <th className="kicker text-left pb-3">Thema</th>
                          <th className="kicker text-right pb-3">Eerste</th>
                          <th className="kicker text-right pb-3">Laatste</th>
                          <th className="kicker text-right pb-3">Δ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {THEMES.map((t) => {
                          const first =
                            valid[0].result.themeScores?.[t.id] ?? 0;
                          const last =
                            valid[valid.length - 1].result.themeScores?.[
                              t.id
                            ] ?? 0;
                          const delta = last - first;
                          const sign =
                            delta > 0 ? "+" : delta < 0 ? "" : "±";
                          return (
                            <tr key={t.id} className="border-b border-rule">
                              <td className="py-3 text-sm text-ink">
                                {t.label}
                              </td>
                              <td className="py-3 mono tabular-nums text-sm text-ink-2 text-right">
                                {Math.round(first)}
                              </td>
                              <td className="py-3 mono tabular-nums text-sm text-ink-2 text-right">
                                {Math.round(last)}
                              </td>
                              <td
                                className={`py-3 mono tabular-nums text-sm text-right ${
                                  Math.abs(delta) > 5
                                    ? delta > 0
                                      ? "text-navy"
                                      : "text-terra"
                                    : "text-ink-muted"
                                }`}
                              >
                                {sign}
                                {Math.round(delta)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : null}
                </ScrollRevealItem>
              </ScrollReveal>
            </section>
          )}
        </>
      )}

      <section className="mt-16 border-t border-ink pt-10 max-w-3xl">
        <p className="kicker mb-3">Privacy</p>
        <p className="text-sm text-ink-2 leading-relaxed">
          Wij koppelen geen share-IDs aan elkaar in onze database. De keten
          waaruit deze tijdlijn bestaat, leeft alleen in de URL die je nu in je
          browser hebt staan. Sluit deze tab zonder hem te bookmarken en de
          relatie tussen de profielen is voor niemand meer terug te halen.
          Wil je hem permanent bewaren? Sla de link op in jouw eigen
          notitie-app.
        </p>
      </section>
    </Container>
  );
}
