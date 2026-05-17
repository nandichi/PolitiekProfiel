import { ImageResponse } from "next/og";
import {
  OG_COLORS as COLORS,
  OG_SIZE,
  OG_CONTENT_TYPE,
  getOgFontConfig,
} from "@/lib/og-template";
import { getIdeologyBySlugSeed } from "@/lib/seed-readers";

export const runtime = "nodejs";
export const contentType = OG_CONTENT_TYPE;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const ideo = getIdeologyBySlugSeed(slug);
  if (!ideo) {
    return new Response("Niet gevonden", { status: 404 });
  }

  const { fonts, display, sans, mono } = await getOgFontConfig();

  const quote = pickQuoteFromDescription(ideo.description, 280);

  return new ImageResponse(
    (
      <div
        style={{
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          background: COLORS.paper,
          color: COLORS.ink,
          display: "flex",
          flexDirection: "column",
          padding: "70px 80px",
          fontFamily: sans,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: COLORS.ink,
            display: "flex",
          }}
        />

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
              fontFamily: display,
              fontWeight: 500,
              fontSize: 28,
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
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: 2.2,
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
            <span>CITAAT · {ideo.spectrumPosition.toUpperCase()}</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: display,
              fontSize: 110,
              color: COLORS.terra,
              lineHeight: 0.6,
              display: "flex",
            }}
          >
            “
          </span>
          <div
            style={{
              marginTop: -10,
              fontFamily: display,
              fontWeight: 500,
              fontSize: 36,
              lineHeight: 1.25,
              letterSpacing: -0.4,
              color: COLORS.ink,
              maxWidth: 1020,
              display: "flex",
            }}
          >
            {quote}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${COLORS.ruleStrong}`,
            paddingTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: 1.6,
                color: COLORS.inkSubtle,
                textTransform: "uppercase",
              }}
            >
              IDEOLOGIE
            </span>
            <span
              style={{
                fontFamily: display,
                fontSize: 30,
                fontWeight: 500,
                color: COLORS.ink,
                letterSpacing: -0.4,
              }}
            >
              {ideo.name}
            </span>
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: 1.4,
              color: COLORS.inkMuted,
              display: "flex",
            }}
          >
            politiekprofiel.nl/ideologie/{ideo.slug}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

function pickQuoteFromDescription(text: string, max: number): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);
  if (sentences.length === 0) return text.slice(0, max);
  let acc = "";
  for (const s of sentences) {
    if ((acc + " " + s).length > max) break;
    acc = acc ? `${acc} ${s}` : s;
  }
  return acc || sentences[0].slice(0, max);
}
