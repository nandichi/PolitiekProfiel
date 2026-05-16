import type { Metadata, Viewport } from "next";
import { Inter, Spectral } from "next/font/google";
import Link from "next/link";
import { ConsentBanner } from "@/components/ConsentBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "PolitiekProfiel — Een serieus politiek kompas",
    template: "%s · PolitiekProfiel",
  },
  description:
    "Een onafhankelijk Nederlands politiek kompas. Vijf dimensies, rustige uitleg, herkenbare vergelijking met politici en landen.",
  applicationName: "PolitiekProfiel",
  authors: [{ name: "PolitiekProfiel" }],
  openGraph: {
    title: "PolitiekProfiel",
    description:
      "Een onafhankelijk Nederlands politiek kompas op vijf dimensies.",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolitiekProfiel",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f4",
  colorScheme: "light",
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${spectral.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ConsentBanner />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="serif text-xl font-medium tracking-tight text-ink hover:no-underline"
        >
          Politiek<span className="text-accent">Profiel</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-muted">
          <Link href="/methodiek" className="hover:text-ink">
            Methodiek
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 md:grid-cols-3 text-sm text-ink-muted">
        <div>
          <p className="serif text-lg text-ink">
            Politiek<span className="text-accent">Profiel</span>
          </p>
          <p className="mt-2 max-w-xs">
            Een onafhankelijk politiek kompas, ontwikkeld als publieksinstrument
            voor reflectie. Geen reclame, geen tracking.
          </p>
        </div>
        <div>
          <p className="kicker mb-3">Verken</p>
          <ul className="space-y-1.5">
            <li>
              <Link href="/" className="hover:text-ink">Start</Link>
            </li>
            <li>
              <Link href="/methodiek" className="hover:text-ink">Methodiek</Link>
            </li>
            <li>
              <Link href="/vergelijk" className="hover:text-ink">Vergelijk twee profielen</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker mb-3">Juridisch</p>
          <ul className="space-y-1.5">
            <li>
              <Link href="/privacy" className="hover:text-ink">Privacyverklaring</Link>
            </li>
            <li className="text-ink-subtle">
              © {new Date().getFullYear()} PolitiekProfiel
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
