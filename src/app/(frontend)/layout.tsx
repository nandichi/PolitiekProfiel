import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WebMcpProvider } from "@/components/WebMcpProvider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://politiekprofiel.nl";
const SITE_NAME = "PolitiekProfiel";
const SITE_DESCRIPTION =
  "Een onafhankelijk Nederlands politiek kompas op vijf onafhankelijke dimensies — economisch, sociaal-cultureel, burgerrechten, bestuur en systeemvertrouwen. Geen tracking, geen account, anonieme deelbare resultaten.";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PolitiekProfiel — een serieus politiek kompas",
    template: "%s · PolitiekProfiel",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  authors: [{ name: "Naoufal Andichi", url: "https://naoufalandichi.nl" }],
  creator: "Naoufal Andichi",
  publisher: "PolitiekProfiel",
  keywords: [
    "politiek kompas",
    "politieke quiz",
    "ideologie",
    "stemwijzer alternatief",
    "politieke dimensies",
    "Nederland politiek",
    "politiek profiel",
    "vergelijken politici",
    "politieke ideologieën",
    "burgerrechten",
    "EU bestuur",
    "AVG",
  ],
  category: "Politics",
  alternates: {
    canonical: "/",
    languages: {
      "nl-NL": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "PolitiekProfiel — een onafhankelijk politiek kompas",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolitiekProfiel — een onafhankelijk politiek kompas",
    description:
      "Een rustig, doordacht politiek profiel op vijf onafhankelijke dimensies. Geen scorelijst voor partijen.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1014" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/apple-icon`,
    width: 180,
    height: 180,
  },
  description: SITE_DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Naoufal Andichi",
    url: "https://naoufalandichi.nl",
  },
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  knowsLanguage: ["nl-NL"],
  sameAs: [],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  name: SITE_NAME,
  alternateName: "Een onafhankelijk politiek kompas",
  url: SITE_URL,
  inLanguage: "nl-NL",
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}#organization` },
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${fraunces.variable} ${plex.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ConsentBanner />
        <WebMcpProvider />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([ORGANIZATION_LD, WEBSITE_LD]),
          }}
        />
      </body>
    </html>
  );
}
