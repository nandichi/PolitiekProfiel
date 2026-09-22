# PolitiekProfiel 2026: volledige visuele herbouw

## Opdracht

Herbouw de volledige publieke visuele laag van PolitiekProfiel. Dit is geen recolor en geen homepage-only redesign. Alle 32 publieke route-templates, gedeelde componenten, quizstates, betaalpoorten, resultaatonderdelen, formulieren, datavisualisaties, navigatie en footer moeten één nieuw systeem vormen.

Behoud alle bestaande inhoud, URLs, metadata, data, privacygrenzen, scoring, API-contracten, Stripe-flow, Payload CMS en resultaatlogica. Wijzig geen politieke data of berekeningen.

## Zelfstandige art direction: Publieke Meetstaat

PolitiekProfiel moet voelen als een publieke meetstaat: een kruising tussen een redactioneel dossier, een stembiljet en een precies meetinstrument. Niet als een campagnewebsite, nieuwsportal, SaaS-dashboard of generieke AI-landingpage.

De visuele basis is het inhoudelijke uitgangspunt van het product: politiek past niet op één lijn. Vijf onafhankelijke meetlijnen vormen het grid, de navigatie, de quizvoortgang en de resultaten. Ze mogen nooit visueel worden samengevoegd tot één totaalscore, radarvorm of links-rechts oordeel.

### Visuele signatuur

- Koel mineraal canvas, bijna-zwarte inkt en één fel signaalaccent.
- Geen beige of warm papier.
- Harde regels, maatstrepen, registratiepunten en cartografische annotaties.
- Rechte hoeken als standaard. Alleen functionele controls mogen 2 tot 6 px radius hebben.
- Geen glassmorphism, gekleurde blobs, gradients, bento, gelijke featurecards of zwevende dashboardmockups.
- Geen partijpolitieke kleur als algemene merktaal.
- Asymmetrische compositie op een 15-koloms desktopgrid, 10 kolommen op tablet en 5 kolommen op mobiel. Dit verwijst subtiel naar de vijf dimensies.
- Grote typografie naast kleine technische annotaties, maar geen italic headings.
- Geen decoratieve sectienummers op ieder blok.
- Geen stockfotografie nodig. Vorm, typografie en eigen SVG/CSS-datavisualisatie dragen de identiteit.

### Kleursysteem

Gebruik rolgebaseerde tokens, niet de oude kleurnamen navy/terra/paper.

- `--color-canvas`: koel mineraal lichtgrijs, rond `oklch(91% 0.012 155)`
- `--color-canvas-raised`: rond `oklch(96% 0.008 155)`
- `--color-canvas-pressed`: rond `oklch(84% 0.014 155)`
- `--color-ink`: rond `oklch(16% 0.018 155)`
- `--color-ink-raised`: rond `oklch(23% 0.022 155)`
- `--color-text-muted`: rond `oklch(43% 0.016 155)`
- `--color-rule`: rond `oklch(69% 0.014 155)`
- `--color-rule-strong`: rond `oklch(48% 0.018 155)`
- `--color-signal`: rood-oranje, rond `oklch(64% 0.22 33)`
- `--color-signal-pressed`: rond `oklch(53% 0.20 33)`
- `--color-focus`: zuur geelgroen, rond `oklch(90% 0.20 119)`
- `--color-danger`, `--color-success`, `--color-compare-a`, `--color-compare-b`, `--color-chart-track`, `--color-chart-marker`

De exacte waarden mogen tijdens contrastmeting worden bijgesteld. Hoofdtekst minimaal WCAG AA. Focusring minimaal 3:1 tegen beide aangrenzende oppervlakken.

### Typografie

Gebruik gratis, commercieel bruikbare en zelf gehoste Fontshare-fonts:

- Display en headings: Cabinet Grotesk Variable, zware gewichten 700 tot 900.
- Body en interface: Switzer Variable, 400 voor tekst en 650 tot 700 voor nadruk.
- Data en annotaties: IBM Plex Mono, de bestaande Next-font mag blijven.

