/**
 * Nederlandse kabinetten sinds 1994, met wat aantoonbaar is bereikt en wat
 * beloofd maar niet gehaald is.
 *
 * Bron per bewering is een parlement.com-pagina over de wetgeving of cijfers
 * van dat kabinet. Het onderscheid tussen een voornemen in het coalitieakkoord
 * en een aangenomen of uitgevoerde maatregel is bewust aangehouden.
 */

export interface CabinetClaim {
  claim: string;
  sourceUrl: string;
}

export interface SeedCabinet {
  slug: string;
  name: string;
  started: string;
  ended: string;
  /** Zit dit kabinet op de peildatum nog? */
  sitting: boolean;
  parties: string[];
  seats: string;
  daysInOffice: string;
  endReason: string;
  achievements: CabinetClaim[];
  unfulfilled: CabinetClaim[];
  interestingFact: string;
  interestingFactSource: string;
  reviewed: string;
}

export const CABINET_REVIEWED = "2026-09-15";

export const CABINETS: SeedCabinet[] = [
  {
    slug: "kok-i",
    name: "Kabinet-Kok I",
    started: "22 augustus 1994",
    ended: "3 augustus 1998",
    sitting: false,
    parties: ["PvdA", "VVD", "D66"],
    seats: "PvdA 37, VVD 31, D66 24 - samen 92 van 150 zetels (61,3%); Eerste Kamer 40 zetels (tot 13-6-1995), daarna 44",
    daysInOffice: "1442 dagen (22 augustus 1994 tot 3 augustus 1998)",
    endReason: "Zat de volledige parlementaire periode uit. Premier Kok bood op 6 mei 1998 (de dag van de Tweede Kamerverkiezingen) het ontslag aan; het kabinet bleef demissionair tot 3 augustus 1998. De samenwerking van PvdA, VVD en D66 werd voortgezet in het kabinet-Kok II.",
    achievements: [
      { claim: "MDW-programma (Marktwerking, Deregulering en Wetgevingskwaliteit) opgezet; de Winkelsluitingswet 1976 werd vervangen door de Winkeltijdenwet (1996), die ruimere openingstijden in de avonduren en op zon- en feestdagen mogelijk maakte.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-kok-i-1994-1998" },
      { claim: "Nieuwe Mededingingswet (1998): het misbruiksysteem werd vervangen door een algemeen kartelverbod en een verbod op misbruik van economische machtspositie, met de nieuwe Nederlandse Mededingingsautoriteit (NMa) als toezichthouder.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-kok-i-1994-1998" },
      { claim: "De werkloosheid daalde van 531.000 in 1994 naar 369.000 in 1998; de gemiddelde jaarlijkse werkgelegenheidsgroei van 2,1% was de hoogste onder een meerjarig kabinet in de periode 1971-2017.", sourceUrl: "https://www.parlement.com/cijfers-kabinet-kok-i-1994-1998" },
    ],
    unfulfilled: [
      { claim: "Het wetsvoorstel tot invoering van de prestatiebeurs in het wetenschappelijk onderwijs werd in 1995 door de Eerste Kamer verworpen met 35 tegen 34 stemmen (een VVD- en een D66-senator stemden tegen); pas een aangepast voorstel werd in 1996 wet.", sourceUrl: "https://www.parlement.com/afwijkend-stemgedrag-de-eerste-kamer" },
    ],
    interestingFact: "Kok I was het eerste kabinet sinds 1918 waaraan geen enkele confessionele partij deelnam; PvdA en VVD regeerden voor het eerst samen sinds het kabinet-Drees II.",
    interestingFactSource: "https://www.parlement.com/coalitie",
    reviewed: "2026-09-15",
  },
  {
    slug: "kok-ii",
    name: "Kabinet-Kok II",
    started: "3 augustus 1998",
    ended: "22 juli 2002",
    sitting: false,
    parties: ["PvdA", "VVD", "D66"],
    seats: "PvdA 45, VVD 38, D66 14 - samen 97 van 150 zetels (64,7%); Eerste Kamer 44 zetels (tot 8-6-1999), daarna 38",
    daysInOffice: "1449 dagen (3 augustus 1998 tot 22 juli 2002)",
    endReason: "Het kabinet diende op 16 april 2002 zijn ontslag in naar aanleiding van het rapport van het NIOD over het bloedbad bij Srebrenica. Het bleef demissionair tot 22 juli 2002 (de Tweede Kamerverkiezingen van 15 mei 2002 vonden in deze demissionaire periode plaats).",
    achievements: [
      { claim: "Openstelling van het burgerlijk huwelijk voor paren van hetzelfde geslacht (2001); Nederland was hiermee het eerste land ter wereld.", sourceUrl: "https://www.cbs.nl/nl-nl/nieuws/2026/13/25-jaar-na-invoering-homohuwelijk-ruim-duizend-echtparen-vieren-jubileum" },
      { claim: "Wet toetsing levensbeëindiging op verzoek en hulp bij zelfdoding (euthanasiewet, 2001): euthanasie is niet langer strafbaar mits de arts zich aan de wettelijke zorgvuldigheidseisen houdt.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-kok-ii-1998-2002" },
      { claim: "Herziening van het belastingstelsel (2001): invoering van het drie-boxenstelsel met een rendementsheffing op vermogen, tariefverlaging, minder aftrekposten en heffingskortingen in plaats van belastingvrije sommen.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-kok-ii-1998-2002" },
    ],
    unfulfilled: [
      { claim: "Invoering van het correctief referendum strandde: de Eerste Kamer verwierp de grondwetswijziging in tweede lezing in de nacht van 18 op 19 mei 1999 (49 tegen 26), mede door de tegenstem van VVD-senator Wiegel. Het kabinet diende daarop zijn ontslag in, maar trok de ontslagaanvraag op 8 juni 1999 na een lijmpoging weer in.", sourceUrl: "https://www.parlement.com/kabinetscrisis-1999-de-nacht-van-wiegel" },
    ],
    interestingFact: "Het correctief referendum was voor D66 het 'kroonjuweel'; de verwerping in de Eerste Kamer met een enkele stem (de 'Nacht van Wiegel') leidde tot een kabinetscrisis die met een lijmpoging werd opgelost.",
    interestingFactSource: "https://www.parlement.com/kabinetscrisis-1999-de-nacht-van-wiegel",
    reviewed: "2026-09-15",
  },
  {
    slug: "balkenende-i",
    name: "Kabinet-Balkenende I",
    started: "22 juli 2002",
    ended: "27 mei 2003",
    sitting: false,
    parties: ["CDA", "LPF", "VVD"],
    seats: "CDA 43, LPF 26, VVD 24 - samen 93 van 150 zetels (62%); Eerste Kamer 39 zetels (CDA 20, VVD 19; LPF niet vertegenwoordigd)",
    daysInOffice: "309 dagen (22 juli 2002 tot 27 mei 2003), waarvan slechts 87 dagen in functie",
    endReason: "Het kabinet viel op 16 oktober 2002 door de 'LPF-crisis': na weken van conflict tussen de LPF-ministers Bomhoff en Heinsbroek zegden de fractievoorzitters van CDA en VVD het vertrouwen op. Het bleef demissionair tot 27 mei 2003.",
    achievements: [
      { claim: "Wet dualisering provinciebestuur (2003): duidelijker scheiding tussen de kaderstellende rol van Provinciale Staten en het besturen door Gedeputeerde Staten; gedeputeerden mogen niet langer Statenlid zijn en er komt een provinciale rekenkamer.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-i-2002-2003" },
      { claim: "Nieuwe Spoorwegwet (2003): de bestaande spoorwegwetten werden vervangen door een strikte scheiding tussen de zorg voor de infrastructuur (overheid) en het leveren van vervoer (marktpartijen in concurrentie).", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-i-2002-2003" },
    ],
    unfulfilled: [
      { claim: "Het strategisch akkoord 'Werken aan vertrouwen, een kwestie van aanpakken' (ruim veertig pagina's) werd nauwelijks uitgewerkt doordat het kabinet al na 87 dagen regeren viel.", sourceUrl: "https://www.montesquieu-instituut.nl/column/202602/aan-de-slag-staat-ook-traditie" },
    ],
    interestingFact: "Van de 309 dagen dat het kabinet bestond, zat het slechts 87 dagen in functie; het was het eerste en enige kabinet met de LPF.",
    interestingFactSource: "https://www.parlement.com/kabinet-balkenende-i-2002-2003",
    reviewed: "2026-09-15",
  },
  {
    slug: "balkenende-ii",
    name: "Kabinet-Balkenende II",
    started: "27 mei 2003",
    ended: "7 juli 2006",
    sitting: false,
    parties: ["CDA", "VVD", "D66"],
    seats: "CDA 44, VVD 28, D66 6 - samen 78 van 150 zetels (52%); Eerste Kamer 41 zetels (vanaf 10-6-2003: CDA 23, VVD 15, D66 3)",
    daysInOffice: "1137 dagen (27 mei 2003 tot 7 juli 2006)",
    endReason: "Het kabinet viel op 30 juni 2006 doordat de D66-bewindslieden opstapten, nadat de D66-fractie een dag eerder het vertrouwen in minister Verdonk had opgezegd vanwege de gang van zaken rond het Nederlanderschap van VVD-Kamerlid Ayaan Hirsi Ali (de 'Ayaan-crisis'). Het bleef demissionair tot de aantreding van het overgangskabinet-Balkenende III op 7 juli 2006.",
    achievements: [
      { claim: "Zorgverzekeringswet (2005, in werking 1 januari 2006): een basisverzekering voor alle ingezetenen ongeacht leeftijd, gezondheidstoestand of inkomen, met een inkomensafhankelijke zorgtoeslag.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-ii-2003-2006" },
      { claim: "Wet Werk en Inkomen naar arbeidsvermogen (WIA, 2005): arbeidsgeschiktheid in plaats van arbeidsongeschiktheid als uitgangspunt; de wet verving de WAO.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-ii-2003-2006" },
      { claim: "Wet werk en bijstand (2003): verving de Algemene Bijstandswet en legde de verantwoordelijkheid voor re-integratie bij gemeenten, die daarvoor een eigen budget kregen.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-ii-2003-2006" },
    ],
    unfulfilled: [
      { claim: "Op 22 maart 2005 verwierp de Eerste Kamer in tweede lezing het grondwetsvoorstel om de burgemeestersbenoeming uit de Grondwet te halen; een dag later trad minister voor Bestuurlijke Vernieuwing Thom de Graaf (D66) af.", sourceUrl: "https://www.parlement.com/het-aftreden-van-minister-de-graaf-en-de-avond-van-van-thijn-2005-weer-geen-bestuurlijke" },
    ],
    interestingFact: "Voor het eerst nam D66 deel aan een centrumrechts kabinet; het kabinet telde een recordaantal van vijf vrouwen.",
    interestingFactSource: "https://www.parlement.com/kabinetten-1945-heden",
    reviewed: "2026-09-15",
  },
  {
    slug: "balkenende-iii",
    name: "Kabinet-Balkenende III",
    started: "7 juli 2006",
    ended: "22 februari 2007",
    sitting: false,
    parties: ["CDA", "VVD"],
    seats: "CDA 44, VVD 27 - samen 71 van 150 zetels (47,3%); Eerste Kamer 38 zetels (CDA 23, VVD 15)",
    daysInOffice: "230 dagen (7 juli 2006 tot 22 februari 2007)",
    endReason: "Overgangskabinet: het werd niet gevormd na verkiezingen maar direct na de val van Balkenende II, met als belangrijkste taken de voorbereiding van de Tweede Kamerverkiezingen van 22 november 2006 en van de begroting 2007. Het werd op 22 februari 2007 opgevolgd door het kabinet-Balkenende IV.",
    achievements: [
      { claim: "Wet ruimtelijke ordening (2006): verving de WRO uit 1965, verving PKB's en streekplannen door structuurvisies en bracht de duur van de bestemmingsplanprocedure terug van 58 naar 22-24 weken.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-iii-2006-2007" },
      { claim: "Wet inburgering (2006): een verplichtend en resultaatgericht inburgeringsstelsel met inburgeringsplicht en verplicht inburgeringsexamen.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-iii-2006-2007" },
      { claim: "Splitsingwet energiebedrijven (2006): maakte de splitsing van de regionale geïntegreerde energiebedrijven en de overdracht van het beheer van het hoogspanningsnet mogelijk.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-iii-2006-2007" },
    ],
    unfulfilled: [
      { claim: "Het kabinet wilde vasthouden aan het bestaande asielbeleid, maar een nieuwe Kamermeerderheid dwong na de verkiezingen van 22 november 2006 nog voor de formatie van Balkenende IV een generaal pardon af; toen minister Verdonk weigerde, verloor zij een deel van haar portefeuille.", sourceUrl: "https://nos.nl/artikel/138229-overzicht-kabinetten-balkenende" },
    ],
    interestingFact: "Op 13 december 2006 nam de Tweede Kamer een motie van afkeuring aan tegen minister Verdonk: nog niet eerder richtte zo'n motie zich tegen een bewindspersoon in een demissionair kabinet.",
    interestingFactSource: "https://www.parlement.com/kabinet-balkenende-iii-2006-2007",
    reviewed: "2026-09-15",
  },
  {
    slug: "balkenende-iv",
    name: "Kabinet-Balkenende IV",
    started: "22 februari 2007",
    ended: "14 oktober 2010",
    sitting: false,
    parties: ["CDA", "PvdA", "ChristenUnie"],
    seats: "CDA 41, PvdA 33, ChristenUnie 6 - samen 80 van 150 zetels (53,3%). Van 23 februari 2010 tot 14 oktober 2010 regeerde een rompkabinet van CDA en ChristenUnie (47 zetels)",
    daysInOffice: "1330 dagen (22 februari 2007 tot 14 oktober 2010), waarvan 233 dagen demissionair",
    endReason: "Het kabinet viel in de vroege ochtend van 20 februari 2010 doordat CDA, PvdA en ChristenUnie het niet eens werden over voortzetting van de Nederlandse militaire missie in de Afghaanse provincie Uruzgan. De PvdA-bewindslieden stapten uit het kabinet; CDA en ChristenUnie regeerden demissionair door tot 14 oktober 2010.",
    achievements: [
      { claim: "Gratis schoolboeken in het voortgezet onderwijs: vanaf 1 augustus 2009 kregen scholen van het Rijk de middelen voor het gratis ter beschikking stellen van lesmateriaal.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-iv-2007-2010" },
      { claim: "Wet tijdelijk huisverbod (2008): de burgemeester kan een huisverbod opleggen aan iemand die dreigt met (ernstig) huiselijk geweld, zodat tijdens de uithuisplaatsing hulp kan worden geboden.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-iv-2007-2010" },
      { claim: "Opheffing van de Nederlandse Antillen (2010): Curaçao en Sint Maarten werden landen binnen het Koninkrijk; Bonaire, Sint Eustatius en Saba werden bijzondere gemeenten (openbare lichamen) binnen Nederland.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-balkenende-iv-2007-2010" },
    ],
    unfulfilled: [
      { claim: "De kilometerheffing werd niet ingevoerd: in mei 2008 werd besloten tot invoering vanaf 2012, in april 2009 werd de eerste fase (vrachtwagens) uitgesteld tot na de kabinetsperiode en sinds maart 2010 lag de uitvoering van het plan geheel stil.", sourceUrl: "https://www.parlement.com/kabinet-balkenende-iv-2007-2010" },
      { claim: "De verhoging van de AOW-leeftijd van 65 naar 67 jaar werd niet door dit kabinet wet: het voorstel uit oktober 2009 (66 jaar in 2020, 67 jaar in 2025) sneuvelde met de val van het kabinet.", sourceUrl: "https://www.parlement.com/kabinet-balkenende-iv-2007-2010" },
    ],
    interestingFact: "Het kabinet viel over de militaire missie in Uruzgan; de val begon in de nacht van 19 op 20 februari 2010 en het kabinet regeerde daarna nog 233 dagen demissionair door.",
    interestingFactSource: "https://www.parlement.com/kabinetscrisis-2010-de-uruzgan-crisis",
    reviewed: "2026-09-15",
  },
  {
    slug: "rutte-i",
    name: "Kabinet-Rutte I",
    started: "14 oktober 2010",
    ended: "5 november 2012",
    sitting: false,
    parties: ["VVD", "CDA"],
    seats: "VVD 31, CDA 21 - samen 52 van 150 zetels; met gedoogsteun van de PVV (24 zetels) een nipte meerderheid van 76 zetels. In de Eerste Kamer geen meerderheid (35 zetels, vanaf 7-6-2011 37)",
    daysInOffice: "753 dagen (14 oktober 2010 tot 5 november 2012), waarvan 196 dagen demissionair",
    endReason: "Het kabinet viel op 23 april 2012 nadat de besprekingen in het Catshuis over verdere bezuinigingen waren mislukt; de PVV zegde het gedoogakkoord op. Premier Rutte bood het ontslag aan; het kabinet bleef demissionair tot 5 november 2012.",
    achievements: [
      { claim: "Wet verhoging van de AOW- en pensioenrichtleeftijd (2012): de AOW- en pensioenleeftijd gaat vanaf 2013 stapsgewijs omhoog naar 66 jaar in 2019 en 67 jaar in 2023.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-i-2010-2012" },
      { claim: "Nieuwe Politiewet (2012): per 1 januari 2013 gingen de 25 regiokorpsen en het Korps landelijke politiediensten op in een landelijk politiekorps, met de minister van Veiligheid en Justitie als beheerder.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-i-2010-2012" },
      { claim: "Wet bankenbelasting en Wet bijzondere maatregelen financiële ondernemingen (2012): een bankenbelasting als bijdrage aan steun aan noodlijdende banken, plus een bevoegdheid tot interventie en als uiterste middel onteigening om instabiliteit van het financiële stelsel te keren.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-i-2010-2012" },
    ],
    unfulfilled: [
      { claim: "De pogingen om in EU-verband de regels voor gezinshereniging te verscherpen mislukten.", sourceUrl: "https://www.parlement.com/kabinet-rutte-i-2010-2012" },
      { claim: "Het doel om het begrotingstekort binnen de Europese 3%-norm te houden werd met het pakket van circa 18 miljard euro aan voorgenomen en deels in gang gezette bezuinigingen niet gehaald; in het voorjaar van 2012 was duidelijk dat aanvullende bezuinigingen nodig waren, wat leidde tot de Catshuiscrisis.", sourceUrl: "https://www.parlement.com/kabinet-rutte-i-2010-2012" },
    ],
    interestingFact: "Rutte I was het eerste kabinet onder leiding van een VVD-premier; Rutte noemde zichzelf de eerste liberale premier sinds Cort van der Linden (1913-1918).",
    interestingFactSource: "https://www.parlement.com/kabinet-rutte-i-2010-2012",
    reviewed: "2026-09-15",
  },
  {
    slug: "rutte-ii",
    name: "Kabinet-Rutte II",
    started: "5 november 2012",
    ended: "26 oktober 2017",
    sitting: false,
    parties: ["VVD", "PvdA"],
    seats: "VVD 41, PvdA 38 - samen 79 van 150 zetels (52,7%); in de Eerste Kamer geen meerderheid (30 zetels, vanaf 9-6-2015 21)",
    daysInOffice: "1816 dagen (5 november 2012 tot 26 oktober 2017); langstzittende naoorlogse kabinet",
    endReason: "Het kabinet maakte zijn volledige termijn vol. Een dag voor de Tweede Kamerverkiezingen van 15 maart 2017 bood het zijn ontslag aan; het bleef demissionair tot 26 oktober 2017 (225 dagen).",
    achievements: [
      { claim: "Participatiewet (2014) en de decentralisaties per 1 januari 2015: de Jeugdwet, de Wet maatschappelijke ondersteuning 2015 en de Wet langdurige zorg brachten taken en verantwoordelijkheden naar gemeenten.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-ii-2012-2017" },
      { claim: "Wet studievoorschot hoger onderwijs (2015): de basisbeurs werd vervangen door een sociaal leenstelsel (in 2023 weer teruggedraaid met de herinvoering van de basisbeurs).", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-ii-2012-2017" },
      { claim: "Wet werk en zekerheid (2014): aanpak van flexcontracten, dwingende ontslagroutes, omvorming van de ontslagvergoeding tot transitievergoeding en verkorting van de maximale WW-duur.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-ii-2012-2017" },
    ],
    unfulfilled: [
      { claim: "Het wetsvoorstel van minister Schippers over een zorgpolis met een beperkte vrije artsenkeuze werd op 16 december 2014 door de Eerste Kamer verworpen (drie PvdA-senatoren stemden mee met de oppositie).", sourceUrl: "https://www.parlement.com/kabinet-rutte-ii-2012-2017" },
      { claim: "De voorgenomen doelmatige uitvoering van de decentralisaties liep op onderdelen mis: de uitbetaling van het persoonsgebonden budget via gemeenten en de Sociale Verzekeringsbank leidde tot aanhoudende problemen.", sourceUrl: "https://www.parlement.com/kabinet-rutte-ii-2012-2017" },
    ],
    interestingFact: "Met 1816 dagen is Rutte II het langstzittende naoorlogse kabinet; het was het eerste kabinet sinds Kok I (1998) dat zijn termijn volmaakte.",
    interestingFactSource: "https://www.parlement.com/zittingsduur-kabinetten",
    reviewed: "2026-09-15",
  },
  {
    slug: "rutte-iii",
    name: "Kabinet-Rutte III",
    started: "26 oktober 2017",
    ended: "10 januari 2022",
    sitting: false,
    parties: ["VVD", "CDA", "D66", "ChristenUnie"],
    seats: "VVD 33, CDA 19, D66 19, ChristenUnie 5 - samen 76 van 150 zetels (50,7%); in de Eerste Kamer vanaf 2019 geen meerderheid (32 zetels)",
    daysInOffice: "1537 dagen (26 oktober 2017 tot 10 januari 2022), waarvan 360 dagen demissionair",
    endReason: "Het kabinet bood op 15 januari 2021 zijn ontslag aan naar aanleiding van de harde conclusies van het parlementair onderzoek naar de kinderopvangtoeslagaffaire. De daarop volgende demissionaire periode van 360 dagen was een record. Op 10 januari 2022 volgde het kabinet-Rutte IV.",
    achievements: [
      { claim: "Wet verplichte geestelijke gezondheidszorg (Wvggz) en de Wet zorg en dwang psychogeriatrische en verstandelijk gehandicapte cliënten (2018): verplichte zorg is aan regels gebonden en dwang mag alleen als uiterste middel worden ingezet.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-iii-2017-2022" },
      { claim: "Wet stikstofreductie en natuurbescherming (2021): wettelijke omgevingswaarden voor de reductie van stikstofdepositie in 2025, 2030 en 2035, met een verplicht programma en provinciale gebiedsplannen.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-iii-2017-2022" },
      { claim: "Nationaal Groeifonds (2020) en de machtigingswet oprichting Invest NL (2019): een fonds voor investeringen die bijdragen aan economische groei en klimaatdoelen, en een staatsdeelneming (Invest NL, 2,5 miljard euro) voor risicovolle innovatie.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-iii-2017-2022" },
    ],
    unfulfilled: [
      { claim: "Het nationale doel van 49% reductie van broeikasgassen in 2030 werd niet in zicht gebracht: het PBL raamde in de Klimaat- en Energieverkenning 2021 een reductie van 38-48%, nog 1 tot 11 procentpunt onder het doel.", sourceUrl: "https://www.pbl.nl/en/publications/climate-and-energy-outlook-2021" },
      { claim: "Het stikstofbeleid liep vast: op 29 mei 2019 oordeelde de Afdeling bestuursrechtspraak van de Raad van State dat het Programma Aanpak Stikstof (PAS) niet als basis voor vergunningverlening mocht worden gebruikt, omdat het niet voldeed aan de Europese Habitatrichtlijn.", sourceUrl: "https://www.raadvanstate.nl/stikstof" },
    ],
    interestingFact: "De demissionaire periode van Rutte III duurde 360 dagen, een record in de naoorlogse parlementaire geschiedenis.",
    interestingFactSource: "https://www.parlement.com/kabinet-rutte-iii-2017-2022",
    reviewed: "2026-09-15",
  },
  {
    slug: "rutte-iv",
    name: "Kabinet-Rutte IV",
    started: "10 januari 2022",
    ended: "2 juli 2024",
    sitting: false,
    parties: ["VVD", "D66", "CDA", "ChristenUnie"],
    seats: "Bij aantreden: VVD 34, D66 24, CDA 14, ChristenUnie 5 - samen 77 van 150 zetels (51,3%). Na 6 december 2023 (na afsplitsingen): 41 zetels (VVD 24, D66 9, CDA 5, CU 3). In de Eerste Kamer 24 zetels",
    daysInOffice: "904 dagen (10 januari 2022 tot 2 juli 2024), waarvan 361 dagen demissionair",
    endReason: "Het kabinet viel op 7 juli 2023 door interne onenigheid over maatregelen om de asielinstroom te beperken (de VVD wilde beperkingen op gezinshereniging, wat voor D66 en ChristenUnie onaanvaardbaar was). Het bleef demissionair tot 2 juli 2024.",
    achievements: [
      { claim: "Wet toekomst pensioenen (2023): een nieuw pensioenstelsel met een directe relatie tussen premie en pensioenopbouw, naar het pensioenakkoord van 2020; de wet zou per 1 januari 2028 ingaan.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-iv-2022-2024" },
      { claim: "Herinvoering van de basisbeurs in het hoger onderwijs (Eerste Kamer juni 2023): vanaf studiejaar 2023-2024 verving de beurs het leenstelsel dat Rutte II in 2014 invoerde.", sourceUrl: "https://www.parlement.com/kabinet-rutte-iv-2022-2024" },
      { claim: "Wet beëindiging gaswinning Groningenveld (2024): de gaswinning werd per 1 oktober 2024 gestopt en daarna verboden. Daarnaast bood premier Rutte op 19 december 2022 namens de regering excuses aan voor het Nederlandse slavernijverleden.", sourceUrl: "https://www.parlement.com/wetgeving-kabinet-rutte-iv-2022-2024" },
    ],
    unfulfilled: [
      { claim: "Het doel de asielinstroom te beperken werd niet gehaald; juist daarover viel het kabinet op 7 juli 2023.", sourceUrl: "https://www.parlement.com/kabinetscrisis-2023-crisis-rond-migratie" },
      { claim: "Het stikstofdoel voor 2030 (driekwart van de stikstofgevoelige Natura 2000-gebieden op een gezond niveau) werd niet gehaald; de aanpak leidde tot grote maatschappelijke onrust en het aantreden van bemiddelaar Remkes.", sourceUrl: "https://www.parlement.com/kabinet-rutte-iv-2022-2024" },
    ],
    interestingFact: "De formatie van Rutte IV duurde 299 dagen, de langste kabinetsformatie sinds de Tweede Wereldoorlog.",
    interestingFactSource: "https://www.parlement.com/kabinetsformaties-sinds-1945",
    reviewed: "2026-09-15",
  },
  {
    slug: "schoof",
    name: "Kabinet-Schoof",
    started: "2 juli 2024",
    ended: "23 februari 2026",
    sitting: false,
    parties: ["PVV", "VVD", "NSC", "BBB"],
    seats: "PVV 37, VVD 24, NSC 20, BBB 7 - samen 88 van 150 zetels (58,7%); Eerste Kamer 30 zetels. Na het vertrek van PVV (3 juni 2025) en NSC (22 augustus 2025) resteerde een rompkabinet met 32 van 150 zetels",
    daysInOffice: "601 dagen (2 juli 2024 tot 23 februari 2026), waarvan 337 dagen in functie tot de val op 3 juni 2025",
    endReason: "Het kabinet viel op 3 juni 2025 doordat de PVV, na onenigheid over aanvullende asielmaatregelen, uit de coalitie stapte; alle negen PVV-bewindslieden vertrokken. Op 22 augustus 2025 verliet ook NSC het kabinet in het kielzog van minister Veldkamp (meningsverschil over maatregelen tegen Israel). Het resterende kabinet van VVD en BBB bleef demissionair tot 23 februari 2026.",
    achievements: [
      { claim: "Herinvoering van tijdelijke binnengrenscontroles per 9 december 2024. In het eerste jaar (9 december 2024 tot 8 december 2025) werd aan 530 vreemdelingen de toegang geweigerd en werden 250 personen aangehouden; de controles werden verlengd tot 8 juni 2026.", sourceUrl: "https://www.rijksoverheid.nl/actueel/nieuws/2026/01/16/minister-van-weel-deelt-resultaten-van-een-jaar-binnengrenscontroles" },
      { claim: "Lastenverzwaringen werden teruggedraaid en er kwam lastenverlichting, met fors extra investeringen in veiligheid en defensie; het kabinet maakte het voornemen bekend 3,5% van het bbp per jaar aan defensie uit te geven (plus 1,5% van het bbp voor bredere weerbaarheid).", sourceUrl: "https://rijksoverheid.nl/binaries/rijksoverheid/documenten/begrotingen/2025/09/16/miljoenennota-2026/Miljoenennota-2026.pdf" },
      { claim: "Het kabinet presenteerde op 13 september 2024 het regeerprogramma als uitwerking van het op 16 mei 2024 gesloten hoofdlijnenakkoord 'Hoop, Lef en Trots'.", sourceUrl: "https://www.rijksoverheid.nl/documenten/2024/09/13/regeerprogramma-kabinet-schoof" },
    ],
    unfulfilled: [
      { claim: "Het voornemen om via asielnoodrecht buiten het parlement om maatregelen te nemen ging niet door; na bezwaren werd gekozen voor een 'spoedwet' (de Asielnoodmaatregelenwet).", sourceUrl: "https://www.parlement.com/kabinet-schoof-2024-2026" },
      { claim: "De beoogde vermindering van de asielinstroom werd niet gerealiseerd; het kabinet viel op 3 juni 2025 juist over dit dossier.", sourceUrl: "https://parlement.com/kabinetscrisis-2025-asielmaatregelencrisis" },
    ],
    interestingFact: "Bij de formatie van 2023-2024 werd de formateur geen minister-president: voor het eerst sinds 1973. Bovendien kreeg Nederland voor het eerst een kabinet met een partijloze premier sinds Cort van der Linden (1913-1918).",
    interestingFactSource: "https://www.parlement.com/kabinetsformatie-2023-2024",
    reviewed: "2026-09-15",
  },
  {
    slug: "jetten",
    name: "Kabinet-Jetten",
    started: "23 februari 2026",
    ended: "heden (nog zittend; peildatum 15 september 2026)",
    sitting: true,
    parties: ["D66", "VVD", "CDA"],
    seats: "D66 26, VVD 22, CDA 18 - samen 66 van 150 zetels (44%); Eerste Kamer 22 van 75 zetels. Minderheidskabinet: voor elk voorstel is steun van andere partijen nodig",
    daysInOffice: "204 dagen tot en met de peildatum 15 september 2026 (nog zittend)",
    endReason: "Nog niet geëindigd. Het is het eerste kabinet sinds 1945 dat op geen enkele meerderheid in de Tweede Kamer kan rekenen (buiten overgangskabinetten) en werkt met wisselende meerderheden per dossier.",
    achievements: [
      { claim: "Wet invoering tweestatusstelsel: aangenomen door de Eerste Kamer op 21 april 2026 met 41 stemmen voor en 34 tegen; de wet maakt onderscheid tussen vluchtelingen en subsidiair beschermden en scherpt de eisen voor nareis aan.", sourceUrl: "https://eerstekamer.nl/wetsvoorstel/36703_wet_invoering" },
      { claim: "Uitvoerings- en implementatiewet Asiel- en migratiepact 2026: aangenomen door de Eerste Kamer op 26 mei 2026; hiermee werden de Europese asiel- en migratieregels in Nederland ingevoerd (het pact trad op 12 juni 2026 in werking).", sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/36871_uitvoerings_en" },
      { claim: "Op 24 april 2026 presenteerde het kabinet een beleidsbrief volkshuisvesting en ruimtelijke ordening met de inzet op 100.000 nieuwe woningen per jaar, negen extra grootschalige woningbouwlocaties en een Taskforce Versnelling Woningbouw onder leiding van de minister-president.", sourceUrl: "https://www.rijksoverheid.nl/actueel/nieuws/2026/04/24/kabinet-deelt-plannen-voor-volkshuisvesting-en-ruimtelijke-ordening" },
    ],
    unfulfilled: [
      { claim: "De Asielnoodmaatregelenwet werd op 21 april 2026 door de Eerste Kamer verworpen met 44 stemmen tegen en 31 voor.", sourceUrl: "https://www.eerstekamer.nl/wetsvoorstel/36704_asielnoodmaatregelenwet" },
      { claim: "De novelle aanpassing strafbaarstelling illegaal verblijf werd op 21 april 2026 door de Eerste Kamer verworpen met 37 stemmen voor en 38 tegen.", sourceUrl: "https://eerstekamer.nl/nieuws/20260421/senaat_verwerpt_strafbaarstelling" },
    ],
    interestingFact: "Het kabinet-Jetten is het eerste echte minderheidskabinet sinds 1945: sinds 1918 konden kabinetten in de Tweede Kamer (met uitzondering van overgangskabinetten) altijd op een meerderheid rekenen.",
    interestingFactSource: "https://www.parlement.com/kabinet-jetten-2026-heden",
    reviewed: "2026-09-15",
  },
];

export function getCabinetBySlug(slug: string): SeedCabinet | undefined {
  return CABINETS.find((cabinet) => cabinet.slug === slug);
}
