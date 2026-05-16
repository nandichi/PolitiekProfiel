import { ImageResponse } from "next/og";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const result = await getResult(id);
  if (!result) {
    return new Response("Niet gevonden", { status: 404 });
  }
  const ideology = await getIdeologyBySlug(result.ideologySlug);

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: "#fbf9f4",
          color: "#14161a",
          fontFamily: "Georgia, serif",
          display: "flex",
          flexDirection: "column",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 500 }}>Politiek</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: "#1e3a8a" }}>
              Profiel
            </span>
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#5b6370",
            }}
          >
            Jouw politieke profiel
          </div>
        </div>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 500,
              lineHeight: 1.02,
              maxWidth: 1000,
            }}
          >
            {ideology?.name ?? result.ideologySlug}
          </div>
          {ideology?.shortDescription && (
            <div
              style={{
                marginTop: 18,
                fontSize: 24,
                color: "#2b2f36",
                fontFamily: "Helvetica, sans-serif",
                maxWidth: 980,
                lineHeight: 1.4,
              }}
            >
              {ideology.shortDescription}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {DIMENSIONS.map((d) => {
            const value = result.dimensions[d.id];
            const left = ((value + 100) / 2).toFixed(2);
            return (
              <div
                key={d.id}
                style={{ display: "flex", alignItems: "center", gap: 18 }}
              >
                <div
                  style={{
                    width: 200,
                    fontSize: 18,
                    color: "#5b6370",
                    fontFamily: "Helvetica, sans-serif",
                  }}
                >
                  {d.shortLabel}
                </div>
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    height: 12,
                    background: "#e8e1d2",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -4,
                      bottom: -4,
                      width: 4,
                      background: "#14161a",
                      left: `${left}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 60,
                    textAlign: "right",
                    fontSize: 20,
                    color: "#14161a",
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: "Helvetica, sans-serif",
                  }}
                >
                  {value > 0 ? "+" : ""}
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
