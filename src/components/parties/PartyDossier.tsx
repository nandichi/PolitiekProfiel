import type { PartyDossier as PartyDossierData } from "@/lib/party-dossier";

interface PartyDossierProps {
  dossier: PartyDossierData;
}

export function PartyDossier({ dossier }: PartyDossierProps) {
  return (
    <section className="border-y border-[var(--ink)]/20 py-8 md:py-10">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-14">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]/50">Partijkaart</p>
          <h2 className="mt-3 font-serif text-3xl leading-[0.98] tracking-[-0.035em] text-[var(--ink)] md:text-4xl">
            Zo lees je dit partijprofiel
          </h2>
        </div>
        <div>
          <p className="max-w-2xl text-base leading-7 text-[var(--ink)]/75">{dossier.roleLine}</p>
          {dossier.strongestSignals.length > 0 ? (
            <dl className="mt-7 divide-y divide-[var(--ink)]/15 border-y border-[var(--ink)]/15">
              {dossier.strongestSignals.map((signal) => (
                <div key={signal.axis} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
                  <dt className="text-sm text-[var(--ink)]/65">{signal.label}</dt>
                  <dd className="font-medium text-[var(--ink)]">{signal.direction}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-7 border-y border-[var(--ink)]/15 py-3 text-sm leading-6 text-[var(--ink)]/65">
              Op deze vijf assen heeft dit profiel geen uitgesproken uitschieter. Lees de programma- en bronsecties voor de concrete onderwerpen.
            </p>
          )}
          <p className="mt-6 max-w-2xl text-sm leading-6 text-[var(--ink)]/60">{dossier.methodLine}</p>
        </div>
      </div>
    </section>
  );
}
