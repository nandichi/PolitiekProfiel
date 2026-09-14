import Link from "next/link";

export interface InternationalPartyCountry {
  country: string;
  note: string;
  parties: Array<{ name: string; slug: string; description: string }>;
}

interface InternationalPartyIndexProps {
  countries: InternationalPartyCountry[];
}

export function InternationalPartyIndex({ countries }: InternationalPartyIndexProps) {
  return (
    <section id="internationaal" className="border-t border-[var(--ink)]/20 pt-8 md:pt-12">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] lg:gap-14">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]/50">
            Kenniscentrum · eerste landengids
          </p>
          <h2 className="mt-3 max-w-md font-serif text-3xl leading-[0.98] tracking-[-0.035em] text-[var(--ink)] md:text-5xl">
            Internationale kaart
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-[var(--ink)]/70">
            Deze selectie is bewust klein gehouden. Elke pagina begint bij de eigen partijbron en een officiële uitslagenbron, zodat je kunt doorlezen zonder te verdwalen in losse labels.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-5">
          {countries.map((country, countryIndex) => (
            <section
              key={country.country}
              aria-labelledby={"international-country-" + countryIndex}
              className="border-l border-[var(--ink)]/20 pl-4"
            >
              <h3 id={"international-country-" + countryIndex} className="font-serif text-2xl tracking-[-0.025em] text-[var(--ink)]">
                {country.country}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ink)]/60">{country.note}</p>
              <ul className="mt-5 divide-y divide-[var(--ink)]/15 border-y border-[var(--ink)]/15">
                {country.parties.map((party) => (
                  <li key={party.slug} className="py-3">
                    <Link href={"/partij/" + party.slug} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                      <span className="font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                        {party.name}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-[var(--ink)]/60">{party.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
