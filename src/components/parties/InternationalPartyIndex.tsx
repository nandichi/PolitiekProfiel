import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DimensionScores } from "@/lib/scoring";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";

export interface InternationalPartyCountry {
  country: string;
  /** Korte landcode voor het mono-label, bijvoorbeeld DE of UK. */
  code: string;
  note: string;
  parties: Array<{
    name: string;
    slug: string;
    abbreviation: string;
    description: string;
    vector: DimensionScores;
  }>;
}

interface InternationalPartyIndexProps {
  countries: InternationalPartyCountry[];
}

/**
 * De buitenlandse partijen in exact hetzelfde kaartpatroon als de Nederlandse,
 * Europese en Amerikaanse partijen: mono-label met land en afkorting, de naam in
 * de display-stijl en de positie op de vijf assen. Zo is elke partij op de site
 * op dezelfde manier te vergelijken.
 */
export function InternationalPartyIndex({
  countries,
}: InternationalPartyIndexProps) {
  if (countries.length === 0) return null;

  return (
    <section className="mt-20 border-t border-ink pt-10">
      <ScrollReveal variant="stagger">
        <ScrollRevealItem>
          <Kicker number={4}>Internationale partijen</Kicker>
          <h2 className="display mt-5 max-w-3xl">
            Buitenlandse partijen, op dezelfde vijf assen.
          </h2>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-4 max-w-2xl text-sm text-ink-muted leading-relaxed">
            Elk profiel begint bij de eigen partijbron en een officiële
            uitslagenbron, zodat je kunt doorlezen zonder te verdwalen in losse
            labels. Bewust een selectie, niet een volledige wereldindex.
          </p>
        </ScrollRevealItem>

        {countries.map((country) => (
          <ScrollRevealItem key={country.country}>
            <div className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3">
                <h3 className="display text-xl text-ink">{country.country}</h3>
                <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                  {country.note}
                </p>
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {country.parties.map((party) => (
                  <li key={party.slug} className="border border-rule bg-paper p-5">
                    <Link
                      href={"/partij/" + party.slug}
                      className="block no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    >
                      <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                        {country.code} ·{" "}
                        {party.abbreviation.toUpperCase()}
                      </p>
                      <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                        {party.name}
                      </p>
                      <p className="mt-2 text-sm leading-5 text-ink-muted">
                        {party.description}
                      </p>
                      <div className="mt-4">
                        <MiniVector vector={party.vector} size="sm" />
                      </div>
                      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted group-hover:text-navy transition-colors">
                        Bekijk het profiel
                        <ArrowRight size={12} strokeWidth={1.8} aria-hidden="true" />
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollRevealItem>
        ))}
      </ScrollReveal>
    </section>
  );
}
