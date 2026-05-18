import { ImageResponse } from "next/og";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";
import { getOgFontConfig } from "@/lib/og-template";
import {
  OG_DIMENSIONS,
  renderResultOg,
  type OgFormat,
} from "@/lib/og-result-renderer";

export const runtime = "nodejs";

function parseFormat(raw: string | null): OgFormat {
  if (raw === "square" || raw === "story") return raw;
  return "wide";
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const result = await getResult(id);
  if (!result) {
    return new Response("Niet gevonden", { status: 404 });
  }
  const ideology = await getIdeologyBySlug(result.ideologySlug);

  const url = new URL(req.url);
  const format = parseFormat(url.searchParams.get("format"));
  const dimensions = OG_DIMENSIONS[format];

  const fontConfig = await getOgFontConfig();
  const element = renderResultOg({
    result,
    ideology,
    format,
    fontFamilies: {
      display: fontConfig.display,
      sans: fontConfig.sans,
      mono: fontConfig.mono,
    },
  });

  return new ImageResponse(element, {
    width: dimensions.width,
    height: dimensions.height,
    fonts: fontConfig.fonts,
  });
}
