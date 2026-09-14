import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(
  process.cwd(),
  "src",
  "app",
  "(frontend)",
  "r",
  "[id]",
  "page.tsx",
);

describe("paid result-page profile explanation", () => {
  it("places the derived personal explanation before the generic ideology background", () => {
    const page = readFileSync(pagePath, "utf8");

    expect(page).toContain('import { PersonalProfile } from "@/components/result/PersonalProfile";');
    expect(page).toContain('import { createPersonalProfile } from "@/lib/result-profile-narrative";');
    expect(page).toContain("const personalProfile = createPersonalProfile");
    expect(page).toContain("<PersonalProfile profile={personalProfile} />");
    expect(page.indexOf("<PersonalProfile profile={personalProfile} />")).toBeLessThan(
      page.indexOf("Wat houdt dit profiel in?"),
    );
  });
});
