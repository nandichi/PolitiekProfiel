import { ImageResponse } from "next/og";
import { OG_COLORS, loadOgFonts } from "@/lib/og-template";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: OG_COLORS.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: fonts.fraunces ? "Fraunces" : "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            right: 14,
            bottom: 14,
            border: `1px solid ${OG_COLORS.paper50}`,
            opacity: 0.18,
            display: "flex",
          }}
        />

        <span
          style={{
            color: OG_COLORS.paper,
            fontSize: 140,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: -6,
            paddingBottom: 8,
          }}
        >
          P
        </span>

        <span
          style={{
            position: "absolute",
            right: 30,
            bottom: 30,
            width: 14,
            height: 14,
            background: OG_COLORS.terra,
            display: "flex",
          }}
        />

        <span
          style={{
            position: "absolute",
            left: 22,
            bottom: 18,
            fontFamily: fonts.plex ? "Plex" : "monospace",
            fontSize: 11,
            color: OG_COLORS.paper200,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.6,
            display: "flex",
          }}
        >
          NL
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(fonts.fraunces
          ? [
              {
                name: "Fraunces",
                data: fonts.fraunces,
                weight: 500 as const,
                style: "normal" as const,
              },
            ]
          : []),
        ...(fonts.plex
          ? [
              {
                name: "Plex",
                data: fonts.plex,
                weight: 500 as const,
                style: "normal" as const,
              },
            ]
          : []),
      ],
    },
  );
}
