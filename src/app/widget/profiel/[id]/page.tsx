import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DIMENSIONS } from "@/lib/dimensions";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Embed · ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedProfielPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();
  const ideology = await getIdeologyBySlug(result.ideologySlug);
  const ideoName = ideology?.name ?? "Politiek profiel";

  return (
    <main
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        background: "#fafaf7",
        color: "#0e1014",
        padding: "20px 22px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #dcd8c9",
          paddingBottom: 10,
          marginBottom: 16,
        }}
      >
        <a
          href={`https://politiekprofiel.nl/r/${id}`}
          target="_top"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 18,
            fontWeight: 500,
            color: "#0e1014",
            textDecoration: "none",
          }}
        >
          Politiek<span style={{ color: "#142850" }}>Profiel</span>
        </a>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: "#5a6071",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          EMBED
        </span>
      </header>

      <section style={{ marginBottom: 18 }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: "#5a6071",
            margin: 0,
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          Profiel
        </p>
        <h1
          style={{
            margin: "4px 0 0 0",
            fontSize: 26,
            fontFamily: "Georgia, serif",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: -0.5,
            color: "#0e1014",
          }}
        >
          {ideoName}
          <span style={{ color: "#b34329" }}>.</span>
        </h1>
        {ideology?.shortDescription && (
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 13,
              lineHeight: 1.45,
              color: "#3a3e48",
            }}
          >
            {ideology.shortDescription}
          </p>
        )}
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          borderTop: "1px solid #dcd8c9",
          paddingTop: 14,
        }}
      >
        {DIMENSIONS.map((d) => {
          const value = result.dimensions[d.id];
          const leftPct = ((value + 100) / 2).toFixed(2);
          return (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 110,
                  fontSize: 12,
                  color: "#0e1014",
                  fontWeight: 500,
                }}
              >
                {d.shortLabel}
              </div>
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  height: 4,
                  background: "#ecebe2",
                  borderTop: "1px solid #dcd8c9",
                  borderBottom: "1px solid #dcd8c9",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -2,
                    bottom: -2,
                    width: 1,
                    background: "#b5ad95",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    bottom: -4,
                    width: 3,
                    background: "#0e1014",
                    left: `${leftPct}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div
                style={{
                  width: 36,
                  textAlign: "right",
                  fontSize: 12,
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontWeight: 500,
                  color: "#0e1014",
                }}
              >
                {value > 0 ? "+" : ""}
                {value}
              </div>
            </div>
          );
        })}
      </section>

      <footer
        style={{
          marginTop: 16,
          borderTop: "1px solid #dcd8c9",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 10,
          letterSpacing: 1.2,
          color: "#5a6071",
        }}
      >
        <a
          href={`https://politiekprofiel.nl/r/${id}`}
          target="_top"
          style={{
            color: "#5a6071",
            textDecoration: "none",
          }}
        >
          politiekprofiel.nl/r/{id}
        </a>
        <span>GEEN TRACKING</span>
      </footer>
    </main>
  );
}