Verwijder Inter en Fraunces volledig uit de publieke layout. Gebruik maximaal deze drie families. Geen gesynthetiseerde gewichten. Geen italic headings. Body minimaal 16 px. Lopende tekst maximaal ongeveer 68 tekens breed.

Als Fontshare-download technisch faalt, gebruik Bricolage Grotesque voor display en Hanken Grotesk voor body via `next/font/google`. Gebruik nooit Inter, Roboto, Arial of system-ui als primaire familie.

### Motion en frameworks

Gebruik de stacks uit het X-onderzoek selectief:

- Motion 12 voor componentstates, quizvraagwissels, menu's, drawers, tabs en resultaatmarkers.
- Voeg GSAP en Lenis alleen toe voor de homepage en één methodologische scrollvertelling.
- Lenis mag uitsluitend op marketing/contentroutes draaien, nooit op `/quiz/**`, `/r/**`, `/embed/**`, checkoutstates, dialogs of forms.
- Three.js en React Three Fiber niet toevoegen. Er is geen functionele 3D-interactie die de extra bundel rechtvaardigt.
- Geen scrollhijacking, parallax, bounce, ambient infinite loops of custom cursor.
- `prefers-reduced-motion` toont alle inhoud direct en gebruikt native scroll.
- Essentiële inhoud is zichtbaar zonder JavaScript en zonder IntersectionObserver.

## Paginafamilies

### Marketing en homepage

De homepage krijgt een nieuwe compositie, geen aanpassing van de bestaande cardlayout.

Hero:

- Donker `ink`-vlak over de volledige breedte.
- Headline: `Politiek past niet op één lijn.`
- Uitleg gebruikt de bestaande productinhoud: vijf onafhankelijke dimensies, geen partijadvies, geen account, geen advertentietracking.
- Primaire CTA: `Doe de Quick · gratis` naar `/quiz/quick`.
- Secundaire actie is een tekstlink: `Bekijk de drie versies` naar het productkeuzeblok.
- Rechts een eigen interactieve meetvisualisatie met vijf horizontale lijnen en vijf verschillende marker-vormen. Geen vooraf bepaald politiek profiel of gelabelde uitkomst.
- Eén korte Motion/GSAP-intro. Daarna staat alles stil.

Productkeuze:

- Geen drie identieke pricingcards.
- Links een statische voorbeeldweergave van het rapport.
- Rechts drie geruleerde keuzeregels voor Quick, Standaard en Uitgebreid.
- Per regel: prijs, tijd, aantal stellingen, resultaatniveau en geschikt-voor.
- Transparante microcopy: inclusief btw, eenmalig, geen abonnement, geen account.
- Standaard mag inhoudelijk worden aanbevolen, maar niet via nep-schaarste of populariteitsclaim.

Overige homepage:

- Vervang de drie gelijke principes door een redactionele meetsequentie met ongelijke breedtes en doorlopende lijnen.
- Toon de vijf assen als vijf inhoudelijke rijen met marker, beide polen en toelichting.
- Voeg een trustblok toe waarin methode, bronbeleid en privacy rechtstreeks leesbaar zijn.
- Maak de pagina compacter dan de huidige mobiele 8.200 px zonder inhoud weg te halen.

### Quiz en betaalpoort

- Geen volledige marketingfooter tijdens een actieve quiz.
- Desktop heeft een compacte linker voortgangsrail, centrale vraag en een rechter hulp/privacyrail.
- Mobiel heeft één voortgangsbalk, vraagtekst en vijf volledig gelabelde antwoordrijen.
- `Helemaal oneens`, `Oneens`, `Neutraal`, `Eens`, `Helemaal eens` blijven op 320 px leesbaar.
- Alle controls minimaal 44 px hoog.
- Focusring zichtbaar op antwoordopties, vorige, overslaan, stoppen en informatielade.
- Verberg technische dimensietellers uit de primaire voortgang. Toon `Vraag N van M` en één balk.
- Behoud de bestaande auto-advance-logica tenzij een bestaande test of productcontract anders vereist. Verander geen statecontracten zonder expliciete test.
- Betaalpoort toont vóór de knop wat men ontvangt, prijs, tijd, aantal vragen, geen abonnement en wat er na Stripe gebeurt.
- Checkoutfouten tonen nooit interne database-, Stripe- of quotaberichten aan bezoekers.

