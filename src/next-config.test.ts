import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("private-result cache policy", () => {
  it("prevents shared caches and indexing for result routes", () => {
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");

    expect(config).toContain('source: "/r/:path*"');
    expect(config).toContain('key: "Cache-Control"');
    expect(config).toContain('value: "private, no-store"');
    expect(config).toContain('key: "X-Robots-Tag"');
    expect(config).toContain('value: "noindex, nofollow"');
    expect(config).toContain('key: "Referrer-Policy"');
    expect(config).toContain('value: "no-referrer"');
    expect(config).toContain('source: "/api/og/:path*"');
  });
});
