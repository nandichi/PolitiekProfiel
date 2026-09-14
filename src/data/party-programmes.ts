/**
 * Editorial programma-samenvattingen per partij per thema.
 *
 * Bron: verkiezingsprogramma's TK 2025 en waar nodig de primaire partijpagina.
 * Samenvattingen beschrijven de verkiezingsprogramma's van 2025, geen huidig
 * kabinetsbeleid of latere fractiestandpunten. Dat onderscheid blijft zichtbaar
 * in de UI, zodat historisch programma en actuele macht niet door elkaar lopen.
 *
 * Status (14 september 2026): programmalinks gecontroleerd en samenvattingen
 * opnieuw beoordeeld op neutraliteit. Fracties zonder zelfstandig programma
 * vallen terug op de actuele beschrijving in `parties.ts`.
 */
import type { ThemeId } from "@/lib/themes";

export interface ProgrammeBullet {
  text: string;
  /** Optionele citatieverwijzing in de UI. */
  source?: string;
}

export interface PartyProgrammeTheme {
  /** Korte intro-zin per thema. */
  summary: string;
  /** 2-4 concrete bullets, neutraal geformuleerd. */
  bullets: ProgrammeBullet[];
}

export type PartyProgramme = Partial<Record<ThemeId, PartyProgrammeTheme>>;

/** Generieke bronlink naar het verkiezingsprogramma per partij (2025). */
export const PROGRAMME_SOURCES: Record<string, { label: string; url: string }> = {
  d66: { label: "D66 – Verkiezingsprogramma 2025-2030 'Het kan wél'", url: "https://media.d66.nl/uploads/2026/04/D66-Verkiezingsprogramma-2025-2030-2-1.pdf" },
  pvv: { label: "PVV – Verkiezingsprogramma 2025 'Dit is uw land'", url: "https://www.pvv.nl/verkiezingsprogramma.html" },
  vvd: { label: "VVD – Verkiezingsprogramma 2025 'Een sterker Nederland'", url: "https://www.vvd.nl/wp-content/uploads/2025/09/Verkiezingsprogramma-TK-VVD-2025-DEF.pdf" },
  "progressief-nederland": { label: "GroenLinks-PvdA – Verkiezingsprogramma 2025 'Tijd voor solidariteit'", url: "https://groenlinkspvda.nl/wp-content/uploads/2025/10/GroenLinks-PvdA-Verkiezingsprogramma-2025.pdf" },
  cda: { label: "CDA – Verkiezingsprogramma 2025 'Bouwen op vertrouwen'", url: "https://www.cda.nl/verkiezingsprogramma" },
  ja21: { label: "JA21 – Verkiezingsprogramma 2025 'De Juiste Aanpak voor Nederland'", url: "https://ja21.nl/partij-programma" },
  fvd: { label: "FvD – Presentatie verkiezingsprogramma 2025", url: "https://fvd.nl/nieuws/fvd-presenteert-kandidatenlijst-en-verkiezingsprogramma-een-nieuwe-kans-voor-nederland" },
  bbb: { label: "BBB – Verkiezingsprogramma 2025 'BBB Levert!'", url: "https://boerburgerbeweging.nl/tweede-kamerverkiezingen-2025" },
  denk: { label: "DENK – Standpunten en verkiezingsprogramma 2025", url: "https://www.bewegingdenk.nl/standpunten/" },
  christenunie: { label: "ChristenUnie – Verkiezingsprogramma 2025 'Opstaan voor het goede'", url: "https://www.christenunie.nl/verkiezingsprogramma" },
  sp: { label: "SP – Verkiezingsprogramma 2025 'Supersociaal'", url: "https://cdn.sp.nl/2025/09/SP-verkiezingsprogramma-TK2025.pdf" },
  sgp: { label: "SGP – Verkiezingsprogramma 2025 'Stem christelijk voor Nederland'", url: "https://sgp.nl/verkiezingsprogramma" },
  pvdd: { label: "Partij voor de Dieren – Verkiezingsprogramma 2025", url: "https://assets.partijvoordedieren.nl/assets/algemeen/PVDD-programma-tweede-kamerverkiezingen-okt-2025.pdf" },
  "50plus": { label: "50PLUS – Verkiezingsprogramma 2025-2029", url: "https://www.50pluspartij.nl/verkiezingsprogramma-50plus" },
  volt: { label: "Volt – Verkiezingsprogramma 2025", url: "https://voltnederland.org/verkiezingsprogramma-2025" },
};

