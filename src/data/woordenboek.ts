/**
 * Nederlandse politieke woordenlijst.
 * Bedoeld als educatieve referentie; geen volledige encyclopedie. Termen zijn
 * geordend per thema, maar de pagina toont ze ook alfabetisch.
 */

export type GlossaryCategory =
  | "instituties"
  | "bestuur"
  | "ideologie"
  | "verkiezingen"
  | "fiscaal"
  | "europa"
  | "sociaal"
  | "juridisch"
  | "geopolitiek"
  | "media";

export interface GlossaryTerm {
  /** Hoofdvorm, kleine letters tenzij eigennaam. */
  term: string;
  /** Stabiele URL-slug. */
  slug: string;
  category: GlossaryCategory;
  /** 1-2 zin definitie. */
  short: string;
  /** Langere uitleg, 2-4 alinea's geschikt. */
  long: string;
  /** Synoniemen of veelgebruikte alternatieve termen. */
  aliases?: string[];
  /** Verwante slugs in dit woordenboek (voor "zie ook"). */
  related?: string[];
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TERMS_RAW: Omit<GlossaryTerm, "slug">[] = [
  // ─── Instituties ───────────────────────────────────────────────
  {
    term: "Tweede Kamer",
    category: "instituties",
    short:
      "Direct gekozen Kamer van het parlement met 150 zetels die het regeringsbeleid controleert en wetten maakt of wijzigt.",
    long:
      "De Tweede Kamer der Staten-Generaal wordt om de vier jaar (of tussentijds) rechtstreeks gekozen door evenredige vertegenwoordiging. Zij heeft het recht van initiatief, amendement, motie, interpellatie en enquête. Wetsvoorstellen die de Tweede Kamer aanneemt gaan door naar de Eerste Kamer, die er alleen 'ja' of 'nee' tegen kan zeggen.",
    related: ["eerste-kamer", "motie", "amendement", "kabinetsformatie"],
  },
  {
    term: "Eerste Kamer",
    category: "instituties",
    short:
      "Senaat met 75 leden die door Provinciale Staten worden gekozen; toetst wetten op rechtmatigheid en uitvoerbaarheid.",
    long:
      "De Eerste Kamer (de Senaat) bestaat uit 75 leden die om de vier jaar indirect worden gekozen door de leden van de Provinciale Staten. Anders dan de Tweede Kamer heeft de Eerste Kamer geen recht van amendement of initiatief: zij keurt wetten goed of af in hun geheel. Een politiek tegengewicht ontstaat doordat de meerderheid in de Senaat zelden samenvalt met die in de Tweede Kamer.",
    related: ["tweede-kamer", "provinciale-staten"],
  },
  {
    term: "Kabinet",
    category: "instituties",
    short:
      "Het collectief van ministers en staatssecretarissen onder leiding van de minister-president dat de uitvoerende macht vormt.",
    long:
      "Een kabinet wordt na een formatie samengesteld uit één of meer politieke partijen. Bij een meerderheidskabinet steunen de coalitiepartijen samen op minstens 76 zetels; een minderheidskabinet (zoals kabinet-Jetten, beëdigd 23 februari 2026) heeft per definitie geen vaste meerderheid en moet wisselende meerderheden zoeken voor elk voorstel.",
    aliases: ["regering", "ministersraad"],
    related: ["minister-president", "kabinetsformatie", "coalitie"],
  },
  {
    term: "Minister-president",
    category: "instituties",
    short:
      "Voorzitter van de ministerraad en politiek leider van het kabinet; in Nederland sinds 23 februari 2026 Rob Jetten (D66).",
    long:
      "De minister-president (premier) leidt de wekelijkse ministerraad, vertegenwoordigt Nederland in de Europese Raad en spreekt namens het kabinet. Hij of zij is in Nederland primus inter pares: meer een coördinator dan een sterke uitvoerende macht zoals een Franse president.",
    related: ["kabinet", "ministerraad"],
  },
  {
    term: "Raad van State",
    category: "instituties",
    short:
      "Het oudste adviesorgaan van de regering én hoogste algemene bestuursrechter; toetst wetsvoorstellen op juridische en bestuurlijke kwaliteit.",
    long:
      "De Raad van State adviseert vooraf over wetsvoorstellen en koninklijke besluiten, en oordeelt achteraf via de Afdeling bestuursrechtspraak over geschillen tussen burgers en de overheid. Voorzitter is de Koning; het dagelijks bestuur ligt bij de vicepresident.",
    related: ["wetsvoorstel"],
  },
  {
    term: "Hoge Raad",
    category: "instituties",
    short:
      "Hoogste rechterlijk college in Nederland; spreekt geen oordeel uit over feiten maar over de juiste toepassing van het recht.",
    long:
      "De Hoge Raad behandelt cassatieberoepen tegen uitspraken van gerechtshoven. Hij toetst niet of een feit klopt, maar of de wet juist is toegepast en gemotiveerd. De Hoge Raad mag wetten niet toetsen aan de Grondwet (zie 'constitutionele toetsing').",
    related: ["constitutionele-toetsing", "rechtsstaat"],
  },

  // ─── Bestuur ───────────────────────────────────────────────────
  {
    term: "Kabinetsformatie",
    category: "bestuur",
    short:
      "Het proces na verkiezingen waarin partijen onderhandelen over een coalitieakkoord en een kabinet samenstellen.",
    long:
      "Sinds 2012 leidt de Tweede Kamer zelf de formatie via verkenners en (in)formateurs. Het proces eindigt met een coalitieakkoord en de beëdiging van het kabinet door de Koning. De formatie van kabinet-Jetten duurde van 30 oktober 2025 tot 23 februari 2026; het akkoord heet 'Aan de slag. Bouwen aan een beter Nederland'.",
    related: ["coalitie", "kabinet", "regeerakkoord"],
  },
  {
    term: "Coalitie",
    category: "bestuur",
    short:
      "Samenwerkingsverband van twee of meer partijen die samen een kabinet vormen.",
    long:
      "Coalities zijn in Nederland regel: door evenredige vertegenwoordiging haalt geen partij ooit een meerderheid alleen. Een coalitie is meerderheids- of minderheidsregering. Bij minderheid moet het kabinet voor elk voorstel wisselende meerderheden zoeken.",
    related: ["kabinetsformatie", "kabinet", "regeerakkoord"],
  },
  {
    term: "Regeerakkoord",
    category: "bestuur",
    short:
      "Schriftelijke afspraak tussen coalitiepartijen waarin beleidsdoelen voor de kabinetsperiode zijn vastgelegd.",
    long:
      "Een regeerakkoord (of coalitieakkoord, hoofdlijnenakkoord) bindt fracties politiek aan een gemeenschappelijk programma. Pas in 2022 publiceerde het kabinet voor het eerst ook de uitvoeringstoetsen erbij. Het akkoord van kabinet-Jetten (januari 2026) is een hoofdlijnenakkoord: ministers vullen de details zelf in.",
    related: ["coalitie", "kabinetsformatie"],
  },
  {
    term: "Motie",
    category: "bestuur",
    short:
      "Korte verklaring of verzoek van Kamerleden aan de regering; varianten zoals motie van afkeuring of motie van wantrouwen kunnen politiek zwaar wegen.",
    long:
      "Met een motie spreekt de Kamer een wens of oordeel uit. Een aangenomen motie verplicht het kabinet juridisch niet, maar politiek vrijwel altijd. Een motie van wantrouwen tegen een minister of het hele kabinet leidt doorgaans tot aftreden — anders is de politieke legitimiteit weg.",
    related: ["amendement", "interpellatie"],
  },
  {
    term: "Amendement",
    category: "bestuur",
    short:
      "Voorstel van een Kamerlid om de tekst van een wetsvoorstel te wijzigen voordat de Tweede Kamer erover stemt.",
    long:
      "Een amendement gaat verder dan een motie: het wijzigt de wet zelf. Alleen de Tweede Kamer heeft recht van amendement; de Eerste Kamer kan een wet alleen aannemen of verwerpen. Initiatiefwetsvoorstellen kunnen ook geamendeerd worden.",
    related: ["motie", "wetsvoorstel", "tweede-kamer"],
  },
  {
    term: "Interpellatie",
    category: "bestuur",
    short:
      "Apart Kamerdebat waarbij een minister of staatssecretaris over een specifiek onderwerp ter verantwoording wordt geroepen.",
    long:
      "Een interpellatiedebat wordt aangevraagd door één Kamerlid en moet door een meerderheid worden goedgekeurd. Het is een zwaarder middel dan reguliere mondelinge vragen omdat het bedoeld is voor incidenten die rechtstreekse politieke verantwoording vragen.",
    related: ["motie", "tweede-kamer"],
  },
  {
    term: "Provinciale Staten",
    category: "bestuur",
    short:
      "Gekozen volksvertegenwoordiging van een provincie; kiest tevens de leden van de Eerste Kamer.",
    long:
      "Provinciale Staten worden om de vier jaar rechtstreeks gekozen. Ze sturen het college van Gedeputeerde Staten aan, dat het provinciaal bestuur uitvoert. Daarnaast vormen Provinciale Staten samen het kiescollege voor de Eerste Kamer.",
    related: ["eerste-kamer", "waterschap"],
  },
  {
    term: "Gemeenteraad",
    category: "bestuur",
    short:
      "Direct gekozen volksvertegenwoordiging van een gemeente; controleert het college van burgemeester en wethouders.",
    long:
      "Gemeenteraden worden om de vier jaar gekozen; volgende verkiezingen waren op 18 maart 2026. De raad stelt verordeningen vast en controleert het college van B&W. De burgemeester wordt door de Kroon benoemd, maar in toenemende mate via aanbeveling van de raad.",
    related: ["wethouder", "burgemeester"],
  },
  {
    term: "Waterschap",
    category: "bestuur",
    short:
      "Decentraal openbaar lichaam dat verantwoordelijk is voor waterveiligheid, waterkwaliteit en peilbeheer.",
    long:
      "Nederland telt 21 waterschappen. Het algemeen bestuur wordt deels gekozen door inwoners (sinds 2023 geheel) en deels gevormd door 'geborgde zetels' voor bedrijven en agrariërs (afgeschaft per 2023, maar 7 zetels blijven voor natuur en agrariërs).",
    related: ["provinciale-staten"],
  },

  // ─── Ideologie ─────────────────────────────────────────────────
  {
    term: "Polderen",
    category: "ideologie",
    short:
      "Typisch Nederlandse vorm van compromis-besluitvorming tussen overheid, werkgevers, vakbonden en maatschappelijke organisaties.",
    long:
      "Polderen verwijst naar het 'overleg-economie'-model dat in de jaren '80 internationaal beroemd werd via het Akkoord van Wassenaar (1982). Voorstanders prijzen het draagvlak; critici noemen het traag en consensus-verslaafd.",
    related: ["sociaal-akkoord", "subsidiariteit"],
  },
  {
    term: "Subsidiariteit",
    category: "ideologie",
    short:
      "Principe dat beleid op het laagst mogelijke bestuursniveau moet worden gemaakt — Europees, nationaal, lokaal of bij burgers zelf.",
    long:
      "Subsidiariteit komt uit de katholieke sociale leer en is verankerd in het EU-verdrag. Het wordt door uiteenlopende stromingen omarmd: christen-democraten leggen het bij gezin en gemeenschap, EU-sceptici bij de natiestaat, anarchisten bij vrijwillige verbanden.",
    related: ["soevereiniteit", "europese-unie"],
  },
  {
    term: "Soevereiniteit",
    category: "ideologie",
    short:
      "Het hoogste gezag van een staat over een grondgebied en bevolking, zonder externe inmenging.",
    long:
      "Soevereiniteit is sinds de Vrede van Westfalen (1648) een kernconcept in internationale politiek. In het tijdperk van EU-recht en internationale verdragen is de strikte versie zeldzaam: nationale parlementen delen bevoegdheden vrijwillig met supranationale organisaties.",
    related: ["subsidiariteit", "europese-unie"],
  },
  {
    term: "Keynesianisme",
    category: "ideologie",
    short:
      "Economische school die overheidsuitgaven bepleit in tijden van recessie om vraag te stimuleren en werkgelegenheid te beschermen.",
    long:
      "Naar de Britse econoom John Maynard Keynes (1883–1946), die tegen het orthodoxe begrotingsdenken inging tijdens de jaren '30. Tegenwoordig is keynesiaans beleid mainstream in noodsituaties (corona, energiecrisis), maar in 'normale' tijden domineert de discipline van staatsschuld-regels (zie 'begrotingsregels').",
    related: ["monetarisme", "begrotingsregels"],
  },
  {
    term: "Liberalisme",
    category: "ideologie",
    short:
      "Politieke filosofie die individuele vrijheid, rechtsstaat en (vaak) vrije markt centraal stelt.",
    long:
      "Klassiek liberalisme legt nadruk op terughoudende staat in economie en privéleven. Sociaal-liberalisme accepteert sterkere herverdeling en publieke voorzieningen als voorwaarde voor effectieve vrijheid. Conservatief liberalisme combineert markt-georiënteerd beleid met traditie-bewuste cultuur.",
    related: ["klassiek-liberalisme", "sociaal-liberalisme"],
  },
  {
    term: "Sociaal-democratie",
    category: "ideologie",
    short:
      "Centrum-linkse stroming die markt accepteert maar publieke voorzieningen, herverdeling en arbeidsbescherming als kerntaken ziet.",
    long:
      "Sociaal-democratische partijen kwamen op in de 19e eeuw uit de arbeidersbeweging. Hun klassieke instrumenten zijn progressieve belasting, collectief arbeidsrecht, publieke zorg en onderwijs. In Nederland is GroenLinks-PvdA (sinds 2023) de grootste sociaal-democratische groepering.",
    related: ["socialisme", "verzorgingsstaat"],
  },
  {
    term: "Christen-democratie",
    category: "ideologie",
    short:
      "Politieke stroming die christelijke ethiek combineert met sociale marktwerking, gespreide verantwoordelijkheid en EU-engagement.",
    long:
      "Kernconcepten zijn 'rentmeesterschap' (zorg voor schepping), 'gespreide verantwoordelijkheid' (geen totalitaire staat, geen ongebreidelde markt) en 'solidariteit' (gemeenschap voor de kwetsbare). In Nederland verenigt CDA katholieke en protestantse tradities sinds 1980.",
    related: ["communitarisme", "subsidiariteit"],
  },
  {
    term: "Populisme",
    category: "ideologie",
    short:
      "Politieke stijl die 'het volk' tegenover 'de elite' plaatst en zich als enige authentieke vertegenwoordiger van het volk presenteert.",
    long:
      "Populisme is geen vaste ideologie maar een framing-strategie die zowel links als rechts voorkomt. Rechts-populisme combineert het vaak met nationale identiteit en migratiekritiek (PVV, DNA); links-populisme met economische herverdeling en kritiek op 'het kapitalisme' (SP, DENK).",
    related: ["nationalisme", "anti-establishment"],
  },
  {
    term: "Communitarisme",
    category: "ideologie",
    short:
      "Politieke filosofie die de gemeenschap (familie, buurt, geloof, natie) als bron van waarden en plichten boven het individu plaatst.",
    long:
      "Communitarisme verzet zich tegen extreem liberalisme dat het individu losweekt van zijn gemeenschap. In Nederlandse politiek herkenbaar bij CDA en — soms expliciet (Pieter Omtzigt's 'gemeenschap centraal') — bij Nieuw Sociaal Contract dat eind 2025 zijn parlementaire vertegenwoordiging verloor.",
    related: ["liberalisme", "christen-democratie"],
  },

  // ─── Verkiezingen ──────────────────────────────────────────────
  {
    term: "Evenredige vertegenwoordiging",
    category: "verkiezingen",
    short:
      "Kiesstelsel waarin het percentage zetels gelijk is aan het percentage stemmen, met landelijke kiesdeler en geen kiesdrempel.",
    long:
      "Nederland heeft sinds 1917 een nationaal kiesdistrict met volledige evenredigheid. De kiesdeler is 1/150e van het totaal aantal stemmen; geen kiesdrempel (anders dan bv. Duitsland 5%). Dat verklaart de hoge politieke fragmentatie — in 2025 haalden 15 partijen een zetel.",
    related: ["kiesdeler", "restzetels"],
  },
  {
    term: "Kiesdeler",
    category: "verkiezingen",
    short:
      "Aantal stemmen dat een partij minimaal nodig heeft voor één zetel in de Tweede Kamer.",
    long:
      "De kiesdeler = totaal aantal geldige stemmen ÷ 150 zetels. In 2025 was dat 70.935 stemmen per zetel. Lijsten die de kiesdeler niet halen, doen niet mee aan de restzetel-verdeling.",
    related: ["evenredige-vertegenwoordiging", "restzetels"],
  },
  {
    term: "Restzetels",
    category: "verkiezingen",
    short:
      "Zetels die overblijven na verdeling op basis van hele kiesdelers; verdeeld via de methode van de grootste gemiddelden (D'Hondt).",
    long:
      "Nederland gebruikt sinds 1933 het D'Hondt-stelsel voor restzetels, dat licht voordelig is voor grotere partijen. Voor 2017 gold een lijstverbindings-regeling die kleinere combinaties bevoordeelde; die werd geschrapt.",
    related: ["evenredige-vertegenwoordiging", "kiesdeler"],
  },
  {
    term: "Voorkeurstem",
    category: "verkiezingen",
    short:
      "Stem op een specifieke kandidaat verder naar onderen op de lijst; bij genoeg voorkeurstemmen kan deze met voorrang verkozen worden.",
    long:
      "In Nederland geldt sinds 1998 dat een kandidaat met 25% van de kiesdeler aan voorkeurstemmen automatisch een zetel krijgt, ongeacht de lijstvolgorde. Voorbeelden van politici die zo de Kamer haalden: Pia Dijkstra, Sylvana Simons.",
    related: ["kiesdeler"],
  },
  {
    term: "Lijsttrekker",
    category: "verkiezingen",
    short:
      "Eerste persoon op de kandidatenlijst van een partij; doorgaans het gezicht van de campagne en beoogd fractievoorzitter.",
    long:
      "De lijsttrekker wordt meestal door partijleden gekozen, soms door het partijbestuur. Bij winst leidt deze persoon meestal ook de formatie en kan minister-president of fractievoorzitter worden. Rob Jetten (D66) ging in 2025 als lijsttrekker naar het premierschap; Jan Paternotte werd vervolgens fractievoorzitter.",
    related: ["fractievoorzitter", "kandidatenlijst"],
  },
  {
    term: "Fractievoorzitter",
    category: "verkiezingen",
    short:
      "Leider van een partij in de Tweede Kamer; voert namens de fractie het woord bij debatten over hoofdlijnen en formatie.",
    long:
      "Fractievoorzitters zijn de gezichten van partijen in het parlementaire debat. Sinds de verkiezingen van 2025 zijn dat o.a. Jan Paternotte (D66), Geert Wilders (PVV), Ruben Brekelmans (VVD), Jesse Klaver (GroenLinks-PvdA) en Henri Bontenbal (CDA).",
    related: ["lijsttrekker", "tweede-kamer"],
  },
  {
    term: "Stemwijzer",
    category: "verkiezingen",
    short:
      "Online tool die stellingen vergelijkt met partij-standpunten en aangeeft welke partij het dichtst bij de gebruiker staat.",
    long:
      "De bekendste tools in Nederland zijn StemWijzer (ProDemos, sinds 1989) en Kieskompas (sinds 2006). Academisch onderzoek wijst uit dat stellingkeuze en weging de uitslag sterk beïnvloeden — een belangrijke reden om meerdere tools naast elkaar te raadplegen, of een bredere quiz zoals PolitiekProfiel.",
    related: ["politiek-kompas", "voorkeurstem"],
  },

  // ─── Fiscaal & economie ────────────────────────────────────────
  {
    term: "Hypotheekrenteaftrek",
    category: "fiscaal",
    short:
      "Belastingvoordeel waarmee huiseigenaren betaalde hypotheekrente aftrekken van hun belastbaar inkomen.",
    long:
      "Sinds 2013 is de regeling beperkt: alleen voor nieuwe leningen geldt verplichte aflossing in 30 jaar, en het aftrektarief is verlaagd naar uiteindelijk het basis-IB-tarief. Linkse en centrum-rechtse partijen pleiten al jaren voor verdere afbouw vanwege marktverstoring; rechts vreest schade voor huiseigenaren.",
    related: ["box-3", "woz"],
  },
  {
    term: "Box 3",
    category: "fiscaal",
    short:
      "Inkomstenbelasting-box voor vermogen (spaargeld, beleggingen, tweede huis); jaren-oude juridische strijd over fictief rendement vs werkelijk rendement.",
    long:
      "Box 3 belastte tot 2022 een fictief rendement, dat de Hoge Raad in het Kerstarrest (24 dec 2021) onrechtmatig verklaarde. Een tussenoplossing geldt sinds 2023; een nieuwe wet voor werkelijk rendement zou per 1 januari 2027 ingaan, maar wordt herhaaldelijk uitgesteld. Een belangrijk politiek dossier voor kabinet-Jetten.",
    related: ["hypotheekrenteaftrek", "vermogensbelasting"],
  },
  {
    term: "WOZ-waarde",
    category: "fiscaal",
    short:
      "Geschatte marktwaarde van een onroerend goed, vastgesteld door de gemeente; basis voor OZB en deel van inkomstenbelasting.",
    long:
      "De WOZ-waarde (Wet waardering onroerende zaken) wordt jaarlijks per peildatum 1 januari herzien. Stijgende huizenprijzen leiden tot hogere lokale belasting, wat een politiek heet hangijzer is, vooral in gemeenten met snelle prijsontwikkeling.",
    related: ["box-3", "hypotheekrenteaftrek"],
  },
  {
    term: "AOW",
    category: "fiscaal",
    short:
      "Algemene Ouderdomswet: basispensioen vanaf de AOW-leeftijd, gefinancierd via omslagstelsel uit lopende premies.",
    long:
      "De AOW is ingevoerd in 1957 (Drees). De AOW-leeftijd is sinds 2013 gekoppeld aan de levensverwachting; kabinet-Jetten kondigde in zijn akkoord (januari 2026) een verdere stapsgewijze verhoging aan, wat tot oppositieprotest leidde van GL-PvdA, SP en 50PLUS.",
    related: ["pensioen", "omslagstelsel"],
  },
  {
    term: "Begrotingsregels",
    category: "fiscaal",
    short:
      "EU- en nationale afspraken die het tekort en de schuld van overheden beperken (3% tekort, 60% schuld als referentie).",
    long:
      "De EU-begrotingsregels (Stabiliteits- en Groeipact, in 2024 hervormd) verplichten lidstaten tot middellange-termijnplanning. Nederland kent daarnaast eigen 'Studiegroep Begrotingsruimte'-aanbevelingen. Critici vinden de regels te streng in tijden van investeringsbehoefte; voorstanders zien ze als bescherming tegen schuldcrises.",
    related: ["keynesianisme", "monetarisme"],
  },
  {
    term: "CPB-doorrekening",
    category: "fiscaal",
    short:
      "Onafhankelijke financiële analyse van partijprogramma's en kabinetsplannen door het Centraal Planbureau.",
    long:
      "Het CPB publiceert 'Keuzes in Kaart' voor verkiezingen sinds 1986. Voor de TK 2025 deden acht partijen mee: VVD, D66, GroenLinks-PvdA, CDA, ChristenUnie, Volt, JA21 en SGP. Doorrekening is vrijwillig; partijen die niet meedoen (PVV, BBB, FvD, SP, PvdD) ontberen daardoor een vergelijkbare financiële toetssteen.",
    related: ["begrotingsregels", "keynesianisme"],
  },
  {
    term: "Vlaktaks",
    category: "fiscaal",
    short:
      "Hypothetische belastinghervorming waarin alle inkomens onder één tarief vallen, eventueel met hoge belastingvrije voet.",
    long:
      "Vlaktaks-voorstellen circuleren sinds de jaren '80; voorstanders (sommige liberale en libertaire kringen) wijzen op eenvoud en efficiëntie. Tegenstanders waarschuwen dat de hervorming herverdeling drastisch beperkt tenzij gecombineerd met een hoge belastingvrije voet of basisinkomen.",
    related: ["progressieve-belasting", "basisinkomen"],
  },
  {
    term: "Basisinkomen",
    category: "fiscaal",
    short:
      "Onvoorwaardelijke uitkering aan iedere burger, ter vervanging van een deel van het sociale stelsel.",
    long:
      "Basisinkomen-debatten zijn al decennia gaande en bestaan in varianten van zeer karig tot rijkelijk. Experimenten in Finland (2017–2018) en op kleinere schaal in Nederlandse gemeenten gaven gemengd beeld: meer welbevinden, niet altijd meer werkparticipatie.",
    related: ["uitkering", "vlaktaks"],
  },

  // ─── Europa ────────────────────────────────────────────────────
  {
    term: "Europese Unie",
    category: "europa",
    short:
      "Politiek-economische unie van 27 lidstaten, met gedeeltelijk gepoolde soevereiniteit, één markt en — voor 20 leden — één munt.",
    long:
      "De EU ontstond uit de Europese Gemeenschap voor Kolen en Staal (1951) als project van vrede en handel. Belangrijkste instellingen: Europees Parlement (direct gekozen), Raad van de EU (lidstaten), Europese Commissie (uitvoerend) en Europees Hof van Justitie. Nederland is netto-betaler en kernlid.",
    aliases: ["EU", "Unie"],
    related: ["europese-commissie", "europees-parlement", "europese-raad"],
  },
  {
    term: "Europese Commissie",
    category: "europa",
    short:
      "Uitvoerend orgaan van de EU; doet wetsvoorstellen, bewaakt verdragen en onderhandelt namens de Unie met derde landen.",
    long:
      "De Commissie telt 27 commissarissen, één per lidstaat, onder leiding van een voorzitter (sinds 2019 Ursula von der Leyen, herbenoemd in 2024). Zij is verantwoording schuldig aan het Europees Parlement, dat de Commissie via motie van wantrouwen kan wegsturen.",
    related: ["europese-unie", "europees-parlement"],
  },
  {
    term: "Europees Parlement",
    category: "europa",
    short:
      "Direct gekozen vertegenwoordiging van EU-burgers met 720 leden; medewetgever met de Raad.",
    long:
      "Het Europees Parlement wordt elke vijf jaar gekozen (laatst 6–9 juni 2024). Nederland heeft 31 zetels. Fracties zijn ideologisch georganiseerd: EPP (christen-democratisch), S&D (sociaal-democratisch), Renew (liberaal), Greens/EFA, ECR, Patriots for Europe, The Left.",
    related: ["europese-commissie", "europese-unie"],
  },
  {
    term: "Europese Raad",
    category: "europa",
    short:
      "Top van regeringsleiders van de 27 lidstaten; bepaalt de grote politieke richtlijnen, geen wetgeving.",
    long:
      "De Europese Raad komt minimaal vier keer per jaar samen. De vaste voorzitter (sinds dec 2024: António Costa) leidt de bijeenkomsten. Belangrijke besluiten vereisen vaak consensus, wat klein-grote lidstaat-dynamiek versterkt.",
    related: ["europese-unie", "soevereiniteit"],
  },

  // ─── Sociaal ───────────────────────────────────────────────────
  {
    term: "Verzorgingsstaat",
    category: "sociaal",
    short:
      "Politiek-economisch model waarin de overheid uitgebreide sociale voorzieningen organiseert: zorg, onderwijs, sociale zekerheid.",
    long:
      "De Nederlandse verzorgingsstaat groeide sterk tussen 1957 (AOW) en 1976 (WAO) en werd vanaf de jaren '80 hervormd ('no nonsense'-beleid). Sinds 2015 zijn delen van zorg en jeugdhulp gedecentraliseerd naar gemeenten, wat tot uitvoeringsproblemen en bezuinigingsdruk leidde.",
    related: ["sociaal-democratie", "subsidiariteit"],
  },
  {
    term: "Bestaanszekerheid",
    category: "sociaal",
    short:
      "Politiek begrip dat duidt op een minimum aan zekerheid in inkomen, wonen en zorg dat de overheid moet borgen.",
    long:
      "Bestaanszekerheid werd een centraal frame in de campagne van 2023, vooral door SP, GL-PvdA, CU en het destijds nieuwe NSC. Concreet: minimumloon-verhoging, hogere toeslagen, betaalbare woningen, stabiele zorgkosten. Het kabinet-Jetten plaatste bestaanszekerheid als doel, maar combineert dat met versobering van uitkeringen.",
    related: ["minimumloon", "uitkering"],
  },
  {
    term: "Toeslagenaffaire",
    category: "sociaal",
    short:
      "Schandaal waarbij de Belastingdienst tussen ca. 2005-2019 onterecht duizenden ouders als fraudeurs aanmerkte bij kinderopvangtoeslag.",
    long:
      "De toeslagenaffaire leidde tot het aftreden van kabinet-Rutte III (januari 2021), tot een parlementaire ondervragingscommissie en tot een breed debat over bestuurscultuur en discriminatie ('etnisch profileren'). Hersteloperatie loopt nog steeds; CDA-Kamerlid Pieter Omtzigt speelde een hoofdrol bij ontmaskering.",
    related: ["rechtsstaat", "bestuurscultuur"],
  },
  {
    term: "Gendergelijkheid",
    category: "sociaal",
    short:
      "Streven naar gelijke rechten, kansen en behandeling van mensen ongeacht gender; raakt aan onderwijs, werk, gezondheidszorg, recht.",
    long:
      "In Nederland is gendergelijkheid juridisch verankerd (Algemene wet gelijke behandeling, 1994). Politieke discussie loopt vooral over de loonkloof, het quota voor topfuncties (sinds 2022) en rechten van trans personen. Conservatieve partijen (SGP, FvD) zijn kritisch op wat zij 'genderideologie' noemen.",
    related: ["burgerrechten"],
  },

  // ─── Juridisch ─────────────────────────────────────────────────
  {
    term: "Rechtsstaat",
    category: "juridisch",
    short:
      "Staat waarin overheidsmacht gebonden is aan recht en burgers via onafhankelijke rechters beschermd zijn tegen willekeur.",
    long:
      "Kernelementen: legaliteit, machtenscheiding, grondrechten en onafhankelijke rechtspraak. De Nederlandse rechtsstaat staat onder druk door toenemende beleidscomplexiteit, politieke aanvallen op rechters en bestuurlijke schandalen zoals de toeslagenaffaire.",
    related: ["constitutionele-toetsing", "trias-politica"],
  },
  {
    term: "Constitutionele toetsing",
    category: "juridisch",
    short:
      "Mogelijkheid voor rechters om wetten te toetsen aan de Grondwet en zo nodig buiten toepassing te laten.",
    long:
      "Nederland verbiedt constitutionele toetsing van wetten in formele zin (artikel 120 Grondwet). Sinds 2018 ligt een initiatiefwet (Halsema, later overgenomen) klaar voor invoering. Rechters mogen wel toetsen aan internationale verdragen zoals het EVRM.",
    related: ["rechtsstaat", "grondwet"],
  },
  {
    term: "Trias politica",
    category: "juridisch",
    short:
      "Klassieke leer over de scheiding van wetgevende, uitvoerende en rechterlijke macht ter voorkoming van machtsconcentratie.",
    long:
      "Voorgesteld door Montesquieu (1748). In de Nederlandse praktijk is de scheiding minder strikt dan in puur presidentiële stelsels: ministers zitten formeel niet in de Kamer, maar de regering legt verantwoording af aan het parlement, en wetgeving wordt gezamenlijk gemaakt.",
    related: ["rechtsstaat", "constitutionele-toetsing"],
  },
  {
    term: "Wetsvoorstel",
    category: "juridisch",
    short:
      "Officieel voorstel voor een nieuwe wet of wijziging, ingediend door regering of via initiatief van een Kamerlid.",
    long:
      "Reguliere wetsvoorstellen worden ingediend door de regering en eerst aan de Raad van State voorgelegd voor advies. Initiatiefwetsvoorstellen door Kamerleden hebben een vergelijkbare route en zijn minder zeldzaam geworden (bv. Wet implementatie EU-richtlijn klokkenluiders, 2023).",
    related: ["amendement", "raad-van-state"],
  },
  {
    term: "Grondrechten",
    category: "juridisch",
    short:
      "Fundamentele rechten van burgers, vastgelegd in de Grondwet en internationale verdragen zoals het EVRM en VN-mensenrechten-verdragen.",
    long:
      "Klassieke grondrechten (vrijheid van meningsuiting, godsdienst, vereniging) staan in hoofdstuk 1 Grondwet. Sociale grondrechten (recht op werk, wonen, gezondheid) zijn als opdracht aan de overheid geformuleerd, niet als afdwingbaar recht in Nederland.",
    related: ["rechtsstaat", "vrijheid-van-meningsuiting"],
  },

  // ─── Geopolitiek ───────────────────────────────────────────────
  {
    term: "NAVO",
    category: "geopolitiek",
    short:
      "Noord-Atlantische Verdragsorganisatie: collectief veiligheidsbondgenootschap van 32 lidstaten in Europa en Noord-Amerika.",
    long:
      "Opgericht in 1949. Artikel 5 bepaalt dat een aanval op één lidstaat een aanval op allemaal is. Sinds de Russische invasie van Oekraïne (2022) is de NAVO opnieuw centraal in Europese veiligheid; de Trump-regering in de VS heeft EU-leden onder druk gezet hun bijdragen te verhogen naar 3-5% bbp.",
    related: ["europese-unie", "defensie"],
  },
  {
    term: "Westfalen-systeem",
    category: "geopolitiek",
    short:
      "Internationale orde gebaseerd op soevereine staten en non-inmenging, ontstaan uit de Vrede van Westfalen (1648).",
    long:
      "Hoewel veel internationaal recht zich sindsdien ontwikkelde rondom mensenrechten, klimaat en handel, is het Westfalen-principe nog steeds de juridische basis van de Verenigde Naties. Spanning ontstaat wanneer interne mensenrechten-schendingen botsen met non-inmenging.",
    related: ["soevereiniteit", "verenigde-naties"],
  },
  {
    term: "Verenigde Naties",
    category: "geopolitiek",
    short:
      "Wereldwijde organisatie van 193 staten met als doel vrede, veiligheid, mensenrechten en duurzame ontwikkeling te bevorderen.",
    long:
      "Opgericht in 1945 na WO II. Belangrijkste organen: Algemene Vergadering, Veiligheidsraad (vijf vetomachten), Internationaal Gerechtshof. Effectiviteit wordt beperkt door grote-machten-politiek (bv. Russisch veto over Oekraïne).",
    related: ["westfalen-systeem", "internationaal-recht"],
  },

  // ─── Media & pers ─────────────────────────────────────────────
  {
    term: "Persvrijheid",
    category: "media",
    short:
      "Recht van journalisten om vrij te publiceren zonder voorafgaande censuur of onevenredige sancties.",
    long:
      "Persvrijheid is verankerd in artikel 7 Grondwet en artikel 10 EVRM. Reporters Without Borders rangschikt Nederland al jaren in de top-10 wereldwijd, maar plaatselijke incidenten (bedreiging, doxing, beperking journalistieke bronnen) baren zorgen.",
    related: ["vrijheid-van-meningsuiting", "rechtsstaat"],
  },
  {
    term: "Publieke omroep",
    category: "media",
    short:
      "Door belasting gefinancierd omroepstelsel met onafhankelijke redactionele lijn; in Nederland gestructureerd via de NPO.",
    long:
      "De Nederlandse Publieke Omroep (NPO) wordt deels via mediawetgeving en deels via ledenparticipatie georganiseerd (verzuilingserfenis). Politieke spanning over taakomvang, neutraliteit en financiering komt periodiek terug; FvD en PVV pleiten voor sterke versobering of afschaffing.",
    related: ["persvrijheid", "verzuiling"],
  },
  {
    term: "Verzuiling",
    category: "media",
    short:
      "Historische maatschappelijke ordening (ca. 1880–1965) waarin katholieken, protestanten, sociaaldemocraten en liberalen aparte instituties hadden.",
    long:
      "Verzuiling vormde scholen, omroepen, vakbonden, ziekenhuizen en zelfs sportclubs langs levensbeschouwelijke lijnen. Ontzuiling kwam met secularisatie en welvaartsstijging. Erfenis: ledenomroepen, bijzonder onderwijs, en bepaalde politieke partijstructuren.",
    related: ["publieke-omroep", "christen-democratie"],
  },
];

export const GLOSSARY: GlossaryTerm[] = TERMS_RAW.map((t) => ({
  ...t,
  slug: slug(t.term),
}));

export const GLOSSARY_BY_SLUG = new Map<string, GlossaryTerm>(
  GLOSSARY.map((t) => [t.slug, t]),
);

export const CATEGORY_LABEL: Record<GlossaryCategory, string> = {
  instituties: "Instituties",
  bestuur: "Bestuur",
  ideologie: "Ideologie",
  verkiezingen: "Verkiezingen",
  fiscaal: "Fiscaal & economie",
  europa: "Europa",
  sociaal: "Sociaal",
  juridisch: "Juridisch",
  geopolitiek: "Geopolitiek",
  media: "Media & pers",
};

export const GLOSSARY_BY_LETTER: Map<string, GlossaryTerm[]> = (() => {
  const map = new Map<string, GlossaryTerm[]>();
  for (const t of GLOSSARY) {
    const letter = t.term[0]?.toUpperCase() ?? "?";
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(t);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => a.term.localeCompare(b.term, "nl"));
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
})();
