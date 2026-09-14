import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Elke `var(--naam)` in de code moet een custom property zijn die echt bestaat.
 *
 * In dit project definieert `globals.css` alleen Tailwind v4-tokens zoals
 * `--color-ink`. Schrijf je `var(--ink)`, dan is de declaratie ongeldig en
 * negeert de browser hem stil: tekst krijgt de overgeerfde kleur en randen
 * verdwijnen. Dat is precies waarom nieuwere secties er anders uitzagen dan de
 * rest van de site. Deze test vangt die klasse fouten in één keer af.
 */
const GLOBALS = path.join(process.cwd(), "src", "app", "(frontend)", "globals.css");
const SRC = path.join(process.cwd(), "src");

/**
 * Variabelen die niet in de css staan maar tijdens runtime worden gezet:
 * `--font-*` komt van next/font, `--theme-*` van het Payload-admin thema en
 * `--tw-*` van Tailwind zelf. Die mogen dus voorkomen zonder css-definitie.
 */
const RUNTIME_INJECTED = [
  /^--tw-/,
  /^--theme-/,
  /^--font-fraunces$/,
  /^--font-inter$/,
  /^--font-plex$/,
];

function definedCustomProperties(): Set<string> {
  const css = readFileSync(GLOBALS, "utf8");
  const names = new Set<string>();
  for (const match of css.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) {
    names.add(match[1]);
  }
  return names;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(tsx?|css)$/.test(entry) && !/\.test\./.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("design-tokens", () => {
  it("gebruikt alleen custom properties die globals.css definieert", () => {
    const defined = definedCustomProperties();
    const offenders: string[] = [];

    for (const file of walk(SRC)) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(/var\((--[a-zA-Z0-9-]+)/g)) {
        const name = match[1];
        if (RUNTIME_INJECTED.some((pattern) => pattern.test(name))) continue;
        if (!defined.has(name)) {
          offenders.push(`${path.relative(process.cwd(), file)}: ${name}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
