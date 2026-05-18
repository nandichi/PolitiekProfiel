import type { ReactElement } from "react";
import { DIMENSIONS } from "@/lib/dimensions";
import { THEMES, type ThemeId, type ThemeScores } from "@/lib/themes";
import type { StoredResult } from "@/lib/results-store";
import type { IdeologyDoc } from "@/lib/result-data";
import { OG_COLORS as C } from "@/lib/og-template";

/**
 * Renderer voor de drie download-PNG formaten van een resultaatpagina:
 * - wide (1200x630) → social link preview / Twitter card
 * - square (1080x1080) → Instagram-post formaat
 * - story (1080x1920) → Instagram-story formaat
 *
 * Het design volgt de site (paper/ink/navy/terra) en hergebruikt het
 * editoriale stramien: monospaced kicker met dot, display-serif titel met
 * terra-punt, mono labels.
 */

export type OgFormat = "wide" | "square" | "story";

export const OG_DIMENSIONS: Record<OgFormat, { width: number; height: number }> = {
  wide: { width: 1200, height: 630 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
};

interface RenderArgs {
  result: StoredResult;
  ideology: IdeologyDoc | null;
  format: OgFormat;
  fontFamilies: { display: string; sans: string; mono: string };
}

export function renderResultOg(args: RenderArgs): ReactElement {
  const { format } = args;
  if (format === "story") return renderStory(args);
  if (format === "square") return renderSquare(args);
  return renderWide(args);
}

function topThemes(scores: ThemeScores | undefined, limit = 3) {
  if (!scores) return [];
  return [...THEMES]
    .map((t) => ({ theme: t, value: scores[t.id as ThemeId] ?? 0 }))
    .filter((t) => Math.abs(t.value) > 5)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, limit);
}

interface DimensionBarProps {
  shortLabel: string;
  value: number;
  fontFamilies: { display: string; sans: string; mono: string };
  scale: number;
}

/**
 * Voltmeter-bar in editoriale stijl. Gevulde balk vanaf het midden naar
 * de score-positie, met een eindstreep als marker. Negatieve waardes
 * gebruiken terra, positieve waardes navy, neutraal blijft ink-muted.
 */
function DimensionBar({ shortLabel, value, fontFamilies, scale }: DimensionBarProps) {
  const clamped = Math.max(-100, Math.min(100, value));
  const isPositive = clamped > 0;
  const isNeutral = Math.abs(clamped) < 5;
  const fillColor = isNeutral ? C.inkSubtle : isPositive ? C.navy : C.terra;
  const half = Math.abs(clamped) / 2;
  const fillLeft = isPositive ? 50 : 50 - half;
  const fillWidth = half;
  const markerLeft = (clamped + 100) / 2;

  const labelWidth = Math.round(170 * scale);
  const valueWidth = Math.round(78 * scale);
  const labelSize = Math.round(17 * scale);
  const valueSize = Math.round(22 * scale);
  const gap = Math.round(18 * scale);
  const trackHeight = Math.max(6, Math.round(8 * scale));
  const rowHeight = Math.max(28, Math.round(32 * scale));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        height: rowHeight,
      }}
    >
      <div
        style={{
          width: labelWidth,
          fontSize: labelSize,
          color: C.ink,
          fontFamily: fontFamilies.sans,
          fontWeight: 500,
          display: "flex",
        }}
      >
        {shortLabel}
      </div>
      <div
        style={{
          position: "relative",
          flex: 1,
          height: trackHeight,
          background: C.paper100,
          borderTop: `1px solid ${C.rule}`,
          borderBottom: `1px solid ${C.rule}`,
          display: "flex",
        }}
      >
        {/* Center tick */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -Math.round(4 * scale),
            bottom: -Math.round(4 * scale),
            width: 1,
            background: C.ruleStrong,
            display: "flex",
          }}
        />
        {/* Filled bar from center to score */}
        <div
          style={{
            position: "absolute",
            left: `${fillLeft}%`,
            top: 0,
            bottom: 0,
            width: `${fillWidth}%`,
            background: fillColor,
            opacity: 0.18,
            display: "flex",
          }}
        />
        {/* Marker */}
        <div
          style={{
            position: "absolute",
            top: -Math.round(8 * scale),
            bottom: -Math.round(8 * scale),
            width: Math.max(3, Math.round(4 * scale)),
            background: fillColor,
            left: `${markerLeft}%`,
            transform: "translateX(-50%)",
            display: "flex",
          }}
        />
      </div>
      <div
        style={{
          width: valueWidth,
          textAlign: "right",
          fontSize: valueSize,
          color: C.ink,
          fontFamily: fontFamilies.mono,
          fontWeight: 500,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {clamped > 0 ? "+" : ""}
        {clamped}
      </div>
    </div>
  );
}

