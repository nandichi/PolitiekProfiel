import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { getQuestionDetail } from "@/lib/tracking-queries";
import { KpiCard, KpiRow } from "./charts/KpiCard";
import { StackedBar, ANSWER_COLORS } from "./charts/StackedBar";
import { DataTable } from "./charts/DataTable";
import {
  card,
  cardHeader,
  empty,
  formatDate,
  formatDuration,
  formatNumber,
  formatPct,
  mono,
  sectionTitle,
  sectionWrap,
  tokens,
} from "./styles";

function getSegment(
  params: AdminViewServerProps["params"],
  index: number,
): string | undefined {
  const segments = params?.segments;
  if (!Array.isArray(segments)) return undefined;
  return segments[index];
}

function valueBucket(value: number): string {
  if (value <= -2) return "strong-negative";
  if (value < 0) return "mild-negative";
  if (value === 0) return "neutral";
  if (value < 2) return "mild-positive";
  return "strong-positive";
}

export default async function QuestionDetailView(props: AdminViewServerProps) {
  const raw = getSegment(props.params, 2);
  const questionId = raw ? Number.parseInt(raw, 10) : NaN;

  if (!Number.isFinite(questionId)) {
    return (
      <div style={{ padding: "32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={empty}>Ongeldig vraag-ID.</div>
      </div>
    );
  }

  const [{ events }, questionDoc] = await Promise.all([
    getQuestionDetail(questionId),
    (async () => {
      try {
        const res = await props.payload.find({
          collection: "questions",
          where: { id: { equals: questionId } },
          limit: 1,
          depth: 0,
        });
        return res.docs[0] as
          | { id: number; statement: string; dimension: string }
          | undefined;
      } catch {
        return undefined;
      }
    })(),
  ]);

  let views = 0;
  let answered = 0;
  let skipped = 0;
  let backs = 0;
  let infoOpened = 0;
  let timeSum = 0;
  let timeCount = 0;
  const valueCounts: Record<string, number> = {};

  for (const e of events) {
    if (e.type === "question-viewed") views += 1;
    else if (e.type === "question-answered") {
      answered += 1;
      if (typeof e.value === "number") {
        const bucket = valueBucket(e.value);
        valueCounts[bucket] = (valueCounts[bucket] ?? 0) + 1;
      }
      if (typeof e.timeOnQuestionMs === "number" && e.timeOnQuestionMs > 0) {
        timeSum += e.timeOnQuestionMs;
        timeCount += 1;
      }
    } else if (e.type === "question-skipped") {
      skipped += 1;
      valueCounts.skipped = (valueCounts.skipped ?? 0) + 1;
    } else if (e.type === "question-back") backs += 1;
    else if (e.type === "info-opened") infoOpened += 1;
  }

  const dropoffPct = views > 0 ? Math.max(0, 1 - (answered + skipped) / views) : 0;
  const avgTime = timeCount > 0 ? timeSum / timeCount : 0;

  const distributionRows = [
    {
      label: questionDoc?.statement ?? `Vraag #${questionId}`,
      segments: [
        {
          key: "strong-negative",
          label: "Sterk oneens",
          value: valueCounts["strong-negative"] ?? 0,
          color: ANSWER_COLORS["strong-negative"],
        },
        {
          key: "mild-negative",
          label: "Oneens",
          value: valueCounts["mild-negative"] ?? 0,
          color: ANSWER_COLORS["mild-negative"],
        },
        {
          key: "neutral",
          label: "Neutraal",
          value: valueCounts.neutral ?? 0,
          color: ANSWER_COLORS.neutral,
        },
        {
          key: "mild-positive",
          label: "Eens",
          value: valueCounts["mild-positive"] ?? 0,
          color: ANSWER_COLORS["mild-positive"],
        },
        {
          key: "strong-positive",
          label: "Sterk eens",
          value: valueCounts["strong-positive"] ?? 0,
          color: ANSWER_COLORS["strong-positive"],
        },
        {
          key: "skipped",
          label: "Overgeslagen",
          value: valueCounts.skipped ?? 0,
          color: ANSWER_COLORS.skipped,
        },
      ],
    },
  ];

  const recentEvents = events
    .slice()
    .sort((a, b) => (b.occurredAt > a.occurredAt ? 1 : -1))
    .slice(0, 100);

  return (
    <div
      style={{
        padding: "24px clamp(16px, 4vw, 40px) 80px",
        maxWidth: "1100px",
        margin: "0 auto",
        color: tokens.text,
      }}
    >
      <p style={{ ...cardHeader }}>
        <Link href="/admin" style={{ color: tokens.textMuted }}>
          ← Dashboard
        </Link>
      </p>
      <h1 style={{ fontSize: "1.5rem", margin: "8px 0 4px" }}>
        Vraag #{questionId}
      </h1>
      {questionDoc?.statement && (
        <p
          style={{
            color: tokens.textMuted,
            fontSize: "1.05rem",
            margin: "8px 0 0 0",
            fontStyle: "italic",
          }}
        >
          “{questionDoc.statement}”
        </p>
      )}
      {questionDoc?.dimension && (
        <p style={{ ...cardHeader, marginTop: 8 }}>
          Dimensie: {questionDoc.dimension}
        </p>
      )}

      <section style={{ ...sectionWrap, marginTop: 24 }}>
        <KpiRow>
          <KpiCard label="Views" value={formatNumber(views)} />
          <KpiCard
            label="Beantwoord"
            value={formatNumber(answered)}
            sub={
              views > 0
                ? `${formatPct(answered / views, 1)} van views`
                : undefined
            }
          />
          <KpiCard
            label="Overgeslagen"
            value={formatNumber(skipped)}
            accent={skipped > 0 ? "warning" : "default"}
          />
          <KpiCard
            label="Drop-off"
            value={formatPct(dropoffPct, 1)}
            accent={dropoffPct > 0.2 ? "error" : "default"}
          />
          <KpiCard
            label="Gem. tijd"
            value={formatDuration(avgTime)}
            sub={`${formatNumber(timeCount)} samples`}
          />
          <KpiCard label="Info geopend" value={formatNumber(infoOpened)} />
          <KpiCard label="Terug" value={formatNumber(backs)} />
        </KpiRow>
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Antwoord-verdeling</h2>
        <div style={card}>
          <StackedBar rows={distributionRows} />
        </div>
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Recente events (max 100)</h2>
        <DataTable
          rows={recentEvents}
          emptyMessage="Geen events op deze vraag."
          columns={[
            {
              key: "time",
              label: "Tijd",
              width: "160px",
              render: (e) => (
                <span style={{ ...mono, fontSize: "0.8rem" }}>
                  {formatDate(e.occurredAt)}
                </span>
              ),
            },
            {
              key: "type",
              label: "Type",
              width: "180px",
              render: (e) => (
                <span style={{ ...mono, fontSize: "0.8rem" }}>{e.type}</span>
              ),
            },
            {
              key: "value",
              label: "Waarde",
              width: "80px",
              align: "right",
              render: (e) =>
                e.value !== undefined ? (
                  <span style={{ ...mono }}>
                    {e.value > 0 ? `+${e.value}` : e.value}
                  </span>
                ) : (
                  <span style={{ color: tokens.textSubtle }}>—</span>
                ),
            },
            {
              key: "duration",
              label: "Tijd op vraag",
              width: "120px",
              align: "right",
              render: (e) =>
                e.timeOnQuestionMs !== undefined ? (
                  <span style={{ ...mono, fontSize: "0.8rem" }}>
                    {formatDuration(e.timeOnQuestionMs)}
                  </span>
                ) : (
                  <span style={{ color: tokens.textSubtle }}>—</span>
                ),
            },
            {
              key: "attempt",
              label: "Poging",
              render: (e) => (
                <Link
                  href={`/admin/tracking/attempt/${e.attemptId}`}
                  style={{ ...mono, fontSize: "0.75rem", color: tokens.textMuted }}
                >
                  {e.attemptId.slice(0, 8)}…
                </Link>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
