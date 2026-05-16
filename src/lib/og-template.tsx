import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

export const OG_COLORS = {
  paper: "#fafaf7",
  paper50: "#f4f3ed",
  paper100: "#ecebe2",
  paper200: "#ddd9c7",
  ink: "#0e1014",
  inkMuted: "#5a6071",
  inkSubtle: "#8c93a3",
  navy: "#142850",
  terra: "#b34329",
  rule: "#dcd8c9",
  ruleStrong: "#b5ad95",
} as const;

// Satori (achter next/og's ImageResponse) ondersteunt alleen TTF, OTF en WOFF.
// WOFF2 wordt expliciet niet ondersteund. Daarom gebruiken we hier WOFF-bestanden
// uit @fontsource via jsdelivr.
const fontCache: {
  fraunces500?: ArrayBuffer;
  fraunces600?: ArrayBuffer;
  fraunces400Italic?: ArrayBuffer;
  inter400?: ArrayBuffer;
  inter500?: ArrayBuffer;
  plex500?: ArrayBuffer;
} = {};

async function fetchFont(url: string): Promise<ArrayBuffer | undefined> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return undefined;
    return await res.arrayBuffer();
  } catch {
    return undefined;
  }
}

const FONT_URLS = {
  fraunces500:
    "https://cdn.jsdelivr.net/npm/@fontsource/fraunces@latest/files/fraunces-latin-500-normal.woff",
  fraunces600:
    "https://cdn.jsdelivr.net/npm/@fontsource/fraunces@latest/files/fraunces-latin-600-normal.woff",
  fraunces400Italic:
    "https://cdn.jsdelivr.net/npm/@fontsource/fraunces@latest/files/fraunces-latin-400-italic.woff",
  inter400:
    "https://cdn.jsdelivr.net/npm/@fontsource/inter@latest/files/inter-latin-400-normal.woff",
  inter500:
    "https://cdn.jsdelivr.net/npm/@fontsource/inter@latest/files/inter-latin-500-normal.woff",
  plex500:
    "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@latest/files/ibm-plex-mono-latin-500-normal.woff",
} as const;

export async function loadOgFonts() {
  const entries = Object.entries(FONT_URLS) as Array<
    [keyof typeof FONT_URLS, string]
  >;
  await Promise.all(
    entries.map(async ([key, url]) => {
      if (!fontCache[key]) {
        fontCache[key] = await fetchFont(url);
      }
    }),
  );
  return {
    fraunces: fontCache.fraunces500,
    fraunces500: fontCache.fraunces500,
    fraunces600: fontCache.fraunces600,
    fraunces400Italic: fontCache.fraunces400Italic,
    inter: fontCache.inter400,
    inter400: fontCache.inter400,
    inter500: fontCache.inter500,
    plex: fontCache.plex500,
  };
}

