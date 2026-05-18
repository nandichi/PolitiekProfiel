import type { ReactElement } from "react";
import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";
import { THEMES, type ThemeId, type ThemeScores } from "@/lib/themes";
import type { StoredResult } from "@/lib/results-store";
import type { IdeologyDoc } from "@/lib/result-data";
import { OG_COLORS as C } from "@/lib/og-template";

/**
 * OG-specifieke accent-kleuren. De site navy (#142850) is zó donker dat hij
 * op een PNG tegen #fafaf7 paper als "donkergrijs" oogt in plaats van blauw.
 * Voor de OG-renderer gebruiken we daarom iets fellere varianten met meer
 * chroma; ze worden alleen toegepast op data-accenten (leaning pool labels,
 * bar fills, highlight strepen, scores). De brand-elementen (PolitiekProfiel
 * logo, dots) houden de officiële site-navy.
 */
const ACCENT_NAVY = "#1f3d8c";
const ACCENT_TERRA = "#c44a2c";

/**
 * Renderer voor de drie download-PNG formaten van een resultaatpagina:
 * - wide (1200x630) → social link preview / Twitter card
 * - square (1080x1080) → Instagram-post formaat
 * - story (1080x1920) → Instagram-story formaat
 *
 * Het design volgt de site (paper/ink/navy/terra) en hergebruikt het
 * editoriale stramien: monospaced kicker met dot, display-serif titel met
 * terra-punt, mono labels.
 *
 * Inhoudelijke principes (zodat de afbeelding ook iets vertelt):
 * - Elke dimensiebar krijgt links/rechts een pool-label in woorden, zodat
 *   "+39" niet meer een raadsel is maar "Sterke staat" laat zien.
 * - Pool waar de score naartoe leunt wordt in accentkleur gezet.
 * - Thema-chips bevatten naast de score ook het pool-woord (OPEN, RESTRICTIEF, …).
 * - Boven de fold staan drie korte "highlights": de sterkste posities van
 *   deze respondent, geformuleerd als pool-label + score.
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

/* ============================================================== */
/*  Pool-label helpers — kortere, "punchier" labels voor de OG.    */
/*  De originele labels in dimensions.ts/themes.ts zijn soms te    */
/*  lang voor een PNG (bv. "Multilevel/EU", "Markt & eigen kracht"). */
/* ============================================================== */

const SHORT_POLE_OVERRIDES: Record<string, string> = {
  "Multilevel/EU": "Pro-EU",
  "Nationaal-soeverein": "Nationaal",
  "Markt & eigen kracht": "Markt",
  "Publieke zorg": "Publiek",
  "Lasten omlaag": "Lasten omlaag",
  "Markt & bouwen": "Markt",
  "Publiek sturen": "Publiek",
};

function shortPoleLabel(label: string): string {
  return SHORT_POLE_OVERRIDES[label] ?? label;
}

interface PoleInfo {
  shortNeg: string;
  shortPos: string;
  leaningLabel: string;
  leaningDir: -1 | 0 | 1;
}

function dimensionPoles(d: (typeof DIMENSIONS)[number], value: number): PoleInfo {
  const shortNeg = shortPoleLabel(d.poleNegative.label);
  const shortPos = shortPoleLabel(d.polePositive.label);
  const dir = Math.abs(value) < 5 ? 0 : value > 0 ? 1 : -1;
  return {
    shortNeg,
    shortPos,
    leaningLabel: dir === 1 ? shortPos : dir === -1 ? shortNeg : "Neutraal",
    leaningDir: dir,
  };
}

function themePoles(t: (typeof THEMES)[number], value: number) {
  const shortNeg = shortPoleLabel(t.poleNegative.label);
  const shortPos = shortPoleLabel(t.polePositive.label);
  const dir = Math.abs(value) < 5 ? 0 : value > 0 ? 1 : -1;
  return {
    shortNeg,
    shortPos,
    leaningLabel: dir === 1 ? shortPos : dir === -1 ? shortNeg : "Neutraal",
    leaningDir: dir,
  };
}

interface Highlight {
  /** Korte label voor in een chip/zin, bv. "Progressief". */
  poleLabel: string;
  /** Context-label, bv. "Cultureel" of "Migratie". */
  context: string;
  /** Originele score (-100..+100). */
  value: number;
  /** Intensiteit-adjectief op basis van abs(score). */
  intensifier: "Sterk" | "Duidelijk" | "Licht" | "";
}

function intensityWord(abs: number): Highlight["intensifier"] {
  if (abs >= 70) return "Sterk";
  if (abs >= 45) return "Duidelijk";
  if (abs >= 25) return "Licht";
  return "";
}

