# Feature-onderzoek PolitiekProfiel — 2026

> **Belangrijk vooraf:** Alles in dit document moet vóór implementatie opnieuw worden onderzocht en geactualiseerd voor **2026**. De Nederlandse politiek beweegt snel: partijen splitsen, fuseren, fractievoorzitters wisselen, en thema's verschuiven. Vóór elke feature die afhankelijk is van actuele politieke data (partijen, fractieleiders, Kamerleden, peilingen, verkiezingsprogramma's, coalities, lokale partijen voor de gemeenteraadsverkiezingen van 18 maart 2026) moet er een verse research-ronde gedaan worden. Geen aanname mag uit dit document blind worden overgenomen — dit is een richtinggevend onderzoek, geen specificatie.
>
> Specifiek opnieuw verifiëren bij implementatie:
> - Welke partijen actief zijn in de Tweede Kamer (zetelverdeling per peiling-datum)
> - Wie de fractievoorzitter / lijsttrekker / partijleider is per partij
> - Actuele Kamerleden en hun rollen
> - Lokale partijen per gemeente voor de gemeenteraadsverkiezingen van 18 maart 2026
> - Status van het kabinet, coalitie en Eerste Kamer
> - Actuele verkiezingsprogramma's en hun CPB-doorrekening
> - Actuele politieke thema's (asielbeleid, klimaat, hypotheekrenteaftrek, AOW, etc.)
> - Actuele staat van concurrent-tools (URL's, features, status)

---

## Inhoud

1. [Bestaande site-features (samenvatting)](#bestaande-site-features)
2. [Concurrentie-analyse Nederland](#concurrentie-analyse-nederland)
3. [Internationale benchmarks](#internationale-benchmarks)
4. [Onvervulde behoeften uit onderzoek](#onvervulde-behoeften)
5. [Aanbevolen features (geprioriteerd)](#aanbevolen-features)
6. [Open vragen voor product-keuzes](#open-vragen)
7. [Research-checklist per feature](#research-checklist)

---

## Bestaande site-features

Wat PolitiekProfiel nu al heeft, zodat aanbevelingen geen dubbel werk worden:

- Adaptieve quiz in 3 lengtes (`quick=30`, `standard=50`, `extended=80`)
- 5 dimensies: economisch, sociaal-cultureel, burgerrechten, bestuur, systeemvertrouwen (`−100..+100`)
- 7 thema's: klimaat, zorg, migratie, economie, EU, democratie, wonen
- Paradox-detectie + confidence-scoring per dimensie
- Resultaatpagina (9 secties): profiel, dimensies, thema's, standpunten-extract, paradoxen, partij-context (NL/EU/US), politici-vergelijking met scatter, landen-vergelijking, delen
- `/vergelijk` tussen 2 deelbare profielen
- `/methodiek`, `/privacy`, `/ai-transparantie`
- Build-time AI-content (~210 slots in `aiContent` collectie)
- Anonieme deelbare resultaten via Firestore, geen tracking, geen account
- Payload CMS op Postgres voor editorial content
- Agent discovery: robots.txt, sitemap, OpenAPI, RFC 9727 api-catalog, WebMCP

Routes die al voorbereid maar leeg zijn: `[locale]/politici/[slug]/`, `[locale]/docs/`, `[locale]/methodiek/`, `[locale]/privacy/`, `[locale]/quiz/`, `[locale]/r/`, `[locale]/vergelijk/`.

---

## Concurrentie-analyse Nederland

> **Research-noot:** alle URL's, statussen en feature-claims hieronder moeten in 2026 opnieuw geverifieerd worden — sommige van deze tools zijn alleen actief tijdens een verkiezingscampagne en kunnen offline of doorontwikkeld zijn.

| Tool | Type | Unieke feature | URL (verifieer) |
|------|------|----------------|-----------------|
| **StemWijzer** (ProDemos) | Klassieke stemwijzer | Marktleider, 8M+ invullingen TK 2025; werkt samen met DPG Media voor GR2026 | `stemwijzer.nl` |
| **Kieskompas** | 2D-compass stemwijzer | Visualiseert positie op assenstelsel (2 assen) | `kieskompas.nl` |
| **CivicStat** | Transparantie-dashboard | Belofte vs stemgedrag, 17.265 moties, 6.917 beloften, individuele Kamerleden, "verborgen patronen" (PvdD ↔ VVD 67% gelijk) | `civicstat.nl` |
| **KIESwijzer** | Stemwijzer obv stemgedrag | Kiezer beoordeelt 5.000+ moties, vergelijkt met werkelijk stemgedrag van Kamerleden | `kieswijzer.app` |
| **StemmenTracker** (ProDemos) | Stemgedrag-tracker | 30 stellingen op moties die partijen onderscheiden, sinds 2021 | `home.stemmentracker.nl` |
| **Factstemwijzer** | Stemgedrag-score | Score op duurzaam/sociaal beleid, met PDF van het document waarover gestemd is | `factstemwijzer.nl` |
| **De Stemchecker** (Volkskrant) | Stemwijzer | Werkelijke stemuitslagen i.p.v. beloften | (Volkskrant) |
| **KiesChat** | RAG-chat | AI-chat met partijprogramma's + CPB-doorrekening, "AI Transparency mode" | `kieschat.nl` |
| **Polderbot** | Coalitie-AI | Genereert hoofdlijnenakkoord op basis van overeenkomsten | `polderbot.nl` |
| **Impolitic** | Waarde-stemwijzer | 20 kernwaarden i.p.v. issue-stellingen | `impolitic.nl` |
| **PartijPrikker** | Stemwijzer GR2026 | Thema's wegen, % match, transparant | `partijprikker.nl` |
| **Weet Wat Je Stemt** | Programma-overzicht | Standpunten van alle partijen per thema | `weetwatjestemt.nu` |
| **De Stemhulp** | Programma-overzicht | Per thema partijstandpunten | `destemhulp.nl` |
| **Kies Interactief** | Programma-stories | Verkiezingsprogramma's in stories-format | `kiesinteractief.nl` |
| **Kiesradar** | Lokale stemhulp | 350-woorden samenvattingen per gemeentepartij voor GR2026 | `kiesradar.nl` |
| **Programmavergelijker** (Open State Foundation) | Doorzoekbare programma's | Search door verkiezingsprogramma's | `openstate.eu` |
| **Programmavergelijk.nl** | Thema-vergelijking | Hoofd- en subthema's | `programmavergelijk.nl` |
| **Mijn Stem** | Lokale stemwijzer | Gemeente-thema's | `mijnstem.nl` |
| **StemNogWijzer** | Genuanceerde stemwijzer | 5 oplossingen per thema i.p.v. binaire stellingen | `stemnogwijzer.nl` |
| **ikregeer.nl** | Politici-volgsysteem | Sociaal netwerk om Kamerleden te volgen, automatische feed van moties/debatten | `ikregeer.nl` |
| **Open Kamer** | Open data dashboard | Wetsvoorstellen, Kamervragen, geschenken, reizen Kamerleden | `openkamer.org` |
| **BGTK.nl** | Stemgedrag-overzicht | Daadwerkelijk stemgedrag partijen en Kamerleden | `bgtk.nl` |
| **Op Wie Kan Ik Stemmen** | Kandidaten-filter | Filter kandidaten en partijen, verwijst naar andere tools | `opwiekanikstemmen.nl` |
| **PartijMeter** (PolitiekPraat) | Stemtest | 25 stellingen, 16 partijen, AI expert uitleg, persoonlijk AI stemadvies | `politiekpraat.nl/partijmeter` |
| **CampAIgn Tracker** | Social-media monitor | Volgt posts van partijen/kandidaten/influencers op FB/IG/TT/X, AI-detectie | `campaigntracker.nl` |
| **Quest Verkiezingstest** | Lifestyle quiz | 16 vragen, breed publiek | `tests.quest.nl` |
| **Debat Direct** (Tweede Kamer) | Live-app | Live debatten, push bij specifieke politici, live stemmingen, ondertiteling, gebarentaal | `tweedekamer.nl/debat-direct` |
| **Staat van het Bestuur** | Decentraal dashboard | Kerngegevens gemeenten, provincies, waterschappen | `staatvanhetbestuurdashboard.nl` |
| **CPB Keuzes in Kaart** | Doorrekening | Budgettaire keuzes per partij | `cpb.nl` |
| **Peilingen Nederland** | Peilingen-archief | Alle TK-peilingen | `peilingennederland.nl` |
| **PolitPro** | Peilingen-tracker | Peilingen + historisch archief | `politpro.eu` |
| **Maurice de Hond** | Peilingen | Reguliere peilingen met analyse | `maurice.nl` |

## Internationale benchmarks

| Tool | Land | Wat opvalt |
|------|------|------------|
| **iSideWith** | US | 81M gebruikers; "My beliefs / parties / ideologies / ballot / support map"; vergelijken met vrienden; passion- en confidence-factors |
| **Pew Political Typology** | US | 9 typology-clusters, sociale data, korte quiz |
| **Political Compass** | INT | 2-assen klassieker, zwaar bekritiseerd |
| **8values** | INT | 4 onafhankelijke assen, % per as |
| **9axes** | INT | 9 assen, 216-vragen versie of 45-vragen short, radar-chart |
| **Political DNA** | INT | 4 dimensies, 32 archetypes |
| **Votely** | INT | 39 assen, 3D-visualisatie, 81 ideologieën |
| **8D-PolComp** | INT | 8 dimensies, "latest 1000 results" aggregaat |
| **FindMyPolitics** | INT | Vergelijken met vrienden side-by-side, "where you agree, differ most" |
| **Poli Map** | INT | 20 vragen, 2D-coordinaten, ideologie-vergelijkingen |
| **Ideological Turing Test** | INT | Mini-game: raad of citaat van Democraat/Republikein is |

---

## Onvervulde behoeften

Uit academische kritiek (UU, NRC, StukRoodVlees) en concurrentie-analyse:

1. **Stemwijzers zijn binair en simplistisch** — gebruikers willen genuanceerde standpunten met meerdere opties (iSideWith, StemNogWijzer pakken dit op).
2. **Kloof tussen belofte en realiteit** — kiezers wantrouwen verkiezingsprogramma's; willen weten of een partij ook *doet* wat ze belooft (CivicStat, Factstemwijzer, KIESwijzer).
3. **Geen historische context** — geen tool laat je politieke evolutie over tijd zien.
4. **"Wat zegt de andere kant tegen jou?"** — sterkste argumenten *tegen* je eigen positie ontbreken bij vrijwel alle tools. PolitiekProfiel doet dit nu deels via AI-content `arguments-against`, kan veel sterker.
5. **Lokaal & EU ontbreken bij dimensie-gebaseerde tools** — gemeenteraadsverkiezingen op 18 maart 2026, geen enkele compass-tool dekt lokaal.
6. **Echo-chamber-doorbrekers** — Ideological Turing Test, "raad waar dit citaat vandaan komt", coalitie-simulator.
7. **Beperkte thema-dekking bij klassieke stemwijzers** — onderzoek wijst uit dat de 30-stellingen-keuze bij StemWijzer de uitslag beïnvloedt; bredere quiz lost dat op.
8. **Geen context bij stellingen** — kiezers vullen stemwijzers vaak oppervlakkig in zonder de uitleg te lezen. Diepere stelling-pagina's helpen.
9. **Stemgedrag-data versus dimensie-positionering staan los** — PolitiekProfiel mist de feitelijke koppeling met Tweede Kamer-stemgedrag.
10. **Geen rustige editorial-aanpak voor politieke fans** — alle bestaande tools zijn óf clickbait-quiz óf zwaar dashboard. Tussenruimte is leeg.

---

## Aanbevolen features

Geprioriteerd in vier categorieën. Voor elk feature geldt: vóór bouwen verse research voor actuele 2026-data (zie [Research-checklist](#research-checklist)).

### Categorie A — Past direct bij de huidige visie

#### A1. Stelling-bibliotheek met diepere uitleg per stelling
Elke stelling krijgt een eigen pagina (`/stelling/[id]`) met context, voor/tegen, bronnen, hoe het in de Tweede Kamer ligt, welke ideologieën hier wat over zeggen. De `info`-blokken in de `Questions` collectie bestaan al maar zijn alleen zichtbaar in de quiz-drawer. SEO-goudmijn én educatie.

**Research-vereiste:** actuele bronnen per stelling, recente Kamer-moties op het onderwerp, partij-standpunten 2026.

#### A2. Ideologie-deepdive pages
Volledige `/ideologie/[slug]` pages met essay, geschiedenis, voorbeelden, kernwaarden, bekende denkers, hoe de ideologie zich verhoudt tot Nederlandse partijen *anno 2026*. AI-content slots (`ideology:slug:essay/reading/arguments-for/arguments-against`) zijn er al; alleen nog presenteren als losse pagina.

**Research-vereiste:** actuele Nederlandse partijen die per ideologie het dichtst in de buurt komen — partijlandschap verandert (denk aan splitsingen, fusies, nieuwe partijen).

#### A3. Politici-deepdive pages
Volledige profielpagina per politicus: vector op alle 5 assen, dichtstbijzijnde ideologie, bio, partij, citaten, koppeling naar relevante stellingen. Route `[locale]/politici/[slug]` bestaat al maar is leeg.

**Research-vereiste (kritiek):** actuele Kamerleden 2026, hun rol (fractievoorzitter / lijsttrekker / Kamerlid / minister), partij-affiliatie, recente uitspraken, geactualiseerde positie-vector. Politici wisselen partij of stoppen — peil dit per build.

#### A4. Land-deepdive pages
`/land/[iso2]` pages: hoe staat een land op de 5 dimensies, welke partijen zijn er aan de macht, korte uitleg.

**Research-vereiste:** actuele regerings-coalities in EU-landen, US, etc.

#### A5. "Steelman"-modus: beste tegen-argument
Per dimensie of thema waar je sterk uitslaat: een dedicated pagina-sectie die het beste argument *tegen* je positie toont met links naar bronnen. Echo-chamber-doorbreker zonder te polariseren. Bouwt voort op de bestaande `arguments-against` AI-content.

#### A6. Standpunten-extract uitbreiden + export
- Per thema apart een "wat jij vindt" mini-paragraaf
- "Onbesliste vragen" — vragen waar je twijfelde of neutraal antwoordde, met uitleg waarom dit lastig is
- Export naar Markdown of PDF voor eigen archief

#### A7. Glossary van politieke termen
`/woordenboek` met 100-200 politieke termen (subsidiariteit, soevereiniteit, polderen, keynesianisme, libertarisme, doorrekening, formatie, motie van wantrouwen, etc.). Editorial, AI-gegenereerd build-time. Sterke SEO.

---

### Categorie B — Past bij visie maar groter werk

#### B1. Programma-bibliotheek (geen chat, wel structuur)
Per partij een pagina met de 7 thema's, en per thema een gestructureerde editorial samenvatting van wat het partijprogramma zegt. Géén AI-chat (KiesChat heeft dat al), wél rustige samenvatting met bronlinks. Geen partij-rangschikking voor de gebruiker.

**Research-vereiste (kritiek):** actuele 2026-verkiezingsprogramma's, CPB-doorrekening, fractievoorzitter, partij-status (nog actief? gefuseerd?). Verschilt per verkiezing en wijzigt tijdens campagnes.

#### B2. Stemgedrag-koppeling (light)
Per thema bij een partij: "in de afgelopen 4 jaar stemde deze partij X% van de moties op dit thema voor". Niet zo diep als CivicStat, maar genoeg om de belofte-vs-realiteit-vraag te beantwoorden. Mogelijk via Tweede Kamer Open Data (er bestaat al een `tk-open-data` folder in `src/lib/`).

**Research-vereiste:** actuele Tweede Kamer Open Data API status, partij-naamswijzigingen, fusies (bv. PvdA-GroenLinks → GroenLinks-PvdA → PRO?).

#### B3. Cohort-inzicht (anoniem aggregaat)
"Mensen met een profiel als jou scoren gemiddeld X op klimaat" — gebaseerd op bestaande Firestore-data. Vraagt om k-anonimiteit (minimaal 50+ profielen per bucket).

**Privacy-overweging:** past dit bij de huidige privacy-belofte (AVG art. 9, geen profilering)? Vergt expliciete update van privacy-statement.

#### B4. Vraag van de week
Eén nieuwe stelling per week, prominent op homepage, directe poll, aggregaat-uitslag publiek. Vraagt actieve redactie — niet build-time.

**Research-vereiste:** wekelijkse actuele politieke onderwerpen, redactionele formulering.

#### B5. Coalitie-simulator op basis van jouw profiel
Welke coalitie van NL-partijen ligt het dichtst bij jou, op de 5-dimensie afstand? Niet als stemadvies, wel als thought experiment. Kan met bestaande party-vectors gebouwd worden.

**Research-vereiste (kritiek):** actuele zetelverdeling 2026 (peilingen of meest recente uitslag), actuele partijen-lijst, fractievoorzitters voor naamgeving.

#### B6. Ideological Turing Test
Mini-game: 5 citaten van Nederlandse politici / programma's, raad of dit van een linkse of rechtse partij is, of welke ideologie. Citaten kunnen build-time door AI uit programma's gehaald worden plus redactioneel gecheckt.

**Research-vereiste:** actuele citaten uit 2026-programma's of recente Kamerdebatten, checken op authenticiteit.

---

### Categorie C — Past bij visie, vraagt afweging

#### C1. Politieke evolutie van jezelf
`/evolutie?ids=...` — voor wie zelf zijn shareIDs bewaart, zet meerdere profielen op tijdlijn. Geen account, geen server-storage van keten.

**Vraag:** past dit bij de "anoniem-eerst"-belofte? Antwoord lijkt ja: gebruiker bewaart zelf ID's, server koppelt niets.

#### C2. Vergelijken met typology-clusters (Pew-stijl)
Niet één gemiddelde, maar clusters: bv. "gepensioneerde liberaal", "progressieve grootstedeling", "nationaal-conservatieve middenklasser". Vraagt clustering op de Firestore-data (k-means of hiërarchisch). Privacy-gevoelig.

**Research-vereiste:** Nederlandse typologie-onderzoek (SCP, Pew-equivalent), NL-specifieke clustering.

#### C3. Lokale lens voor gemeenteraadsverkiezingen 18 maart 2026
**Optie 1 (groot):** een vereenvoudigde lokaal-quiz per gemeente. Heel groot werk: 343 gemeenten, lokale partijen, lokale thema's.
**Optie 2 (slank):** een "lokale-lens" die je nationale profiel vertaalt naar typische lokale issues (woningbouw, parkeren, duurzaamheid, lokale belastingen, veiligheid).

**Research-vereiste (kritiek):** lokale partijen per gemeente verschillen enorm, en lokale partijen zijn vaak niet gekoppeld aan nationale ideologieën. Voor optie 1 is per-gemeente onderzoek nodig.

#### C4. Wekelijkse politieke nieuwsbrief / weekupdate
"Politiek deze week" — rustige, editorial weekbrief die actuele Nederlandse politiek koppelt aan PolitiekProfiel-thema's en -dimensies. Vraagt redactie of betrouwbare AI-pipeline.

**Research-vereiste (per editie):** wekelijkse politieke gebeurtenissen, debatten, moties, kabinetsbesluiten.

#### C5. Politici stemgedrag op 5 dimensies
Per politicus: ingenomen posities op moties laten zien op de 5 dimensies. Vereist Tweede Kamer Open Data integratie. Levert "Pieter Omtzigt staat hier op de assen, Wilders daar"-visualisatie.

**Research-vereiste (kritiek):** actuele Kamerleden 2026, fractievoorzitters, koppeling moties → dimensies (hand-mappen of model), Tweede Kamer Open Data API stabiliteit.

---

### Categorie D — Engagement / virale features

Mogelijke spanning met "rustige editorial"-toon, maar genoemd voor afweging:

- **Shareable typology-card** (Pew-stijl): "Ik ben een Sociaal-Liberale Pragmatist" — 1 zin, 1 plaatje, voor sociale media
- **Embed-widget** voor blogs/journalistieke sites: een mini-versie van LiveAxes
- **Quote-cards** uit AI-essays als shareable assets
- **Dagelijkse stelling op X-bot** (vraagt dagelijks redactiewerk)

---

## Open vragen

Voor product-keuzes (te beantwoorden vóór implementatie):

1. **Welke features uit dit document gaan we eerst uitwerken?** Prioritering nodig.
2. **Past stemgedrag-data (B2, C5) bij de visie**, of komen we daarmee te dicht bij CivicStat / KIESwijzer?
3. **Privacy-update nodig?** Cohort-inzicht (B3) en typology-clusters (C2) vragen mogelijk een aanpassing van de privacy-verklaring.
4. **Editorial-capaciteit:** features zoals B4 (vraag van de week) en C4 (nieuwsbrief) vereisen wekelijks redactioneel werk. Is daar capaciteit voor?
5. **Lokaal (C3):** is gemeenteraad 2026 een doel, of houden we focus op nationaal?
6. **Tone of voice:** mogen virale share-cards (categorie D) of botst dat met "rustige editorial"?
7. **AI runtime-grens:** alle huidige AI is build-time. Sommige features (B4, C4) vragen mogelijk per-week pipelines; blijft dat nog "build-time" of trekken we de grens elders?

---

## Research-checklist

> Vóór elke implementatie deze checklist opnieuw doorlopen. Politieke data is per definitie aan tijd gebonden.

### Algemeen — minimaal vóór elke nieuwe feature
- [ ] Actuele lijst Tweede Kamer-partijen 2026 (incl. zetels per laatst-bekende peiling)
- [ ] Actuele fractievoorzitters / lijsttrekkers / partijleiders per partij
- [ ] Actuele coalitie en kabinetssamenstelling
- [ ] Actuele Eerste Kamer-zetelverdeling
- [ ] Recente partijwisselingen, splitsingen, fusies, nieuwe partijen
- [ ] Status van concurrent-tools (zijn ze nog online? Nieuwe features?)

### Per feature aanvullend
- [ ] **A1 stelling-bibliotheek:** actuele bronnen per stelling, recente Kamer-moties op het onderwerp
- [ ] **A2 ideologie-deepdive:** welke NL-partijen 2026 vallen onder welke ideologie
- [ ] **A3 politici-deepdive:** Kamerlid-rol per persoon, recente uitspraken, partij-affiliatie 2026
- [ ] **A4 land-deepdive:** actuele regerings-coalities EU/US
- [ ] **A7 woordenboek:** Nederlandse politieke termen 2026 (recente neologismen zoals nieuwe wetten, beleidstermen)
- [ ] **B1 programma-bibliotheek:** verkiezingsprogramma's 2026, CPB-doorrekening, partij-bestaan per build
- [ ] **B2 stemgedrag-koppeling:** Tweede Kamer Open Data API status, partij-naamswijzigingen
- [ ] **B5 coalitie-simulator:** zetelverdeling 2026, partijen-vectoren actualiseren
- [ ] **B6 Ideological Turing Test:** authentieke citaten 2026, redactionele check
- [ ] **C2 typology-clusters:** SCP-onderzoek, NL-specifieke kiezerstypologie
- [ ] **C3 lokale lens:** lokale partijen per gemeente, lokale thema's GR2026
- [ ] **C4 nieuwsbrief:** wekelijkse politieke gebeurtenissen, debatten, moties
- [ ] **C5 politici stemgedrag:** Kamerleden 2026, motie-dimensie mapping

### Bronnen om regelmatig te checken
- Tweede Kamer Open Data (`opendata.tweedekamer.nl`)
- ProDemos / parlement.com
- CPB Keuzes in Kaart
- SCP (Sociaal en Cultureel Planbureau)
- CBS politiek-statistieken
- Peilingen Nederland, PolitPro, Maurice de Hond
- NRC / NOS / Volkskrant politiek-redacties
- CivicStat (voor belofte-vs-stemgedrag-data en eventuele samenwerking)
- Kiesraad voor officiële uitslagen en kandidatenlijsten

---

*Document opgesteld als richtinggevend onderzoek, niet als specificatie. Alle inhoud vraagt verse verificatie vóór implementatie.*
