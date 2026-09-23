import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const OWNED_FILES = [
  "src/components/ContactForm.tsx",
  "src/components/CheckoutButton.tsx",
  "src/components/PaidTierButtons.tsx",
  "src/components/CompareLookup.tsx",
  "src/components/EmailResultLinkBlock.tsx",
  "src/components/coalition/CoalitionBuilder.tsx",
  "src/components/coalition/CoalitionResultExplorer.tsx",
  "src/components/turing/TuringGame.tsx",
  "src/components/evolution/EvolutionPicker.tsx",
  "src/components/CodeBlock.tsx",
  "src/components/ShareBlock.tsx",
] as const;

function read(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

describe("adjacent public surfaces in the 2026 system", () => {
  it("uses role-based palette utilities without legacy public palette classes", () => {
    const legacyPalette =
      /(?:^|[^a-z-])(?:bg|text|border|accent|decoration)-(?:paper(?:-\d+)?|navy(?:-\d+)?|terra(?:-\d+)?|ink-(?:2|muted|subtle))(?:\/\d+)?\b/g;
    const offenders = OWNED_FILES.flatMap((file) => {
      const matches = read(file).match(legacyPalette) ?? [];
      return matches.map((match) => `${file}: ${match.trim()}`);
    });

    expect(offenders).toEqual([]);
  });

  it("keeps forms and tool controls keyboard-visible and exposes status semantics", () => {
    const formSources = [
      read("src/components/ContactForm.tsx"),
      read("src/components/CompareLookup.tsx"),
      read("src/components/EmailResultLinkBlock.tsx"),
      read("src/components/coalition/CoalitionResultExplorer.tsx"),
      read("src/components/evolution/EvolutionPicker.tsx"),
    ];

    for (const source of formSources) {
      expect(source).toContain("focus-visible:");
    }
    expect(read("src/components/ContactForm.tsx")).toContain('role="alert"');
    expect(read("src/components/EmailResultLinkBlock.tsx")).toContain('aria-live="polite"');
    expect(read("src/components/CodeBlock.tsx")).toContain('role="status"');
  });

  it("shows a stable visitor-safe checkout error instead of exception details", () => {
    for (const file of [
      "src/components/CheckoutButton.tsx",
      "src/components/PaidTierButtons.tsx",
    ]) {
      const source = read(file);
      expect(source).toContain("Betalen is tijdelijk niet beschikbaar. Probeer het later opnieuw.");
      expect(source).not.toMatch(/err instanceof Error \? err\.message/);
    }
  });

  it("keeps dialogs and adjacent surfaces flat rather than blurred or glassy", () => {
    const sources = OWNED_FILES.map(read).join("\n");
    expect(sources).not.toContain("backdrop-blur");
    expect(sources).not.toContain("shadow-2xl");
  });
});