/**
 * Top 3 sterkste posities van de respondent, samengesteld uit alle vijf
 * dimensies plus de zeven thema's. Gesorteerd op absolute score, alleen
 * waarden ≥ 25 worden meegenomen. Geeft de gebruiker een directe
 * "wie ben ik politiek?" samenvatting in drie regels.
 */
function topHighlights(result: StoredResult, limit = 3): Highlight[] {
  const items: Highlight[] = [];

  for (const d of DIMENSIONS) {
    const value = result.dimensions[d.id as DimensionId];
    if (Math.abs(value) < 25) continue;
    const { leaningLabel } = dimensionPoles(d, value);
    items.push({
      poleLabel: leaningLabel,
      context: d.shortLabel,
      value,
      intensifier: intensityWord(Math.abs(value)),
    });
  }

  if (result.themeScores) {
    for (const t of THEMES) {
      const value = result.themeScores[t.id as ThemeId] ?? 0;
      if (Math.abs(value) < 35) continue;
      const { leaningLabel } = themePoles(t, value);
      items.push({
        poleLabel: leaningLabel,
        context: t.shortLabel,
        value,
        intensifier: intensityWord(Math.abs(value)),
      });
    }
  }

  items.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  // Voorkom duplicaten op pool-label (bv. dimensie "Progressief" + thema "Open"
  // dat ook overeenkomt). Eerste hit wint.
  const seen = new Set<string>();
  const out: Highlight[] = [];
  for (const it of items) {
    const key = `${it.poleLabel}|${it.context}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
    if (out.length >= limit) break;
  }
  return out;
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
  contextLabel: string;
  poleNegLabel: string;
  polePosLabel: string;
  value: number;
  fontFamilies: { display: string; sans: string; mono: string };
  scale: number;
  /** Breedte van de pool-label kolommen aan beide kanten van de bar. */
  poleColWidth?: number;
}

/**
 * Voltmeter-bar met pool-labels. Anatomie:
 *
 * [Economie 130px] [Vrije markt] ───●───────── [Sterke staat]   [+39 mono]
 *      context        pool-neg          bar         pole-pos       score
 *
 * - De fill loopt van center naar de score-positie in accentkleur (terra
 *   bij negatief, navy bij positief).
 * - De pool waar de score naartoe leunt staat in dezelfde accentkleur en
 *   in gewicht 500; de tegenoverliggende pool blijft muted.
 */
function DimensionBar({
  contextLabel,
  poleNegLabel,
  polePosLabel,
  value,
  fontFamilies,
  scale,
  poleColWidth = 132,
}: DimensionBarProps) {
  const clamped = Math.max(-100, Math.min(100, value));
  const isPositive = clamped > 0;
  const isNeutral = Math.abs(clamped) < 5;
  const accentColor = isNeutral ? C.inkSubtle : isPositive ? ACCENT_NAVY : ACCENT_TERRA;
  const half = Math.abs(clamped) / 2;
  const fillLeft = isPositive ? 50 : 50 - half;
  const fillWidth = half;
  const markerLeft = (clamped + 100) / 2;

  const contextWidth = Math.round(130 * scale);
  const valueWidth = Math.round(78 * scale);
  const contextSize = Math.round(16 * scale);
  const poleSize = Math.round(13 * scale);
  const valueSize = Math.round(22 * scale);
  const gap = Math.round(14 * scale);
  const trackHeight = Math.max(6, Math.round(8 * scale));
  const rowHeight = Math.max(28, Math.round(34 * scale));

  const colWidth = Math.round(poleColWidth * scale);

  const negActive = clamped < -5;
  const posActive = clamped > 5;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        height: rowHeight,
      }}
    >
      {/* Dimensie label (context) */}
      <div
        style={{
          width: contextWidth,
          fontSize: contextSize,
          color: C.ink,
          fontFamily: fontFamilies.sans,
          fontWeight: 500,
          display: "flex",
        }}
      >
        {contextLabel}
      </div>

      {/* Negative pool label */}
      <div
        style={{
          width: colWidth,
          fontSize: poleSize,
          color: negActive ? accentColor : C.inkMuted,
          fontFamily: fontFamilies.sans,
          fontWeight: negActive ? 600 : 400,
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {poleNegLabel}
      </div>

      {/* Bar */}
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
            background: accentColor,
            opacity: 0.55,
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
            background: accentColor,
            left: `${markerLeft}%`,
            transform: "translateX(-50%)",
            display: "flex",
          }}
        />
      </div>

      {/* Positive pool label */}
      <div
        style={{
          width: colWidth,
          fontSize: poleSize,
          color: posActive ? accentColor : C.inkMuted,
          fontFamily: fontFamilies.sans,
          fontWeight: posActive ? 600 : 400,
          display: "flex",
        }}
      >
        {polePosLabel}
      </div>

      {/* Score */}
      <div
        style={{
          width: valueWidth,
          textAlign: "right",
          fontSize: valueSize,
          color: isNeutral ? C.inkMuted : C.ink,
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

interface HighlightsBlockProps {
  highlights: Highlight[];
  fontFamilies: { display: string; sans: string; mono: string };
  variant: "wide" | "stack";
  scale?: number;
}

/**
 * Drie sterkste posities, getoond als pool-label + score. Twee varianten:
 *
 * - "wide": horizontale rij (voor het wide-format, om verticale ruimte te sparen).
 * - "stack": stack van regels (square/story), per regel context + leaning + score.
 */
function HighlightsBlock({
  highlights,
  fontFamilies,
  variant,
  scale = 1,
}: HighlightsBlockProps) {
  if (highlights.length === 0) return null;
  const f = fontFamilies;

  if (variant === "wide") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {highlights.map((h, i) => {
          const color = h.value > 0 ? ACCENT_NAVY : ACCENT_TERRA;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                paddingLeft: 14,
                borderLeft: `2px solid ${color}`,
              }}
            >
              <span
                style={{
                  fontFamily: f.mono,
                  fontSize: 11,
                  letterSpacing: 1.6,
                  color: C.inkSubtle,
                  textTransform: "uppercase",
                }}
              >
                {h.context}
              </span>
              <span
                style={{
                  fontFamily: f.display,
                  fontSize: 24,
                  fontWeight: 500,
                  color: C.ink,
                  letterSpacing: -0.4,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <span>{h.poleLabel}</span>
                <span
                  style={{
                    fontFamily: f.mono,
                    fontSize: 15,
                    color,
                    fontWeight: 500,
                    letterSpacing: 0,
                  }}
                >
                  {h.value > 0 ? "+" : ""}
                  {h.value}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // stacked variant (square/story)
  const titleSize = Math.round(30 * scale);
  const contextSize = Math.round(12 * scale);
  const scoreSize = Math.round(17 * scale);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: Math.round(16 * scale),
      }}
    >
      {highlights.map((h, i) => {
        const color = h.value > 0 ? ACCENT_NAVY : ACCENT_TERRA;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: Math.round(18 * scale),
              paddingLeft: Math.round(16 * scale),
              borderLeft: `3px solid ${color}`,
              paddingTop: Math.round(4 * scale),
              paddingBottom: Math.round(4 * scale),
            }}
          >
            {/* Kicker column: context + intensiteit */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(2 * scale),
                width: Math.round(120 * scale),
              }}
            >
              <span
                style={{
                  fontFamily: f.mono,
                  fontSize: contextSize,
                  letterSpacing: 1.8,
                  color: C.inkSubtle,
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                {h.context}
              </span>
              {h.intensifier && (
                <span
                  style={{
                    fontFamily: f.mono,
                    fontSize: contextSize,
                    letterSpacing: 1.8,
                    color,
                    textTransform: "uppercase",
                    fontWeight: 500,
                    display: "flex",
                  }}
                >
                  {h.intensifier}
                </span>
              )}
            </div>

            {/* Pool label (display) */}
            <span
              style={{
                fontFamily: f.display,
                fontSize: titleSize,
                fontWeight: 500,
                color: C.ink,
                letterSpacing: -0.5,
                display: "flex",
                flex: 1,
                lineHeight: 1,
              }}
            >
              {h.poleLabel}
            </span>

            {/* Score */}
            <span
              style={{
                fontFamily: f.mono,
                fontSize: scoreSize,
                color,
                fontWeight: 500,
                display: "flex",
              }}
            >
              {h.value > 0 ? "+" : ""}
              {h.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface ThemeChipProps {
  theme: (typeof THEMES)[number];
  value: number;
  fontFamilies: { display: string; sans: string; mono: string };
  size?: "sm" | "md" | "lg";
}

function ThemeChip({ theme, value, fontFamilies, size = "md" }: ThemeChipProps) {
  const { leaningLabel, leaningDir } = themePoles(theme, value);
  const color = leaningDir > 0 ? ACCENT_NAVY : leaningDir < 0 ? ACCENT_TERRA : C.inkMuted;
  const f = fontFamilies;

  const padding =
    size === "sm" ? "6px 10px" : size === "lg" ? "12px 20px" : "8px 14px";
  const themeFs = size === "sm" ? 13 : size === "lg" ? 18 : 15;
  const poleFs = size === "sm" ? 10 : size === "lg" ? 12 : 11;
  const scoreFs = size === "sm" ? 12 : size === "lg" ? 16 : 14;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size === "lg" ? 12 : 10,
        padding,
        border: `1px solid ${C.rule}`,
        background: C.paper50,
      }}
    >
      <span
        style={{
          fontFamily: f.sans,
          fontSize: themeFs,
          fontWeight: 500,
          color: C.ink,
        }}
      >
        {theme.shortLabel}
      </span>
      {leaningLabel !== "Neutraal" && (
        <span
          style={{
            fontFamily: f.mono,
            fontSize: poleFs,
            letterSpacing: 1.6,
            color,
            textTransform: "uppercase",
          }}
        >
          {leaningLabel}
        </span>
      )}
      <span
        style={{
          fontFamily: f.mono,
          fontSize: scoreFs,
          color,
          fontWeight: 500,
        }}
      >
        {value > 0 ? "+" : ""}
        {value}
      </span>
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
  const f = fontFamilies;
  const highlights = topHighlights(result, 3);

  return (
    <div
      style={{
        width,
        height,
        background: C.paper,
        color: C.ink,
        display: "flex",
        flexDirection: "column",
        padding: "44px 64px 36px 64px",
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

      {/* Two-column hero */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "row",
          gap: 40,
          flex: 1,
        }}
      >
        {/* Left: ideology name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 520,
          }}
        >
          <Kicker number="01" label="Ideologie" fontFamilies={f} />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              fontFamily: f.display,
              fontWeight: 500,
              fontSize: 64,
              lineHeight: 0.98,
              letterSpacing: -1.6,
              color: C.ink,
            }}
          >
            <span>{ideoName}</span>
            <span style={{ color: C.terra }}>.</span>
          </div>
          {ideology?.shortDescription && (
            <div
              style={{
                marginTop: 14,
                fontSize: 16,
                color: C.ink,
                fontFamily: f.sans,
                fontWeight: 400,
                lineHeight: 1.4,
                display: "flex",
              }}
            >
              {ideology.shortDescription.length > 140
                ? `${ideology.shortDescription.slice(0, 137)}…`
                : ideology.shortDescription}
            </div>
          )}
        </div>

        {/* Right: highlights */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingLeft: 28,
            borderLeft: `1px solid ${C.rule}`,
          }}
        >
          <Kicker number="02" label="Sterkste posities" fontFamilies={f} size={11} />
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            {highlights.map((h, i) => {
              const color = h.value > 0 ? ACCENT_NAVY : ACCENT_TERRA;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${color}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: f.mono,
                      fontSize: 10,
                      letterSpacing: 1.6,
                      color: C.inkSubtle,
                      textTransform: "uppercase",
                    }}
                  >
                    {h.context}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: f.display,
                        fontSize: 22,
                        fontWeight: 500,
                        color: C.ink,
                        letterSpacing: -0.4,
                      }}
                    >
                      {h.poleLabel}
                    </span>
                    <span
                      style={{
                        fontFamily: f.mono,
                        fontSize: 14,
                        color,
                        fontWeight: 500,
                      }}
                    >
                      {h.value > 0 ? "+" : ""}
                      {h.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingTop: 18,
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
          <Kicker number="03" label="Dimensies" fontFamilies={f} size={11} />
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

        {DIMENSIONS.map((d) => {
          const value = result.dimensions[d.id];
          const { shortNeg, shortPos } = dimensionPoles(d, value);
          return (
            <DimensionBar
              key={d.id}
              contextLabel={d.shortLabel}
              poleNegLabel={shortNeg}
              polePosLabel={shortPos}
              value={value}
              fontFamilies={f}
              scale={0.78}
              poleColWidth={120}
            />
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: f.mono,
          fontSize: 11,
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
  const highlights = topHighlights(result, 3);

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
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Kicker number="01" label="Ideologie" fontFamilies={f} />

        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexWrap: "wrap",
            fontFamily: f.display,
            fontWeight: 500,
            fontSize: 92,
            lineHeight: 0.96,
            letterSpacing: -2.4,
            color: C.ink,
          }}
        >
          <span>{ideoName}</span>
          <span style={{ color: C.terra }}>.</span>
        </div>

        {ideoShort && (
          <div
            style={{
              marginTop: 18,
              fontSize: 21,
              color: C.ink,
              fontFamily: f.sans,
              fontWeight: 400,
              lineHeight: 1.42,
              display: "flex",
              maxWidth: 920,
            }}
          >
            {ideoShort.length > 180 ? `${ideoShort.slice(0, 177)}…` : ideoShort}
          </div>
        )}

        {/* Spectrum pill */}
        {spectrum && (
          <div
            style={{
              marginTop: 20,
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
                padding: "8px 14px",
                border: `1px solid ${C.ink}`,
                fontFamily: f.mono,
                fontSize: 12,
                letterSpacing: 1.6,
                color: C.ink,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 6,
                  height: 6,
                  background: C.navy,
                  borderRadius: 999,
                }}
              />
              {spectrum.replace(/-/g, " ")}
            </span>
            <span
              style={{
                fontFamily: f.mono,
                fontSize: 11,
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

      {/* Highlights */}
      {highlights.length > 0 && (
        <div
          style={{
            marginTop: 28,
            paddingTop: 22,
            borderTop: `1px solid ${C.rule}`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Kicker number="02" label="Wie je politiek bent" fontFamilies={f} size={12} />
          <HighlightsBlock
            highlights={highlights}
            fontFamilies={f}
            variant="stack"
            scale={0.9}
          />
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1, display: "flex", minHeight: 12 }} />

      {/* Dimensions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingTop: 22,
          borderTop: `1px solid ${C.ruleStrong}`,
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
          <Kicker number="03" label="Dimensies" fontFamilies={f} size={12} />
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

        {DIMENSIONS.map((d) => {
          const value = result.dimensions[d.id];
          const { shortNeg, shortPos } = dimensionPoles(d, value);
          return (
            <DimensionBar
              key={d.id}
              contextLabel={d.shortLabel}
              poleNegLabel={shortNeg}
              polePosLabel={shortPos}
              value={value}
              fontFamilies={f}
              scale={0.78}
              poleColWidth={120}
            />
          );
        })}
      </div>

      {/* Top themes */}
      {themes.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 18,
            paddingTop: 18,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          <Kicker number="04" label="Sterkste thema's" fontFamilies={f} size={11} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {themes.map((t) => (
              <ThemeChip
                key={t.theme.id}
                theme={t.theme}
                value={t.value}
                fontFamilies={f}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 20,
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
  const highlights = topHighlights(result, 3);

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
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Kicker number="01" label="Ideologie" fontFamilies={f} size={15} />

        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexWrap: "wrap",
            fontFamily: f.display,
            fontWeight: 500,
            fontSize: 108,
            lineHeight: 0.95,
            letterSpacing: -2.6,
            color: C.ink,
          }}
        >
          <span>{ideoName}</span>
          <span style={{ color: C.terra }}>.</span>
        </div>

        {ideoShort && (
          <div
            style={{
              marginTop: 24,
              fontSize: 24,
              color: C.ink,
              fontFamily: f.sans,
              fontWeight: 400,
              lineHeight: 1.42,
              display: "flex",
              maxWidth: 880,
            }}
          >
            {ideoShort.length > 200 ? `${ideoShort.slice(0, 197)}…` : ideoShort}
          </div>
        )}

        {spectrum && (
          <div
            style={{
              marginTop: 24,
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
                padding: "12px 20px",
                border: `1.5px solid ${C.ink}`,
                fontFamily: f.mono,
                fontSize: 14,
                letterSpacing: 1.8,
                color: C.ink,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 8,
                  height: 8,
                  background: C.navy,
                  borderRadius: 999,
                }}
              />
              {spectrum.replace(/-/g, " ")}
            </span>
          </div>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div
          style={{
            marginTop: 36,
            paddingTop: 28,
            borderTop: `1px solid ${C.rule}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Kicker number="02" label="Wie je politiek bent" fontFamilies={f} size={13} />
          <HighlightsBlock
            highlights={highlights}
            fontFamilies={f}
            variant="stack"
            scale={1.05}
          />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", minHeight: 18 }} />

      {/* Dimensions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
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
          <Kicker number="03" label="Dimensies" fontFamilies={f} size={13} />
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

        {DIMENSIONS.map((d) => {
          const value = result.dimensions[d.id];
          const { shortNeg, shortPos } = dimensionPoles(d, value);
          return (
            <DimensionBar
              key={d.id}
              contextLabel={d.shortLabel}
              poleNegLabel={shortNeg}
              polePosLabel={shortPos}
              value={value}
              fontFamilies={f}
              scale={0.92}
              poleColWidth={132}
            />
          );
        })}
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
          <Kicker number="04" label="Sterkste thema's" fontFamilies={f} size={13} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {themes.map((t) => (
              <ThemeChip
                key={t.theme.id}
                theme={t.theme}
                value={t.value}
                fontFamilies={f}
                size="md"
              />
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
