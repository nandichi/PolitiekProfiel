import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { AdminChrome } from "@/admin-tracking/AdminChrome";
import {
  card,
  cardHeader,
  formatDate,
  mono,
  muted,
  sectionTitle,
  tokens,
} from "@/admin-tracking/styles";

interface PromotionCodeRow {
  id: string | number;
  code?: string;
  tier?: string;
  maxRedemptions?: number;
  expiresAt?: string;
  stripePromotionCodeId?: string;
  createdAt?: string;
}

export default async function CouponGeneratorView(
  props: AdminViewServerProps,
) {
  const recent = await props.payload
    .find({
      collection: "stripe-promotion-codes",
      limit: 10,
      depth: 0,
      sort: "-createdAt",
    })
    .then((res) => res.docs as unknown as PromotionCodeRow[])
    .catch(() => []);

  return (
    <AdminChrome serverProps={props}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={cardHeader}>Stripe coupons</p>
          <h1 style={{ ...sectionTitle, fontSize: "2rem", marginBottom: 8 }}>
            Coupon generator
          </h1>
          <p style={{ ...muted, maxWidth: 720, lineHeight: 1.6 }}>
            Maak 100 procent kortingscodes aan voor de betaalde quizzen. De code
            wordt direct als Stripe promotion code aangemaakt en kan door de
            gebruiker in Stripe Checkout worden ingevuld.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <section style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 18,
              }}
            >
              <div>
                <p style={cardHeader}>Recente codes</p>
                <h2 style={sectionTitle}>Laatst gegenereerd</h2>
              </div>
              <Link
                href="/admin/collections/stripe-promotion-codes/create"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: `1px solid ${tokens.text}`,
                  color: tokens.bg,
                  background: tokens.text,
                  padding: "10px 14px",
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                Nieuwe code
              </Link>
            </div>

            {recent.length === 0 ? (
              <p style={muted}>Er zijn nog geen promotiecodes aangemaakt.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                      <th style={th}>Code</th>
                      <th style={th}>Tier</th>
                      <th style={th}>Limiet</th>
                      <th style={th}>Verloopt</th>
                      <th style={th}>Stripe ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((row) => (
                      <tr
                        key={row.id}
                        style={{ borderBottom: `1px solid ${tokens.border}` }}
                      >
                        <td style={{ ...td, ...mono }}>{row.code ?? "—"}</td>
                        <td style={td}>{tierLabel(row.tier)}</td>
                        <td style={td}>{row.maxRedemptions ?? "Onbeperkt"}</td>
                        <td style={td}>
                          {row.expiresAt ? formatDate(row.expiresAt) : "Geen"}
                        </td>
                        <td style={{ ...td, ...mono }}>
                          {row.stripePromotionCodeId ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside style={card}>
            <p style={cardHeader}>Werking</p>
            <ul
              style={{
                ...muted,
                lineHeight: 1.7,
                paddingLeft: 18,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <li>Nieuwe records maken een Stripe coupon en promotion code.</li>
              <li>De korting is standaard 100 procent en geldt eenmalig.</li>
              <li>
                Tier-scope wordt in Stripe toegepast als de product-ID env-vars
                beschikbaar zijn.
              </li>
              <li>
                Codes worden niet gekoppeld aan antwoorden, tracking-ID&apos;s
                of resultaat-URL&apos;s.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </AdminChrome>
  );
}

const th = {
  textAlign: "left" as const,
  padding: "10px 8px",
  color: tokens.textMuted,
  fontFamily: tokens.mono,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const td = {
  padding: "12px 8px",
  color: tokens.text,
  verticalAlign: "top" as const,
};

function tierLabel(tier: string | undefined): string {
  if (tier === "standard") return "Standaard";
  if (tier === "extended") return "Uitgebreid";
  return "Alle betaalde quizzen";
}
