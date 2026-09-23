import type { PartyDossier as PartyDossierData } from "@/lib/party-dossier";
import { FiveLineRegister } from "@/components/content/PublicContent";

interface PartyDossierProps {
  dossier: PartyDossierData;
}

export function PartyDossier({ dossier }: PartyDossierProps) {
  return (
    <section
      aria-labelledby="partijkaart-title"
      className="border-y border-rule-strong py-10 md:py-14"
    >
      <div className="grid grid-cols-5 gap-x-4 gap-y-8 md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6">
        <header className="col-span-5 md:col-span-3 lg:col-span-4">
          <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-signal">
            Partijkaart
          </p>
          <h2
            id="partijkaart-title"
            className="mt-4 font-display text-3xl font-extrabold leading-none tracking-[-0.035em] md:text-4xl"
          >
            Zo lees je dit partijprofiel
          </h2>
          <FiveLineRegister className="mt-8 max-w-40" />
        </header>

        <div className="col-span-5 min-w-0 md:col-span-7 lg:col-span-7">
          <p className="max-w-[68ch] text-base leading-7 text-ink-raised md:text-lg">
            {dossier.roleLine}
          </p>

          {dossier.strongestSignals.length > 0 ? (
            <dl className="mt-8 border-y border-rule-strong divide-y divide-rule">
              {dossier.strongestSignals.map((signal) => (
                <div
                  key={signal.axis}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-4"
                >
                  <dt className="text-sm text-text-muted">{signal.label}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">
                    {signal.direction}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-8 border-y border-rule py-4 text-sm leading-6 text-text-muted">
              Op deze vijf assen heeft dit profiel geen uitgesproken uitschieter. Lees de programma- en bronsecties voor de concrete onderwerpen.
            </p>
          )}
        </div>

        <aside className="col-span-5 border-t border-rule pt-5 md:col-start-4 md:col-span-7 lg:col-start-auto lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-signal">
            Methode
          </p>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {dossier.methodLine}
          </p>
        </aside>
      </div>
    </section>
  );
}
