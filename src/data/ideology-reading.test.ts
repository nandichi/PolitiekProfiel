import { describe, expect, it } from "vitest";
import { IDEOLOGY_READING } from "@/data/ideology-reading";

describe("ideology reading list", () => {
  it("uses the corrected bibliographic records", () => {
    const all = Object.values(IDEOLOGY_READING).flat();
    expect(all).toHaveLength(16);
    expect(all).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "The Rise of Christian Democracy in Europe",
          author: "Stathis N. Kalyvas",
          year: 1996,
        }),
        expect.objectContaining({
          title: "Technocracy and the Politics of Expertise",
          author: "Frank Fischer",
          year: 1990,
        }),
        expect.objectContaining({
          title: "Liberalism and Social Action",
          author: "John Dewey",
          year: 1935,
        }),
        expect.objectContaining({
          title: "The Essential Communitarian Reader",
          author: "Amitai Etzioni",
          year: 1998,
        }),
      ]),
    );
  });
});
