# PolitiekProfiel

Een Nederlandstalig politiek kompas op vijf onafhankelijke dimensies: economisch, sociaal-cultureel, burgerrechten, bestuur en systeemvertrouwen. Editorial premium UI, anonieme deelbare resultaten, geen tracking.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript strict mode
- Tailwind CSS v4 (CSS-first)
- Payload CMS 3 (embedded admin op `/admin`)
- Editorial database: Postgres (Neon via Vercel Marketplace) in productie, SQLite lokaal
- Resultaten-database: Firebase Firestore in productie, Payload `results` collectie als fallback lokaal
- `nanoid` voor shortlinks, `@vercel/og` voor dynamische share-images, `lucide-react` voor iconen
- Lettertypes: Spectral (serif) + Inter (sans) via `next/font`

## Lokaal draaien

```bash
pnpm install
pnpm dev
```

De applicatie draait dan op `http://localhost:3000`. Eerste keer:

1. `cp .env.example .env.local` en vul `PAYLOAD_SECRET` met een random 32-bytes hex.
2. `pnpm seed` om alle stellingen, ideologieën, politici en landen in de lokale SQLite database te zetten en een admin-user aan te maken (`admin@politiekprofiel.nl` / `ChangeMe123!` — pas aan via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
3. Open `http://localhost:3000/admin` om in te loggen op het CMS.

## Scripts

```bash
pnpm dev          # dev server
pnpm build        # productie build
pnpm start        # productie server
pnpm test         # vitest unit tests (scoring engine)
pnpm seed         # content + admin seed
pnpm payload generate:types
pnpm payload generate:importmap
```

## Routes

| Pad | Doel |
| --- | --- |
| `/` | startpagina met 3-lengte picker |
| `/quiz/[tier]` | quiz (one-question-per-screen) |
| `/r/[id]` | resultaatpagina |
| `/vergelijk?a=&b=` | twee profielen naast elkaar |
| `/methodiek` | uitleg over de 5 dimensies en scoring |
| `/privacy` | privacyverklaring (AVG art. 9) |
| `/admin/**` | Payload admin |
| `/api/results` | POST endpoint dat antwoorden valideert, scort en opslaat |
| `/api/og/[id]` | dynamische OG-image |

## Datamodel

### Payload collections (Postgres)

- `questions` — stelling, dimensie, richting (+/-), gewicht, tiers, info-blok (context, voor/tegen, bronnen)
- `ideologies` — naam, slug, korte + volledige beschrijving, spectrum-positie, profielvector (5 dim), voorbeelden
- `politicians` — naam, rol, land, partij, bio, positievector, bronnen, internationaal-flag
- `countries` — naam, ISO-2 code, beschrijving, positievector, bronnen
- `users` — admin-accounts (Payload auth)
- `results` — fallback voor lokaal als Firestore niet beschikbaar is

### Firestore (in productie)

- `results/{shareId}` — `{ tier, ideologySlug, dimensions, answeredCount, skippedCount, totalQuestions, createdAt }`
- Public-read, geen client writes (alleen Admin SDK server-side via `/api/results`).

## Scoring

Zie [`src/lib/scoring.ts`](src/lib/scoring.ts) en bijbehorende tests.

Per dimensie: `raw = som(direction × antwoordwaarde × weight)` → normaliseren naar [-100, +100] op basis van max beantwoord gewicht. Ideologie-/politici-/landen-matching: Euclidische afstand in 5D-ruimte.

## Productie deployen

1. **Neon Postgres** (via Vercel Marketplace) als `DATABASE_URL`.
2. **Firebase service account** voor server-side Firestore writes:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (met letterlijke `\n` voor newlines)
3. **`PAYLOAD_SECRET`** (32-byte hex).
4. **`NEXT_PUBLIC_SITE_URL`** = `https://<je-vercel-domein>`.
5. Na eerste deploy: `pnpm seed` runnen tegen productie-DB om alle content te zetten.

## Privacy

- Geen tracking, geen analytics, geen marketing-cookies.
- Resultaten worden anoniem opgeslagen (alleen scores + ideologie). Geen IP-adres, geen user-agent.
- Tijdens de quiz: voortgang in `localStorage` van de browser.
- Cookieconsent-banner is functioneel: niets te accepteren, alleen sluiten.
