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
  "Privacy: geen tracking, geen account, geen marketing-cookies. Politieke voorkeur als bijzondere persoonsgegevens onder de AVG.";

export default async function PrivacyOg() {
  const { fonts, display, sans, mono } = await getOgFontConfig();

  return new ImageResponse(
    (
      <OgTemplate
        kicker="PRIVACY"
        number="02 · JOUW GEGEVENS"
        titleParts={[
          { text: "Geen account." },
          { text: "Geen tracking." },
          { text: "Anoniem", italic: true, navy: true },
          { text: ".", terra: true },
        ]}
        body="Politieke voorkeur valt onder bijzondere persoonsgegevens (AVG). We slaan alleen anoniem je vijf dimensiescores op; geen IP-adres, geen user-agent en geen individuele antwoorden."
        meta={[
          { label: "Cookies", value: "Geen" },
          { label: "Account", value: "Geen" },
          { label: "Wet", value: "AVG · GDPR" },
          { label: "Opslag", value: "Anoniem" },
        ]}
        footer={{
          left: "politiekprofiel.nl/privacy",
          right: "AVG · GEEN TRACKING",
        }}
        fontFamilies={{ display, sans, mono }}
      />
    ),
    { ...size, fonts },
  );
}
