import type { PoliticianProfileLens as PoliticianProfileLensData } from "@/lib/politician-profile-lens";

interface PoliticianProfileLensProps {
  lens: PoliticianProfileLensData;
}

export function PoliticianProfileLens({ lens }: PoliticianProfileLensProps) {
  return (
    <section aria-labelledby="portret-context" className="border-y border-[var(--ink)]/15 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Portret in context
          </p>
          <h2 id="portret-context" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {lens.roleTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--ink)]/75 sm:text-lg">
            {lens.roleExplanation}
          </p>
        </div>

        <aside className="border-l-2 border-[var(--brand)] pl-5 sm:pl-7">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
            Zo lees je de kaart
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--ink)]/72">{lens.profileNote}</p>
        </aside>
      </div>

      {lens.strongestSignals.length ? (
        <div className="mt-10 border-t border-[var(--ink)]/12 pt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Opvallend in deze kaart
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            {lens.strongestSignals.map((signal) => (
              <li key={signal.axis} className="border-t border-[var(--ink)]/12 pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55">
                  {signal.label}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-6">{signal.direction}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink)]/72">{signal.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