interface KickerProps {
  number: string;
  label: string;
  fontFamilies: { display: string; sans: string; mono: string };
  size?: number;
}

function Kicker({ number, label, fontFamilies, size = 13 }: KickerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: size,
          letterSpacing: 2.4,
          color: C.inkMuted,
          textTransform: "uppercase",
        }}
      >
        {number} · {label}
      </span>
      <span
        style={{
          display: "block",
          width: 50,
          height: 1,
          background: C.ruleStrong,
        }}
      />
    </div>
  );
}

interface BrandProps {
  fontFamilies: { display: string; sans: string; mono: string };
  size?: number;
}

function Brand({ fontFamilies, size = 30 }: BrandProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        fontFamily: fontFamilies.display,
        fontWeight: 500,
        fontSize: size,
      }}
    >
      <span style={{ color: C.ink }}>Politiek</span>
      <span style={{ color: C.navy }}>Profiel</span>
    </div>
  );
}

interface BadgeProps {
  text: string;
  fontFamilies: { display: string; sans: string; mono: string };
  size?: number;
}

function Badge({ text, fontFamilies, size = 13 }: BadgeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: fontFamilies.mono,
        fontSize: size,
        letterSpacing: 2.4,
        textTransform: "uppercase",
        color: C.inkMuted,
      }}
    >
      <span
        style={{
          display: "block",
          width: 8,
          height: 8,
          background: C.terra,
        }}
      />
      <span>{text}</span>
    </div>
  );
}

interface MetaPillProps {
  label: string;
  value: string;
  fontFamilies: { display: string; sans: string; mono: string };
}

