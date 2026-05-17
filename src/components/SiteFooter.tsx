import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface FooterColumn {
  index: string;
  title: string;
  links: Array<{ href: string; label: string }>;
}

const COLUMNS: FooterColumn[] = [
  {
    index: "01",
    title: "Start",
    links: [
      { href: "/quiz/standard", label: "Quiz" },
      { href: "/vergelijk", label: "Vergelijk" },
      { href: "/verkennen", label: "Verkennen" },
    ],
  },
  {
    index: "02",
    title: "Bibliotheek",
    links: [
      { href: "/stellingen", label: "Stellingen" },
      { href: "/ideologieen", label: "Ideologieën" },
      { href: "/politici", label: "Politici" },
      { href: "/partijen", label: "Partijen" },
      { href: "/landen", label: "Landen" },
      { href: "/woordenboek", label: "Woordenboek" },
    ],
  },
  {
    index: "03",
    title: "Tools",
    links: [
      { href: "/coalitie", label: "Coalitie-simulator" },
      { href: "/turing-test", label: "Turing test" },
      { href: "/evolutie", label: "Politieke evolutie" },
    ],
  },
  {
    index: "04",
    title: "Methode & juridisch",
    links: [
      { href: "/methodiek", label: "Methodiek" },
      { href: "/methodiek#dimensies", label: "De vijf dimensies" },
      { href: "/methodiek#scoring", label: "Scoring" },
      { href: "/privacy", label: "Privacyverklaring" },
      { href: "/ai-transparantie", label: "AI-transparantie" },
      { href: "mailto:privacy@politiekprofiel.nl", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-rule bg-paper">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 pt-16 lg:pt-24 pb-10">
        {/* Manifest + columns */}
        <div className="grid grid-cols-1 gap-14 lg:gap-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker mb-5">Colofon</p>
            <p className="display text-[1.6rem] md:text-[1.85rem] leading-[1.1] text-ink tracking-tight">
              Een onafhankelijk politiek{" "}
              <em className="display-italic font-light text-navy">kompas</em>,
              ontwikkeld als publiek instrument voor reflectie.
            </p>
            <p className="mt-5 text-sm text-ink-2 max-w-sm leading-relaxed">
              Geen reclame. Geen tracking. Geen account. Vijf dimensies, een
              eerlijke vergelijking.
            </p>
            <Link
              href="/quiz/standard"
              className="mt-7 inline-flex items-center gap-2 text-sm text-ink no-underline border-b border-ink/40 hover:border-ink pb-0.5"
            >
              Start de quiz
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </Link>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="index-num text-[0.7rem]">{col.index}</span>
                  <span
                    aria-hidden
                    className="block h-px w-4 bg-rule-strong translate-y-[-2px]"
                  />
                  <p className="kicker">{col.title}</p>
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-2 no-underline hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-14 lg:mt-20 pt-6 border-t border-rule flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-4">
            <Link
              href="/"
              className="display text-lg font-medium tracking-tight no-underline"
            >
              <span className="text-ink">Politiek</span>
              <span className="text-navy">Profiel</span>
            </Link>
            <span
              aria-hidden
              className="hidden sm:block w-8 h-px bg-rule-strong translate-y-[-3px]"
            />
            <span className="mono text-xs text-ink-muted tracking-wide">
              © {year} · Geen tracking · Geen reclame
            </span>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="mono text-xs text-ink-muted tracking-wide">
              Gebouwd door{" "}
              <a
                href="https://naoufalandichi.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-2 underline-offset-2 hover:text-navy hover:underline"
              >
                Naoufal Andichi
              </a>
              <span aria-hidden className="mx-1.5 text-ink-muted">
                ·
              </span>
              <a
                href="https://www.linkedin.com/in/naoufalandichi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-2 underline-offset-2 hover:text-navy hover:underline"
              >
                LinkedIn
              </a>
            </p>
            <p className="mono text-xs text-ink-muted tracking-wide">
              v1.0 · Gemaakt in Nederland
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
