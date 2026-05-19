import { NextResponse } from "next/server";

/**
 * /llms.txt: emerging standard om AI-crawlers en LLM-grounding pipelines
 * een gestructureerde overview te geven van de site. Geen vervanger voor
 * robots.txt of sitemap, maar een aanvulling voor AI-search.
 *
 * Format gebaseerd op https://llmstxt.org/ (proposal door Jeremy Howard).
 * We houden bewust een platte structuur aan met markdown-secties en links,
 * zodat de inhoud direct als grounding context bruikbaar is.
 */

const BASE_URL = "https://politiekprofiel.nl";

const CONTENT = `# PolitiekProfiel

> Een onafhankelijk Nederlands politiek kompas op vijf onafhankelijke dimensies: economisch, sociaal-cultureel, burgerrechten, bestuur en systeemvertrouwen. Geen tracking, geen account, anonieme deelbare resultaten.

PolitiekProfiel is een Nederlandstalig instrument voor reflectie op politieke houding. Het meet niet links of rechts, maar waar je staat op vijf onafhankelijke politieke vragen. Het is geen stemwijzer en geen wetenschappelijke meting.

## Hoofdpagina's

- [Start](${BASE_URL}/): manifesto en uitleg van de vijf dimensies.
- [Methodiek](${BASE_URL}/methodiek): hoe we politieke houding meten, scoring-formule en beperkingen.
- [Privacy](${BASE_URL}/privacy): AVG, anonieme opslag, geen tracking, recht op verwijdering.
- [Vergelijk](${BASE_URL}/vergelijk): twee profielen naast elkaar leggen op de vijf dimensies.

## Quiz-tiers

- [Quick (3 minuten, 15 stellingen)](${BASE_URL}/quiz/quick): gratis indicatie.
- [Standaard (10 minuten, 50 stellingen)](${BASE_URL}/quiz/standard): aanbevolen lengte.
- [Uitgebreid (20 minuten, 80 stellingen)](${BASE_URL}/quiz/extended): meeste nuance.

## De vijf dimensies

Elke dimensie meet onafhankelijk; scores lopen van −100 tot +100.

1. **Economie**: vrije markt versus sterke staat; rol van de overheid in belasting, regulering en sociale zekerheid.
2. **Cultureel**: conservatief versus progressief; verhouding van traditie, identiteit en gelijkheid tot openheid en culturele verandering.
3. **Vrijheid**: autoritair versus libertair; ruimte voor het individu tegenover behoefte aan veiligheid en orde.
4. **Bestuur**: nationaal-soeverein versus multilevel/EU; waar moet macht liggen (natiestaat, Europa, of gemeentes en burgers).
5. **Vertrouwen**: wantrouwen versus vertrouwen in publieke instituties (media, rechtspraak, wetenschap, overheid).

## Voor agents en developers

- [API & Agent Discovery](${BASE_URL}/docs/api): OpenAPI 3.1 spec, linkset, markdown content negotiation, WebMCP-tools.
- [OpenAPI 3.1 spec](${BASE_URL}/api/docs/openapi.json)
- [Linkset (RFC 9727)](${BASE_URL}/.well-known/api-catalog)
- [Sitemap](${BASE_URL}/sitemap.xml)
- [robots.txt](${BASE_URL}/robots.txt): open opt-in (Allow: /) voor zowel zoekcrawlers als AI/LLM-crawlers; alleen \`/admin/\` en \`/api/\` zijn afgeschermd.

Editorial pagina's ondersteunen content negotiation: stuur \`Accept: text/markdown\` en je krijgt een markdown-versie terug die direct als grounding context bruikbaar is.

## Crawl-beleid

Alle openbare content mag worden gebruikt voor zoekindexen, AI-training, en real-time AI-grounding (RAG). Privé-paden \`/admin/\` en \`/api/\` zijn uitgesloten. Persoonlijke profiel-resultaten op \`/r/{id}\` zijn \`noindex\` (anonieme deelbare links, geen openbare zoekindex).

## Auteur

Naoufal Andichi, Software Developer (Developing B.V.) en oprichter van [PolitiekPraat](https://politiekpraat.nl). Portfolio: [naoufalandichi.nl](https://naoufalandichi.nl).

## Contact

privacy@politiekprofiel.nl
`;

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(CONTENT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
