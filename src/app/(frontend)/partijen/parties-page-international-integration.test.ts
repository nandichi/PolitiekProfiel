import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(process.cwd(), "src", "app", "(frontend)", "partijen", "page.tsx");

describe("parties knowledge centre page", () => {
  it("publishes the international party guide", () => {
    const page = readFileSync(pagePath, "utf8");
    expect(page).toContain('import { InternationalPartyIndex }');
    expect(page).toContain("<InternationalPartyIndex countries={internationalCountries} />");
  });
});
