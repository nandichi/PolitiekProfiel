import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

const PAGE_PATH = "src/app/(frontend)/r/[id]/page.tsx";
const VISUALISATION_PATHS = [
  "src/components/DimensionBar.tsx",
  "src/components/MiniVector.tsx",
  "src/components/RankedList.tsx",
  "src/components/ScatterPlot.tsx",
  "src/components/result/ConfidenceIndicator.tsx",
  "src/components/result/ThemeBars.tsx",
  "src/components/viz/AxisSelect.tsx",
  "src/components/viz/Tooltip.tsx",
];
const RESULT_PRESENTATION_PATHS = [
  PAGE_PATH,
  "src/components/EmailResultLinkBlock.tsx",
  "src/components/ShareBlock.tsx",
  ...VISUALISATION_PATHS,
  "src/components/result/AiContentBlock.tsx",
  "src/components/result/AiContentReveal.tsx",
  "src/components/result/AnswerAtlas.tsx",
  "src/components/result/BackToTop.tsx",
  "src/components/result/DeleteResultButton.tsx",
  "src/components/result/ImageDownloads.tsx",
  "src/components/result/InstagramStoryDialog.tsx",
  "src/components/result/ParadoxList.tsx",
  "src/components/result/PartyContext.tsx",
  "src/components/result/PartyStatementCompare.tsx",
  "src/components/result/PersonalProfile.tsx",
  "src/components/result/PivotalAnswers.tsx",
  "src/components/result/SocialShareGrid.tsx",
  "src/components/result/TldrCallout.tsx",
];

describe("result redesign contract", () => {
  it("gives the five independent axes, limitation and qualitative reading before any upsell", () => {
    const page = read(PAGE_PATH);
    const firstAxis = page.indexOf("<DimensionBar");
    const limitation = page.indexOf("Een profiel vat je antwoorden samen");
    const qualitativeReading = page.indexOf("{personalProfile.lead}");
    const upsell = page.indexOf("<FreeResultPaywall />");

    expect(firstAxis).toBeGreaterThan(-1);
    expect(limitation).toBeGreaterThan(-1);
    expect(qualitativeReading).toBeGreaterThan(-1);
    expect(limitation).toBeLessThan(firstAxis);
    expect(qualitativeReading).toBeLessThan(firstAxis);
    expect(firstAxis).toBeLessThan(upsell);
    expect(page).not.toMatch(/totaalscore|radardiagram|partijwinnaar/i);
  });

  it("shows one Quick upsell only after free value and keeps result controls available", () => {
    const page = read(PAGE_PATH);

    expect(page.match(/<FreeResultPaywall \/>/g) ?? []).toHaveLength(1);
    expect(page).not.toContain("InlinePaywall");
    expect(page).toContain('id="delen"');
    expect(page).toContain("<ShareBlock");
    expect(page).toContain("<DeleteResultButton");
    expect(page).toContain("<ImageDownloads");
    expect(page.indexOf("<EmailResultLinkBlock")).toBeGreaterThan(
      page.indexOf("<DimensionBar"),
    );
  });

  it("uses one labelled marker grammar across result visualisations", () => {
    const marker = read("src/components/viz/MeasureMarker.tsx");
    expect(marker).toContain("dimensionMarkerShape");
    expect(marker).toMatch(/circle/);
    expect(marker).toMatch(/diamond/);
    expect(marker).toMatch(/triangle/);
    expect(marker).toMatch(/cross/);

    for (const relativePath of [
      "src/components/DimensionBar.tsx",
      "src/components/MiniVector.tsx",
      "src/components/result/ThemeBars.tsx",
    ]) {
      expect(read(relativePath), relativePath).toContain("MeasureMarker");
    }
  });

  it("server-renders essential result content without viewport observers", () => {
    const page = read(PAGE_PATH);
    expect(page).not.toContain("ScrollReveal");

    for (const relativePath of [
      "src/components/DimensionBar.tsx",
      "src/components/RankedList.tsx",
      "src/components/result/ThemeBars.tsx",
      "src/components/result/ImageDownloads.tsx",
    ]) {
      const source = read(relativePath);
      expect(source, relativePath).not.toMatch(/useInView|whileInView|IntersectionObserver/);
    }
  });

  it("uses semantic tokens and no legacy public font or palette references", () => {
    const forbidden =
      /(?:\b(?:bg|text|border|fill|stroke|decoration|accent|from|to)-(?:paper|navy|terra)(?:\b|-|\/)|--color-(?:paper|navy|terra)\b|--font-(?:inter|fraunces)\b|\bInter\b|\bFraunces\b|display-italic)/i;

    for (const relativePath of RESULT_PRESENTATION_PATHS) {
      expect(read(relativePath), relativePath).not.toMatch(forbidden);
    }
  });
});
