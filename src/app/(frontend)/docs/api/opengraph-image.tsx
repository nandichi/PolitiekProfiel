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
  "API & Agent Discovery: OpenAPI spec, robots.txt, sitemap, api-catalog, markdown for agents en WebMCP voor PolitiekProfiel.";

export default async function ApiDocsOg() {
  const { fonts, display, sans, mono } = await getOgFontConfig();

  return new ImageResponse(
    (
      <OgTemplate
        kicker="API · AGENT DISCOVERY"
        number="03 · VOOR DEVELOPERS & AGENTS"
        titleParts={[
          { text: "Een site die" },
          { text: "agents", italic: true, navy: true },
          { text: "begrijpen", italic: true, navy: true },
          { text: ".", terra: true },
        ]}
        body="OpenAPI 3.1 spec, /.well-known/api-catalog (RFC 9727), robots.txt met expliciete AI-bot rules, markdown content negotiation en WebMCP-tools voor browser-agents."
        meta={[
          { label: "Spec", value: "OpenAPI 3.1" },
          { label: "Catalog", value: "RFC 9727" },
          { label: "Markdown", value: "Accept: text/md" },
          { label: "Browser-AI", value: "WebMCP" },
        ]}
        footer={{
          left: "politiekprofiel.nl/docs/api",
          right: "OPENAPI · LINKSET · WEBMCP",
        }}
        fontFamilies={{ display, sans, mono }}
      />
    ),
    { ...size, fonts },
  );
}