export interface OgFontConfig {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export async function getOgFontConfig(): Promise<{
  fonts: OgFontConfig[];
  display: string;
  sans: string;
  mono: string;
}> {
  const cache = await loadOgFonts();
  const fonts: OgFontConfig[] = [];

  if (cache.fraunces500) {
    fonts.push({ name: "Fraunces", data: cache.fraunces500, weight: 500, style: "normal" });
  }
  if (cache.fraunces600) {
    fonts.push({ name: "Fraunces", data: cache.fraunces600, weight: 600, style: "normal" });
  }
  if (cache.fraunces400Italic) {
    fonts.push({
      name: "Fraunces",
      data: cache.fraunces400Italic,
      weight: 400,
      style: "italic",
    });
  }
  if (cache.inter400) {
    fonts.push({ name: "Inter", data: cache.inter400, weight: 400, style: "normal" });
  }
  if (cache.inter500) {
    fonts.push({ name: "Inter", data: cache.inter500, weight: 500, style: "normal" });
  }
  if (cache.plex) {
    fonts.push({ name: "Plex", data: cache.plex, weight: 500, style: "normal" });
  }

  return {
    fonts,
    display: cache.fraunces500 ? "Fraunces" : "Georgia, serif",
    sans: cache.inter400 ? "Inter" : "Helvetica, Arial, sans-serif",
    mono: cache.plex ? "Plex" : "Menlo, ui-monospace, monospace",
  };
}

export interface OgTitlePart {
  text: string;
  italic?: boolean;
  navy?: boolean;
  terra?: boolean;
}

export interface OgTemplateProps {
  kicker: string;
  number?: string;
  titleParts: OgTitlePart[];
  body?: string;
  meta?: { label: string; value: string }[];
  footer?: { left?: string; right?: string };
  fontFamilies: { display: string; sans: string; mono: string };
}

export function OgTemplate({
  kicker,
  number,
  titleParts,
  body,
  meta,
  footer,
  fontFamilies,
}: OgTemplateProps): ReactElement {
  const { display, sans, mono } = fontFamilies;

  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        background: OG_COLORS.paper,
        color: OG_COLORS.ink,
        display: "flex",
        flexDirection: "column",
        padding: "64px 72px",
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
          background: OG_COLORS.ink,
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
            fontSize: 30,
          }}
        >
          <span style={{ color: OG_COLORS.ink }}>Politiek</span>
          <span style={{ color: OG_COLORS.navy }}>Profiel</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: mono,
            fontSize: 13,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: OG_COLORS.inkMuted,
          }}
        >
          <span
            style={{
              display: "block",
              width: 8,
              height: 8,
              background: OG_COLORS.terra,
            }}
          />
          <span>{kicker}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 56,
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
            marginBottom: 22,
          }}
        >
          {number && (
            <span
              style={{
                fontFamily: mono,
                fontSize: 13,
                letterSpacing: 2.4,
                color: OG_COLORS.inkMuted,
              }}
            >
              {number}
            </span>
          )}
          <span
            style={{
              display: "block",
              width: 50,
              height: 1,
              background: OG_COLORS.ruleStrong,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: display,
            fontWeight: 500,
            fontSize: 78,
            lineHeight: 1.02,
            letterSpacing: -1.8,
            color: OG_COLORS.ink,
            maxWidth: 1050,
          }}
        >
          {titleParts.map((part, i) => {
            const color = part.terra
              ? OG_COLORS.terra
              : part.navy
                ? OG_COLORS.navy
                : OG_COLORS.ink;
            return (
              <span
                key={i}
                style={{
                  fontFamily: display,
                  fontStyle: part.italic ? "italic" : "normal",
                  fontWeight: part.italic ? 400 : 500,
                  color,
                  marginRight: 18,
                }}
              >
                {part.text}
              </span>
            );
          })}
        </div>

        {body && (
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              color: OG_COLORS.ink,
              fontFamily: sans,
              fontWeight: 400,
              maxWidth: 950,
              lineHeight: 1.45,
              display: "flex",
            }}
          >
            {body}
          </div>
        )}
      </div>

      {meta && meta.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 36,
            paddingTop: 22,
            borderTop: `1px solid ${OG_COLORS.ruleStrong}`,
            marginBottom: 18,
          }}
        >
          {meta.map((m, i) => (
            <div
              key={i}
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
                  color: OG_COLORS.inkSubtle,
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontFamily: display,
                  fontSize: 22,
                  fontWeight: 500,
                  color: OG_COLORS.ink,
                  letterSpacing: -0.4,
                }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: mono,
          fontSize: 13,
          letterSpacing: 1.4,
          color: OG_COLORS.inkMuted,
          paddingTop: meta && meta.length > 0 ? 0 : 20,
          borderTop:
            meta && meta.length > 0 ? "none" : `1px solid ${OG_COLORS.ruleStrong}`,
        }}
      >
        <span>{footer?.left ?? "politiekprofiel.nl"}</span>
        <span>{footer?.right ?? "GEEN TRACKING · ANONIEM"}</span>
      </div>
    </div>
  );
}
