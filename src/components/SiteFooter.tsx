import Link from "next/link";

const COLUMNS: Array<{
  title: string;
  links: Array<{ href: string; label: string }>;
}> = [
  {
    title: "Verken",
    links: [
      { href: "/", label: "Start" },
      { href: "/quiz/standard", label: "Quiz" },
      { href: "/vergelijk", label: "Vergelijk" },
    ],
  },
  {
    title: "Methode",
    links: [
      { href: "/methodiek", label: "Methodiek" },
      { href: "/methodiek#dimensies", label: "De vijf dimensies" },
      { href: "/methodiek#scoring", label: "Scoring" },
    ],
  },
  {
    title: "Juridisch",
    links: [
      { href: "/privacy", label: "Privacyverklaring" },
      { href: "mailto:privacy@politiekprofiel.nl", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-rule bg-paper">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 pt-16 lg:pt-24 pb-10">
        {/* Top: meta + columns */}
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.5fr_3fr]">
          <div>
            <p className="kicker mb-5">Colofon</p>
            <p className="display text-2xl leading-snug text-ink">
              Een onafhankelijk politiek kompas, ontwikkeld als publiek
              instrument voor reflectie.
            </p>
            <p className="mt-5 text-sm text-ink-muted max-w-sm">
              Geen reclame. Geen tracking. Geen account. Vijf dimensies, een
              eerlijke vergelijking.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {COLUMNS.map((col, i) => (
              <div key={col.title}>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="index-num text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
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
        <div className="mt-14 lg:mt-20 pt-6 border-t border-rule flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-4">
            <span className="display text-lg font-medium tracking-tight">
              <span className="text-ink">Politiek</span>
              <span className="text-navy">Profiel</span>
            </span>
            <span
              aria-hidden
              className="hidden sm:block w-8 h-px bg-rule-strong translate-y-[-3px]"
            />
            <span className="mono text-xs text-ink-muted tracking-wide">
              © {year} · Geen tracking · Geen reclame
            </span>
          </div>
          <p className="mono text-xs text-ink-muted tracking-wide">
            v1.0 · Gemaakt in Nederland
          </p>
        </div>
      </div>
    </footer>
  );
}
