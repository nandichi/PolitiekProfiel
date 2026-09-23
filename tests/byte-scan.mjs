import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";

const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".css", ".json", ".md", ".mjs", ".yml", ".yaml"]);
const trackedChanged = execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", "HEAD"], {
  encoding: "utf8",
}).split(/\r?\n/).filter(Boolean);
const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
  encoding: "utf8",
}).split(/\r?\n/).filter(Boolean);
const changed = [...new Set([...trackedChanged, ...untracked])];

const violations = [];
for (const relativePath of changed) {
  if (!TEXT_EXTENSIONS.has(extname(relativePath)) || !existsSync(resolve(relativePath))) continue;
  const source = readFileSync(relativePath);
  if (source.includes(0)) violations.push(`${relativePath}: NUL byte`);
  if (source.length >= 3 && source[0] === 0xef && source[1] === 0xbb && source[2] === 0xbf) {
    violations.push(`${relativePath}: UTF-8 BOM`);
  }
  const text = source.toString("utf8");
  if (text.includes("\u2028") || text.includes("\u2029")) {
    violations.push(`${relativePath}: Unicode line separator`);
  }
}

try {
  execFileSync("git", ["diff", "--check", "HEAD"], { stdio: "pipe" });
} catch (error) {
  violations.push(error.stdout?.toString() || error.stderr?.toString() || "git diff --check failed");
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(`Byte scan passed: ${changed.length} changed/new files have no NUL, BOM, or Unicode line separators; git diff --check is clean.`);
