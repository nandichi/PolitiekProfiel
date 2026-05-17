/**
 * Tweede Kamer Open Data — OData v4 client.
 *
 * Docs: https://opendata.tweedekamer.nl/documentatie
 * Endpoint: https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/
 *
 * Belangrijk:
 *  - Public, geen auth nodig, geen rate-limit afspraak. Wij respecteren
 *    `delta=1` (incremental sync) en bewaren `enclosure_url` voor stukken.
 *  - `Verwijderd eq false` filtert ingetrokken records.
 *  - Standaard `$select` zodat we niet onnodig data over de lijn trekken.
 *  - Geen `eval`, geen client-side fetches: dit draait alleen vanuit
 *    server-routes (cron / API / build).
 */
import "server-only";

const BASE_URL = "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0";
const USER_AGENT = "PolitiekProfiel/1.0 (https://politiekprofiel.nl; contact privacy@politiekprofiel.nl)";

export interface ODataResponse<T> {
  "@odata.context": string;
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
  value: T[];
}

export interface TkFractie {
  Id: string;
  Afkorting: string;
  NaamNL: string;
  NaamEN: string;
  AantalZetels: number;
  AantalStemmen: number;
  DatumActief: string;
  DatumInactief: string | null;
  Verwijderd: boolean;
  GewijzigdOp: string;
  ApiGewijzigdOp: string;
}

export interface TkStemming {
  Id: string;
  Soort: string; // "Voor" | "Tegen" | "Onthouding"
  FractieGrootte: number;
  ActorNaam: string | null;
  ActorFractie: string | null;
  Vergissing: boolean;
  Besluit_Id: string;
  Fractie_Id: string | null;
  Persoon_Id: string | null;
  Verwijderd: boolean;
  GewijzigdOp: string;
}

export interface TkBesluit {
  Id: string;
  BesluitSoort: string; // "Aangenomen" | "Verworpen" | "Ingediend" | ...
  BesluitTekst: string | null;
  StemmingsSoort: string | null; // "Hoofdelijk" | "Met handopsteken" | ...
  Status: string;
  Verwijderd: boolean;
  GewijzigdOp: string;
  Agendapunt_Id: string;
  /**
   * Niet direct beschikbaar als kolom op Besluit, maar wel via
   * `$expand=Zaak`. Wordt door {@link fetchBesluitenByIds} ingelezen.
   */
  Zaak_Id?: string | null;
  /** Eventuele uitgevulde zaken via $expand. */
  Zaak?: TkZaak[];
}

export interface TkZaak {
  Id: string;
  Nummer: string;
  Soort: string;
  Titel: string;
  Onderwerp: string;
  Status: string;
  GestartOp: string;
  Verwijderd: boolean;
  GewijzigdOp: string;
}

interface FetchOptions {
  signal?: AbortSignal;
  /** Cache-strategie van Next.js. Default = revalidate na 24 uur. */
  revalidate?: number;
}

