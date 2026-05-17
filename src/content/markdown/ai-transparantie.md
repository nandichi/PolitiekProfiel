# AI-transparantie

PolitiekProfiel gebruikt AI om bezoekers te helpen hun profiel beter te begrijpen. We zijn open over wat we genereren, hoe we het doen en wat we expliciet **niet** doen.

## Wat we genereren

Vooraf, eenmalig, en gecached in onze database:

- **Per ideologie**: een uitgebreide essay van 600-800 woorden over de stroming, een leeslijst, sterkste argumenten vóór, en respectvolle tegenargumenten.
- **Per dimensie x score-bucket**: uitleg over wat een sterk negatieve, negatieve, neutrale, positieve of sterk positieve score op die as betekent.
- **Per ideologie x thema**: hoe denkt deze ideologie doorgaans over klimaat, zorg, migratie, economie, EU, democratie en wonen.
- **Per paradox-type**: wat het betekent als je antwoorden binnen of tussen dimensies elkaar tegenspreken, en waarom dat geen probleem hoeft te zijn.

In totaal ongeveer **210 stukjes content**, eenmalig gegenereerd. Geen runtime-aanroep.

## Wat we expliciet niet doen

- We sturen **geen** runtime data naar AI. Niet je antwoorden, niet je dimensie-scores, niet je paradoxen, niet je IP-adres.
- We genereren **geen** persoonlijke duiding voor jou specifiek. Iedereen met dezelfde ideologie en dezelfde score-bucket ziet dezelfde voorgekauwde tekst.
- We gebruiken **geen** AI om partijen te ranken of stemadvies te geven.

## Hoe we kwaliteit bewaken

- Iedere generatie wordt opgeslagen met **prompt, model en datum** als audit-trail.
- Een redactionele check loopt na het genereren over **balans**, **toon**, **nuance** en correcte representatie van uiteenlopende politieke stromingen.
- Handmatige aanpassingen via de Payload-editor zijn altijd mogelijk. Een aangepaste tekst wordt gemarkeerd als `humanEdited`.
- Bij her-generatie wordt elk slot beoordeeld op kosten en alleen vervangen als de redactie dat goedkeurt.

## Welk model gebruiken we

We gebruiken **OpenAI** met een tekstmodel dat is geoptimaliseerd voor Nederlandstalige content en lage hallucinatie. Het exacte model is per slot zichtbaar in de audit-trail (`model` veld).

## Prompts

Onze prompt-engineering volgt deze principes:

- Streng gebalanceerd; geen partij-promotie.
- Citeert geen actuele politici direct (om actualiteit-drift te voorkomen).
- Nederlandse taal, editorial register, rust en nuance.
- Bron-aanduiding waar mogelijk ('klassieke argumentatie', 'academische literatuur').
- Geen polariserende framing of activistische taal.

De volledige prompts per slot zijn opvraagbaar via een redactionele exportroute.

## Geen runtime AI

Op je resultaatpagina is **geen** AI-call actief. Alles wat je leest is gecached uit eerdere, gecontroleerde batches. Open je daarna een ander resultaat? Dezelfde teksten worden hergebruikt zonder enige nieuwe aanroep.

## Waarom we hier transparant over zijn

We willen dat je vertrouwt dat AI hier slechts een redactioneel hulpmiddel is: geen invloed op de scoring, geen invloed op de aanbevelingen, en zeker geen verwerking van persoonlijke gegevens.
