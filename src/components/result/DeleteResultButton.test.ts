import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const componentPath = path.join(
  process.cwd(),
  "src",
  "components",
  "result",
  "DeleteResultButton.tsx",
);

describe("DeleteResultButton", () => {
  it("requires confirmation and calls the self-service deletion endpoint", () => {
    const component = fs.readFileSync(componentPath, "utf8");

    expect(component).toContain("window.confirm");
    expect(component).toContain("method: \"DELETE\"");
    expect(component).toContain("/api/r/${encodeURIComponent(shareId)}");
  });
});
