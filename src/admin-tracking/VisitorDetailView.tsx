import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { getVisitorDetail } from "@/lib/tracking-queries";
import { AdminChrome } from "./AdminChrome";
import { DataTable } from "./charts/DataTable";
import { KpiCard, KpiRow } from "./charts/KpiCard";
import {
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

export default async function VisitorDetailView(props: AdminViewServerProps) {
  const trackingId = getSegment(props.params, 2);

  if (!trackingId) {
    return (
      <AdminChrome serverProps={props}>
        <div style={{ padding: "32px", maxWidth: 800, margin: "0 auto" }}>
          <div style={empty}>Geen tracking-ID opgegeven.</div>
        </div>
      </AdminChrome>
    );
  }

  const { attempts } = await getVisitorDetail(trackingId);

  const submitted = attempts.filter((a) => a.submitted).length;
  const abandoned = attempts.filter((a) => a.abandoned).length;
  const totalDuration = attempts.reduce(
    (acc, a) => acc + (a.durationMs ?? 0),
    0,
  );
  const earliest =
    attempts.length > 0
      ? attempts[attempts.length - 1].startedAt
      : undefined;
  const latest = attempts.length > 0 ? attempts[0].startedAt : undefined;

  return (
    <AdminChrome serverProps={props}>
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
        Bezoeker
      </h1>
      <p style={{ ...mono, color: tokens.textMuted, fontSize: "0.85rem" }}>
        {trackingId}
      </p>

      {attempts.length === 0 ? (
        <div style={{ ...empty, marginTop: 24 }}>
          Geen pogingen gevonden voor deze tracking-ID.
        </div>
      ) : (
        <>
          <section style={{ ...sectionWrap, marginTop: 24 }}>
            <KpiRow>
              <KpiCard
                label="Quizzes gestart"
                value={formatNumber(attempts.length)}
              />
              <KpiCard
                label="Ingediend"
                value={formatNumber(submitted)}
                accent={submitted > 0 ? "success" : "default"}
              />
              <KpiCard
                label="Verlaten"
                value={formatNumber(abandoned)}
                accent={abandoned > 0 ? "warning" : "default"}
              />
              <KpiCard
                label="Totale tijd"
                value={formatDuration(totalDuration)}
              />
              <KpiCard
                label="Eerste bezoek"
                value={earliest ? formatDate(earliest) : "—"}
                sub={
                  latest && earliest && latest !== earliest
                    ? `Laatste: ${formatDate(latest)}`
                    : undefined
                }
              />
            </KpiRow>
          </section>

          <section style={sectionWrap}>
            <h2 style={sectionTitle}>Alle pogingen</h2>
            <DataTable
              rows={attempts}
              rowHref={(a) => `/admin/tracking/attempt/${a.attemptId}`}
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
                    <span style={{ ...mono, fontSize: "0.8rem" }}>
                      {r.tier}
                    </span>
                  ),
                },
                {
                  key: "answered",
                  label: "Antwoorden",
                  width: "120px",
                  align: "right",
                  render: (r) => (
                    <span style={{ ...mono }}>
                      {formatNumber(r.questionsAnswered)}
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
                  align: "right",
                  render: (r) => (
                    <span style={{ ...mono, fontSize: "0.8rem" }}>
                      {r.durationMs ? formatDuration(r.durationMs) : "—"}
                    </span>
                  ),
                },
                {
                  key: "shareId",
                  label: "Resultaat",
                  render: (r) =>
                    r.shareId ? (
                      <Link
                        href={`/r/${r.shareId}`}
                        style={{ color: tokens.text, ...mono, fontSize: "0.75rem" }}
                        target="_blank"
                      >
                        /r/{r.shareId}
                      </Link>
                    ) : (
                      <span style={{ color: tokens.textSubtle }}>—</span>
                    ),
                },
              ]}
            />
          </section>
        </>
      )}
    </div>
    </AdminChrome>
  );
}
