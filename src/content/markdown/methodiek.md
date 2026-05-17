# Methodiek — politiek meten zonder karikatuur

We willen niet weten of je 'links' of 'rechts' bent. We willen weten waar je staat op vijf onafhankelijke politieke vragen, hoe je oordeelt op zeven concrete beleidsthema's, en waar je antwoorden elkaar mogelijk tegenspreken. Dat geeft een rijker en eerlijker beeld dan een enkele as.

## De vijf assen

### 1. Economisch — Vrije markt / Sterke staat

Hoe sterk moet de overheid ingrijpen in de economie via belasting, regulering en sociale zekerheid?

- **Vrije markt:** Lage belastingen, weinig regulering, terughoudende overheid, eigen verantwoordelijkheid.
- **Sterke staat:** Herverdeling, publieke voorzieningen, regulering van markten, sociale zekerheid.

### 2. Sociaal-cultureel — Conservatief / Progressief

Hoe verhouden traditie, identiteit en gelijkheid zich tot openheid, diversiteit en culturele verandering?

- **Conservatief:** Behoud van tradities, nationale identiteit, terughoudendheid t.o.v. snelle culturele verandering.
- **Progressief:** Gelijke rechten, openheid voor diversiteit, ruimte voor culturele en maatschappelijke vernieuwing.

### 3. Burgerrechten — Autoritair / Libertair

Hoeveel ruimte krijgt het individu tegenover de behoefte aan veiligheid en orde?

- **Autoritair:** Sterke overheidsbevoegdheden voor veiligheid, surveillance en ordehandhaving.
- **Libertair:** Maximale individuele vrijheid, privacy en bescherming tegen overheidsingrijpen.

### 4. Bestuur — Nationaal-soeverein / Multilevel-EU

Waar moet macht liggen: bij de natiestaat, bij Europa, of juist bij gemeentes en burgers?

- **Nationaal-soeverein:** Macht bij de natiestaat, terughoudend t.o.v. supranationale instituties zoals de EU.
- **Multilevel/EU:** Sterkere Europese samenwerking, of juist meer macht naar regio's, gemeentes en burgers.

### 5. Systeemvertrouwen — Wantrouwen / Vertrouwen

In hoeverre vertrouw je publieke instituties zoals media, rechtspraak, wetenschap en overheid?

- **Wantrouwen:** Kritisch tot wantrouwend tegenover gevestigde instituties; vraagt fundamentele hervorming.
- **Vertrouwen:** Vertrouwen in instituties als media, rechtspraak, wetenschap en democratie.

## Vragen en balans

Per dimensie staan stellingen die richting de **positieve pool** wijzen, en even veel stellingen die richting de **negatieve pool** wijzen. Zo kan een 'mee eens' nooit eenzijdig één kant op wegen; de balans is wiskundig ingebouwd.

We kiezen **concrete en actuele stellingen**. Geen vage platitudes ('Iedereen verdient een eerlijke kans') maar specifieke beleidskeuzes. Bij elke stelling kun je via het achtergrond-paneel de context, argumenten vóór en tegen, en bronnen raadplegen.

## Scoring

Elk antwoord krijgt een waarde van **−2** (volledig mee oneens) tot **+2** (volledig mee eens). Neutraal telt als 0; overgeslagen wordt niet meegenomen in de normalisatie.

Formule per dimensie:

```
raw    = Σ ( direction × antwoord × gewicht )
maxW   = Σ ( |gewicht|  ) over beantwoorde vragen
score  = ( raw / ( maxW × 2 ) ) × 100   →  [-100 … +100]
```

Je profiel is een vector in een 5-dimensionale ruimte. De dichtstbijzijnde ideologie, politicus of land wordt bepaald via de **Euclidische afstand** in die ruimte.

## Adaptieve quiz

De quiz is **adaptief**: niet iedereen krijgt dezelfde stellingen. Op basis van je antwoorden kiest de engine vervolgens vragen die:

- **assen scherper afgrenzen** waar je score nog rond nul ligt of weinig signaal heeft;
- **thema's afdekken** die nog onderbelicht zijn voor je gekozen tier;
- **consistentie testen** door af en toe een stelling te kiezen die mogelijk een paradox onthult;
- **niet eerder zijn voorgelegd** in dezelfde sessie.

Iedere sessie krijgt een geseed-random pool, dus zelfs bij identieke antwoorden zien twee bezoekers deels andere stellingen.

## Thema-scoring

Per beleidsthema (klimaat, zorg, migratie, economie, EU, democratie, wonen) wordt dezelfde formule toegepast, maar dan alleen over stellingen die het thema raken. Output is een score van −100..+100 met een vaste richting per thema (bv. negatief = restrictief migratiebeleid, positief = open migratiebeleid).

## Paradox-detectie

Voor elke dimensie en voor enkele thema-paren detecteren we **interne spanning** wanneer:

- minstens drie antwoorden binnen dezelfde dimensie zijn gegeven, en
- er zowel sterk positieve als sterk negatieve antwoorden (waarde ≥ 2) tegenover elkaar staan.

De **severity** weegt mee hoeveel sterke tegenstellingen er zijn en hoe groot het aandeel is van de beantwoorde vragen in die dimensie. Cross-thema paradoxen (zoals 'klimaat ambitieus + lasten laag') worden apart gedetecteerd.

Paradoxen zijn nadrukkelijk **geen fout**. Ze tonen interessante spanningen om over door te denken.

## Confidence per dimensie

Hoeveel vertrouwen je in je dimensie-score kunt hebben hangt af van:

- **dekking** (35%) — hoeveel stellingen je beantwoordde voor die dimensie;
- **sterkte** (40%) — hoe ver je score van nul ligt;
- **consistentie** (25%) — hoe weinig je antwoorden binnen die dimensie varieerden.

De drie delen vormen samen een score van 0..100. Hoog vertrouwen begint bij 70, gemiddeld bij 40.

## AI-content vooraf gegenereerd

De duidende teksten op je resultaatpagina — essays per ideologie, betekenis per dimensie en thema, paradox-uitleg, leesvoer en argumenten — zijn **vooraf gegenereerd** met OpenAI en opgeslagen in de CMS. Bij het tonen van je resultaat wordt **nooit** een AI-call gedaan op jouw antwoorden. Audit-trail (model, prompt, datum) is per slot bewaard. Zie [`/ai-transparantie`](/ai-transparantie).

## Beperkingen

Dit kompas is geen **stemwijzer** en geen wetenschappelijke meting. Het is een instrument voor reflectie. We werken met geschatte profielposities van politici en landen die we afleiden uit publieke indices, programma's en debatten. Posities zijn discutabel, en wij bouwen graag verder op feedback.

Politiek is bovendien meer dan een vragenlijst kan vangen. Zie jouw resultaat als een gespreksopener met jezelf, niet als een eindoordeel.
