import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { getAttemptDetail } from "@/lib/tracking-queries";
import { DataTable } from "./charts/DataTable";
import {
  card,
  cardHeader,
  empty,
  formatDate,
  formatDuration,
  formatNumber,
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

export default async function AttemptDetailView(props: AdminViewServerProps) {
  const attemptId = getSegment(props.params, 2);

  if (!attemptId) {
    return (
      <div style={{ padding: "32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={empty}>Geen attempt-ID opgegeven.</div>
      </div>
    );
  }

  const { attempt, events, shareId } = await getAttemptDetail(attemptId);

  if (!attempt) {
    return (
      <div style={{ padding: "32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={empty}>
          Attempt <span style={{ ...mono }}>{attemptId}</span> niet gevonden.
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/admin" style={{ color: tokens.text }}>
            ← Terug naar dashboard
          </Link>
        </p>
      </div>
    );
  }

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
      <h1 style={{ fontSize: "1.75rem", margin: "8px 0 4px" }}>
        Quiz-poging
      </h1>
      <p style={{ ...mono, color: tokens.textMuted, fontSize: "0.85rem" }}>
        {attempt.attemptId}
      </p>

      <section
        style={{
          ...sectionWrap,
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        <Stat label="Tier" value={attempt.tier} />
        <Stat label="Modus" value={attempt.adaptive ? "Adaptief" : "Vast"} />
        <Stat
          label="Status"
          value={
            attempt.submitted
              ? "Ingediend"
              : attempt.abandoned
                ? "Verlaten"
                : "Actief"
          }
          accent={
            attempt.submitted
              ? "success"
              : attempt.abandoned
                ? "error"
                : "muted"
          }
        />
        <Stat label="Gestart" value={formatDate(attempt.startedAt)} />
        <Stat
          label="Afgerond"
          value={attempt.completedAt ? formatDate(attempt.completedAt) : "—"}
        />
        <Stat
          label="Duur"
          value={
            attempt.durationMs ? formatDuration(attempt.durationMs) : "—"
          }
        />
        <Stat
          label="Vragen gezien"
          value={formatNumber(attempt.questionsSeen)}
        />
        <Stat
          label="Beantwoord / overgeslagen"
          value={`${formatNumber(attempt.questionsAnswered)} / ${formatNumber(
            attempt.questionsSkipped,
          )}`}
        />
        <Stat
          label="Bezoeker"
          value={
            <Link
              href={`/admin/tracking/visitor/${attempt.trackingId}`}
              style={{ color: tokens.text }}
            >
              <span style={{ ...mono, fontSize: "0.85rem" }}>
                {attempt.trackingId}
              </span>
            </Link>
          }
        />
        {shareId && (
          <Stat
            label="Resultaat"
            value={
              <Link
                href={`/r/${shareId}`}
                style={{ color: tokens.text, ...mono, fontSize: "0.85rem" }}
                target="_blank"
              >
                /r/{shareId}
              </Link>
            }
          />
        )}
      </section>

      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Events ({formatNumber(events.length)})</h2>
        <DataTable
          rows={events}
          emptyMessage="Geen events vastgelegd voor deze poging."
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
              key: "questionId",
              label: "Vraag",
              width: "80px",
              align: "right",
              render: (e) =>
                e.questionId !== undefined ? (
                  <Link
                    href={`/admin/tracking/question/${e.questionId}`}
                    style={{ ...mono, color: tokens.text }}
                  >
                    #{e.questionId}
                  </Link>
                ) : (
                  <span style={{ color: tokens.textSubtle }}>—</span>
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
              key: "meta",
              label: "Meta",
              render: (e) =>
                e.meta ? (
                  <span
                    style={{
                      ...mono,
                      fontSize: "0.75rem",
                      color: tokens.textMuted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "inline-block",
                      maxWidth: "100%",
                    }}
                  >
                    {JSON.stringify(e.meta)}
                  </span>
                ) : (
                  <span style={{ color: tokens.textSubtle }}>—</span>
                ),
            },
          ]}
        />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "success" | "error" | "muted";
}) {
  const color =
    accent === "success"
      ? tokens.success
      : accent === "error"
        ? tokens.error
        : accent === "muted"
          ? tokens.textMuted
          : tokens.text;
  return (
    <div style={card}>
      <div style={cardHeader}>{label}</div>
      <div style={{ fontSize: "1rem", color, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