export const PARTY_PROGRAMMES: Record<string, PartyProgramme> = {
  d66: {
    klimaat: {
      summary:
        "Klimaatpad naar klimaatneutraliteit in 2050, met wind en zon als eerste keuze en voorbereidingen voor twee nieuwe kerncentrales.",
      bullets: [
        { text: "Doorgaan met de voorbereidingen voor de bouw van twee nieuwe kerncentrales." },
        { text: "Investeren in schone energie, een sterker elektriciteitsnet en verduurzaming van de industrie." },
        { text: "Vliegbelasting verhogen en kerosineheffing inzetten via EU." },
      ],
    },
    zorg: {
      summary:
        "Versterken van publieke zorg, betere positie zorgmedewerkers, brede preventie en regie op zorglandschap.",
      bullets: [
        { text: "Loonsverhoging zorgpersoneel boven inflatie; minder regeldruk en administratielast." },
        { text: "Mentale-gezondheidszorg jongeren ophogen via wijkteams en huisartsen." },
        { text: "Zorg betaalbaar houden en voorkomen dat mensen zorg mijden om financiële redenen." },
      ],
    },
    migratie: {
      summary:
        "Strenge maar humane benadering: snelle procedures, eerlijke spreiding en stevige integratie. Vóór EU-asielpact.",
      bullets: [
        { text: "Spreidingswet behouden; gemeenten gecompenseerd voor opvang." },
        { text: "Inburgering versnellen door taalonderwijs vanaf dag één." },
        { text: "Werkmigranten van buiten EU strikter selecteren op tekortsectoren." },
      ],
    },
    economie: {
      summary:
        "Brede welvaart: investeren in onderwijs en innovatie, lasten op arbeid verlagen en het minimumloon verhogen.",
      bullets: [
        { text: "Het tarief in de eerste en tweede schijf van de inkomstenbelasting verlagen en het minimumloon verhogen." },
        { text: "Investeren in een slimme, innovatieve economie en goed onderwijs." },
        { text: "Ondernemers ruimte geven om te vernieuwen, met aandacht voor publieke waarden." },
      ],
    },
    eu: {
      summary:
        "Sterk pro-Europees: meer gezamenlijke besluitvorming op klimaat, defensie en migratie. Steun voor Europees leger en gezamenlijke schulden.",
      bullets: [
        { text: "Akkoord met afschaffing van vetorecht op buitenland en belastingen." },
        { text: "Steun voor uitbreiding met Oekraïne, Moldavië en Westelijke Balkan." },
        { text: "Eurobonds als instrument voor klimaat- en defensie-investeringen." },
      ],
    },
    democratie: {
      summary:
        "Bestuurlijke vernieuwing: kiesstelsel-hervorming, bindend correctief referendum onder voorwaarden, gekozen burgemeester.",
      bullets: [
        { text: "Splitsing van het kiesstelsel: helft regio-mandaten, helft landelijk." },
        { text: "Versterking van de Algemene Rekenkamer en parlementair onderzoek." },
        { text: "Verkozen burgemeester met formele bevoegdheden." },
      ],
    },
    wonen: {
      summary:
        "Massieve woningbouw (100.000 per jaar), 40% sociaal/middenhuur, hervorming hypotheekrenteaftrek.",
      bullets: [
        { text: "Afbouw hypotheekrenteaftrek vanaf 2028; opbrengst naar bouw." },
        { text: "Verplicht aandeel sociale huur in nieuwe wijken (30%)." },
        { text: "Corporaties ruimte geven om middenhuur onderdeel van hun kerntaak te maken." },
      ],
    },
  },
  vvd: {
    klimaat: {
      summary:
        "Pragmatische klimaatkoers: doelen halen, maar betaalbaar en met behoud van industrie. Kernenergie en CCS centraal.",
      bullets: [
        { text: "Vier kerncentrales bouwen; tussenoplossing met levensduurverlenging Borssele." },
        { text: "CO₂-opslag (CCS) opschalen voor industrie." },
        { text: "Subsidies elektrisch rijden afbouwen; netcongestie versneld oplossen." },
      ],
    },
    zorg: {
      summary:
        "Marktwerking met sterk toezicht. Inzet op eigen verantwoordelijkheid, technologie en innovatie.",
      bullets: [
        { text: "Verlaging van het eigen risico terugdraaien en het bedrag per zorgmoment beperken." },
        { text: "Zorgzwaartepakketten herzien; meer thuiszorg via digitale tools." },
        { text: "Doorbreken arbeidsmarkttekort via flexibel inzetbare buitenlandse zorgverleners." },
      ],
    },
    migratie: {
      summary:
        "Stevig restrictief: tweestatusstelsel, snelle terugkeer, opt-outs binnen EU-asielpact.",
      bullets: [
        { text: "Permanente versie van Asielnoodmaatregelenwet via uitzonderingsclausules." },
        { text: "Arbeidsmigratie buiten EU plafonneren tot strikte tekortsectoren." },
        { text: "Inburgeringsexamen verzwaren met economisch criterium." },
      ],
    },
    economie: {
      summary:
        "Lagere lasten op arbeid en ondernemers, behoud kennisinfrastructuur, ruimte voor mkb.",
      bullets: [
        { text: "Inkomstenbelasting middenklasse −1,5 procentpunt." },
        { text: "Innovatie-aftrek mkb verruimen tot €500.000." },
        { text: "Box 3 nieuw stelsel werkelijk rendement op 33%." },
      ],
    },
    eu: {
      summary:
        "Pragmatisch pro-EU: interne markt, gezamenlijke veiligheid, voorzichtig met nieuwe bevoegdheden.",
      bullets: [
        { text: "Vetorecht behouden op belastingen." },
        { text: "Steun voor Europese defensiesamenwerking, niet voor Europees leger." },
        { text: "Uitbreidingen alleen na strenge toetreedingscriteria." },
      ],
    },
    democratie: {
      summary:
        "Bestuurlijke stabiliteit voor alles: terughoudend met grote stelselwijzigingen, vertrouwen in instituties.",
      bullets: [
        { text: "Tegen bindend correctief referendum." },
        { text: "Versterken parlementair budgetrecht via Algemene Rekenkamer." },
        { text: "Coalitieafspraken moeten voor Kamer en kiezer controleerbaar zijn." },
      ],
    },
    wonen: {
      summary:
        "Bouwen via private sector, kortere procedures, eigenwoningbezit blijven stimuleren.",
      bullets: [
        { text: "Hypotheekrenteaftrek volledig handhaven." },
        { text: "Vergunningstrajecten naar 6 maanden via Wet versnelling bouw." },
        { text: "Sociale huurgrens optrekken; corporaties meer ruimte." },
      ],
    },
  },
  cda: {
    klimaat: {
      summary:
        "Klimaatbeleid met respect voor boeren, ondernemers en regio's. Stikstof oplossen via natuurherstel en innovatie, niet via gedwongen uitkoop.",
      bullets: [
        { text: "Klimaatfonds behouden en de verdeling ervan herzien." },
        { text: "Stikstofdoelen pas in 2035 i.p.v. 2030 (mits EU-akkoord)." },
        { text: "Inzet op biobased bouw en duurzame landbouw." },
      ],
    },
    zorg: {
      summary:
        "Brede welvaart: zorg dichtbij huis, sterke gezinszorg, eerlijke beloning verpleegkundigen.",
      bullets: [
        { text: "Loonsverhoging zorg met 8% in twee stappen." },
        { text: "Ondersteuning mantelzorgers via fiscale aftrek." },
        { text: "Streekziekenhuizen behouden via aparte financiering." },
      ],
    },
    migratie: {
      summary:
        "Gecontroleerde instroom, sterk gericht op draagvlak in gemeenten.",
      bullets: [
        { text: "Tweestatusstelsel uitvoeren; nareis subsidiair beschermden inperken." },
        { text: "Spreidingswet houden, maar evalueren in 2027." },
        { text: "Brede integratie via maatschappelijke diensttijd." },
      ],
    },
    economie: {
      summary:
        "Gespreide verantwoordelijkheid: sterk mkb, regionale economie, brede belastingbasis.",
      bullets: [
        { text: "Familiebedrijfsregeling behouden; vermogensgrens optrekken naar 6 miljoen." },
        { text: "Brede heroriëntatie subsidies op brede welvaart i.p.v. bbp." },
        { text: "Loonruimte voor publieke sectoren verruimen." },
      ],
    },
    eu: {
      summary:
        "Christen-democratisch pro-EU: subsidiariteit voorop, geen verdragswijzigingen, wel sterke interne markt.",
      bullets: [
        { text: "Tegen afschaffing vetorecht." },
        { text: "Vóór gezamenlijk Europees defensiebudget." },
        { text: "Steun voor Westelijke Balkan-uitbreiding mits hervormingen." },
      ],
    },
    democratie: {
      summary:
        "Vertrouwen in instituties; gespreide verantwoordelijkheid; meer aandacht voor gemeenten en provincies.",
      bullets: [
        { text: "Verzelfstandiging Belastingdienst doorzetten." },
        { text: "Lokale belastingruimte vergroten (eigen zone gemeenten)." },
        { text: "Geen bindend referendum, wel meer burgerberaden." },
      ],
    },
    wonen: {
      summary:
        "Bouwen voor gezinnen: betaalbare koopwoningen, terughoudend met sociale huur in dorpen.",
      bullets: [
        { text: "Starterskorting overdrachtsbelasting tot €450.000." },
        { text: "Versnelde herziening Wet bestuurlijke boete (planschade)." },
        { text: "Hypotheekrenteaftrek behouden voor middeninkomens." },
      ],
    },
  },
  pvv: {
    klimaat: {
      summary:
        "Sterke kritiek op klimaatbeleid; klimaatfonds afbouwen en klimaatwet versoepelen. Vóór kernenergie als enige alternatief.",
      bullets: [
        { text: "Klimaatfonds van 35 mrd schrappen; geld inzetten voor lastenverlichting." },
        { text: "Stikstofbeleid afschaffen; geen gedwongen uitkoop boeren." },
        { text: "Vier kerncentrales bouwen, gas en kolen openhouden." },
      ],
    },
    zorg: {
      summary:
        "Forse extra investering in zorg, met name verpleeghuizen en wijkzorg. Eigen risico afschaffen.",
      bullets: [
        { text: "Eigen risico naar nul." },
        { text: "Extra geld voor verpleegkundigen en thuiszorg." },
        { text: "Stop op zorgkostenstijging via vaste premies." },
      ],
    },
    migratie: {
      summary:
        "Asielstop, uittreden uit EU-asielpact, intrekken Vluchtelingenverdrag (nationaal).",
      bullets: [
        { text: "Volledige asielstop; geen statushouders meer toelaten." },
        { text: "Werkmigratie van buiten EU bevriezen." },
        { text: "Strenge handhaving op illegaal verblijf en terugkeer." },
      ],
    },
    economie: {
      summary:
        "Forse lastenverlaging voor middeninkomens, behoud van AOW-leeftijd op 65 (toekomst), nationale industriepolitiek.",
      bullets: [
        { text: "AOW-leeftijd terug naar 65 voor zware beroepen." },
        { text: "BTW boodschappen en energie naar 0%." },
        { text: "Hypotheekrenteaftrek volledig behouden." },
      ],
    },
    eu: {
      summary:
        "Sterk EU-kritisch: Nexit-referendum, terughalen bevoegdheden, geen Europees leger.",
      bullets: [
        { text: "Referendum over EU-lidmaatschap binnen 2 jaar." },
        { text: "Vetorecht uitbreiden naar alle EU-besluiten." },
        { text: "Eigen militaire commandostructuur behouden." },
      ],
    },
    democratie: {
      summary:
        "Sterk wantrouwig jegens gevestigde instituties; voorstander van bindend referendum.",
      bullets: [
        { text: "Bindend correctief referendum op alle wetten." },
        { text: "Afschaffen Eerste Kamer of fors inkrimpen." },
        { text: "Beëindiging publieke omroep in huidige vorm." },
      ],
    },
    wonen: {
      summary:
        "Voorrang voor Nederlanders op sociale huur; bouwen op stikstof-gronden.",
      bullets: [
        { text: "Voorrangsregeling sociale huur voor 'eigen volk eerst'." },
        { text: "Stikstofregels schrappen voor woningbouw." },
        { text: "Hypotheekrenteaftrek volledig behouden." },
      ],
    },
  },
  "progressief-nederland": {
    klimaat: {
      summary:
        "Ambitieus klimaatbeleid met eerlijke verdeling: vervuiler betaalt, fossiele subsidies afbouwen, klimaatticket voor ov.",
      bullets: [
        { text: "Fossiele subsidies zo snel mogelijk afbouwen, ook als Europa nog niet meebeweegt." },
        { text: "Grote vervuilers meer laten bijdragen aan de klimaattransitie." },
        { text: "Nationaal klimaatticket €40/maand voor ov." },
      ],
    },
    zorg: {
      summary:
        "Zorg als publieke verantwoordelijkheid: marktwerking terugdraaien, ggz uit de markt, hogere lonen.",
      bullets: [
        { text: "Eigen risico volledig afschaffen." },
        { text: "Loonsverhoging zorgmedewerkers 10% over 2 jaar." },
        { text: "Ggz en jeugdzorg uit de marktwerking." },
      ],
    },
    migratie: {
      summary:
        "Humane benadering met snelle procedures; voorstander EU-asielpact en spreidingswet.",
      bullets: [
        { text: "Geen tweestatusstelsel, gezinshereniging volledig behouden." },
        { text: "Snelle integratie met taallessen en werk vanaf dag één." },
        { text: "Veilige routes voor arbeids- en kennismigratie." },
      ],
    },
    economie: {
      summary:
        "Sterke herverdeling: vermogensbelasting, hogere top, brede investeringsagenda. Minimumloon naar €18.",
      bullets: [
        { text: "Progressieve vermogensbelasting boven €1 mln." },
        { text: "Minimumloon naar €18/uur in twee stappen." },
        { text: "Topinkomens en mensen met veel vermogen eerlijk laten bijdragen aan de samenleving." },
      ],
    },
    eu: {
      summary:
        "Sterk pro-EU: federale toekomstvisie, eurobonds, gemeenschappelijke buitenlandse politiek.",
      bullets: [
        { text: "Vetorecht afschaffen op buitenland, klimaat en belastingen." },
        { text: "Federale Europese democratie als langetermijnvisie." },
        { text: "Klimaatdoelen via gezamenlijke EU-financiering." },
      ],
    },
    democratie: {
      summary:
        "Versterking democratie via burgerberaden, transparantie en sterkere positie lokaal bestuur.",
      bullets: [
        { text: "Burgerberaad klimaat met bindend advies." },
        { text: "Open begroting alle gemeenten via standaardformat." },
        { text: "Voorstander van een correctief referendum als extra invloedskanaal voor burgers." },
      ],
    },
    wonen: {
      summary:
        "Publieke regie op wonen: huurverhogingen begrenzen, sterke positie corporaties en meer betaalbare woningen.",
      bullets: [
        { text: "Hypotheekrenteaftrek volledig afschaffen in 5 jaar." },
        { text: "Een wettelijke bovengrens aan huurstijgingen invoeren en bescherming tegen woekerhuren voor alle huurwoningen laten gelden." },
        { text: "Verdubbeling sociale huur via corporaties." },
      ],
    },
  },
  ja21: {
    klimaat: {
      summary:
        "Realistisch klimaatbeleid: doelen pragmatisch, geen 'Nederland-gidsland', wél kernenergie.",
      bullets: [
        { text: "Vier kerncentrales bouwen; gas openhouden." },
        { text: "Stikstofdoelen volledig herzien; geen gedwongen uitkoop." },
        { text: "Klimaatfonds halveren." },
      ],
    },
    migratie: {
      summary:
        "Hard restrictief: opt-outs EU-asielpact, asielstop voor specifieke landen.",
      bullets: [
        { text: "Tweestatusstelsel als minimum; strengere asielregels bepleiten." },
        { text: "Opt-out spreidingswet voor gemeenten met grote opvanglast." },
        { text: "Geen werkmigranten van buiten EU zonder tekortverklaring." },
      ],
    },
    economie: {
      summary:
        "Centrum-rechts: lagere lasten, kleinere overheid, sterke mkb.",
      bullets: [
        { text: "Inkomstenbelasting eerste schijf met 2 procentpunt verlagen." },
        { text: "Afschaffing dividendbelasting voor nieuwe bedrijven." },
        { text: "Bezuinigen op ontwikkelingshulp." },
      ],
    },
    eu: {
      summary:
        "EU-kritisch: minder bevoegdheden naar Brussel, vetorecht behouden, geen Europees leger.",
      bullets: [
        { text: "Tegen afschaffing vetorecht." },
        { text: "Steun voor terughalen ICT en aanbestedingsregels." },
        { text: "Geen Europees leger; bilaterale NAVO-samenwerking." },
      ],
    },
  },
  fvd: {
    klimaat: {
      summary:
        "Sterke afwijzing van mainstream klimaatbeleid; pleidooi voor kernenergie en behoud van gas/kolen.",
      bullets: [
        { text: "Klimaatwet schrappen; geen netto-nul-doel." },
        { text: "Sluit aan bij wereldwijde kritiek op IPCC-consensus." },
        { text: "Vóór kernenergie als enige beleidsoptie." },
      ],
    },
    migratie: {
      summary:
        "Asielstop, remigratiebeleid, intrekken Vluchtelingenverdrag (nationaal).",
      bullets: [
        { text: "Volledige asielstop." },
        { text: "Beleid 'remigratie' voor specifieke groepen." },
        { text: "Vertrek uit EU-asielpact." },
      ],
    },
    economie: {
      summary:
        "Libertair-economisch: lage belastingen, kleine staat, vrijemarkt-fundamentalisme.",
      bullets: [
        { text: "Vlaktaks van 25% inkomstenbelasting." },
        { text: "Forse bezuinigingen op overheidsapparaat." },
        { text: "Privatisering NS, deel van de zorg." },
      ],
    },
    eu: {
      summary:
        "Sterk pro-Nexit. Vertrek uit EU is hoofdpunt programma.",
      bullets: [
        { text: "Nexit-referendum binnen 1 jaar." },
        { text: "Voorbereiding op zelfstandige handelsakkoorden." },
        { text: "Vertrek uit eurozone als optie." },
      ],
    },
    democratie: {
      summary:
        "Wantrouwen jegens 'kartel': bindend referendum, gekozen burgemeester, kritisch op rechtspraak.",
      bullets: [
        { text: "Bindend referendum op alle wetten." },
        { text: "Gekozen burgemeester en gouverneur." },
        { text: "Kritisch op rol Hoge Raad en EHRM." },
      ],
    },
  },
  bbb: {
    klimaat: {
      summary:
        "Stikstofbeleid op zijn kop: geen gedwongen uitkoop, focus op innovatie. Klimaat met realisme.",
      bullets: [
        { text: "Stikstofwet aanpassen; ruimere drempels voor boeren." },
        { text: "Klimaatfonds halveren; investeren in agrarische innovatie." },
        { text: "Kernenergie als hoofdpijler energiemix." },
      ],
    },
    economie: {
      summary:
        "Voor mkb, boeren en plattelandseconomie. Lagere lasten, tegen Europese regeldruk.",
      bullets: [
        { text: "Afschaffing erfbelasting op familiebedrijven en boerderijen." },
        { text: "Versoepeling Europese regeldruk voor mkb." },
        { text: "Lagere brandstofaccijns." },
      ],
    },
    migratie: {
      summary:
        "Restrictief: minder asielzoekers, geen gemeentelijke quota tegen wil.",
      bullets: [
        { text: "Opt-out gemeenten uit spreidingswet." },
        { text: "Strengere terugkeer." },
        { text: "Geen werkmigratie buiten EU zonder tekort." },
      ],
    },
  },
  sp: {
    klimaat: {
      summary:
        "Klimaatbeleid met eerlijke verdeling: vervuiler betaalt, fossiele subsidies afbouwen.",
      bullets: [
        { text: "Klimaatfonds verhogen naar 50 mrd." },
        { text: "Fossiele subsidies afschaffen." },
        { text: "Nationaal isolatieprogramma voor lage inkomens." },
      ],
    },
    zorg: {
      summary:
        "Zorg nationaliseren: einde marktwerking, regiomodel, vaste lonen.",
      bullets: [
        { text: "Marktwerking zorg afschaffen; nationaal zorgfonds." },
        { text: "Eigen risico naar nul." },
        { text: "Loonsverhoging zorgmedewerkers 15%." },
      ],
    },
    economie: {
      summary:
        "Klassiek-socialistisch: nationaliseren, vermogensbelasting, AOW omhoog.",
      bullets: [
        { text: "Progressieve vermogensbelasting boven €500.000." },
        { text: "AOW met 10% verhogen." },
        { text: "Energieprijzen reguleren; staatsenergiebedrijf oprichten." },
      ],
    },
    eu: {
      summary:
        "Sterk eurosceptisch: terughalen bevoegdheden, geen federale EU.",
      bullets: [
        { text: "Vetorecht behouden." },
        { text: "Europese verdragen wijzigen: de Commissie verkleinen en bevoegdheden afstaan aan het Europees Parlement en de lidstaten." },
        { text: "Tegen Eurobonds." },
      ],
    },
  },
  christenunie: {
    zorg: {
      summary:
        "Sterke positie zorgmedewerkers, ondersteuning mantelzorg, gezinszorg.",
      bullets: [
        { text: "Mantelzorgforfait verhogen naar €500/jaar." },
        { text: "Loonsverhoging zorgmedewerkers." },
        { text: "Investeren in palliatieve zorg." },
      ],
    },
    migratie: {
      summary:
        "Humane benadering: gastvrij voor vluchtelingen, sterke integratie.",
      bullets: [
        { text: "Geen tweestatusstelsel; gezinshereniging behouden." },
        { text: "Spreiding via gemeenten met financiële compensatie." },
        { text: "Inburgering via wijkgesprekken en kerken." },
      ],
    },
    democratie: {
      summary:
        "Tegen bindend referendum; vertrouwen in vertegenwoordigende democratie.",
      bullets: [
        { text: "Tegen bindend correctief referendum." },
        { text: "Versterking lokale politiek via gemeentelijke middelen." },
      ],
    },
  },
  sgp: {
    klimaat: {
      summary:
        "Klimaat als rentmeesterschap, maar realistisch: geen overhaaste maatregelen.",
      bullets: [
        { text: "Stikstofdoelen versoepelen voor boeren." },
        { text: "Kernenergie als hoofdpijler." },
      ],
    },
    migratie: {
      summary:
        "Restrictief asielbeleid; sterk christelijk perspectief op nationale identiteit.",
      bullets: [
        { text: "Sober opvangbeleid." },
        { text: "Tweestatusstelsel uitvoeren." },
      ],
    },
  },
  pvdd: {
    klimaat: {
      summary:
        "Radicaal klimaat- en natuurbeleid: Nederland uiterlijk in 2030 klimaatneutraal en een andere inrichting van de landbouw.",
      bullets: [
        { text: "Elk jaar 5% van het nationale inkomen besteden aan de klimaat- en natuurcrisis." },
        { text: "Direct stoppen met fossiele subsidies en landbouwsubsidies." },
        { text: "Een nationaal CO₂-budget invoeren en klimaatbeleid daarop richten." },
      ],
    },
    economie: {
      summary:
        "Donut-economie: brede welvaart als doel, niet bbp-groei.",
      bullets: [
        { text: "Vermogensbelasting boven €500.000." },
        { text: "Afschaffing landbouwsubsidies; gerichte transitiesteun." },
      ],
    },
  },
  denk: {
    migratie: {
      summary:
        "Anti-discriminatie centraal; tegen tweestatusstelsel en strengere inburgering.",
      bullets: [
        { text: "Tegen tweestatusstelsel; volledige gezinshereniging." },
        { text: "Antidiscriminatiewet aanscherpen." },
      ],
    },
    economie: {
      summary:
        "Sociaal-economisch herverdelend; aandacht voor armoede en bestaanszekerheid.",
      bullets: [
        { text: "Minimumloon naar €18/uur." },
        { text: "Hogere uitkeringen voor gezinnen onder armoedegrens." },
      ],
    },
  },
  "50plus": {
    zorg: {
      summary:
        "Ouderenzorg uitbreiden, AOW indexeren, verpleeghuis-capaciteit verhogen.",
      bullets: [
        { text: "AOW koppelen aan minimumloon." },
        { text: "20.000 extra verpleeghuisplekken." },
      ],
    },
    economie: {
      summary:
        "Indexatie pensioenen; behoud koopkracht ouderen.",
      bullets: [
        { text: "Pensioenen volledig indexeren." },
        { text: "AOW gekoppeld houden aan het minimumloon en een dertiende maand voor AOW'ers invoeren." },
      ],
    },
  },
  volt: {
    klimaat: {
      summary:
        "Federaal Europees klimaatbeleid; ambitieuze doelen via EU.",
      bullets: [
        { text: "Klimaatdoelen via EU-fonds financieren." },
        { text: "Europees klimaatticket €40/maand." },
      ],
    },
    eu: {
      summary:
        "Federaal Europa: gemeenschappelijke politiek, eurobonds, transnationale lijsten.",
      bullets: [
        { text: "Federale EU-grondwet." },
        { text: "Transnationale verkiezingslijsten EP." },
        { text: "Vetorecht afschaffen." },
      ],
    },
  },
};

export function getProgrammeForParty(slug: string): PartyProgramme | null {
  return PARTY_PROGRAMMES[slug] ?? null;
}