function MetaPill({ label, value, fontFamilies }: MetaPillProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: 11,
          letterSpacing: 1.8,
          color: C.inkSubtle,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fontFamilies.display,
          fontSize: 22,
          fontWeight: 500,
          color: C.ink,
          letterSpacing: -0.4,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================== */
/*  WIDE — 1200x630 (link preview)                                  */
/* ============================================================== */

function renderWide({ result, ideology, fontFamilies }: RenderArgs): ReactElement {
  const { width, height } = OG_DIMENSIONS.wide;
  const ideoName = ideology?.name ?? result.ideologySlug;
  const ideoShort = ideology?.shortDescription;
  const f = fontFamilies;

  return (
    <div
      style={{
        width,
        height,
        background: C.paper,
        color: C.ink,
        display: "flex",
        flexDirection: "column",
        padding: "56px 72px",
        fontFamily: f.sans,
        position: "relative",
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
          background: C.ink,
          display: "flex",
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
        <Brand fontFamilies={f} />
        <Badge text="Jouw politieke profiel" fontFamilies={f} />
      </div>

      {/* Hero */}
      <div
        style={{
          marginTop: 36,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Kicker number="01" label="Profiel" fontFamilies={f} />

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "baseline",
            fontFamily: f.display,
            fontWeight: 500,
            fontSize: 88,
            lineHeight: 0.98,
            letterSpacing: -2.2,
            color: C.ink,
            maxWidth: 1000,
          }}
        >
          <span>{ideoName}</span>
          <span style={{ color: C.terra }}>.</span>
        </div>

        {ideoShort && (
          <div
            style={{
              marginTop: 18,
              fontSize: 20,
              color: C.ink,
              fontFamily: f.sans,
              fontWeight: 400,
              maxWidth: 950,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {ideoShort.length > 180 ? `${ideoShort.slice(0, 177)}…` : ideoShort}
          </div>
        )}
      </div>

      {/* Dimensions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          paddingTop: 22,
          borderTop: `1px solid ${C.ruleStrong}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 6,
          }}
        >
          <Kicker number="02" label="Dimensies" fontFamilies={f} size={11} />
          <span
            style={{
              fontFamily: f.mono,
              fontSize: 11,
              letterSpacing: 1.4,
              color: C.inkSubtle,
              marginLeft: "auto",
            }}
          >
            −100 · 0 · +100
          </span>
        </div>

        {DIMENSIONS.map((d) => (
          <DimensionBar
            key={d.id}
            shortLabel={d.shortLabel}
            value={result.dimensions[d.id]}
            fontFamilies={f}
            scale={0.9}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: f.mono,
          fontSize: 12,
          letterSpacing: 1.4,
          color: C.inkMuted,
        }}
      >
        <span>politiekprofiel.nl/r/{result.shareId}</span>
        <span>GEEN TRACKING · ANONIEM</span>
      </div>
    </div>
  );
}

/* ============================================================== */
/*  SQUARE — 1080x1080 (social post)                                */
/* ============================================================== */

function renderSquare({ result, ideology, fontFamilies }: RenderArgs): ReactElement {
  const { width, height } = OG_DIMENSIONS.square;
  const ideoName = ideology?.name ?? result.ideologySlug;
  const ideoShort = ideology?.shortDescription;
  const spectrum = ideology?.spectrumPosition;
  const f = fontFamilies;
  const themes = topThemes(result.themeScores, 3);

  return (
    <div
      style={{
        width,
        height,
        background: C.paper,
        color: C.ink,
        display: "flex",
        flexDirection: "column",
        padding: "72px 80px",
        fontFamily: f.sans,
        position: "relative",
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
          background: C.ink,
          display: "flex",
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
        <Brand fontFamilies={f} size={32} />
        <Badge text="Jouw profiel" fontFamilies={f} />
      </div>

      {/* Hero */}
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Kicker number="01" label="Ideologie" fontFamilies={f} />

        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexWrap: "wrap",
            fontFamily: f.display,
            fontWeight: 500,
            fontSize: 110,
            lineHeight: 0.96,
            letterSpacing: -2.8,
            color: C.ink,
          }}
        >
          <span>{ideoName}</span>
          <span style={{ color: C.terra }}>.</span>
        </div>

        {ideoShort && (
          <div
            style={{
              marginTop: 26,
              fontSize: 24,
              color: C.ink,
              fontFamily: f.sans,
              fontWeight: 400,
              lineHeight: 1.42,
              display: "flex",
              maxWidth: 920,
            }}
          >
            {ideoShort.length > 200 ? `${ideoShort.slice(0, 197)}…` : ideoShort}
          </div>
        )}

        {/* Spectrum pill */}
        {spectrum && (
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                border: `1px solid ${C.ink}`,
                fontFamily: f.mono,
                fontSize: 13,
                letterSpacing: 1.6,
                color: C.ink,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 7,
                  height: 7,
                  background: C.navy,
                  borderRadius: 999,
                }}
              />
              {spectrum.replace(/-/g, " ")}
            </span>
            <span
              style={{
                fontFamily: f.mono,
                fontSize: 12,
                letterSpacing: 1.6,
                color: C.inkMuted,
                textTransform: "uppercase",
              }}
            >
              · {result.answeredCount}/{result.totalQuestions} beantwoord
            </span>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, display: "flex" }} />

      {/* Dimensions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingTop: 28,
          borderTop: `1px solid ${C.ruleStrong}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <Kicker number="02" label="Dimensies" fontFamilies={f} />
          <span
            style={{
              fontFamily: f.mono,
              fontSize: 12,
              letterSpacing: 1.4,
              color: C.inkSubtle,
              marginLeft: "auto",
            }}
          >
            −100 · 0 · +100
          </span>
        </div>

        {DIMENSIONS.map((d) => (
          <DimensionBar
            key={d.id}
            shortLabel={d.shortLabel}
            value={result.dimensions[d.id]}
            fontFamilies={f}
            scale={1}
          />
        ))}
      </div>

      {/* Top themes */}
      {themes.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 26,
            paddingTop: 22,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          <Kicker number="03" label="Sterkste thema's" fontFamilies={f} size={12} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {themes.map((t) => (
              <div
                key={t.theme.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  border: `1px solid ${C.rule}`,
                  background: C.paper50,
                }}
              >
                <span
                  style={{
                    fontFamily: f.sans,
                    fontSize: 16,
                    fontWeight: 500,
                    color: C.ink,
                  }}
                >
                  {t.theme.shortLabel}
                </span>
                <span
                  style={{
                    fontFamily: f.mono,
                    fontSize: 14,
                    color: t.value > 0 ? C.navy : C.terra,
                    fontWeight: 500,
                  }}
                >
                  {t.value > 0 ? "+" : ""}
                  {t.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: f.mono,
          fontSize: 13,
          letterSpacing: 1.4,
          color: C.inkMuted,
        }}
      >
        <span>politiekprofiel.nl/r/{result.shareId}</span>
        <span>DOE OOK DE QUIZ</span>
      </div>
    </div>
  );
}

/* ============================================================== */
/*  STORY — 1080x1920 (Instagram-story)                             */
/* ============================================================== */

function renderStory({ result, ideology, fontFamilies }: RenderArgs): ReactElement {
  const { width, height } = OG_DIMENSIONS.story;
  const ideoName = ideology?.name ?? result.ideologySlug;
  const ideoShort = ideology?.shortDescription;
  const spectrum = ideology?.spectrumPosition;
  const f = fontFamilies;
  const themes = topThemes(result.themeScores, 3);

  return (
    <div
      style={{
        width,
        height,
        background: C.paper,
        color: C.ink,
        display: "flex",
        flexDirection: "column",
        padding: "120px 80px",
        fontFamily: f.sans,
        position: "relative",
      }}
    >
      {/* Top accent block */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: C.ink,
          display: "flex",
        }}
      />
      {/* Decorative side rule */}
      <div
        style={{
          position: "absolute",
          top: 120,
          bottom: 120,
          left: 40,
          width: 1,
          background: C.rule,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          bottom: 120,
          right: 40,
          width: 1,
          background: C.rule,
          display: "flex",
        }}
      />

      {/* Header band */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Brand fontFamilies={f} size={36} />
          <Badge text="Profiel" fontFamilies={f} size={14} />
        </div>
        <div
          style={{
            height: 1,
            background: C.ruleStrong,
            display: "flex",
          }}
        />
      </div>

      {/* Hero */}
      <div
        style={{
          marginTop: 80,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Kicker number="01" label="Ideologie" fontFamilies={f} size={15} />

        <div
          style={{
            marginTop: 36,
            display: "flex",
            flexWrap: "wrap",
            fontFamily: f.display,
            fontWeight: 500,
            fontSize: 132,
            lineHeight: 0.95,
            letterSpacing: -3.2,
            color: C.ink,
          }}
        >
          <span>{ideoName}</span>
          <span style={{ color: C.terra }}>.</span>
        </div>

        {ideoShort && (
          <div
            style={{
              marginTop: 36,
              fontSize: 28,
              color: C.ink,
              fontFamily: f.sans,
              fontWeight: 400,
              lineHeight: 1.42,
              display: "flex",
              maxWidth: 880,
            }}
          >
            {ideoShort.length > 220 ? `${ideoShort.slice(0, 217)}…` : ideoShort}
          </div>
        )}

        {spectrum && (
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 24px",
                border: `1.5px solid ${C.ink}`,
                fontFamily: f.mono,
                fontSize: 15,
                letterSpacing: 1.8,
                color: C.ink,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 9,
                  height: 9,
                  background: C.navy,
                  borderRadius: 999,
                }}
              />
              {spectrum.replace(/-/g, " ")}
            </span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex" }} />

      {/* Dimensions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          paddingTop: 36,
          borderTop: `1px solid ${C.ruleStrong}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <Kicker number="02" label="Dimensies" fontFamilies={f} size={14} />
          <span
            style={{
              fontFamily: f.mono,
              fontSize: 13,
              letterSpacing: 1.4,
              color: C.inkSubtle,
              marginLeft: "auto",
            }}
          >
            −100 · 0 · +100
          </span>
        </div>

        {DIMENSIONS.map((d) => (
          <DimensionBar
            key={d.id}
            shortLabel={d.shortLabel}
            value={result.dimensions[d.id]}
            fontFamilies={f}
            scale={1.4}
          />
        ))}
      </div>

      {/* Top themes */}
      {themes.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginTop: 40,
            paddingTop: 28,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          <Kicker number="03" label="Sterkste thema's" fontFamilies={f} size={14} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {themes.map((t) => (
              <div
                key={t.theme.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px",
                  border: `1px solid ${C.rule}`,
                  background: C.paper50,
                }}
              >
                <span
                  style={{
                    fontFamily: f.sans,
                    fontSize: 20,
                    fontWeight: 500,
                    color: C.ink,
                  }}
                >
                  {t.theme.shortLabel}
                </span>
                <span
                  style={{
                    fontFamily: f.mono,
                    fontSize: 17,
                    color: t.value > 0 ? C.navy : C.terra,
                    fontWeight: 500,
                  }}
                >
                  {t.value > 0 ? "+" : ""}
                  {t.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div
        style={{
          marginTop: 44,
          paddingTop: 26,
          borderTop: `1px solid ${C.ruleStrong}`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: f.mono,
            fontSize: 14,
            letterSpacing: 2.2,
            color: C.inkMuted,
            textTransform: "uppercase",
          }}
        >
          Doe ook de quiz →
        </span>
        <span
          style={{
            fontFamily: f.display,
            fontSize: 32,
            fontWeight: 500,
            color: C.ink,
            letterSpacing: -0.6,
          }}
        >
          politiekprofiel.nl
        </span>
      </div>
    </div>
  );
}