### Resultaat

- Eerste scherm toont vijf gestapelde onafhankelijke assen, uitleg over de beperking van het profiel en de belangrijkste kwalitatieve duiding.
- Geen totaalscore, radar, partijwinnaar of stemadvies.
- DimensionBar, ThemeBars, ConfidenceIndicator, MiniVector, ScatterPlot en vergelijkingsmarkers krijgen één nieuwe visuele grammatica.
- Kleur is nooit het enige onderscheid: combineer marker-vorm, lijnritme en labels.
- Quick blijft een bruikbaar resultaat tonen. Upsell komt één keer na de gratis waarde, niet herhaald onder iedere as.
- E-mailvraag mag de eerste resultaatwaarde niet blokkeren.
- Bestaande verwijder-, deel-, export- en downloadfuncties blijven bereikbaar en functioneel.
- Lange Nederlandse namen en compounds moeten werken op 320 px.

### Content, dossiers en hubs

- Contentpagina's gebruiken een dossierlayout: inhoudsopgave links, artikel centraal, bronnotities en relevante meetas rechts. Mobiel wordt één logische documentvolgorde.
- Overzichtspagina's worden geen eindeloze kaartcatalogus. Gebruik geruleerde lijsten, zoek/filter waar reeds aanwezig en duidelijke groepskoppen.
- `/verkennen` wordt gegroepeerd in vragen en methode, partijen en personen, landen en geschiedenis, tools en experimenten.
- Partij- en politicuspagina's gebruiken de vijfassenweergave als samenvatting, zonder stemadvies.
- Juridische pagina's blijven sober en leesbaar. Geen marketinganimaties.
- `/docs/api` mag technischer en compacter zijn, maar gebruikt dezelfde typografie, kleur en navigatie.

## Navigatie en footer

Navigatie:

- Vlakke sticky balk, geen capsule of blur-glass.
- Desktop: woordmerk links, inhoudelijke navigatie centraal, `Kies je quiz` rechts.
- Onder de balk loopt een dunne vijfdelige meetregel.
- Behoud alle bestaande hover/focus/click/Escape/buitenkliklogica van het mega-menu.
- Mobiel menu opent als volledig donker vlak met duidelijke tekstlabels, 44 px doelen en interne scroll.

Footer:

- Sluit als een redactioneel colofon, niet als vier standaard linkcards.
- Grote afsluitende zin en CTA-regel.
- Daarna geruleerde linkrijen met directe zichtbaarheid voor Methodiek, Privacy, Voorwaarden en Contact.
- Onderaan compacte mono-organisatie- en copyrightinformatie.

## Technische grenzen

Niet wijzigen:

- `src/lib/scoring.ts`
- `src/lib/adaptive.ts`
- `src/lib/results-store.ts`
- `src/lib/result-*.ts`, behalve puur presentational helpers als dat aantoonbaar nodig is
- `src/lib/entitlements.ts`
- `src/lib/checkout-client.ts`, behalve veilige foutnormalisatie met test
- `src/data/**`
- `src/collections/**`
- `src/migrations/**`
- `src/app/api/**`, behalve generieke checkoutfout zonder intern detail, met regressietest
- `src/payload.config.ts`
- `src/payload-types.ts`
- `src/proxy.ts`
- `src/app/(payload)/**`

Behoud exact:

- alle routepaden en dynamische params
- metadata, canonicals, robots en JSON-LD
- URL-parameters `a`, `b`, `ids`, `r`, `entitlement`, `checkout`, `promo`
- localStorage-sleutels en quiz-resumecontract
- sectie-ID's op resultaat- en juridische pagina's
- API-payloads en HTTP-methodes
- noindex/no-store voor gevoelige routes
- Stripe en entitlement-flow
- WebMCP registratie

## Verwachte bestanden

Maak of wijzig zonder productiebestanden te verwijderen:

