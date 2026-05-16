import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { buildBreadcrumbList, jsonLdString } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "API & Agent Discovery",
  description:
    "Technische documentatie van de PolitiekProfiel API en de agent-discovery-endpoints: OpenAPI 3.1 spec, robots.txt, sitemap, /.well-known/api-catalog (RFC 9727), markdown content negotiation en WebMCP-tools.",
  alternates: { canonical: "/docs/api" },
  openGraph: {
    title: "API & Agent Discovery · PolitiekProfiel",
    description:
      "OpenAPI 3.1, linkset, markdown for agents, WebMCP-tools — een site die agents begrijpen.",
    url: "/docs/api",
    type: "article",
  },
};

const ENDPOINTS: Array<{
  method: string;
  path: string;
  contentType: string;
  rel?: string;
  description: string;
}> = [
  {
    method: "GET",
    path: "/robots.txt",
    contentType: "text/plain",
    description:
      "Crawl-policy met expliciete User-agent rules per AI/zoekbot. Open opt-in voor zowel zoekindexering als AI-training en grounding.",
  },
  {
    method: "GET",
    path: "/sitemap.xml",
    contentType: "application/xml",
    rel: "sitemap",
    description: "Sitemap met canonical URLs van alle publieke editorial pagina's.",
  },
  {
    method: "GET",
    path: "/.well-known/api-catalog",
    contentType: "application/linkset+json",
    rel: "api-catalog",
    description:
      "Linkset volgens RFC 9727 / RFC 9264 die naar de OpenAPI-spec en docs van /api/results wijst.",
  },
  {
    method: "GET",
    path: "/api/docs/openapi.json",
    contentType: "application/openapi+json",
    rel: "service-desc",
    description: "OpenAPI 3.1 spec van de publieke endpoints.",
  },
  {
    method: "POST",
    path: "/api/results",
    contentType: "application/json",
    description:
      "Antwoorden indienen, krijgt een share-ID terug. Geen authenticatie, geen tracking, geen IP-opslag.",
  },
];

const HOMEPAGE_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</api/docs/openapi.json>; rel="service-desc"',
  '</docs/api>; rel="service-doc"',
  '</sitemap.xml>; rel="sitemap"',
  '</methodiek>; rel="describedby"',
];

export default function ApiDocsPage() {
  // /docs is geen eigen pagina (404), dus we maken een platte breadcrumb
  // van Start direct naar de huidige pagina.
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "API & Agent Discovery", item: "/docs/api" },
  ]);

  return (
    <Container width="default" className="pt-12 md:pt-20 pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />
      <Kicker>API & Agent Discovery</Kicker>
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-ink mt-3 mb-6">
        Voor developers en AI-agents
      </h1>
      <p className="text-ink/80 text-lg leading-relaxed max-w-2xl mb-12">
        PolitiekProfiel is gebouwd voor mensen, maar publiceert ook de discovery-metadata
        die AI-agents nodig hebben om de site programmatisch te begrijpen. Hieronder een
        overzicht van de publieke endpoints en de Link headers die op de homepage worden
        meegegeven.
      </p>

      <section className="mb-16">
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">Endpoints</h2>
        <div className="overflow-x-auto rounded-lg border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-ink/70">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Methode</th>
                <th className="text-left px-4 py-3 font-medium">Pad</th>
                <th className="text-left px-4 py-3 font-medium">Content-Type</th>
                <th className="text-left px-4 py-3 font-medium">rel</th>
                <th className="text-left px-4 py-3 font-medium">Beschrijving</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={`${e.method}-${e.path}`} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-3 font-mono text-xs">{e.method}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link href={e.path} className="text-ink hover:underline">
                      {e.path}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/70">
                    {e.contentType}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/70">
                    {e.rel ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink/80">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">
          Link headers op de homepage
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          De homepage geeft een <code className="font-mono text-sm">Link</code>-response-header
          terug (RFC 8288) die agents naar deze resources wijst:
        </p>
        <pre className="bg-ink/5 border border-ink/10 rounded-lg p-4 overflow-x-auto text-xs font-mono text-ink/90">
          {`Link: ${HOMEPAGE_LINK_HEADERS.join(",\n      ")}`}
        </pre>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">
          Markdown for Agents
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          De editorial pagina&apos;s <code className="font-mono text-sm">/</code>,{" "}
          <code className="font-mono text-sm">/methodiek</code> en{" "}
          <code className="font-mono text-sm">/privacy</code> ondersteunen content
          negotiation: stuur een <code className="font-mono text-sm">Accept: text/markdown</code>
          {" "}header en je krijgt een markdown-versie terug met{" "}
          <code className="font-mono text-sm">Content-Type: text/markdown</code>. HTML
          blijft de default voor browsers.
        </p>
        <pre className="bg-ink/5 border border-ink/10 rounded-lg p-4 overflow-x-auto text-xs font-mono text-ink/90">
          {`curl -H "Accept: text/markdown" https://politiekprofiel.nl/methodiek`}
        </pre>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">WebMCP</h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          Bij het laden van de site wordt{" "}
          <code className="font-mono text-sm">navigator.modelContext.provideContext()</code>
          {" "}aangeroepen (indien beschikbaar) zodat browser-gebaseerde agents drie tools
          kunnen gebruiken: een quiz starten, twee profielen vergelijken en een resultaat
          openen.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">Crawl-beleid</h2>
        <p className="text-ink/80 leading-relaxed">
          Volledig open: zowel zoekmachines als AI-crawlers (training, real-time grounding,
          search) mogen de publieke pagina&apos;s indexeren en gebruiken. Alleen{" "}
          <code className="font-mono text-sm">/admin/</code> en{" "}
          <code className="font-mono text-sm">/api/</code> zijn afgeschermd. Zie{" "}
          <Link href="/robots.txt" className="underline">
            /robots.txt
          </Link>
          {" "}voor de expliciete User-agent rules per AI/zoekbot.
        </p>
      </section>
    </Container>
  );
}
