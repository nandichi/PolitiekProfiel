import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(process.cwd(), "src", "app", "(frontend)", "r", "[id]", "page.tsx");

describe("result page answer atlas integration", () => {
  it("renders explanation-ready evidence from the reader's own answers", () => {
    const source = readFileSync(pagePath, "utf8");

    expect(source).toContain('import { AnswerAtlas } from "@/components/result/AnswerAtlas"');
    expect(source).toContain('import { deriveAnswerAtlas } from "@/lib/result-answer-atlas"');
    expect(source).toContain("await deriveAnswerAtlas(");
    expect(source).toContain("<AnswerAtlas sections={answerAtlas} />");
  });
});
