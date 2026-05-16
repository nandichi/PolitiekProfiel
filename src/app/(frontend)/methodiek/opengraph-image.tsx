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
  "Methodiek — hoe PolitiekProfiel politieke houding meet op vijf onafhankelijke dimensies, zonder karikatuur.";

export default async function MethodiekOg() {
  const { fonts, display, sans, mono } = await getOgFontConfig();

  return new ImageResponse(
    (
      <OgTemplate
        kicker="METHODIEK"
        number="01 — HOE WE METEN"
        titleParts={[
          { text: "Politiek meten" },
          { text: "zonder", italic: true, navy: true },
          { text: "karikatuur", italic: true, navy: true },
          { text: ".", terra: true },
        ]}
        body="Vijf onafhankelijke dimensies, gebalanceerde stellingen, transparante scoring op de schaal −100 tot +100. Geen één-as label. Wel ruimte voor nuance."
        meta={[
          { label: "Dimensies", value: "5 onafhankelijke" },
          { label: "Schaal", value: "−100 ↔ +100" },
          { label: "Stellingen", value: "30 – 120" },
          { label: "Bias", value: "Gebalanceerd" },
        ]}
        footer={{
          left: "politiekprofiel.nl/methodiek",
          right: "DOCUMENTATIE · NL",
        }}
        fontFamilies={{ display, sans, mono }}
      />
    ),
    { ...size, fonts },
  );
}
