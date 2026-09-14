import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

const root = process.cwd();
const source = (...parts: string[]) =>
  fs.readFileSync(path.join(root, "src", ...parts), "utf8");

describe("sensitive result sharing", () => {
  it.each([
    "/vergelijk?a=private-result",
    "/evolutie?ids=private-result",
    "/coalitie?r=private-result",
  ])("marks result-derived route %s as private and non-indexable", (route) => {
    const response = proxy(new NextRequest(`https://politiekprofiel.nl${route}`));

    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
  });

  it("does not emit result identifiers in a canonical comparison URL", () => {
    const resultPage = source("app", "(frontend)", "r", "[id]", "page.tsx");

    expect(resultPage).not.toContain("canonical: `/vergelijk?");
  });

  it("does not aggregate sensitive customer results for public cohort features", () => {
    const resultPage = source("app", "(frontend)", "r", "[id]", "page.tsx");
    const typologyPage = source("app", "(frontend)", "typology", "page.tsx");

    expect(resultPage).not.toContain('from "@/lib/cohort"');
    expect(typologyPage).not.toContain('from "@/lib/cohort"');
  });

  it("uses dynamic noindex metadata whenever a page resolves share identifiers", () => {
    for (const file of [
      ["app", "(frontend)", "vergelijk", "page.tsx"],
      ["app", "(frontend)", "evolutie", "page.tsx"],
      ["app", "(frontend)", "coalitie", "page.tsx"],
    ]) {
      const page = source(...file);
      expect(page).toContain("export async function generateMetadata");
      expect(page).toContain("PRIVATE_RESULT_QUERY_ROBOTS");
    }
  });
});
