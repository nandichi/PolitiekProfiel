import { ImageResponse } from "next/og";
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  OgTemplate,
  getOgFontConfig,
} from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "PolitiekProfiel — een onafhankelijk Nederlands politiek kompas op vijf onafhankelijke dimensies.";

export default async function OpenGraphImage() {
  const { fonts, display, sans, mono } = await getOgFontConfig();

  return new ImageResponse(
    (
      <OgTemplate
        kicker="EEN ONAFHANKELIJK KOMPAS"
        number="00 — MANIFESTO"
        titleParts={[
          { text: "Politiek is meer" },
          { text: "dan" },
          { text: "links", italic: true, navy: true },
          { text: "of" },
          { text: "rechts", italic: true, navy: true },
          { text: ".", terra: true },
        ]}
        body="Een rustig, doordacht profiel op vijf onafhankelijke dimensies. Geen scorelijst voor partijen. Geen reclame. Wel heldere uitleg en herkenbare vergelijking met politici en landen."
        meta={[
          { label: "Dimensies", value: "Vijf" },
          { label: "Tijdsduur", value: "5 – 20 min" },
          { label: "Account", value: "Geen" },
          { label: "Tracking", value: "Geen" },
        ]}
        footer={{
          left: "politiekprofiel.nl",
          right: "ANONIEM · GRATIS · NL",
        }}
        fontFamilies={{ display, sans, mono }}
      />
    ),
    { ...size, fonts },
  );
}
