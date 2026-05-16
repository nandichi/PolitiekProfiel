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
  category: "Politics",
  alternates: {
    canonical: "/",
    languages: {
      "nl-NL": "/",
      "x-default": "/",
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

const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}#founder`,
  name: "Naoufal Andichi",
  url: "https://naoufalandichi.nl",
  jobTitle: "Software Developer",
  worksFor: {
    "@type": "Organization",
    name: "Developing B.V.",
    url: "https://developing.nl/",
  },
  knowsAbout: [
    "Nederlandse politiek",
    "politieke ideologieën",
    "data-visualisatie",
    "webdevelopment",
  ],
  knowsLanguage: ["nl-NL", "en"],
  sameAs: [
    "https://naoufalandichi.nl",
    "https://www.linkedin.com/in/naoufalandichi/",
    "https://politiekpraat.nl",
  ],
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: SITE_NAME,
  legalName: SITE_NAME,
  alternateName: "Een onafhankelijk politiek kompas",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/apple-icon`,
    width: 180,
    height: 180,
  },
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  founder: { "@id": `${SITE_URL}#founder` },
  founders: [{ "@id": `${SITE_URL}#founder` }],
  foundingDate: "2026",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
  },
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  knowsLanguage: ["nl-NL"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "privacy",
    email: "privacy@politiekprofiel.nl",
    availableLanguage: ["nl"],
  },
  sameAs: [
    "https://naoufalandichi.nl",
    "https://www.linkedin.com/in/naoufalandichi/",
  ],
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
  creator: { "@id": `${SITE_URL}#founder` },
  about: [
    { "@type": "Thing", name: "Nederlandse politiek" },
    { "@type": "Thing", name: "politieke ideologieën" },
    { "@type": "Thing", name: "politiek kompas" },
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Nederlandse kiezers",
    geographicArea: { "@type": "Country", name: "Netherlands" },
  },
  isAccessibleForFree: true,
  license: `${SITE_URL}/privacy`,
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
            __html: JSON.stringify([PERSON_LD, ORGANIZATION_LD, WEBSITE_LD]),
          }}
        />
      </body>
    </html>
  );
}
