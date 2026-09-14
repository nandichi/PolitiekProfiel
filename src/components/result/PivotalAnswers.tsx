import { dimensionMeta } from "@/lib/dimensions";
import type { PivotalAnswer } from "@/lib/result-pivotal-answers";

interface PivotalAnswersProps {
  items: PivotalAnswer[];
}

const ANSWER_LABELS: Record<string, string> = {
  "-2": "helemaal oneens",
  "-1": "oneens",
  "1": "eens",
  "2": "helemaal eens",
};

function label(value: number): string {
  return ANSWER_LABELS[String(value)] ?? String(value);
}

function flipLabel(value: number): string {
  return ANSWER_LABELS[String(-value)] ?? String(-value);
}

function signed(score: number): string {
  return score > 0 ? `+${score}` : String(score);
}

/**
 * "Wat als je hier anders had geantwoord?"
 *
 * Dit is de enige sectie die de scoringsregel zelf doorrekent op één antwoord.
 * Daardoor is het cijfer exact in plaats van een schatting, en tegelijk begrensd:
 * het laat één antwoord in isolatie zien, niet een alternatief profiel.
 */
export function PivotalAnswers({ items }: PivotalAnswersProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="kantelpunt-heading"
      className="border-y border-[var(--ink)]/15 py-12 sm:py-16"
    >
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
          Doorgerekend op jouw antwoorden
        </p>
        <h2 id="kantelpunt-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Wat als je hier anders had geantwoord?
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--ink)]/72 sm:text-lg">
          Deze stellingen verschoven je uitkomst het meest. Hieronder staat per
          stelling wat er met die ene as gebeurt als je precies het tegenovergestelde
          had geantwoord. Dat is geen schatting: het is dezelfde rekenregel als
          hierboven, één keer opnieuw uitgevoerd.
        </p>
      </div>

      <ol className="mt-10 space-y-8">
        {items.map((item) => {
          const meta = dimensionMeta(item.dimension);
          return (
            <li
              key={item.questionId}
              className="border-l-2 border-[var(--brand)] pl-5 sm:pl-7"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                {meta.label}
              </p>
              <p className="mt-2 max-w-3xl text-lg font-semibold leading-7 text-[var(--ink)]">
                {item.statement}
              </p>
              <dl className="mt-4 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/55">
                    Jouw antwoord
                  </dt>
                  <dd className="mt-1 text-base text-[var(--ink)]">{label(item.value)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/55">
                    Je score op deze as
                  </dt>
                  <dd className="mt-1 text-base tabular-nums text-[var(--ink)]">
                    {signed(item.currentScore)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/55">
                    Bij {flipLabel(item.value)}
                  </dt>
                  <dd className="mt-1 text-base tabular-nums text-[var(--ink)]">
                    {signed(item.flippedScore)}
                    <span className="ml-2 text-sm text-[var(--ink)]/60">
                      {item.impact} punten verschil
                    </span>
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 max-w-3xl text-sm leading-6 text-[var(--ink)]/60">
        Dit rekent één antwoord in isolatie door. Je echte uitkomst komt uit het
        geheel van je antwoorden, en een verschuiving van één as is geen
        voorspelling van een ander profiel. Het is ook geen advies over hoe je
        had moeten antwoorden.
      </p>
    </section>
  );
}
