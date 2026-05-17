/**
 * Editorial programma-samenvattingen per partij per thema.
 *
 * Bron: verkiezingsprogramma's TK 2025 + CPB Keuzes in Kaart 2025-2028 + actuele
 * Kamerstandpunten per mei 2026. Alle samenvattingen zijn redactioneel en
 * neutraal gehouden; bedoeld als naslag, niet als stemadvies.
 *
 * Status (17 mei 2026): D66, VVD, CDA, PVV, GL-PvdA, JA21, BBB, FvD, SP, CU,
 * SGP, PvdD, DENK, DNA, 50PLUS, Volt.
 *
 * Voor partijen waarvan nog geen redactionele samenvatting bestaat, valt de
 * UI terug op de algemene `description` uit `parties.ts`.
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
  d66: { label: "D66 – Verkiezingsprogramma 2025 'Een nieuw begin'", url: "https://d66.nl/verkiezingsprogramma" },
  pvv: { label: "PVV – Concept-verkiezingsprogramma 2025", url: "https://www.pvv.nl/standpunten" },
  vvd: { label: "VVD – Verkiezingsprogramma 2025 'Ruimte om vooruit te komen'", url: "https://www.vvd.nl/verkiezingsprogramma" },
  "groenlinks-pvda": { label: "GroenLinks-PvdA – Verkiezingsprogramma 2025 'Tijd voor eerlijk'", url: "https://groenlinkspvda.nl/verkiezingsprogramma" },
  cda: { label: "CDA – Verkiezingsprogramma 2025 'Recht doen aan Nederland'", url: "https://www.cda.nl/verkiezingsprogramma" },
  ja21: { label: "JA21 – Verkiezingsprogramma 2025", url: "https://www.ja21.nl/verkiezingsprogramma" },
  fvd: { label: "FvD – Verkiezingsprogramma 2025", url: "https://www.fvd.nl/standpunten" },
  dna: { label: "DNA – Beginselprogramma 2026", url: "https://www.denederlandsevrijheidsalliantie.nl/" },
  bbb: { label: "BBB – Verkiezingsprogramma 2025 'Boeren, Burgers, Beleid'", url: "https://www.boerburgerbeweging.nl/programma" },
  denk: { label: "DENK – Verkiezingsprogramma 2025", url: "https://www.bewegingdenk.nl/programma" },
  christenunie: { label: "ChristenUnie – Verkiezingsprogramma 2025", url: "https://www.christenunie.nl/standpunten" },
  sp: { label: "SP – Verkiezingsprogramma 2025", url: "https://www.sp.nl/standpunten" },
  sgp: { label: "SGP – Verkiezingsprogramma 2025", url: "https://www.sgp.nl/standpunten" },
  pvdd: { label: "Partij voor de Dieren – Verkiezingsprogramma 2025", url: "https://www.partijvoordedieren.nl/standpunten" },
  "50plus": { label: "50PLUS – Verkiezingsprogramma 2025", url: "https://www.50pluspartij.nl/standpunten" },
  volt: { label: "Volt – Verkiezingsprogramma 2025", url: "https://voltnederland.org/programma" },
};

export const PARTY_PROGRAMMES: Record<string, PartyProgramme> = {
  d66: {
    klimaat: {
      summary:
        "Doorzetten klimaatdoelen (netto-nul 2050, −60% CO₂ in 2030 t.o.v. 1990) met nadruk op kernenergie, groene industrie en eerlijke verdeling van lasten.",
      bullets: [
        { text: "Bouw van vier nieuwe kerncentrales versnellen; tegelijk inzet op wind op zee en zonneparken." },
        { text: "Klimaatfonds van 35 miljard euro behouden voor verduurzaming industrie, woningen en mobiliteit." },
        { text: "Vliegbelasting verhogen en kerosineheffing inzetten via EU." },
      ],
    },
    zorg: {
      summary:
        "Versterken van publieke zorg, betere positie zorgmedewerkers, brede preventie en regie op zorglandschap.",
      bullets: [
        { text: "Loonsverhoging zorgpersoneel boven inflatie; minder regeldruk en administratielast." },
        { text: "Mentale-gezondheidszorg jongeren ophogen via wijkteams en huisartsen." },
        { text: "Eigen risico op termijn afschaffen; eerst halveren naar €165 in 2027." },
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
        "Brede welvaart: investeren in onderwijs, innovatie en EU-handel. Vlakke belastingverhoging top, lasten op arbeid omlaag.",
      bullets: [
        { text: "Extra schijf inkomstenbelasting boven €150.000 op 52%." },
        { text: "Toptarief vennootschapsbelasting naar 27%." },
        { text: "Onderwijsuitgaven structureel +5 miljard euro per jaar." },
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
        { text: "Wet huurmaximum aanscherpen tot middenhuur €1.300/maand." },
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
        { text: "Eigen risico bevriezen op €385; geen verlaging." },
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
        { text: "Pleit voor coalitiediscipline in minderheidskabinet." },
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
        { text: "Volgens regie van het kabinet-Jetten: 35 mrd klimaatfonds behouden; herziening verdeling." },
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
        "Gecontroleerde instroom, sterk gericht op draagvlak in gemeentes. Bart van den Brink leidt vanuit ministerie van Justitie en Veiligheid.",
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
        { text: "Loonruimte voor publieke sectoren verruimen via kabinetsformatie 2026." },
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
  "groenlinks-pvda": {
    klimaat: {
      summary:
        "Ambitieus klimaatbeleid met eerlijke verdeling: vervuiler betaalt, fossiele subsidies afbouwen, klimaatticket voor ov.",
      bullets: [
        { text: "Klimaatfonds verdubbelen naar 70 mrd voor versnelde transitie." },
        { text: "Fossiele subsidies (39 mrd) afschaffen in deze regeerperiode." },
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
        { text: "Toptarief inkomstenbelasting naar 60% boven €150.000." },
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
        { text: "Tegen bindend referendum (gevaar van populisme)." },
      ],
    },
    wonen: {
      summary:
        "Publieke regie op wonen: huurprijsbevriezing, sterke positie corporaties, sociaal bouwen.",
      bullets: [
        { text: "Hypotheekrenteaftrek volledig afschaffen in 5 jaar." },
        { text: "Huurprijsbevriezing 3 jaar in vrije sector." },
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
        { text: "Tweestatusstelsel als minimum; harder dan kabinet-Jetten." },
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
  dna: {
    klimaat: {
      summary:
        "Klimaatbeleid alleen als het niet schaadt voor middenklasse; afschaffen klimaatfonds.",
      bullets: [
        { text: "Klimaatwet versoepelen; klimaatfonds afschaffen." },
        { text: "Stikstofregels schrappen voor wonen en infrastructuur." },
        { text: "Kernenergie bouwen, gas openhouden." },
      ],
    },
    migratie: {
      summary:
        "Asielstop en strikte handhaving. Inzet op 'joods-christelijke' identiteit.",
      bullets: [
        { text: "Volledige asielstop; intrekken status statushouders na 5 jaar." },
        { text: "Werkmigratie buiten EU bevriezen." },
        { text: "Strenge handhaving op terugkeer." },
      ],
    },
    economie: {
      summary:
        "Lastenverlichting middeninkomens; behoud sociale voorzieningen voor 'eigen' burgers.",
      bullets: [
        { text: "BTW boodschappen naar 0%." },
        { text: "AOW-leeftijd terug naar 65." },
        { text: "Voorrang Nederlanders op uitkeringen." },
      ],
    },
    eu: {
      summary:
        "Sterk EU-kritisch: Nexit-referendum op termijn, vetorecht behouden, geen Europees leger.",
      bullets: [
        { text: "Vetorecht behouden op alle terreinen." },
        { text: "Referendum over EU op middellange termijn." },
        { text: "Geen Europees leger; sterke NAVO-band met VS." },
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
        { text: "Tegen verdragswijzigingen die soevereiniteit overdragen." },
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
        "Eco-radicaal: 75% CO₂-reductie in 2030, einde veehouderij in huidige vorm.",
      bullets: [
        { text: "Klimaatfonds verdrievoudigen." },
        { text: "Halvering veestapel binnen 5 jaar." },
        { text: "Verbod nieuwe fossiele projecten." },
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
        { text: "AOW met 10% verhogen." },
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
