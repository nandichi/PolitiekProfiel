import { describe, expect, it } from "vitest";
import { GLOSSARY, GLOSSARY_BY_SLUG } from "@/data/woordenboek";

describe("woordenboek navigation", () => {
  it("only publishes related links that actually exist", () => {
    const missing = GLOSSARY.flatMap((term) =>
      (term.related ?? []).filter((related) => !GLOSSARY_BY_SLUG.has(related)),
    );
    expect(missing).toEqual([]);
  });
});
