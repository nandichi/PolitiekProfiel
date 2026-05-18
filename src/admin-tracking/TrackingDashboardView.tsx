import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import type { Tier } from "@/lib/dimensions";
import {
  getDashboardData,
  type QueryFilters,
} from "@/lib/tracking-queries";
import { FilterBar } from "./FilterBar";
import { KpiCard, KpiRow } from "./charts/KpiCard";
import { LineChart } from "./charts/LineChart";
import { FunnelChart } from "./charts/FunnelChart";
import { Heatmap } from "./charts/Heatmap";
import { BarChart, type BarChartRow } from "./charts/BarChart";
import { StackedBar, ANSWER_COLORS } from "./charts/StackedBar";
import { DataTable } from "./charts/DataTable";
import {
  card,
  cardHeader,
  formatDate,
  formatDuration,
  formatNumber,
  formatPct,
  mono,
  sectionTitle,
  sectionWrap,
  tokens,
} from "./styles";

function parseFilters(searchParams: AdminViewServerProps["searchParams"]): {
  filters: QueryFilters;
  rangeLabel: string;
} {
  const get = (key: string): string | undefined => {
    const v = searchParams?.[key];
    if (Array.isArray(v)) return v[0];
    return typeof v === "string" ? v : undefined;
  };
  const range = get("range") ?? "30";
  const tier = get("tier") as Tier | undefined;
  const adaptiveRaw = get("adaptive");
  const adaptive =
    adaptiveRaw === "1"
      ? true
      : adaptiveRaw === "0"
        ? false
        : undefined;
  const ideology = get("ideology") || undefined;

  const to = new Date();
  let from: Date | undefined;
  let rangeLabel = "laatste 30 dagen";
  if (range === "all") {
    from = new Date(0);
    rangeLabel = "alle tijd";
  } else {
    const days = Number.parseInt(range, 10);
    const safe = Number.isFinite(days) && days > 0 ? days : 30;
    from = new Date(to.getTime() - safe * 24 * 60 * 60 * 1000);
    rangeLabel =
      safe === 7
        ? "laatste 7 dagen"
        : safe === 30
          ? "laatste 30 dagen"
          : safe === 90
            ? "laatste 90 dagen"
            : safe === 365
              ? "laatste jaar"
              : `laatste ${safe} dagen`;
  }
  return {
    filters: {
      from,
      to,
      tier,
      adaptive,
      ideology,
    },
    rangeLabel,
  };
}

interface IdeologyOption {
  slug: string;
  label: string;
}

async function loadIdeologyOptions(
  payload: AdminViewServerProps["payload"],
): Promise<IdeologyOption[]> {
  try {
    const res = await payload.find({
      collection: "ideologies",
      limit: 100,
      depth: 0,
      sort: "name",
    });
    return (
      res.docs as unknown as Array<{ slug: string; name: string }>
    ).map((d) => ({ slug: d.slug, label: d.name }));
  } catch {
    return [];
  }
}

async function loadQuestionLabels(
  payload: AdminViewServerProps["payload"],
  ids: number[],
): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map();
  const map = new Map<number, string>();
  try {
    const res = await payload.find({
      collection: "questions",
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 0,
    });
    for (const doc of res.docs as unknown as Array<{
      id: number;
      statement: string;
    }>) {
      map.set(doc.id, doc.statement);
    }
  } catch {
    // gracefully fall back to empty labels.
  }
  return map;
}

