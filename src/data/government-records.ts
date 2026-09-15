/**
 * Wat elke partij met regeringservaring feitelijk heeft bereikt, en wat niet.
 *
 * Bij elk resultaat staat wie er als bewindspersoon verantwoordelijk was en in
 * welk jaar het gebeurde. Waar een maatregel een besluit van de hele coalitie
 * was, staat dat er expliciet bij: een kabinetsmaatregel is niet automatisch de
 * verdienste van een enkele partij.
 */

export interface GovernmentResult {
  claim: string;
  responsibleMinister: string;
  year: string;
  sourceUrl: string;
}

export interface GovernmentUndelivered {
  claim: string;
  sourceUrl: string;
}

export interface PartyGovernmentRecord {
  /** Slug van de partijpagina. */
  partySlug: string;
  cabinets: string[];
  keyMinisters: string;
  results: GovernmentResult[];
  notDelivered: GovernmentUndelivered[];
}

export const GOVERNMENT_RECORD_REVIEWED = "2026-09-15";

export const GOVERNMENT_RECORDS: PartyGovernmentRecord[] = [
  {
    partySlug: "vvd",
    cabinets: ["Kok I (1994-1998)", "Kok II (1998-2002)", "Balkenende I (2002-2003)", "Balkenende II (2003-2006)", "Balkenende III (2006-2007)", "Rutte I (2010-2012)", "Rutte II (2012-2017)", "Rutte III (2017-2022)", "Rutte IV (2022-2024)", "Schoof (2024-2026)", "Jetten (2026-heden)"],
    keyMinisters: "Opstelten (Veiligheid en Justitie 2010-2015), Kamp (Sociale Zaken 2010-2012; Financiën 2012-2017), Schippers (Volksgezondheid 2010-2017), Blok (Wonen 2012-2017), Zalm (Financiën 1994-2002), Wiebes (Economische Zaken en Klimaat 2017-2021), Yeşilgöz (Justitie 2021-2024), Hermans (Klimaat en Groene Groei 2024-2026)",
    results: [
      {
        claim: "Politiewet 2012: één landelijke politieorganisatie in plaats van regionale korpsen, in werking per 1 januari 2013. Een besluit van de coalitie, niet uitsluitend toe te schrijven aan de VVD.",
        responsibleMinister: "Ivo Opstelten (VVD), minister van Veiligheid en Justitie",
        year: "2012",
        sourceUrl: "https://wetten.overheid.nl/BWBR0031788",
      },
      {
        claim: "Wet verhoging van de AOW- en pensioenrichtleeftijd: stapsgewijze verhoging van de AOW-leeftijd, een afspraak van VVD en CDA in Rutte I.",
        responsibleMinister: "Henk Kamp (VVD), minister van Sociale Zaken en Werkgelegenheid",
        year: "2012",
        sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/33290_wet_verhoging_aow_en",
      },
      {
        claim: "Wet langdurige zorg: verving de AWBZ, aangenomen in 2014 en in werking per 1 januari 2015. Een maatregel van Rutte II (VVD en PvdA).",
        responsibleMinister: "Edith Schippers (VVD), minister van Volksgezondheid, Welzijn en Sport",
        year: "2014",
        sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/33891_wet_langdurige_zorg",
      },
    ],
    notDelivered: [
      { claim: "Afschaffing van de dividendbelasting stond in het regeerakkoord van Rutte III, maar werd in oktober 2018 ingetrokken en dus nooit uitgevoerd. Het was een coalitieafspraak; verantwoordelijk minister was Wopke Hoekstra (CDA).", sourceUrl: "https://www.tweedekamer.nl/nieuws/kamernieuws/debat-over-afschaffing-van-dividendbelasting" },
      { claim: "Het wettelijke stikstofdoel voor 2030 is onder Rutte III en IV niet gehaald. PBL, RIVM en WUR concluderen dat de bronmaatregelen in 2030 onvoldoende effect hebben. Gedeeld coalitiebesluit van VVD, CDA, D66 en ChristenUnie.", sourceUrl: "https://www.pbl.nl/system/files/document/2024-02/wur-pbl-rivm-2024-voortgang-stikstofbronmaatregelen-en-verwachte-effecten-in-2030-5204.pdf" },
    ],
  },
  {
    partySlug: "progressief-nederland",
    cabinets: ["Kok I (1994-1998, als PvdA)", "Kok II (1998-2002, als PvdA)", "Balkenende IV (2007-2010, als PvdA)", "Rutte II (2012-2017, als PvdA)", "GroenLinks zelf heeft nooit een minister geleverd"],
    keyMinisters: "Kok (premier 1994-2002), Melkert (Sociale Zaken 1994-1998), Vermeend (staatssecretaris Financiën 1994-2000), Bos (Financiën 2007-2010), Asscher (Sociale Zaken 2012-2017), Dijsselbloem (Financiën 2012-2017), Plasterk (Onderwijs 2007-2010)",
    results: [
      {
        claim: "Wet inkomstenbelasting 2001 met het boxenstelsel, een maatregel van de paarse kabinetten (PvdA, VVD, D66).",
        responsibleMinister: "Willem Vermeend (PvdA), staatssecretaris van Financiën",
        year: "2001",
        sourceUrl: "https://wetten.overheid.nl/BWBR0011353",
      },
      {
        claim: "Participatiewet: één regeling voor de onderkant van de arbeidsmarkt, in werking per 1 januari 2015. Een maatregel van Rutte II (VVD en PvdA).",
        responsibleMinister: "Lodewijk Asscher (PvdA), minister van Sociale Zaken en Werkgelegenheid",
        year: "2015",
        sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/33161_invoeringswet",
      },
      {
        claim: "Wet werk en zekerheid: hervorming van het ontslagrecht en de flexcontracten, grotendeels in werking per 1 juli 2015. Een maatregel van Rutte II (VVD en PvdA).",
        responsibleMinister: "Lodewijk Asscher (PvdA), minister van Sociale Zaken en Werkgelegenheid",
        year: "2015",
        sourceUrl: "https://zoek.officielebekendmakingen.nl/stb-2015-234.html",
      },
    ],
    notDelivered: [
      { claim: "De in het regeerakkoord van Rutte II aangekondigde aanpak van schijnzelfstandigheid werkte niet: de Wet DBA trad in werking, maar de handhaving werd met een moratorium opgeschort. Coalitieafspraak van VVD en PvdA.", sourceUrl: "https://zoek.officielebekendmakingen.nl/stcrt-2016-59049.html" },
      { claim: "In het coalitieakkoord van Balkenende IV was een kilometerheffing voorzien onder de naam 'Anders betalen voor mobiliteit'. Die is nooit ingevoerd. Gedeelde afspraak van CDA, PvdA en ChristenUnie.", sourceUrl: "https://www.rijksoverheid.nl/documenten/2007/02/07/coalitieakkoord-balkenende-iv" },
    ],
  },
  {
    partySlug: "cda",
    cabinets: ["Balkenende I (2002-2003)", "Balkenende II (2003-2006)", "Balkenende III (2006-2007)", "Balkenende IV (2007-2010)", "Rutte III (2017-2022)", "Rutte IV (2022-2024)", "Jetten (2026-heden)"],
    keyMinisters: "Balkenende (premier 2002-2010), De Geus (Sociale Zaken 2002-2007), Donner (Justitie 2002-2006; Sociale Zaken 2006-2007), Verhagen (Buitenlandse Zaken 2003-2007), Hoekstra (Financiën 2017-2022), Grapperhaus (Justitie en Veiligheid 2017-2022), De Jonge (Volksgezondheid 2017-2022; Binnenlandse Zaken 2022-2024), Slob (Onderwijs 2017-2021)",
    results: [
      {
        claim: "Wet werk en inkomen naar arbeidsvermogen (WIA): verving de WAO en keert uit bij langdurige arbeidsongeschiktheid. Een maatregel van Balkenende II (CDA, VVD, D66).",
        responsibleMinister: "Aart Jan de Geus (CDA), minister van Sociale Zaken en Werkgelegenheid",
        year: "2005",
        sourceUrl: "https://zoek.officielebekendmakingen.nl/stb-2005-573.html",
      },
      {
        claim: "Steun- en herstelpakketten in de coronacrisis, waaronder de NOW. De Algemene Rekenkamer oordeelde dat uitvoering en controle op orde waren. Een kabinetsmaatregel van Rutte III.",
        responsibleMinister: "Wopke Hoekstra (CDA), minister van Financiën",
        year: "2020",
        sourceUrl: "https://www.rekenkamer.nl/actueel/nieuws/2022/05/18/uitvoering-en-controle-op-now-op-orde",
      },
      {
        claim: "Wet betaalbare huur: regulering van de middenhuur via het woningwaarderingsstelsel, in werking per 1 juli 2024. Een coalitiebesluit van Rutte IV.",
        responsibleMinister: "Hugo de Jonge (CDA), minister van Binnenlandse Zaken en Koninkrijksrelaties",
        year: "2024",
        sourceUrl: "https://zoek.officielebekendmakingen.nl/stb-2024-197.html",
      },
    ],
    notDelivered: [
      { claim: "Afschaffing van de dividendbelasting uit het regeerakkoord van Rutte III werd in oktober 2018 ingetrokken; CDA-minister Hoekstra was verantwoordelijk. Gedeeld coalitiebesluit.", sourceUrl: "https://www.tweedekamer.nl/nieuws/kamernieuws/debat-over-afschaffing-van-dividendbelasting" },
      { claim: "In het coalitieakkoord van Balkenende IV was een kilometerheffing voorzien. Die is nooit ingevoerd. Gedeelde afspraak van CDA, PvdA en ChristenUnie.", sourceUrl: "https://www.rijksoverheid.nl/documenten/2007/02/07/coalitieakkoord-balkenende-iv" },
    ],
  },
  {
    partySlug: "d66",
    cabinets: ["Kok I (1994-1998)", "Kok II (1998-2002)", "Balkenende II (2003-2006)", "Rutte II (2012-2017)", "Rutte IV (2022-2024)", "Jetten (2026-heden)"],
    keyMinisters: "Borst (Volksgezondheid 1994-2002), Brinkhorst (Economische Zaken 2003-2006), Koolmees (Sociale Zaken 2017-2022), Jetten (Klimaat en Energie 2022-2024; premier 2026-heden), Kaag (Financiën en Buitenlandse Zaken 2022-2024), Dijkgraaf (Onderwijs 2022-2024)",
    results: [
      {
        claim: "Wet toetsing levensbeëindiging op verzoek en hulp bij zelfdoding, in werking per 1 april 2002. Een maatregel van Kok II (PvdA, VVD, D66).",
        responsibleMinister: "Els Borst (D66), minister van Volksgezondheid, Welzijn en Sport",
        year: "2001",
        sourceUrl: "https://wetten.overheid.nl/BWBR0012410",
      },
      {
        claim: "Wet arbeidsmarkt in balans: aangenomen in beide Kamers in 2019 en grotendeels in werking per 1 januari 2020. Een maatregel van Rutte III.",
        responsibleMinister: "Wouter Koolmees (D66), minister van Sociale Zaken en Werkgelegenheid",
        year: "2019",
        sourceUrl: "https://www.rijksoverheid.nl/actueel/nieuws/2019/05/28/wet-arbeidsmarkt-in-balans-aangenomen-in-beide-kamers",
      },
      {
        claim: "Instelling van het Klimaatfonds met middelen voor de klimaat- en energietransitie. Een coalitiebesluit van Rutte IV.",
        responsibleMinister: "Rob Jetten (D66), minister voor Klimaat en Energie",
        year: "2023",
        sourceUrl: "https://www.rijksoverheid.nl/documenten/2023/04/26/voorjaarsbesluitvorming-klimaat",
      },
    ],
    notDelivered: [
      { claim: "Een bindend correctief referendum was tot 2026 niet in de Grondwet verankerd; pas in 2025 presenteerde het kabinet hoofdlijnen. Een dossier waarvoor D66 zich lang inzette.", sourceUrl: "https://www.rijksoverheid.nl/actueel/nieuws/2025/10/17/kabinet-presenteert-hoofdlijnen-voor-meer-invloed-burgers-via-bindend-correctief-referendum" },
      { claim: "Het wettelijke klimaatdoel voor 2030 was onder Rutte III en IV volgens het PBL niet in zicht. De verantwoordelijkheid lag mede bij de D66-minister voor Klimaat en Energie, in een gedeeld coalitiebesluit.", sourceUrl: "https://www.pbl.nl/uploads/default/downloads/pbl-2023-klimaat-en-energieverkenning-2023-5243.pdf" },
    ],
  },
  {
    partySlug: "christenunie",
    cabinets: ["Balkenende IV (2007-2010)", "Rutte III (2017-2022)", "Rutte IV (2022-2024)"],
    keyMinisters: "Rouvoet (Jeugd en Gezin 2007-2010), Schouten (Landbouw 2017-2022; Sociale Zaken en Armoedebeleid 2022-2024). Van der Staaij was fractieleider en geen minister.",
    results: [
      {
        claim: "Wet toekomst pensioenen: hervorming van het pensioenstelsel, in werking per 1 juli 2023. Verankerd in het coalitieakkoord van Rutte IV en aangenomen met een brede Kamermeerderheid.",
        responsibleMinister: "Carola Schouten (ChristenUnie), minister van Sociale Zaken en Werkgelegenheid",
        year: "2023",
        sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/36067_wet_toekomst_pensioenen",
      },
      {
        claim: "Invoering van Centra voor Jeugd en Gezin in gemeenten als laagdrempelig loket voor jeugd en gezin, onderdeel van het beleidsprogramma van Balkenende IV.",
        responsibleMinister: "André Rouvoet (ChristenUnie), minister voor Jeugd en Gezin",
        year: "2007-2010",
        sourceUrl: "https://www.rekenkamer.nl/site/binaries/site-content/collections/documents/2012/06/13/centra-voor-jeugd-en-gezin-in-gemeenten/Rapport+Centra+voor+Jeugd+en+Gezin+in+gemeenten.pdf",
      },
      {
        claim: "Wet stikstofreductie en natuurverbetering: een wettelijke verplichting om de stikstofuitstoot te reduceren. Een coalitiebesluit van Rutte III.",
        responsibleMinister: "Carola Schouten (ChristenUnie), minister van Landbouw, Natuur en Voedselkwaliteit",
        year: "2021",
        sourceUrl: "https://www.tweedekamer.nl/kamerstukken/wetsvoorstellen/detail?cfg=wetsvoorsteldetails&qry=wetsvoorstel%3A35600",
      },
    ],
    notDelivered: [
      { claim: "De wettelijke stikstofdoelstelling voor 2030 werd onder Rutte III en IV niet gehaald. PBL, RIVM en WUR concluderen dat de bronmaatregelen onvoldoende effect hebben. Gedeeld coalitiebesluit.", sourceUrl: "https://www.pbl.nl/system/files/document/2024-02/wur-pbl-rivm-2024-voortgang-stikstofbronmaatregelen-en-verwachte-effecten-in-2030-5204.pdf" },
      { claim: "In het coalitieakkoord van Balkenende IV was een kilometerheffing voorzien. Die is nooit ingevoerd. Gedeelde afspraak van CDA, PvdA en ChristenUnie.", sourceUrl: "https://www.rijksoverheid.nl/documenten/2007/02/07/coalitieakkoord-balkenende-iv" },
    ],
  },
  {
    partySlug: "pvv",
    cabinets: ["Rutte I (2010-2012, gedoogsteun zonder eigen bewindslieden)", "Schoof (2024-2026)"],
    keyMinisters: "Agema (Volksgezondheid 2024-2025), Faber (Asiel en Migratie 2024-2025), Madlener (Infrastructuur en Waterstaat 2024-2025), Beljaarts (Economische Zaken 2024-2025), Klever (Buitenlandse Handel 2024-2025). Wilders was fractieleider en geen minister.",
    results: [
      {
        claim: "De PVV leverde in het kabinet-Schoof vijf ministers: Fleur Agema, Marjolein Faber, Barry Madlener, Dirk Beljaarts en Reinette Klever.",
        responsibleMinister: "diverse PVV-bewindslieden",
        year: "2024",
        sourceUrl: "https://www.rijksoverheid.nl/regering/over-de-regering/kabinetten-sinds-1945/kabinet-schoof",
      },
      {
        claim: "Verhoging van de maximumsnelheid: op drie snelwegtrajecten kan overdag weer 130 kilometer per uur worden gereden. Een maatregel van het kabinet-Schoof.",
        responsibleMinister: "Barry Madlener (PVV), minister van Infrastructuur en Waterstaat",
        year: "2025",
        sourceUrl: "https://www.rijksoverheid.nl/actueel/nieuws/2025/04/14/vanaf-nu-hele-dag-130-kilometer-per-uur-op-aantal-snelwegen",
      },
      {
        claim: "Tijdelijke herinvoering van grenscontroles aan de binnengrenzen door de marechaussee vanaf december 2024, tegen illegale immigratie en grensoverschrijdende criminaliteit.",
        responsibleMinister: "Marjolein Faber (PVV), minister van Asiel en Migratie",
        year: "2024",
        sourceUrl: "https://www.marechaussee.nl/onderwerpen/t/tijdelijke-herinvoering-van-grenscontroles",
      },
    ],
    notDelivered: [
      { claim: "De in het verkiezingsprogramma van 2023 beloofde totale asielstop is niet doorgevoerd.", sourceUrl: "https://nos.nl/collectie/13999/artikel/2579598-pvv-programma-totale-asielstop-geen-verbod-meer-op-koran-of-moskee" },
      { claim: "De in het hoofdlijnenakkoord van 2024 aangekondigde Asielnoodmaatregelenwet is niet ingevoerd. Het kabinet-Schoof viel in juni 2025 over het asieldossier en de PVV-bewindslieden stapten op. Gedeeld coalitiebesluit met VVD, NSC en BBB.", sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/36704_asielnoodmaatregelenwet" },
    ],
  },
  {
    partySlug: "bbb",
    cabinets: ["Schoof (2024-2026)"],
    keyMinisters: "Keijzer (Volkshuisvesting en Ruimtelijke Ordening 2024-2026), Wiersma (Landbouw, Visserij, Voedselzekerheid en Natuur 2024-2026), Van Marum (Herstel Groningen), Tieman (Infrastructuur en Waterstaat), Rummenie en Tuinman (staatssecretarissen). Van der Plas was fractieleider en geen minister.",
    results: [
      {
        claim: "De BBB leverde in het kabinet-Schoof vier ministers en meerdere staatssecretarissen, onder wie Mona Keijzer, Femke Wiersma en Eddie van Marum.",
        responsibleMinister: "diverse BBB-bewindslieden",
        year: "2024",
        sourceUrl: "https://www.rijksoverheid.nl/regering/over-de-regering/kabinetten-sinds-1945/kabinet-schoof",
      },
      {
        claim: "Verlenging van de termijn voor PAS-melders, boeren zonder geldige natuurvergunning, om een oplossing te vinden. Minister Wiersma gaf hen in 2025 drie jaar langer de tijd.",
        responsibleMinister: "Femke Wiersma (BBB), minister van Landbouw, Visserij, Voedselzekerheid en Natuur",
        year: "2025",
        sourceUrl: "https://tweedekamer.nl/kamerstukken/detail?did=2025D22153&id=2025D22153",
      },
    ],
    notDelivered: [
      { claim: "Het wettelijke stikstofdoel voor 2030 bleef van kracht en de rechter beval de Staat dat doel te halen. Het kabinet-Schoof met BBB-minister Wiersma slaagde er niet in die wettelijke verplichting te schrappen.", sourceUrl: "https://www.rechtspraak.nl/organisatie-en-contact/organisatie/rechtbanken/rechtbank-den-haag/nieuws/rechtbank-beveelt-nederlandse-staat-wettelijk-stikstofdoel-2030-te-halen" },
      { claim: "Er kwam geen nieuwe Europese derogatie voor mest en geen akkoord over het mestbeleid; het mestdossier leidde tot een conflict in het kabinet.", sourceUrl: "https://www.tweedekamer.nl/kamerstukken/plenaire_verslagen/kamer_in_het_kort/debat-over-de-ruzie-het-kabinet-over-mest" },
    ],
  },
];

export function getGovernmentRecord(
  partySlug: string,
): PartyGovernmentRecord | undefined {
  return GOVERNMENT_RECORDS.find((record) => record.partySlug === partySlug);
}