async function odataFetch<T>(
  path: string,
  query: Record<string, string | number | boolean | undefined>,
  opts: FetchOptions = {},
): Promise<ODataResponse<T>> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const url = `${BASE_URL}/${path}${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, {
    signal: opts.signal,
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: opts.revalidate ?? 60 * 60 * 24 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `TK OData fetch ${path} faalde (${res.status}): ${text.slice(0, 200)}`,
    );
  }
  return (await res.json()) as ODataResponse<T>;
}

/** Haal alle actieve fracties op (zonder verwijderde, met huidige zetels). */
export async function fetchActieveFracties(
  opts: FetchOptions = {},
): Promise<TkFractie[]> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await odataFetch<TkFractie>(
    "Fractie",
    {
      $filter: `Verwijderd eq false and DatumActief le ${today} and (DatumInactief eq null or DatumInactief gt ${today})`,
      $select:
        "Id,Afkorting,NaamNL,NaamEN,AantalZetels,AantalStemmen,DatumActief,DatumInactief,Verwijderd,GewijzigdOp,ApiGewijzigdOp",
      $orderby: "AantalZetels desc",
      $top: 50,
    },
    opts,
  );
  return res.value;
}

/**
 * Stemmingen sinds een bepaalde datum. Gebruik dit voor de wekelijkse cron;
 * vermijd `since=null` in productie want dat haalt jaren aan history op.
 */
export async function fetchRecenteStemmingen(
  since: Date,
  opts: FetchOptions = {},
): Promise<TkStemming[]> {
  const sinceIso = since.toISOString();
  const all: TkStemming[] = [];
  // TK OData heeft een harde server-grens van 250 records per pagina én
  // levert geen automatische @odata.nextLink. We pagineren handmatig met
  // $skip totdat een pagina < pageSize records retourneert.
  const pageSize = 250;
  const maxPages = 200; // ~50.000 stemmingen veiligheidsplafond (~1-2 jaar historie)
  for (let page = 0; page < maxPages; page += 1) {
    const skip = page * pageSize;
    const params = new URLSearchParams({
      $filter: `Verwijderd eq false and GewijzigdOp gt ${sinceIso}`,
      $select:
        "Id,Soort,FractieGrootte,ActorNaam,ActorFractie,Vergissing,Besluit_Id,Fractie_Id,Persoon_Id,Verwijderd,GewijzigdOp",
      $orderby: "GewijzigdOp asc",
      $top: String(pageSize),
      $skip: String(skip),
    });
    const url = `${BASE_URL}/Stemming?${params.toString()}`;
    const res = await fetch(url, {
      signal: opts.signal,
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      next: { revalidate: opts.revalidate ?? 60 * 60 * 12 },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `TK OData Stemming fetch faalde (${res.status}): ${text.slice(0, 200)}`,
      );
    }
    const data = (await res.json()) as ODataResponse<TkStemming>;
    all.push(...data.value);
    if (data.value.length < pageSize) break;
  }
  return all;
}

/**
 * Haal een specifiek besluit op (en daarmee zaak/agendapunt).
 *
 * `Zaak_Id` is geen kolom op Besluit; we expanden Zaak inline en pakken
 * de eerste gerelateerde zaak (in de praktijk altijd ≤1).
 */
export async function fetchBesluitenByIds(
  ids: ReadonlyArray<string>,
  opts: FetchOptions = {},
): Promise<TkBesluit[]> {
  if (ids.length === 0) return [];
  // OData v4 `Id in (...)` houdt de query-boom klein (server-grens 100 nodes).
  // We batchen op 200 om ruim onder de URL-lengtegrens te blijven.
  const out: TkBesluit[] = [];
  const batchSize = 200;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const filter = `Id in (${batch.join(",")})`;
    const res = await odataFetch<TkBesluit>(
      "Besluit",
      {
        $filter: `Verwijderd eq false and ${filter}`,
        $select:
          "Id,BesluitSoort,BesluitTekst,StemmingsSoort,Status,Verwijderd,GewijzigdOp,Agendapunt_Id",
        $expand:
          "Zaak($select=Id,Nummer,Soort,Titel,Onderwerp,Status,GestartOp,Verwijderd,GewijzigdOp)",
        $top: 250,
      },
      opts,
    );
    for (const b of res.value) {
      const eersteZaak = b.Zaak && b.Zaak.length > 0 ? b.Zaak[0] : null;
      b.Zaak_Id = eersteZaak ? eersteZaak.Id : null;
      out.push(b);
    }
  }
  return out;
}

export async function fetchZakenByIds(
  ids: ReadonlyArray<string>,
  opts: FetchOptions = {},
): Promise<TkZaak[]> {
  if (ids.length === 0) return [];
  const out: TkZaak[] = [];
  const batchSize = 200;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const filter = `Id in (${batch.join(",")})`;
    const res = await odataFetch<TkZaak>(
      "Zaak",
      {
        $filter: `Verwijderd eq false and ${filter}`,
        $select:
          "Id,Nummer,Soort,Titel,Onderwerp,Status,GestartOp,Verwijderd,GewijzigdOp",
        $top: 250,
      },
      opts,
    );
    out.push(...res.value);
  }
  return out;
}
