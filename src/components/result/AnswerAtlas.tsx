import type { AnswerAtlasSection } from "@/lib/result-answer-atlas";
import { dimensionMeta } from "@/lib/dimensions";
import { THEMES, type ThemeId } from "@/lib/themes";

interface AnswerAtlasProps {
  sections: AnswerAtlasSection[];
}

const themeLabels = new Map(THEMES.map((theme) => [theme.id, theme.label]));

function intensityLabel(value: number): string {
  const strong = Math.abs(value) >= 2;
  const once = value >= 0;
  if (value === 0) return "geen duidelijke richting";
  return `${strong ? "sterk" : "matig"} ${once ? "eens" : "oneens"}`;
}

export function AnswerAtlas({ sections }: AnswerAtlasProps) {
  if (!sections.length) return null;

  return (
    <section
      aria-labelledby="antwoordkaart-heading"
      className="border-y border-[var(--color-ink)]/15 py-12 sm:py-16"
    >
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-terra)]">
          Terug naar je eigen antwoorden
        </p>
        <h2 id="antwoordkaart-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Je antwoordkaart
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--color-ink)]/72 sm:text-lg">
          Deze passages laten zien welke antwoorden het zwaarst meetelden in de onderdelen die in jouw profiel het duidelijkst naar voren komen. Ze leggen je niets in de mond. Je ziet terug wat je zelf invulde, plus waarom die stelling in de quiz stond.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section
            key={section.theme}
            aria-labelledby={"antwoordkaart-" + section.theme}
            className="border-l-2 border-[var(--color-terra)] pl-5 sm:pl-7"
          >
            <h3 id={"antwoordkaart-" + section.theme} className="text-xl font-bold">
              {themeLabels.get(section.theme as ThemeId) ?? section.theme}
            </h3>
            <ol className="mt-5 space-y-5">
              {section.entries.map((entry) => (
                <li key={entry.questionId} className="border-t border-[var(--color-ink)]/12 pt-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-terra)]">
                    {dimensionMeta(entry.dimension).shortLabel} · {intensityLabel(entry.value)} · jouw antwoord: {entry.answerLabel}
                  </p>
                  <p className="mt-2 max-w-3xl text-lg font-semibold leading-7 text-[var(--color-ink)]">
                    {entry.question}
                  </p>
                  <details open className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-ink)]/72">
                    <summary className="cursor-pointer font-semibold text-[var(--color-ink)] underline decoration-[var(--color-terra)]/60 underline-offset-4">
                      Waarom deze vraag meetelt
                    </summary>
                    <p className="mt-3">{entry.explanation}</p>
                    {entry.sourceUrl ? (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block font-semibold text-[var(--color-ink)] underline decoration-[var(--color-terra)] underline-offset-4"
                      >
                        Bron bij deze vraag
                      </a>
                    ) : null}
                  </details>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
