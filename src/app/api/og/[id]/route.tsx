import { ImageResponse } from "next/og";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";
import { OG_COLORS as COLORS, getOgFontConfig } from "@/lib/og-template";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await getResult(id);
  if (!result) {
    return new Response("Niet gevonden", { status: 404 });
  }
  const ideology = await getIdeologyBySlug(result.ideologySlug);

  const { fonts: fontConfig, display: displayFont, sans: sansFont, mono: monoFont } =
    await getOgFontConfig();

  const ideoName = ideology?.name ?? result.ideologySlug;
  const ideoShort = ideology?.shortDescription;

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: COLORS.paper,
          color: COLORS.ink,
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: sansFont,
        }}
      >
        {/* Top hairline */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: COLORS.ink,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: displayFont,
              fontWeight: 500,
              fontSize: 30,
            }}
          >
            <span style={{ color: COLORS.ink }}>Politiek</span>
            <span style={{ color: COLORS.navy }}>Profiel</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: monoFont,
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: COLORS.inkMuted,
            }}
          >
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                background: COLORS.terra,
              }}
            />
            <span>JOUW POLITIEKE PROFIEL</span>
          </div>
        </div>

        {/* Main: ideology name */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 13,
                letterSpacing: 2.4,
                color: COLORS.inkMuted,
              }}
            >
              01 · PROFIEL
            </span>
            <span
              style={{
                display: "block",
                width: 50,
                height: 1,
                background: COLORS.ruleStrong,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: displayFont,
              fontWeight: 500,
              fontSize: 96,
              lineHeight: 0.98,
              letterSpacing: -2.4,
              color: COLORS.ink,
              maxWidth: 1000,
            }}
          >
            <span>{ideoName}</span>
            <span style={{ color: COLORS.terra }}>.</span>
          </div>

          {ideoShort && (
            <div
              style={{
                marginTop: 22,
                fontSize: 22,
                color: COLORS.ink,
                fontFamily: sansFont,
                fontWeight: 400,
                maxWidth: 950,
                lineHeight: 1.4,
              }}
            >
              {ideoShort}
            </div>
          )}
        </div>

        {/* Bottom: dimension voltmeters */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 28,
            borderTop: `1px solid ${COLORS.ruleStrong}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 12,
                letterSpacing: 2.4,
                color: COLORS.inkMuted,
              }}
            >
              02 · DIMENSIES
            </span>
            <span
              style={{
                display: "block",
                width: 50,
                height: 1,
                background: COLORS.ruleStrong,
              }}
            />
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 12,
                letterSpacing: 1.4,
                color: COLORS.inkSubtle,
                marginLeft: "auto",
              }}
            >
              −100 · 0 · +100
            </span>
          </div>

          {DIMENSIONS.map((d) => {
            const value = result.dimensions[d.id];
            const left = ((value + 100) / 2).toFixed(2);
            return (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  height: 30,
                }}
              >
                <div
                  style={{
                    width: 170,
                    fontSize: 16,
                    color: COLORS.ink,
                    fontFamily: sansFont,
                    fontWeight: 500,
                  }}
                >
                  {d.shortLabel}
                </div>
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    height: 6,
                    background: COLORS.paper100,
                    borderTop: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: -4,
                      bottom: -4,
                      width: 1,
                      background: COLORS.ruleStrong,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      bottom: -8,
                      width: 3,
                      background: COLORS.ink,
                      left: `${left}%`,
                      transform: "translateX(-50%)",
                      display: "flex",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 72,
                    textAlign: "right",
                    fontSize: 20,
                    color: COLORS.ink,
                    fontFamily: monoFont,
                    fontWeight: 500,
                  }}
                >
                  {value > 0 ? "+" : ""}
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer line */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: monoFont,
            fontSize: 13,
            letterSpacing: 1.4,
            color: COLORS.inkMuted,
          }}
        >
          <span>politiekprofiel.nl/r/{result.shareId}</span>
          <span>GEEN TRACKING · ANONIEM</span>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts: fontConfig }
  );
}