- `src/app/(frontend)/globals.css`
- `src/app/(frontend)/layout.tsx`
- `src/app/(frontend)/page.tsx`
- alle 32 `src/app/(frontend)/**/page.tsx` alleen waar nodig voor de nieuwe compositie
- `src/components/Container.tsx`
- `src/components/Kicker.tsx`
- `src/components/Section.tsx`
- `src/components/SiteHeader.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/StickyIndex.tsx`
- gedeelde motion-, quiz-, visualisatie-, form- en resultaatcomponenten
- nieuwe presentational primitives onder `src/components/system/`
- nieuwe merkvisualisaties onder `src/components/brand/`
- self-hosted fonts onder `public/fonts/`
- `package.json` en lockfile voor GSAP en Lenis
- tests en een rerunnable responsive-auditscript onder `tests/` of `scripts/`
- widget en OG-assets in een afsluitende brandpass

Verwijder geen routebestand, componentdirectory, contentbestand, dataset, migratie of API-route.

## TDD en contracttests

Voordat productiecode wordt gewijzigd:

1. Schrijf een `src/redesign-contract.test.ts` die eerst rood wordt en daarna borgt:
   - publieke layout gebruikt geen Inter of Fraunces;
   - de nieuwe rolgebaseerde tokens bestaan;
   - oude primaire tokens worden niet meer gedefinieerd;
   - homepage bevat de nieuwe headline en beide CTA-intenties;
   - header gebruikt `Kies je quiz`;
   - checkout API retourneert geen `summary.message` aan de bezoeker;
   - geen italic headingclasses op de homepage, header en footer;
   - GSAP en Lenis zijn alleen verbonden aan de toegestane routegroepen.
2. Run de test en bevestig de verwachte failure.
3. Implementeer in verticale slices: foundation, homepage, quiz, resultaat, contentfamilies, adjacent surfaces.
4. Run de gerichte test na iedere slice.

Tests mogen contractgedrag controleren, niet exacte utility-classstrings die normale refactors blokkeren.

## Verificatie

Releasegates:

- byte-scan op NUL, BOM en U+2028/U+2029
- `pnpm test`
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `git diff --check`
- geen nieuwe lintwarnings in productcode
- geen em dash of en dash in nieuw zichtbare copy
- alle 32 route-templates geven lokaal een geldige status en herkenbare DOM-marker
- metadata, canonical, robots en JSON-LD blijven aanwezig
- keyboardtest voor header, mega-menu, mobiel menu, quiz, forms en dialogs
- reduced-motiontest zonder verborgen inhoud
- interactieve click-through voor Quick-flow, InfoDrawer, Turing, coalitie, formulierstates en result controls waar lokaal reproduceerbaar

Responsive matrix:

- 320 x 700
- 360 x 800
- 375 x 812
- 390 x 844
- 430 x 932
- 768 x 1024
- 1024 x 768
- 1440 x 900
- 1920 x 1080

Op iedere deep-auditroute:

- `documentElement.scrollWidth - clientWidth === 0`
- geen niet-scrollbaar element buiten de viewport
- geen eigen elementinhoud breder dan de container
- interactieve labels blijven op één regel waar het affordances zijn
- hit targets minimaal 44 px op mobiel
- geen console errors of page errors

Deep-auditroutes:

- `/`
- `/verkennen`
- `/politici`
- `/politici/dilan-yesilgoz-zegerius`
- `/partijen`
- `/partij/d66`
- `/ideologie/sociaal-democraat`
- `/stelling/e001`
- `/woordenboek/tweede-kamer`
- `/methodiek`
- `/privacy`
- `/voorwaarden`
- `/docs/api`
- `/contact`
- `/quiz/quick`
- `/quiz/standard`
- `/coalitie`
- `/turing-test`
- `/vergelijk`
- `/evolutie`

Resultaatroutes worden alleen met synthetische fixtures getest. Lees geen klantresultaten.

## Klaar wanneer

De taak is pas klaar wanneer de site niet alleen buildt, maar ook lokaal draait, alle gates groen zijn, de responsive matrix mechanisch is gecontroleerd en een onafhankelijke review geen blokkerende fouten vindt. Een agentrapport of een geslaagde build alleen is geen bewijs.
