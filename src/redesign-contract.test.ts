import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

describe("PolitiekProfiel 2026 redesign contract", () => {
  it("uses the new role-based visual tokens and removes the old palette contract", () => {
    const css = read("src/app/(frontend)/globals.css");

    for (const token of [
      "--color-canvas",
      "--color-canvas-raised",
      "--color-ink",
      "--color-text-muted",
      "--color-rule",
      "--color-signal",
      "--color-focus",
      "--color-chart-track",
      "--color-chart-marker",
    ]) {
      expect(css, `${token} ontbreekt`).toContain(token + ":");
    }

    for (const legacyToken of [
      "--color-paper:",
      "--color-navy:",
      "--color-terra:",
    ]) {
      expect(css, `${legacyToken} hoort niet in het nieuwe systeem`).not.toContain(
        legacyToken,
      );
    }
  });

  it("removes Inter and Fraunces from the public font contract", () => {
    const layout = read("src/app/(frontend)/layout.tsx");
    const css = read("src/app/(frontend)/globals.css");
    const publicFontContract = layout + "\n" + css;

    expect(publicFontContract).not.toMatch(/\bInter\b|font-inter/i);
    expect(publicFontContract).not.toMatch(/\bFraunces\b|font-fraunces/i);
    expect(publicFontContract).toMatch(/Cabinet|Bricolage/i);
    expect(publicFontContract).toMatch(/Switzer|Hanken/i);
  });

  it("ships the new homepage proposition and clear CTA intents", () => {
    const page = read("src/app/(frontend)/page.tsx");

    expect(page).toContain("Politiek past niet op één lijn.");
    expect(page).toContain("Doe de Quick");
    expect(page).toContain("Bekijk de drie versies");
  });

  it("uses the transparent quiz-choice CTA in the global navigation", () => {
    const header = read("src/components/SiteHeader.tsx");
    expect(header).toContain("Kies je quiz");
  });

  it("does not style headings with the old italic-display pattern", () => {
    const sources = [
      read("src/app/(frontend)/page.tsx"),
      read("src/components/SiteHeader.tsx"),
      read("src/components/SiteFooter.tsx"),
    ].join("\n");

    expect(sources).not.toContain("display-italic");
  });

  it("uses the researched motion stack without adding a 3D runtime", () => {
    const pkg = JSON.parse(read("package.json")) as {
      dependencies?: Record<string, string>;
    };
    const dependencies = pkg.dependencies ?? {};

    expect(dependencies).toHaveProperty("motion");
    expect(dependencies).toHaveProperty("gsap");
    expect(dependencies).toHaveProperty("lenis");
    expect(dependencies).not.toHaveProperty("three");
    expect(dependencies).not.toHaveProperty("@react-three/fiber");
  });

  it("never exposes infrastructure errors through the checkout API", () => {
    const checkout = read("src/app/api/stripe/checkout/route.ts");

    expect(checkout).not.toMatch(/error:\s*`Checkout-fout:\s*\$\{summary\.message\}`/);
    expect(checkout).toContain("CHECKOUT_UNAVAILABLE");
  });
});
