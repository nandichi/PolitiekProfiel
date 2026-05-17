import type { PartyDoc } from "@/lib/result-data";
import { LexicalRenderer } from "@/components/LexicalRenderer";

const REGION_TITLES: Record<PartyDoc["region"], string> = {
  NL: "Nederlandse partijen",
  EU: "Europese partij-families",
  US: "Amerikaanse stromingen",
};

const REGION_DESC: Record<PartyDoc["region"], string> = {
  NL: "Welke Nederlandse partijen liggen het dichtst bij deze ideologie? Dit is educatieve context — geen stemadvies.",
  EU: "Hoe vertaalt deze ideologie zich in het Europees Parlement?",
  US: "En in het Amerikaanse politieke landschap?",
};

interface PartyContextProps {
  parties: PartyDoc[];
  ideologyName: string;
}

export function PartyContext({ parties, ideologyName }: PartyContextProps) {
  if (parties.length === 0) {
    return (
      <div className="border border-rule p-5 md:p-7 bg-paper-100">
        <p className="kicker mb-2">Nog geen partij-context</p>
        <p className="text-ink-2 text-sm leading-relaxed">
          Voor &ldquo;{ideologyName}&rdquo; hebben we nog geen partijen
          gekoppeld. Wel worden de scores per dimensie en thema getoond zodat je
          zelf de vergelijking kunt maken.
        </p>
      </div>
    );
  }

  const byRegion: Record<PartyDoc["region"], PartyDoc[]> = {
    NL: [],
    EU: [],
    US: [],
  };
  for (const p of parties) byRegion[p.region].push(p);

  const regions = (["NL", "EU", "US"] as PartyDoc["region"][]).filter(
    (r) => byRegion[r].length > 0,
  );

  return (
    <div className="space-y-12">
      <div className="border border-navy/30 bg-navy/3 px-4 py-3 text-xs text-ink-2 leading-relaxed max-w-3xl">
        Dit is geen stemwijzer. We tonen partijen die in hoofdlijnen
        overeenkomen met de ideologie waarop jouw profiel het meest lijkt,
        niet met je individuele scores.
      </div>

      {regions.map((region) => (
        <section key={region}>
          <p className="kicker mb-2">{REGION_TITLES[region]}</p>
          <h3 className="display text-xl md:text-2xl mb-2">
            {REGION_DESC[region]}
          </h3>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
            {byRegion[region].map((party) => (
              <li
                key={party.id}
                className="border-t border-rule pt-5"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h4 className="display text-lg md:text-xl text-ink leading-tight wrap-break-word [hyphens:auto]">
                    {party.name}
                  </h4>
                  <span className="mono text-[0.65rem] tracking-wider text-ink-muted">
                    {party.abbreviation}
                  </span>
                </div>
                <div className="editorial-prose [&>p]:text-sm [&>p]:text-ink-2 [&>p]:leading-relaxed [&>p]:mt-2 [&>p:first-child]:mt-0">
                  <LexicalRenderer value={party.description} />
                </div>
                {(party.founded || party.leader) && (
                  <p className="mt-3 mono text-[0.65rem] tracking-wider text-ink-subtle">
                    {[party.founded, party.leader].filter(Boolean).join(" · ").toUpperCase()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
