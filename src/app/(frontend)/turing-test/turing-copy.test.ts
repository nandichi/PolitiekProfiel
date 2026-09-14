import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Turing test provenance", () => {
  it("labels editorial prompts as prompts rather than direct quotations", () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), "src", "app", "(frontend)", "turing-test", "page.tsx"),
      "utf8",
    );

    expect(page).toContain("redactionele oefenfragmenten");
  });
});