export default async function TrackingDashboardView(
  props: AdminViewServerProps,
) {
  const { filters, rangeLabel } = parseFilters(props.searchParams);
  const data = await getDashboardData(filters);

  const ideologies = await loadIdeologyOptions(props.payload);
  const ideologyLabel = new Map(ideologies.map((i) => [i.slug, i.label]));

  const questionIds = data.questions.map((q) => q.questionId);
  const questionLabels = await loadQuestionLabels(props.payload, questionIds);

  const ideologyRows: BarChartRow[] = data.ideologies.map((i) => ({
    label: ideologyLabel.get(i.ideologySlug) ?? i.ideologySlug,
    value: i.count,
  }));

  const tierRows: BarChartRow[] = data.tiers.map((t) => ({
    label:
      t.tier === "quick"
        ? "Quick"
        : t.tier === "standard"
          ? "Standaard"
          : t.tier === "extended"
            ? "Uitgebreid"
            : t.tier,
    value: t.count,
  }));

  const paradoxRows: BarChartRow[] = data.paradoxes.map((p) => ({
    label: `${p.type} · gem. ${p.avgSeverity.toFixed(1)}`,
    value: p.count,
  }));

  const heatmapRows = data.questions
    .filter((q) => q.views >= 1)
    .slice(0, 30)
    .map((q) => ({
      questionId: q.questionId,
      label:
        questionLabels.get(q.questionId) ?? `Vraag #${q.questionId}`,
      views: q.views,
      dropoffPct: q.dropoffPct,
      href: `/admin/tracking/question/${q.questionId}`,
    }));

  const answerDistRows = data.questions
    .filter((q) => q.answered + q.skipped >= 1)
    .slice(0, 20)
    .map((q) => ({
      label: questionLabels.get(q.questionId) ?? `Vraag #${q.questionId}`,
      segments: [
        {
          key: "strong-negative",
          label: "Sterk oneens",
          value: q.valueCounts["strong-negative"] ?? 0,
          color: ANSWER_COLORS["strong-negative"],
        },
        {
          key: "mild-negative",
          label: "Oneens",
          value: q.valueCounts["mild-negative"] ?? 0,
          color: ANSWER_COLORS["mild-negative"],
        },
        {
          key: "neutral",
          label: "Neutraal",
          value: q.valueCounts.neutral ?? 0,
          color: ANSWER_COLORS.neutral,
        },
        {
          key: "mild-positive",
          label: "Eens",
          value: q.valueCounts["mild-positive"] ?? 0,
          color: ANSWER_COLORS["mild-positive"],
        },
        {
          key: "strong-positive",
          label: "Sterk eens",
          value: q.valueCounts["strong-positive"] ?? 0,
          color: ANSWER_COLORS["strong-positive"],
        },
        {
          key: "skipped",
          label: "Overgeslagen",
          value: q.valueCounts.skipped ?? 0,
          color: ANSWER_COLORS.skipped,
        },
      ],
    }));

  return (
    <div
      style={{
        padding: "24px clamp(16px, 4vw, 40px) 80px",
        maxWidth: "1400px",
        margin: "0 auto",
        color: tokens.text,
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <p
          style={{
            ...mono,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: tokens.textMuted,
            margin: 0,
          }}
        >
          PolitiekProfiel · Tracking
        </p>
        <h1
          style={{
            margin: "6px 0 4px 0",
            fontSize: "2rem",
            fontWeight: 500,
          }}
        >
          Quiz-dashboard
        </h1>
        <p style={{ margin: 0, color: tokens.textMuted, fontSize: "0.9rem" }}>
          Periode: {rangeLabel}
          {" · "}
          Bron:{" "}
          <span style={{ ...mono }}>
            {data.dataSource === "firestore" ? "Firestore" : "Postgres"}
          </span>
          {data.totalsEstimated && (
            <span style={{ color: tokens.warning, marginLeft: "12px" }}>
              · Resultaten beperkt tot eerste batches (mogelijk incompleet)
            </span>
          )}
        </p>
      </header>

      <FilterBar ideologies={ideologies} />

      <section style={sectionWrap}>
        <KpiRow>
          <KpiCard
            label="Quiz starts"
            value={formatNumber(data.kpi.starts)}
          />
          <KpiCard
            label="Profielen aangemaakt"
            value={formatNumber(data.kpi.completes)}
            sub={`Completion rate ${formatPct(data.kpi.completionRate, 1)}`}
          />
          <KpiCard
            label="Verlaten"
            value={formatNumber(data.kpi.abandoned)}
            accent="warning"
          />
          <KpiCard
            label="Unieke bezoekers"
            value={formatNumber(data.kpi.uniqueVisitors)}
            sub="Browser-trackingId's"
          />
          <KpiCard
            label="Gem. duur (submit)"
            value={formatDuration(data.kpi.avgDurationMs)}
          />
        </KpiRow>
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Verloop per dag</h2>
        <div style={card}>
          <LineChart data={data.timeSeries} />
        </div>
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Funnel</h2>
        <div style={card}>
          <FunnelChart steps={data.funnel} />
        </div>
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Drop-off per vraag</h2>
        <div style={card}>
          <Heatmap rows={heatmapRows} maxRows={30} />
        </div>
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Antwoord-verdeling per vraag (top 20 op views)</h2>
        <div style={card}>
          <StackedBar rows={answerDistRows} />
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <section>
          <h2 style={sectionTitle}>Tier-verdeling</h2>
          <div style={card}>
            <BarChart rows={tierRows} />
          </div>
        </section>
        <section>
          <h2 style={sectionTitle}>Ideologie-verdeling</h2>
          <div style={card}>
            <BarChart rows={ideologyRows} maxRows={12} />
          </div>
        </section>
        <section>
          <h2 style={sectionTitle}>Paradox-types</h2>
          <div style={card}>
            <BarChart rows={paradoxRows} />
          </div>
        </section>
      </div>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Recente pogingen</h2>
        <DataTable
          rows={data.recentAttempts}
          rowHref={(row) => `/admin/tracking/attempt/${row.attemptId}`}
          columns={[
            {
              key: "startedAt",
              label: "Start",
              width: "160px",
              render: (r) => (
                <span style={{ ...mono, fontSize: "0.8rem" }}>
                  {formatDate(r.startedAt)}
                </span>
              ),
            },
            {
              key: "tier",
              label: "Tier",
              width: "100px",
              render: (r) => (
                <span style={{ ...mono, fontSize: "0.8rem" }}>{r.tier}</span>
              ),
            },
            {
              key: "answered",
              label: "Beantwoord",
              width: "120px",
              align: "right",
              render: (r) => (
                <span style={{ ...mono }}>
                  {formatNumber(r.questionsAnswered)} / {formatNumber(r.questionsSeen)}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              width: "120px",
              render: (r) => (
                <span
                  style={{
                    ...mono,
                    fontSize: "0.75rem",
                    color: r.submitted
                      ? tokens.success
                      : r.abandoned
                        ? tokens.error
                        : tokens.textMuted,
                  }}
                >
                  {r.submitted
                    ? "INGEDIEND"
                    : r.abandoned
                      ? "VERLATEN"
                      : "ACTIEF"}
                </span>
              ),
            },
            {
              key: "duration",
              label: "Duur",
              width: "100px",
              align: "right",
              render: (r) => (
                <span style={{ ...mono, fontSize: "0.8rem" }}>
                  {r.durationMs ? formatDuration(r.durationMs) : "—"}
                </span>
              ),
            },
            {
              key: "trackingId",
              label: "Bezoeker",
              render: (r) => (
                <Link
                  href={`/admin/tracking/visitor/${r.trackingId}`}
                  style={{
                    ...mono,
                    fontSize: "0.75rem",
                    color: tokens.textMuted,
                  }}
                >
                  {r.trackingId.slice(0, 8)}…
                </Link>
              ),
            },
          ]}
        />
      </section>

      <footer
        style={{
          marginTop: "48px",
          paddingTop: "16px",
          borderTop: `1px solid ${tokens.border}`,
          ...cardHeader,
        }}
      >
        Intern dashboard. Geen IP, geen UA, geen referrer.
      </footer>
    </div>
  );
}
