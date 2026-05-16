import { ImageResponse } from "next/og";
import { OG_COLORS, loadOgFonts } from "@/lib/og-template";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
        <span
          style={{
            color: OG_COLORS.paper,
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: -1.2,
            paddingBottom: 2,
          }}
        >
          P
        </span>
        <span
          style={{
            position: "absolute",
            right: 4,
            bottom: 4,
            width: 4,
            height: 4,
            background: OG_COLORS.terra,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fonts.fraunces
        ? [
            {
              name: "Fraunces",
              data: fonts.fraunces,
              weight: 500,
              style: "normal",
            },
          ]
        : undefined,
    },
  );
}
