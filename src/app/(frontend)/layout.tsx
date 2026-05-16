import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WebMcpProvider } from "@/components/WebMcpProvider";
import "./globals.css";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "PolitiekProfiel - Een serieus politiek kompas",
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
  themeColor: "#fafaf7",
  colorScheme: "light",
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
      </body>
    </html>
  );
}
