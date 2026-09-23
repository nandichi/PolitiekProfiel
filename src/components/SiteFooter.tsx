"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { MeasureRule } from "@/components/system/MeasureRule";

const PRIMARY_LINKS = [
  { href: "/methodiek", label: "Methodiek", note: "Hoe de vijf meetlijnen werken" },
  { href: "/privacy", label: "Privacy", note: "Wat we wel en niet bewaren" },
  { href: "/voorwaarden", label: "Voorwaarden", note: "Aankoop en gebruik" },
  { href: "/contact", label: "Contact", note: "Vraag, probleem of correctie" },
] as const;

const INDEX_LINKS = [
  { href: "/verkennen", label: "Verkennen" },
  { href: "/stellingen", label: "Stellingen" },
  { href: "/ideologieen", label: "Ideologieën" },
  { href: "/politici", label: "Politici" },
  { href: "/partijen", label: "Partijen" },
  { href: "/landen", label: "Landen" },
  { href: "/woordenboek", label: "Woordenboek" },
  { href: "/coalitie", label: "Coalitie-simulator" },
  { href: "/turing-test", label: "Turing test" },
  { href: "/evolutie", label: "Politieke evolutie" },
] as const;

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname.startsWith("/quiz/") || pathname.startsWith("/embed/")) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-ink bg-ink text-canvas sm:mt-24">
      <MeasureRule inverted />
      <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 lg:px-10 lg:pt-24">
        <div className="grid grid-cols-5 gap-x-4 gap-y-10 md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6">
          <div className="col-span-5 md:col-span-8 lg:col-span-10">
            <p className="mono text-[0.68rem] uppercase tracking-[0.17em] text-focus">
              Publiek instrument voor politieke reflectie
            </p>
            <p className="display mt-5 max-w-[16ch] text-[clamp(2.7rem,6.8vw,7rem)] font-black leading-[0.88] tracking-[-0.055em] text-canvas">
              Meet meer dan één politieke lijn.
            </p>
            <Link
              href="/quiz/quick"
              className="mt-8 inline-flex min-h-12 items-center gap-3 bg-signal px-5 py-3 text-sm font-bold text-canvas no-underline hover:bg-signal-pressed hover:text-canvas"
            >
              Doe de Quick · gratis
              <ArrowRight aria-hidden size={16} strokeWidth={2} />
            </Link>
          </div>

          <div className="col-span-5 md:col-span-10 lg:col-span-5 lg:col-start-11">
            <p className="mono text-[0.65rem] uppercase tracking-[0.15em] text-canvas/55">
              Direct controleren
            </p>
            <ul className="mt-4 border-t border-canvas/30">
              {PRIMARY_LINKS.map((link, index) => (
                <li key={link.href} className="border-b border-canvas/25">
                  <Link
                    href={link.href}
                    className="group grid min-h-16 grid-cols-[2rem_1fr_auto] items-center gap-3 py-3 text-canvas no-underline hover:text-focus"
                  >
                    <span className="mono text-[0.6rem] text-canvas/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{link.label}</span>
                      <span className="mt-0.5 block text-xs text-canvas/55">{link.note}</span>
                    </span>
                    <ArrowUpRight aria-hidden size={15} strokeWidth={1.8} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-canvas/25 pt-6 lg:mt-20">
          <nav aria-label="Footer index">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {INDEX_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-canvas/70 no-underline hover:text-focus"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 flex flex-col gap-5 border-t border-canvas/20 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <BrandWordmark className="text-lg" inverted />
              <p className="mono mt-2 text-[0.62rem] uppercase tracking-[0.12em] text-canvas/50">
                © {year} · Nederland · onafhankelijk
              </p>
            </div>
            <p className="mono text-[0.62rem] tracking-[0.1em] text-canvas/50 sm:text-right">
              Gebouwd door{" "}
              <a
                href="https://naoufalandichi.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-canvas underline-offset-4 hover:text-focus"
              >
                Naoufal Andichi
              </a>
              {" · "}
              <a
                href="https://www.linkedin.com/in/naoufalandichi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-canvas underline-offset-4 hover:text-focus"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
