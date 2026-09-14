import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PARTY_PROGRAMMES } from "@/data/party-programmes";

const programmeText = (party: string, theme: string) => {
  const entry = PARTY_PROGRAMMES[party]?.[theme as keyof (typeof PARTY_PROGRAMMES)[string]];
  return [entry?.summary, ...(entry?.bullets.map((bullet) => bullet.text) ?? [])].join(" ");
};

describe("audited programme summaries", () => {
  it("keeps corrected primary-programme claims", () => {
    expect(programmeText("d66", "klimaat")).toContain("doelmatig");
    expect(programmeText("cda", "migratie")).toContain("doorzetten");
    expect(programmeText("cda", "wonen")).toContain("stapsgewijs afbouwen");
    expect(programmeText("progressief-nederland", "klimaat")).toContain("€59");
    expect(programmeText("progressief-nederland", "wonen")).toContain("stapsgewijs afbouwen");
    expect(programmeText("sp", "economie")).toContain("€5 miljoen");
    expect(programmeText("pvdd", "klimaat")).toContain("2030 als uitgangspunt");
  });

  it("does not present current faction sizes as 2025 election results", () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), "src/app/(frontend)/politici/[slug]/page.tsx"),
      "utf8",
    );
    expect(page).toContain("Actuele zetels");
    expect(page).not.toContain("Zetels TK 2025");
  });
});
